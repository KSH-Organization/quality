/**
 * Resolves an image src by CMS-first lookup: `images` is the raw "images"
 * namespace out of the (CMS-merged) next-intl messages tree — see
 * src/i18n/request.ts. If the CMS has a value for `key` (a URL or a
 * data: URI pasted into the CMS editor), that wins; otherwise falls back to
 * the local asset shipped in /public.
 */
export function resolveImage(
    images: Record<string, unknown> | undefined,
    key: string,
    fallback: string,
): string {
    const value = images?.[key];
    return typeof value === "string" && value.trim() !== "" ? value : fallback;
}
