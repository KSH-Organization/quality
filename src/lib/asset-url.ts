import hashes from "./asset-hashes.json";

const ASSET_HASHES = hashes as Record<string, string>;

/**
 * Adds a content fingerprint to a bundled image URL: `/images/x.jpg` becomes
 * `/images/x.jpg?v=ab12cd34`, where the hash is of the file's bytes (generated
 * by scripts/build-asset-hashes.mjs at build time).
 *
 * Why: next/image caches optimised copies against the request URL with a long
 * max-age. Replacing an image in place reuses that URL, so caches keep serving
 * the previous bytes long after a deploy. Changing the file changes the hash,
 * which changes the URL, so the new image is fetched immediately — while
 * untouched images keep their URL and stay fully cached.
 *
 * Leaves anything that isn't a bundled asset untouched: CMS Media Library URLs
 * are already immutable (a re-upload gets a new id), data: URIs carry their own
 * bytes, and absolute URLs belong to someone else.
 */
export function assetUrl(src: string): string {
    if (!src || !src.startsWith("/")) return src; // data:, http(s):, or empty
    if (src.includes("?")) return src; // already carries a query
    const hash = ASSET_HASHES[src];
    return hash ? `${src}?v=${hash}` : src;
}
