/**
 * Generates `kshc.manifest.json` — the declarative content manifest this site
 * sends to MOHTAWA's `POST /api/seed`, which does the actual creating.
 *
 * This replaces the imperative half of the old `seed-cms.ts`: instead of the
 * frontend knowing HOW to create pages/sections/collections over many API
 * calls, it just describes WHAT its content is and lets the CMS apply it. The
 * shapes still come from `src/lib/cms-schema.ts`, so the read layer
 * (`src/lib/cms.ts`) and this stay in sync exactly as before.
 *
 * Usage:
 *   npx tsx scripts/build-manifest.ts            # writes kshc.manifest.json
 *   npm run seed:cms                             # build + send in one step
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { routing } from "../src/i18n/routing";
import {
    COLLECTIONS,
    COLLECTION_PATHS,
    IMAGE_BLOCKS,
    PAGE_BASES,
} from "../src/lib/cms-schema";

type Json = Record<string, unknown>;

const LOCALES = routing.locales as readonly string[];
const BASE_LOCALE = routing.defaultLocale as string;
const OTHER_LOCALES = LOCALES.filter((l) => l !== BASE_LOCALE);
const LOCALE_LABELS: Record<string, string> = {
    en: "English",
    ar: "العربية",
};

const loadMessages = (locale: string): Json =>
    JSON.parse(
        readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"),
    );

const messagesByLocale = Object.fromEntries(
    LOCALES.map((l) => [l, loadMessages(l)]),
) as Record<string, Json>;

/* ------------------------------------------------------------ helpers ---- */
// (identical semantics to the previous seed script, so seeded content is
// byte-for-byte what the site already expects)

const isPlainObject = (v: unknown): v is Json =>
    typeof v === "object" && v !== null && !Array.isArray(v);

const isLong = (v: string) => v.length > 80 || v.includes("\n");

function titleCase(key: string): string {
    return key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[-_.]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();
}

function fieldType(id: string): string {
    if (id === "image" || id === "logo") return "image";
    if (id === "body") return "longtext";
    return "text";
}

const getPath = (obj: Json, path: string): unknown =>
    path
        .split(".")
        .reduce<unknown>((acc, k) => (isPlainObject(acc) ? acc[k] : undefined), obj);

type Block = {
    id: string;
    type: string;
    label: string;
    value?: string;
    fields?: { id: string; type: string; label: string }[];
    items?: Json[];
    localized?: boolean;
    /** Manifest-only: { locale: value | items } — the CMS splits these out. */
    i18n?: Record<string, unknown>;
};
type Section = { title: string; blocks: Block[] };

const deriveFields = (rows: Json[]) =>
    Object.keys(rows[0] ?? {}).map((id) => ({
        id,
        type: fieldType(id),
        label: titleCase(id),
    }));

const textBlock = (id: string, key: string, value: string): Block => ({
    id,
    type: isLong(value) ? "longtext" : "text",
    label: titleCase(key),
    value,
});

const listBlock = (id: string, key: string, rows: Json[]): Block => ({
    id,
    type: "list",
    label: titleCase(key),
    fields: deriveFields(rows),
    items: rows,
});

function buildBlocks(prefix: string, obj: Json): Block[] {
    const blocks: Block[] = [];
    for (const [k, v] of Object.entries(obj)) {
        const path = `${prefix}.${k}`;
        if (COLLECTION_PATHS.includes(path)) continue; // owned by a Collection
        if (Array.isArray(v)) blocks.push(listBlock(path, k, v as Json[]));
        else if (isPlainObject(v)) blocks.push(...buildBlocks(path, v));
        else if (v != null) blocks.push(textBlock(path, k, String(v)));
    }
    return blocks;
}

/** Fixed chrome/hero images: Shared, empty → the admin uploads in the CMS. */
function imageSection(base: string): Section | null {
    const keys = IMAGE_BLOCKS[base] ?? [];
    if (!keys.length) return null;
    return {
        title: "Media",
        blocks: keys.map((key) => ({
            id: `images.${key}`,
            type: "image",
            label: titleCase(key),
            value: "",
            localized: false,
        })),
    };
}

function buildPageSections(base: string, msgs: Json): Section[] {
    if (base === "globals") {
        const sections: Section[] = [];
        if (isPlainObject(msgs.nav))
            sections.push({ title: "Navigation", blocks: buildBlocks("nav", msgs.nav) });
        if (isPlainObject(msgs.footer))
            sections.push({ title: "Footer", blocks: buildBlocks("footer", msgs.footer) });
        const meta = msgs.meta as Json | undefined;
        if (meta && typeof meta.siteName === "string")
            sections.push({
                title: "Site meta",
                blocks: [textBlock("meta.siteName", "siteName", meta.siteName)],
            });
        return sections;
    }

    const nsObj = (msgs[base] ?? {}) as Json;
    const sections: Section[] = [];
    const general: Block[] = [];

    for (const [key, val] of Object.entries(nsObj)) {
        const path = `${base}.${key}`;
        if (COLLECTION_PATHS.includes(path)) continue;
        if (Array.isArray(val)) general.push(listBlock(path, key, val as Json[]));
        else if (isPlainObject(val))
            sections.push({ title: titleCase(key), blocks: buildBlocks(path, val) });
        else if (val != null) general.push(textBlock(path, key, String(val)));
    }
    if (general.length) sections.unshift({ title: "General", blocks: general });

    const metaFor = (msgs.meta as Json | undefined)?.[base];
    if (isPlainObject(metaFor))
        sections.push({ title: "SEO", blocks: buildBlocks(`meta.${base}`, metaFor) });

    return sections.filter((s) => s.blocks.length > 0);
}

/** Flat { blockId: value | items } for one page base in one locale. */
function blockValues(base: string, msgs: Json): Record<string, unknown> {
    const values: Record<string, unknown> = {};
    for (const section of buildPageSections(base, msgs))
        for (const b of section.blocks)
            values[b.id] = b.type === "list" ? b.items : b.value;
    return values;
}

/* -------------------------------------------------------------- build ---- */

const pages = PAGE_BASES.map((base) => {
    const sections = buildPageSections(base, messagesByLocale[BASE_LOCALE]);

    // Attach each locale's value to its block as `i18n`, so the manifest is
    // one self-contained document per page (the CMS splits it into the
    // page's per-locale translations map).
    const translated = OTHER_LOCALES.map(
        (l) => [l, blockValues(base, messagesByLocale[l])] as const,
    );
    for (const section of sections)
        for (const block of section.blocks) {
            const i18n: Record<string, unknown> = {};
            for (const [locale, values] of translated)
                if (values[block.id] !== undefined) i18n[locale] = values[block.id];
            if (Object.keys(i18n).length) block.i18n = i18n;
        }

    const media = imageSection(base);
    return {
        slug: base,
        title: titleCase(base),
        sections: [...sections, ...(media ? [media] : [])],
    };
});

const collections = COLLECTIONS.flatMap((def) => {
    const baseArr = getPath(messagesByLocale[BASE_LOCALE], def.path) as
        | Json[]
        | undefined;
    if (!Array.isArray(baseArr)) return [];

    const fields = [
        { id: "key", type: "text", label: "Key", localized: false },
        ...def.localeFields.map((f) => ({
            id: f,
            type: fieldType(f),
            label: titleCase(f),
            localized: true,
        })),
        ...def.flatFields.map((f) => ({
            id: f,
            type: fieldType(f),
            label: titleCase(f),
            localized: false,
        })),
    ];

    const rows = baseArr.map((row) => {
        const out: Json = { key: row.key };
        for (const f of def.localeFields) out[f] = row[f] ?? "";
        // Shared fields (images) start empty — an admin uploads them in the
        // dashboard's Media Library; the site falls back to its bundled asset.
        for (const f of def.flatFields) out[f] = "";

        const i18n: Record<string, Record<string, unknown>> = {};
        for (const locale of OTHER_LOCALES) {
            const arr =
                (getPath(messagesByLocale[locale], def.path) as Json[] | undefined) ??
                [];
            const match = arr.find((r) => r.key === row.key);
            if (!match) continue;
            const values: Record<string, unknown> = {};
            for (const f of def.localeFields) values[f] = match[f] ?? "";
            i18n[locale] = values;
        }
        if (Object.keys(i18n).length) out.i18n = i18n;
        return out;
    });

    return [
        {
            name: titleCase(def.slug),
            slug: def.slug,
            schema: { fields },
            rows,
        },
    ];
});

// Public inboxes. Field ids match what the site's forms actually POST —
// see src/components/contact-form.tsx and careers-form.tsx.
const forms = [
    {
        name: "Contact Messages",
        slug: "contact-messages",
        description: "Messages sent from the website's contact form",
        // ids + required flags mirror src/components/contact-form.tsx exactly
        fields: [
            { id: "name", type: "text", label: "Full name", required: true },
            { id: "email", type: "email", label: "Email", required: true },
            { id: "phone", type: "phone", label: "Phone" },
            { id: "message", type: "textarea", label: "Message", required: true },
        ],
    },
    {
        name: "Job Applications",
        slug: "job-applications",
        description: "Applications submitted from the careers page",
        // ids + required flags mirror src/components/careers-form.tsx exactly
        // (`job` is the key of a row in the careers-jobs collection)
        fields: [
            { id: "job", type: "text", label: "Job (careers-jobs key)", required: true },
            { id: "email", type: "email", label: "Email", required: true },
            { id: "fullName", type: "text", label: "Full name", required: true },
            { id: "phone", type: "phone", label: "Phone" },
            { id: "cv", type: "text", label: "CV link" },
            { id: "portfolio", type: "text", label: "Portfolio link" },
        ],
    },
];

const manifest = {
    locales: LOCALES.map((code) => ({
        code,
        name: LOCALE_LABELS[code] ?? code.toUpperCase(),
        isDefault: code === BASE_LOCALE,
    })),
    pages,
    collections,
    forms,
};

const out = join(process.cwd(), "kshc.manifest.json");
writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n", "utf8");

const blockCount = pages.reduce(
    (n, p) => n + p.sections.reduce((m, s) => m + s.blocks.length, 0),
    0,
);
console.log(
    `Wrote ${out}\n  ${pages.length} pages (${blockCount} blocks), ` +
    `${collections.length} collections, ${forms.length} forms, ` +
    `locales: ${LOCALES.join(", ")}`,
);
