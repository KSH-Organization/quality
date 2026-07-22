/**
 * Shared description of how this site's content is laid out in the MOHTAWA CMS.
 * Imported by BOTH the read layer (`src/lib/cms.ts`) and the write layer
 * (`scripts/seed-cms.ts`) so the two can never drift.
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

// Fixed chrome/hero/client images, kept in a single locale-agnostic collection
// (avoids re-uploading the same logo per language). Per-article/event images
// instead live on their own collection rows (the `image` flatField above).
export const SITE_IMAGES_SLUG = "site-images";
export const IMAGE_KEYS = [
    "logo",
    "hero-home",
    "hero-about",
    "hero-services",
    "hero-careers",
    "about-illustration",
    "about-vision",
    "about-mission",
    "client-bank",
    "client-zain",
    "client-samil",
];
