# CMS integration (MOHTAWA)

Every text string and image on this site is CMS-first with a local fallback: the
site always renders (a MOHTAWA CMS is optional), but when one is configured its
content wins wherever it has a value.

- **Text** — `src/i18n/request.ts` merges CMS content over
  `messages/<locale>.json` each request; pages read copy through `next-intl`
  (`t()` / `t.raw()`), so nothing per-component is wired to the CMS.
- **Images** — `src/lib/images.ts`'s `resolveImage()` checks the CMS-merged
  `images` map before falling back to `/public/images`.

## Content model

- **Pages** (`<base>-<locale>`, e.g. `home-en`) hold a page's copy as typed
  content blocks; a block's `id` is its message key, and fixed repeated groups
  (clients, service cards, stats) are `list` blocks.
- **Collections** hold the genuinely dynamic lists — `news-articles`,
  `news-events`, `careers-jobs` — one row per item with per-locale columns
  (`title_en`, `title_ar`, …). Add/remove items from the dashboard.
- **`site-images`** holds fixed chrome/hero/client images (`key → image`).

The single source of truth for this layout is [`src/lib/cms-schema.ts`](../src/lib/cms-schema.ts),
imported by both the read layer ([`src/lib/cms.ts`](../src/lib/cms.ts)) and the
seed ([`scripts/seed-cms.ts`](../scripts/seed-cms.ts)).

## Run the seed

```bash
CMS_API_URL=http://localhost:3000/api \
CMS_ADMIN_EMAIL=admin@example.com \
CMS_ADMIN_PASSWORD=Admin12345! \
npm run seed:cms
```

Creates/publishes the Pages and Collections above from `messages/*.json`. Safe to
re-run: existing Pages are left untouched; collections/images upsert by key.

## Adding a language

Add the locale to [`src/i18n/routing.ts`](../src/i18n/routing.ts), add a
`messages/<locale>.json`, and re-run the seed — it creates that locale's Pages and
adds the matching `_<locale>` columns to every collection.

## Caching

`CMS_REVALIDATE_SECONDS` (default `5`) controls how long a CMS response is cached
server-side. This cache is server-side, so a stale page can't be cleared by a
browser refresh or incognito — it clears when the window elapses. Set `0` to
always render live.

---

The **full walkthrough** — running the seed, the block/collection shapes, what
the backend expects, and how the data is fetched — lives in the CMS dashboard
under **Integration guide** (built from `mohtawa/frontend/src/pages/Guide.tsx`).
