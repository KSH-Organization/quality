/**
 * Reads site copy from the MOHTAWA CMS. Every page pulls its text through
 * next-intl, so this module's output is merged straight into the messages
 * tree (see src/i18n/request.ts) — no per-component wiring needed.
 *
 * Content lives in two CMS collections, both editable straight from the
 * dashboard's ordinary Collections screen (no bespoke editor needed):
 *  - "site-content": one row per translatable string, flat — { key, en, ar }.
 *    `key` is the dot-path into this site's messages tree (e.g. "nav.home",
 *    "about.body"); rebuilt into a nested object below.
 *  - "site-images": one row per image slot — { key, image }. `image` is a
 *    real dashboard "Image" field (drag-and-drop upload), stored as a
 *    base64 data: URI or a pasted URL.
 * See backend/src/seed/site-content.seed.ts in the MOHTAWA repo for how
 * these are seeded, and src/lib/images.ts for how `images.<key>` rows are
 * consumed.
 *
 * The CMS is optional at runtime: if it's unreachable, slow, or a
 * collection/row is missing, callers fall back to the local
 * messages/{locale}.json bundled with the app.
 */

// Server-only: the CMS is fetched inside next-intl's request config, never
// from the browser, so this can point at a container-internal hostname.
const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:3000/api").replace(
    /\/+$/,
    "",
);

const FETCH_TIMEOUT_MS = 3000;

type CmsRow = Record<string, unknown>;

async function fetchCollectionRows(slug: string): Promise<CmsRow[] | null> {
    try {
        const res = await fetch(`${CMS_API_URL}/collections/slug/${slug}`, {
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            // Revalidate periodically rather than on every request — CMS edits
            // don't need to appear instantly, and this keeps pages fast even
            // when the CMS is slow.
            next: { revalidate: 60 },
        });

        if (!res.ok) return null;

        const collection = (await res.json()) as { items?: unknown };
        return Array.isArray(collection.items)
            ? (collection.items as CmsRow[])
            : null;
    } catch {
        // Network error, timeout, CMS down, bad JSON — any of these just means
        // "no CMS override available right now".
        return null;
    }
}

/** Sets `value` at a dot-path inside `target`, creating intermediate objects. */
function setPath(
    target: Record<string, unknown>,
    path: string,
    value: unknown,
): void {
    const parts = path.split(".").filter(Boolean);
    if (parts.length === 0) return;

    let cursor = target;
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        const next = cursor[part];
        if (typeof next !== "object" || next === null || Array.isArray(next)) {
            cursor[part] = {};
        }
        cursor = cursor[part] as Record<string, unknown>;
    }
    cursor[parts[parts.length - 1]] = value;
}

function nonEmptyString(value: unknown): string | null {
    return typeof value === "string" && value.trim() !== "" ? value : null;
}

/**
 * Builds the CMS override tree for `locale`: the nested messages object from
 * "site-content" rows, plus an "images" namespace from "site-images" rows.
 * Only rows with a non-empty value for this locale are included, so
 * deepMerge() below correctly falls back to local copy for everything else.
 */
export async function fetchCmsSiteContent(
    locale: string,
): Promise<Record<string, unknown> | null> {
    const [textRows, imageRows] = await Promise.all([
        fetchCollectionRows("site-content"),
        fetchCollectionRows("site-images"),
    ]);

    if (!textRows && !imageRows) return null;

    const content: Record<string, unknown> = {};

    for (const row of textRows ?? []) {
        const key = nonEmptyString(row.key);
        const value = nonEmptyString(row[locale]);
        if (key && value) setPath(content, key, value);
    }

    const images: Record<string, string> = {};
    for (const row of imageRows ?? []) {
        const key = nonEmptyString(row.key);
        const value = nonEmptyString(row.image);
        if (key && value) images[key] = value;
    }
    if (Object.keys(images).length > 0) content.images = images;

    return Object.keys(content).length > 0 ? content : null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

/**
 * Deep-merges `override` onto `base`, `override` wins on every leaf it
 * defines. Keys `override` doesn't have (or sets to null/undefined) keep
 * their value from `base` — that's what makes "only some text edited in the
 * CMS, the rest stays local" work.
 */
export function deepMerge<T extends Record<string, unknown>>(
    base: T,
    override: Record<string, unknown> | null | undefined,
): T {
    if (!override) return base;

    const result: Record<string, unknown> = { ...base };

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
