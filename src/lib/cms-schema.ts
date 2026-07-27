/**
 * Shared description of how this site's content is laid out in the MOHTAWA CMS.
 * Imported by BOTH the read layer (`src/lib/cms.ts`) and the write layer
 * (`scripts/build-manifest.ts`) so the two can never drift.
 *
 * Model:
 *  - Each top-level messages namespace that is a *page* becomes one CMS **Page
 *    per locale** (slug `<base>-<locale>`), whose copy is stored as typed
 *    content blocks. A block's `id` is its full dot-path message key
 *    (e.g. `home.hero.badge`); a repeated group is a single `list` block whose
 *    `items` is the array (e.g. `home.capabilities.items`).
 *  - Genuinely *dynamic* lists (news, events, jobs — admin adds/removes over
 *    time) are **Collections** with one row per item and per-locale columns.
 *  - Fixed chrome/hero images live in the `site-images` collection.
 *
 * Nothing here is hardcoded to English/Arabic — the locale list lives in
 * `src/i18n/routing.ts` and drives both the seed and the read layer.
 */

// Top-level namespaces that become CMS Pages (one per locale). `globals` holds
// site chrome (nav/footer/site name); the rest map to a site page.
export const PAGE_BASES = [
    "globals",
    "home",
    "about",
    "departments",
    "services",
    "news",
    "careers",
    "contact",
] as const;

export type CollectionDef = {
    /** CMS collection slug. */
    slug: string;
    /** Dot-path in the messages tree this collection populates. */
    path: string;
    /** Fields translated per locale (localized in the CMS schema). */
    localeFields: string[];
    /** Shared (non-localized) fields, e.g. an uploaded image. */
    flatFields: string[];
};

// Dynamic lists → Collections. The CMS resolves each collection per ?locale=,
// so the read layer gets already-localized rows (plain field names). `path` is
// where the built array is injected into the messages tree, matching the local
// fallback arrays in messages/*.json (components read them with `t.raw`).
export const COLLECTIONS: CollectionDef[] = [
    {
        slug: "news-articles",
        path: "news.articles",
        localeFields: ["title", "date", "body"],
        flatFields: ["image"],
    },
    {
        slug: "news-events",
        path: "news.events",
        localeFields: ["title", "category", "date"],
        flatFields: ["image"],
    },
    {
        slug: "careers-jobs",
        path: "careers.form.jobs",
        localeFields: ["title"],
        flatFields: [],
    },
];

// Message paths owned by Collections — excluded when the seed builds Page
// blocks so they aren't duplicated as page content.
export const COLLECTION_PATHS = COLLECTIONS.map((c) => c.path);

// Where each image block belongs, keyed by page base → the SECTION it sits in.
// Placing an image next to the copy it illustrates (rather than in one shared
// "Media" bucket) is what makes it obvious which image an editor is changing —
// `hero-about` sits in About's Hero section, not in a list of eight images.
//
// The block id stays `images.<key>`, so the read layer's setPath still routes
// it to tree.images[<key>] and `resolveImage()` needs no change. Blocks are
// Shared (one value across locales) and start empty, so the site falls back to
// its bundled /public/images asset until an admin uploads one.
//
// Per-row images/icons are NOT here — they live on their own list row or
// collection row (see ROW_MEDIA and the collections' flatFields), so each item
// carries its own picture instead of the editor guessing which of N images in
// a Media section maps to which item.
export const IMAGE_BLOCKS: Record<string, Record<string, string[]>> = {
    globals: { Navigation: ["logo"] },
    home: { Hero: ["hero-home"] },
    about: {
        Hero: ["hero-about"],
        General: ["about-illustration"],
        Vision: ["about-vision"],
        Mission: ["about-mission"],
    },
    services: { General: ["hero-services"] },
    careers: { General: ["hero-careers"] },
};

/**
 * List blocks whose ROWS carry their own media, so each item's image/icon is
 * edited inline with that item's text. Keyed by the block's dot-path id.
 *
 * `image` — a picture for that row (client logos, etc.)
 * `icon`  — an uploaded icon; empty falls back to the component's built-in
 *           Lucide icon for that row's `key`, so the site never loses icons.
 */
export const ROW_MEDIA: Record<string, ("image" | "icon")[]> = {
    "home.capabilities.items": ["icon"], // CAPABILITY_ICONS
    "home.edge.stats": ["icon"], // STAT_ICONS
    "home.clients.items": ["image"], // CLIENT_LOGOS (real logos, not icons)
    "about.objectives.items": ["icon"], // OBJECTIVE_ICONS
    "departments.items": ["icon"], // DEPARTMENT_ICONS
    "services.items": ["icon"], // SERVICE_ICONS
};
