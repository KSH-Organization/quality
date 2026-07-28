import { assetUrl } from "./asset-url";

/**
 * Resolves an image src by CMS-first lookup: `images` is the raw "images"
 * namespace out of the (CMS-merged) next-intl messages tree — see
 * src/i18n/request.ts. If the CMS has a value for `key` (a URL or a
 * data: URI pasted into the CMS editor), that wins; otherwise falls back to
 * the local asset shipped in /public.
 *
 * Bundled fallbacks come back fingerprinted (`/images/x.jpg?v=<hash>`) so that
 * replacing a file changes its URL — otherwise next/image keeps serving the
 * previously optimised copy from cache long after a deploy. CMS URLs are
 * already immutable (a re-upload mints a new id) and pass through untouched.
 */
export function resolveImage(
    images: Record<string, unknown> | undefined,
    key: string,
    fallback: string,
): string {
    const value = images?.[key];
    const src =
        typeof value === "string" && value.trim() !== "" ? value : fallback;
    return assetUrl(src);
}
