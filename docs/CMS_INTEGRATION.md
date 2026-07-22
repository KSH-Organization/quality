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

The CMS uses Strapi-style i18n: **locales are managed in the CMS** (Settings →
Internationalization, one default), each document has **per-locale translations**
overlaid on its default-locale base, and fields can be **shared** (one value
across languages) or **localized** (translated). Reads pass `?locale=<code>` and
the CMS returns already-resolved content (default-locale fallback).

- **Pages** (slug `<base>`, e.g. `home`) hold a page's default-locale copy as
  typed content blocks; a block's `id` is its message key, and fixed repeated
  groups (clients, service cards, stats) are `list` blocks. Other locales live in
  the page's `translations` map.
- **Collections** hold the genuinely dynamic lists — `news-articles`,
  `news-events`, `careers-jobs` — one row per item; text fields are localized,
  `key`/`image` are shared. Add/remove items from the dashboard.
- **`site-images`** holds fixed chrome/hero/client images (`key → image`),
  locale-agnostic.

The single source of truth for this layout is [`src/lib/cms-schema.ts`](../src/lib/cms-schema.ts),
imported by both the read layer ([`src/lib/cms.ts`](../src/lib/cms.ts), which
fetches `?locale=<locale>`) and the seed
([`scripts/seed-cms.ts`](../scripts/seed-cms.ts)).

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

1. Add the locale in the CMS dashboard (Settings → Internationalization).
2. Add it to [`src/i18n/routing.ts`](../src/i18n/routing.ts) so the site has
   `/<locale>` URLs, and add a `messages/<locale>.json`.
3. Re-run the seed to populate that language's translations (or translate in the
   dashboard by switching locale in the Pages/Collections editors).

## Caching

`CMS_REVALIDATE_SECONDS` (default `5`) controls how long a CMS response is cached
server-side. This cache is server-side, so a stale page can't be cleared by a
browser refresh or incognito — it clears when the window elapses. Set `0` to
always render live.

---

The **full walkthrough** — running the seed, the block/collection shapes, what
the backend expects, and how the data is fetched — lives in the CMS dashboard
under **Integration guide** (built from `mohtawa/frontend/src/pages/Guide.tsx`).
