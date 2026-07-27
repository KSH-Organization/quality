/**
 * Reads this site's content from the MOHTAWA CMS and shapes it into the nested
 * messages tree that next-intl consumes (see `src/i18n/request.ts`), so pages
 * keep reading copy through `t()` / `t.raw()` with no per-component wiring.
 *
 * Sources (all optional at runtime — anything missing/unreachable falls back to
 * the local `messages/<locale>.json`):
 *  - **Pages** `<base>-<locale>` (see `cms-schema.ts` PAGE_BASES): every content
 *    block's `id` is its message key; text blocks carry a `value`, `list` blocks
 *    carry an `items` array. Walked into the tree by dot-path.
 *  - **Collections** (news/events/jobs): the CMS resolves each per `?locale=`,
 *    so rows come back already localized (plain field names).
 *  - **Images**: page-level image blocks have id `images.<key>` and a Media
 *    Library URL value, so they land at `tree.images[<key>]` via the same block
 *    walk — read by `src/lib/images.ts`. They sit in the section whose copy they
 *    illustrate, not in one shared bucket.
 *  - **Per-row media**: an item's own `image`/`icon` is a column on its list or
 *    collection row, so it travels with that item's text (see ROW_MEDIA). An
 *    empty `icon` falls back to the component's built-in Lucide icon for that
 *    row's `key`; an empty `image` falls back to the bundled asset.
 *
 * The CMS is fetched server-side only (inside next-intl's request config).
 */
import { COLLECTIONS, PAGE_BASES } from "./cms-schema";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:3000/api").replace(
    /\/+$/,
    "",
);

const FETCH_TIMEOUT_MS = 3000;

// How long (seconds) a fetched CMS response is cached server-side before the
// next request re-fetches. This is a *server-side* cache (Next.js Data Cache +
// Full Route Cache), so a stale page can't be cleared by reloading in the
// browser or an incognito window — it clears only when this window elapses.
// Kept short so an admin editing in the dashboard sees the change within a few
// seconds. Set CMS_REVALIDATE_SECONDS=0 to always render live (every request
// hits the CMS); raise it for a high-traffic deploy that tolerates staler copy.
const REVALIDATE_SECONDS = Number(process.env.CMS_REVALIDATE_SECONDS ?? "5");

type Json = Record<string, unknown>;
type CmsBlock = {
    id?: unknown;
    type?: unknown;
    value?: unknown;
    items?: unknown;
};

async function fetchJson(path: string): Promise<Json | null> {
    try {
        const res = await fetch(`${CMS_API_URL}${path}`, {
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            next: { revalidate: REVALIDATE_SECONDS },
        });
        if (!res.ok) return null;
        return (await res.json()) as Json;
    } catch {
        // Network error, timeout, CMS down, bad JSON → "no override available".
        return null;
    }
}

const q = (locale: string) => `?locale=${encodeURIComponent(locale)}`;

/**
 * Every content block across every section of a published page, resolved for
 * `locale` by the CMS (localized values overlaid, default-locale fallback).
 */
async function fetchPageBlocks(
    slug: string,
    locale: string,
): Promise<CmsBlock[] | null> {
    const page = await fetchJson(`/pages/slug/${slug}${q(locale)}`);
    if (!page || !Array.isArray(page.sections)) return null;
    const blocks: CmsBlock[] = [];
    for (const section of page.sections as Json[]) {
        const content = section?.content as Json | undefined;
        const list = content?.blocks;
        if (Array.isArray(list)) blocks.push(...(list as CmsBlock[]));
    }
    return blocks;
}

async function fetchCollectionRows(
    slug: string,
    locale: string,
): Promise<Json[] | null> {
    const collection = await fetchJson(`/collections/slug/${slug}${q(locale)}`);
    return collection && Array.isArray(collection.items)
        ? (collection.items as Json[])
        : null;
}

/** Sets `value` at a dot-path inside `target`, creating intermediate objects. */
function setPath(target: Json, path: string, value: unknown): void {
    const parts = path.split(".").filter(Boolean);
    if (parts.length === 0) return;
    let cursor = target;
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        const next = cursor[part];
        if (typeof next !== "object" || next === null || Array.isArray(next)) {
            cursor[part] = {};
        }
        cursor = cursor[part] as Json;
    }
    cursor[parts[parts.length - 1]] = value;
}

function nonEmptyString(value: unknown): string | null {
    return typeof value === "string" && value.trim() !== "" ? value : null;
}

/**
 * Builds the CMS override tree for `locale` from Pages + Collections + images.
 * Only non-empty leaves are included so `deepMerge` below falls back to local
 * copy for everything the CMS doesn't define. Returns null when the CMS gave us
 * nothing at all (so the site runs entirely on local copy).
 */
export async function fetchCmsSiteContent(locale: string): Promise<Json | null> {
    const [pageBlockLists, ...collectionRowLists] = await Promise.all([
        Promise.all(PAGE_BASES.map((base) => fetchPageBlocks(base, locale))),
        ...COLLECTIONS.map((c) => fetchCollectionRows(c.slug, locale)),
    ]);

    const tree: Json = {};
    let gotAnything = false;

    // Pages → tree. Text block: id -> value (image blocks are text blocks whose
    // id is `images.<key>` and value a Media URL, so they land at
    // tree.images[<key>]). List block: id -> items array.
    for (const blocks of pageBlockLists) {
        if (!blocks) continue;
        for (const block of blocks) {
            const id = nonEmptyString(block.id);
            if (!id) continue;
            if (block.type === "list") {
                if (Array.isArray(block.items)) {
                    setPath(tree, id, block.items);
                    gotAnything = true;
                }
            } else {
                const value = nonEmptyString(block.value);
                if (value) {
                    setPath(tree, id, value);
                    gotAnything = true;
                }
            }
        }
    }

    // Collections → arrays at their message path (locale-selected columns).
    COLLECTIONS.forEach((def, i) => {
        const rows = collectionRowLists[i];
        if (!rows || rows.length === 0) return;
        // The CMS already resolved rows for this locale, so fields are plain.
        const items = rows.map((row) => {
            const item: Json = { key: row.key };
            for (const field of [...def.localeFields, ...def.flatFields]) {
                item[field] = row[field] ?? "";
            }
            return item;
        });
        setPath(tree, def.path, items);
        gotAnything = true;
    });

    return gotAnything ? tree : null;
}

function isPlainObject(value: unknown): value is Json {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Deep-merges `override` onto `base`; `override` wins on every leaf it defines.
 * Arrays replace wholesale (a CMS list replaces the local fallback list).
 */
export function deepMerge<T extends Json>(
    base: T,
    override: Json | null | undefined,
): T {
    if (!override) return base;
    const result: Json = { ...base };
    for (const [key, overrideValue] of Object.entries(override)) {
        if (overrideValue === undefined || overrideValue === null) continue;
        const baseValue = result[key];
        result[key] =
            isPlainObject(baseValue) && isPlainObject(overrideValue)
                ? deepMerge(baseValue, overrideValue)
                : overrideValue;
    }
    return result as T;
}
