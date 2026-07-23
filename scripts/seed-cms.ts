/**
 * Seeds this site's content into a MOHTAWA CMS over its public HTTP API only —
 * no database access, no dependency on the CMS repo's internals. Copy this
 * script (and the shapes it writes) into any frontend that wants its content
 * managed by MOHTAWA. See docs/CMS_INTEGRATION.md and the dashboard's
 * "Integration guide" page for the full write-up.
 *
 * What it creates (see src/lib/cms-schema.ts for the single source of truth),
 * using MOHTAWA's Strapi-style i18n — one document per page/collection with
 * per-locale translations, not a copy per language:
 *  - One **Page** per PAGE_BASE (slug `<base>`, published) holding the
 *    default-locale copy as content blocks; a text string is a text block
 *    (`id` = its message key), a repeated group is a `list` block. For every
 *    other locale it PUTs a `translations` map ({ blockId: value }).
 *  - **Collections** for the dynamic lists (news/events/jobs): default-locale
 *    rows + a per-locale `translations` map, with localized text fields and
 *    shared `key`/`image` fields.
 *  - Fixed chrome/hero images as **Shared image blocks** in a "Media" section
 *    on each page (id `images.<key>`, empty → local fallback; an admin uploads
 *    via the Media Library). No separate images collection.
 *  - Deletes the obsolete `site-content`/`site-images` collections and any
 *    legacy per-locale `<base>-<locale>` pages from previous models.
 *
 * Locales come from src/i18n/routing.ts and should match the CMS registry
 * (GET /api/locales) — add a locale there + a messages/<locale>.json and re-run
 * to seed that language's translations.
 *
 * Safe to re-run: existing Pages/Collections are left in place (never clobbers
 * an editor's translations); only missing documents are created.
 *
 * Usage (from the repo root):
 *   CMS_API_URL=http://localhost:3000/api \
 *   CMS_ADMIN_EMAIL=admin@example.com \
 *   CMS_ADMIN_PASSWORD=Admin12345! \
 *   npm run seed:cms
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { routing } from "../src/i18n/routing";
import {
    COLLECTIONS,
    COLLECTION_PATHS,
    IMAGE_BLOCKS,
    PAGE_BASES,
} from "../src/lib/cms-schema";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:3000/api").replace(
    /\/+$/,
    "",
);
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;

const LOCALES = routing.locales as readonly string[];
// The base/default locale — its values live in the page blocks / collection
// rows; other locales are stored as translations overlaid on top.
const BASE_LOCALE = routing.defaultLocale as string;
const OTHER_LOCALES = LOCALES.filter((l) => l !== BASE_LOCALE);

type Json = Record<string, unknown>;
type Block = {
    id: string;
    type: string;
    label: string;
    value?: string;
    fields?: { id: string; type: string; label: string }[];
    items?: Json[];
    localized?: boolean;
};
type Section = { title: string; blocks: Block[] };

// Image blocks for a page base — Shared (one value across locales), stored in
// a "Media" section. Empty by default; an admin picks/uploads via the Media
// Library, and the site falls back to its bundled asset until then.
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

// --- tiny HTTP helpers ------------------------------------------------------

async function api(
    method: string,
    path: string,
    token?: string,
    body?: unknown,
): Promise<{ status: number; json: any }> {
    const res = await fetch(`${CMS_API_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    let json: any = null;
    try {
        json = await res.json();
    } catch {
        /* empty body (e.g. 204) */
    }
    return { status: res.status, json };
}

async function login(): Promise<string> {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error(
            "Set CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD (the CMS's admin login) before running.",
        );
    }
    const { status, json } = await api("POST", "/auth/login", undefined, {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
    });
    if (status !== 200 && status !== 201) {
        throw new Error(`Login failed (${status}): ${JSON.stringify(json)}`);
    }
    return json.access_token as string;
}

// --- helpers ----------------------------------------------------------------

function loadMessages(locale: string): Json {
    return JSON.parse(
        readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"),
    );
}

const LOCALE_LABELS: Record<string, string> = { en: "English", ar: "Arabic" };
const localeLabel = (l: string) => LOCALE_LABELS[l] ?? l.toUpperCase();

function titleCase(key: string): string {
    return key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[-_.]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();
}

const isPlainObject = (v: unknown): v is Json =>
    typeof v === "object" && v !== null && !Array.isArray(v);

const isLong = (v: string) => v.length > 80 || v.includes("\n");

function fieldType(id: string): string {
    if (id === "image" || id === "logo") return "image";
    if (id === "body") return "longtext";
    return "text";
}

/** Column schema for a list block's rows, from the first row's keys. */
function deriveFields(rows: Json[]): { id: string; type: string; label: string }[] {
    const first = rows[0] ?? {};
    return Object.keys(first).map((id) => ({
        id,
        type: fieldType(id),
        label: titleCase(id),
    }));
}

function textBlock(id: string, key: string, value: string): Block {
    return { id, type: isLong(value) ? "longtext" : "text", label: titleCase(key), value };
}

function listBlock(id: string, key: string, rows: Json[]): Block {
    return { id, type: "list", label: titleCase(key), fields: deriveFields(rows), items: rows };
}

/** Flatten an object into content blocks; nested objects recurse, arrays → list blocks. */
function buildBlocks(prefix: string, obj: Json): Block[] {
    const blocks: Block[] = [];
    for (const [k, v] of Object.entries(obj)) {
        const path = `${prefix}.${k}`;
        if (COLLECTION_PATHS.includes(path)) continue; // owned by a Collection
        if (Array.isArray(v)) {
            blocks.push(listBlock(path, k, v as Json[]));
        } else if (isPlainObject(v)) {
            blocks.push(...buildBlocks(path, v));
        } else if (v != null) {
            blocks.push(textBlock(path, k, String(v)));
        }
    }
    return blocks;
}

/** Sections for one page base, from that locale's messages. */
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
        if (Array.isArray(val)) {
            general.push(listBlock(path, key, val as Json[]));
        } else if (isPlainObject(val)) {
            sections.push({ title: titleCase(key), blocks: buildBlocks(path, val) });
        } else if (val != null) {
            general.push(textBlock(path, key, String(val)));
        }
    }
    if (general.length) sections.unshift({ title: "General", blocks: general });

    const metaFor = (msgs.meta as Json | undefined)?.[base];
    if (isPlainObject(metaFor))
        sections.push({ title: "SEO", blocks: buildBlocks(`meta.${base}`, metaFor) });

    return sections.filter((s) => s.blocks.length > 0);
}

/** Keep existing rows for a key untouched; only add rows for new keys. */
function mergeByKey(fresh: Json[], existing: Json[]): Json[] {
    const byKey = new Map(existing.map((r) => [r.key, r]));
    const merged = fresh.map((r) => byKey.get(r.key as string) ?? r);
    const freshKeys = new Set(fresh.map((r) => r.key));
    return [...merged, ...existing.filter((r) => !freshKeys.has(r.key))];
}

// --- seed steps -------------------------------------------------------------

type SchemaField = {
    id: string;
    type: string;
    label: string;
    localized?: boolean;
};

/** Flat { blockId: value | items } for a page base in one locale. */
function collectBlockValues(base: string, msgs: Json): Record<string, unknown> {
    const values: Record<string, unknown> = {};
    for (const section of buildPageSections(base, msgs)) {
        for (const b of section.blocks) {
            values[b.id] = b.type === "list" ? b.items : b.value;
        }
    }
    return values;
}

async function seedPages(token: string, messagesByLocale: Record<string, Json>) {
    const defaultMsgs = messagesByLocale[BASE_LOCALE];

    for (const base of PAGE_BASES) {
        const existing = await api("GET", `/pages/slug/${base}`, token);
        if (existing.status === 200) {
            // Don't clobber an existing page, but do add the "Media" image
            // section if a previous seed created the page before it existed.
            const media = imageSection(base);
            const sections = (existing.json.sections ?? []) as { title: string }[];
            if (media && !sections.some((s) => s.title === "Media")) {
                await api("POST", "/sections", token, {
                    pageId: existing.json.id,
                    title: media.title,
                    order: sections.length,
                    content: { blocks: media.blocks },
                });
                console.log(`  page ${base}: exists — added Media section`);
            } else {
                console.log(`  page ${base}: exists — skipped`);
            }
            continue;
        }

        const created = await api("POST", "/pages", token, {
            title: titleCase(base),
            slug: base,
        });
        if (created.status !== 201 && created.status !== 200) {
            throw new Error(`create page ${base} failed (${created.status}): ${JSON.stringify(created.json)}`);
        }
        const pageId = created.json.id as string;
        await api("PUT", `/pages/${pageId}`, token, { isPublished: true });

        const media = imageSection(base);
        const sections = [
            ...buildPageSections(base, defaultMsgs),
            ...(media ? [media] : []),
        ];
        for (let i = 0; i < sections.length; i++) {
            const s = sections[i];
            const r = await api("POST", "/sections", token, {
                pageId,
                title: s.title,
                order: i,
                content: { blocks: s.blocks },
            });
            if (r.status !== 201 && r.status !== 200) {
                throw new Error(`create section ${base}/${s.title} failed (${r.status}): ${JSON.stringify(r.json)}`);
            }
        }

        for (const locale of OTHER_LOCALES) {
            const values = collectBlockValues(base, messagesByLocale[locale]);
            const r = await api("PUT", `/pages/${pageId}/translations`, token, {
                locale,
                values,
            });
            if (r.status !== 200) {
                throw new Error(`set ${locale} translations for ${base} failed (${r.status}): ${JSON.stringify(r.json)}`);
            }
        }
        console.log(
            `  page ${base}: created (${sections.length} sections, published, ${OTHER_LOCALES.length} translations)`,
        );
    }
}

/** { [rowKey]: { [localizedField]: value } } for a collection in one locale. */
function collectionTranslations(
    def: (typeof COLLECTIONS)[number],
    msgs: Json,
): Record<string, Record<string, unknown>> {
    const arr = (getPath(msgs, def.path) as Json[] | undefined) ?? [];
    const out: Record<string, Record<string, unknown>> = {};
    for (const row of arr) {
        const fields: Record<string, unknown> = {};
        for (const f of def.localeFields) fields[f] = row[f] ?? "";
        out[String(row.key)] = fields;
    }
    return out;
}

async function seedCollections(token: string, messagesByLocale: Record<string, Json>) {
    const defaultMsgs = messagesByLocale[BASE_LOCALE];

    for (const def of COLLECTIONS) {
        const baseArr = getPath(defaultMsgs, def.path) as Json[] | undefined;
        if (!Array.isArray(baseArr)) continue;

        // Base rows carry the default-locale values; text fields are localized,
        // key + shared fields (e.g. image) are not.
        const items: Json[] = baseArr.map((row) => {
            const it: Json = { key: row.key };
            for (const f of def.localeFields) it[f] = row[f] ?? "";
            for (const f of def.flatFields) it[f] = "";
            return it;
        });
        const fields: SchemaField[] = [
            { id: "key", type: "text", label: "Key", localized: false },
        ];
        for (const f of def.localeFields)
            fields.push({ id: f, type: fieldType(f), label: titleCase(f), localized: true });
        for (const f of def.flatFields)
            fields.push({ id: f, type: fieldType(f), label: titleCase(f), localized: false });

        // Replace a collection left over from the old per-locale-column model.
        const existing = await api("GET", `/collections/slug/${def.slug}`, token);
        const oldShape =
            existing.status === 200 &&
            Array.isArray(existing.json.schema?.fields) &&
            existing.json.schema.fields.some((f: SchemaField) => /_/.test(f.id));
        if (oldShape) {
            await api("DELETE", `/collections/${existing.json.id}`, token);
        }

        if (existing.status === 200 && !oldShape) {
            const merged = mergeByKey(
                items,
                Array.isArray(existing.json.items) ? existing.json.items : [],
            );
            const r = await api("PUT", `/collections/${existing.json.id}`, token, {
                name: titleCase(def.slug),
                items: merged,
                schema: { fields },
            });
            if (r.status !== 200) throw new Error(`update ${def.slug} failed (${r.status}): ${JSON.stringify(r.json)}`);
            console.log(`  collection ${def.slug}: updated (${merged.length} rows)`);
            continue;
        }

        const created = await api("POST", "/collections", token, {
            name: titleCase(def.slug),
            items,
            schema: { fields },
        });
        if (created.status !== 201 && created.status !== 200)
            throw new Error(`create ${def.slug} failed (${created.status}): ${JSON.stringify(created.json)}`);
        const collectionId = created.json.id as string;

        for (const locale of OTHER_LOCALES) {
            const values = collectionTranslations(def, messagesByLocale[locale]);
            const r = await api("PUT", `/collections/${collectionId}/translations`, token, {
                locale,
                values,
            });
            if (r.status !== 200) throw new Error(`set ${locale} translations for ${def.slug} failed (${r.status}): ${JSON.stringify(r.json)}`);
        }
        console.log(
            `  collection ${def.slug}: created (${items.length} rows, ${OTHER_LOCALES.length} translations)`,
        );
    }
}

function getPath(obj: Json, path: string): unknown {
    return path.split(".").reduce<unknown>((acc, k) => (isPlainObject(acc) ? acc[k] : undefined), obj);
}

// Remove previous models' artifacts: the flat site-content collection, the
// site-images collection (images now live as page blocks), and the per-locale
// `<base>-<locale>` pages.
async function deleteLegacy(token: string) {
    for (const slug of ["site-content", "site-images"]) {
        const c = await api("GET", `/collections/slug/${slug}`, token);
        if (c.status === 200) {
            await api("DELETE", `/collections/${c.json.id}`, token);
            console.log(`  removed obsolete '${slug}' collection`);
        }
    }
    for (const base of PAGE_BASES) {
        for (const locale of LOCALES) {
            const slug = `${base}-${locale}`;
            const p = await api("GET", `/pages/slug/${slug}`, token);
            if (p.status === 200) {
                await api("DELETE", `/pages/${p.json.id}`, token);
                console.log(`  removed legacy page ${slug}`);
            }
        }
    }
}

async function run() {
    const token = await login();
    const messagesByLocale: Record<string, Json> = {};
    for (const locale of LOCALES) messagesByLocale[locale] = loadMessages(locale);

    console.log(`Locales: ${LOCALES.join(", ")} (base: ${BASE_LOCALE})`);
    console.log("Cleanup:");
    await deleteLegacy(token);
    console.log("Pages:");
    await seedPages(token, messagesByLocale);
    console.log("Collections:");
    await seedCollections(token, messagesByLocale);
    console.log("Done.");
}

run().catch((err) => {
    console.error("Seed failed:", err instanceof Error ? err.message : err);
    process.exit(1);
});
