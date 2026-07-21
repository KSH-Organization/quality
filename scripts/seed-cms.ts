/**
 * Seeds this site's content into a MOHTAWA CMS over its public HTTP API only —
 * no database access, no dependency on the CMS repo's internals. Copy this
 * script (and the shapes it writes) into any frontend that wants its content
 * managed by MOHTAWA. See docs/CMS_INTEGRATION.md and the dashboard's
 * "Integration guide" page for the full write-up.
 *
 * What it creates (see src/lib/cms-schema.ts for the single source of truth):
 *  - One **Page per locale** for each PAGE_BASE (slug `<base>-<locale>`,
 *    published). A page's copy is stored as content blocks grouped into
 *    sections; a text string is a text block (`id` = its message key), a
 *    repeated group is a `list` block whose `items` is the array.
 *  - **Collections** for the dynamic lists (news/events/jobs), one row per item
 *    with per-locale columns (`title_en`, `title_ar`, …).
 *  - The **site-images** collection for fixed chrome/hero images.
 *  - Deletes the obsolete flat `site-content` collection if present.
 *
 * Locales come from src/i18n/routing.ts — add a locale + a messages/<locale>.json
 * and re-run to extend the site to a new language.
 *
 * Safe to re-run: existing Pages are left untouched (never clobbers an admin's
 * page edits); collections/images upsert by key (only missing keys inserted).
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
    IMAGE_KEYS,
    PAGE_BASES,
    SITE_IMAGES_SLUG,
} from "../src/lib/cms-schema";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:3000/api").replace(
    /\/+$/,
    "",
);
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;

const LOCALES = routing.locales as readonly string[];

type Json = Record<string, unknown>;
type Block = {
    id: string;
    type: string;
    label: string;
    value?: string;
    fields?: { id: string; type: string; label: string }[];
    items?: Json[];
};
type Section = { title: string; blocks: Block[] };

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

async function seedPages(token: string, messagesByLocale: Record<string, Json>) {
    for (const locale of LOCALES) {
        const msgs = messagesByLocale[locale];
        for (const base of PAGE_BASES) {
            const slug = `${base}-${locale}`;
            const existing = await api("GET", `/pages/slug/${slug}`, token);
            if (existing.status === 200) {
                console.log(`  page ${slug}: exists — skipped`);
                continue;
            }
            const created = await api("POST", "/pages", token, {
                title: `${titleCase(base)} (${localeLabel(locale)})`,
                slug,
            });
            if (created.status !== 201 && created.status !== 200) {
                throw new Error(`create page ${slug} failed (${created.status}): ${JSON.stringify(created.json)}`);
            }
            const pageId = created.json.id as string;
            await api("PUT", `/pages/${pageId}`, token, { isPublished: true });

            const sections = buildPageSections(base, msgs);
            for (let i = 0; i < sections.length; i++) {
                const s = sections[i];
                const r = await api("POST", "/sections", token, {
                    pageId,
                    title: s.title,
                    order: i,
                    content: { blocks: s.blocks },
                });
                if (r.status !== 201 && r.status !== 200) {
                    throw new Error(`create section ${slug}/${s.title} failed (${r.status}): ${JSON.stringify(r.json)}`);
                }
            }
            console.log(`  page ${slug}: created (${sections.length} sections, published)`);
        }
    }
}

async function upsertCollection(
    token: string,
    name: string,
    slug: string,
    fields: { id: string; type: string; label: string }[],
    freshRows: Json[],
) {
    const existing = await api("GET", `/collections/slug/${slug}`, token);
    if (existing.status === 200) {
        const items = mergeByKey(
            freshRows,
            Array.isArray(existing.json.items) ? existing.json.items : [],
        );
        const r = await api("PUT", `/collections/${existing.json.id}`, token, {
            name,
            items,
            schema: { fields },
        });
        if (r.status !== 200) throw new Error(`update ${slug} failed (${r.status}): ${JSON.stringify(r.json)}`);
        console.log(`  collection ${slug}: updated (${items.length} rows)`);
    } else {
        const r = await api("POST", "/collections", token, {
            name,
            items: freshRows,
            schema: { fields },
        });
        if (r.status !== 201 && r.status !== 200) throw new Error(`create ${slug} failed (${r.status}): ${JSON.stringify(r.json)}`);
        console.log(`  collection ${slug}: created (${freshRows.length} rows)`);
    }
}

async function seedCollections(token: string, messagesByLocale: Record<string, Json>) {
    const defaultMsgs = messagesByLocale[routing.defaultLocale];

    for (const def of COLLECTIONS) {
        // Row keys + order come from the default locale's array at this path.
        const baseArr = getPath(defaultMsgs, def.path) as Json[] | undefined;
        if (!Array.isArray(baseArr)) continue;

        const rows: Json[] = baseArr.map((baseRow) => {
            const row: Json = { key: baseRow.key };
            for (const locale of LOCALES) {
                const arr = getPath(messagesByLocale[locale], def.path) as Json[] | undefined;
                const match = arr?.find((r) => r.key === baseRow.key) ?? {};
                for (const f of def.localeFields) row[`${f}_${locale}`] = match[f] ?? "";
            }
            for (const f of def.flatFields) row[f] = "";
            return row;
        });

        const fields = [{ id: "key", type: "text", label: "Key" }];
        for (const f of def.localeFields)
            for (const locale of LOCALES)
                fields.push({
                    id: `${f}_${locale}`,
                    type: fieldType(f),
                    label: `${titleCase(f)} (${localeLabel(locale)})`,
                });
        for (const f of def.flatFields)
            fields.push({ id: f, type: fieldType(f), label: titleCase(f) });

        await upsertCollection(token, titleCase(def.slug), def.slug, fields, rows);
    }
}

function getPath(obj: Json, path: string): unknown {
    return path.split(".").reduce<unknown>((acc, k) => (isPlainObject(acc) ? acc[k] : undefined), obj);
}

async function seedImages(token: string) {
    const rows: Json[] = IMAGE_KEYS.map((key) => ({ key, image: "" }));
    await upsertCollection(
        token,
        "Site Images",
        SITE_IMAGES_SLUG,
        [
            { id: "key", type: "text", label: "Key" },
            { id: "image", type: "image", label: "Image" },
        ],
        rows,
    );
}

async function deleteLegacySiteContent(token: string) {
    const existing = await api("GET", "/collections/slug/site-content", token);
    if (existing.status === 200) {
        await api("DELETE", `/collections/${existing.json.id}`, token);
        console.log("  removed obsolete 'site-content' collection");
    }
}

async function run() {
    const token = await login();
    const messagesByLocale: Record<string, Json> = {};
    for (const locale of LOCALES) messagesByLocale[locale] = loadMessages(locale);

    console.log(`Locales: ${LOCALES.join(", ")}`);
    console.log("Pages:");
    await seedPages(token, messagesByLocale);
    console.log("Collections:");
    await seedCollections(token, messagesByLocale);
    await seedImages(token);
    await deleteLegacySiteContent(token);
    console.log("Done.");
}

run().catch((err) => {
    console.error("Seed failed:", err instanceof Error ? err.message : err);
    process.exit(1);
});
