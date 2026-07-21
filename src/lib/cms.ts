/**
 * Reads site copy from the MOHTAWA CMS. Every page pulls its text through
 * next-intl, so this module's output is merged straight into the messages
 * tree (see src/i18n/request.ts) — no per-component wiring needed.
 *
 * The CMS is optional at runtime: if it's unreachable, slow, or simply
 * doesn't have a "site-content" collection yet, callers fall back to the
 * local messages/{locale}.json bundled with the app.
 */

// Server-only: the CMS is fetched inside next-intl's request config, never
// from the browser, so this can point at a container-internal hostname.
const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:3000/api").replace(
    /\/+$/,
    "",
);

const FETCH_TIMEOUT_MS = 3000;

type CmsCollectionItem = {
    locale?: string;
    content?: Record<string, unknown>;
};

/**
 * Fetches the "site-content" collection's item for `locale` from the CMS.
 * Returns null (never throws) if the CMS is unreachable or the content is
 * missing/malformed, so callers can unconditionally fall back to local copy.
 */
export async function fetchCmsSiteContent(
    locale: string,
): Promise<Record<string, unknown> | null> {
    try {
        const res = await fetch(`${CMS_API_URL}/collections/slug/site-content`, {
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            // Revalidate periodically rather than on every request — CMS edits
            // don't need to appear instantly, and this keeps pages fast even
            // when the CMS is slow.
            next: { revalidate: 60 },
        });

        if (!res.ok) return null;

        const collection = (await res.json()) as { items?: CmsCollectionItem[] };
        const item = collection.items?.find((i) => i.locale === locale);

        return item?.content && typeof item.content === "object"
            ? item.content
            : null;
    } catch {
        // Network error, timeout, CMS down, bad JSON — any of these just means
        // "no CMS override available right now".
        return null;
    }
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
