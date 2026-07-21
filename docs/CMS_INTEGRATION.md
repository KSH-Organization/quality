# CMS integration (MOHTAWA)

Every text string and image on this site is CMS-first with a local
fallback: the site always renders — a MOHTAWA CMS deployment is optional —
but when one is configured, its content wins wherever it has a value.

- Text: `src/i18n/request.ts` merges CMS content over `messages/{locale}.json`
  on every request. Every page already reads copy through `next-intl`
  (`t()` / `useTranslations`), so nothing else needs to change when a key
  moves to the CMS.
- Images: `src/lib/images.ts`'s `resolveImage()` checks the CMS-merged
  `images` namespace before falling back to the matching file in
  `/public/images`.

If the CMS is unreachable, slow, or simply doesn't have a row for some key,
that key silently falls back to the local bundle — nothing breaks.

## Running the seed

The seed creates/updates the two CMS collections this site reads (see
below) so a fresh MOHTAWA deployment starts out with this site's baseline
copy, editable from the CMS dashboard from day one.

```bash
CMS_API_URL=http://localhost:3000/api \
CMS_ADMIN_EMAIL=admin@example.com \
CMS_ADMIN_PASSWORD=Admin12345! \
npm run seed:cms
```

- `CMS_API_URL` — the CMS's API base (defaults to `http://localhost:3000/api`
  if omitted).
- `CMS_ADMIN_EMAIL` / `CMS_ADMIN_PASSWORD` — an existing admin account on
  that CMS. The script only calls the CMS's public HTTP API (`POST
  /api/auth/login`, then `GET`/`POST`/`PUT /api/collections`) — no database
  access, no dependency on the CMS's source code. `scripts/seed-cms.ts` can
  be copied into any other frontend that wants the same pattern; it's not
  specific to this repo beyond reading `messages/en.json` and
  `messages/ar.json`.

**Safe to re-run.** It never overwrites a row an admin has already edited
in the dashboard — matching is by `key`, and only missing keys get
inserted. Rows whose key no longer exists in `messages/*.json` (e.g. copy
that was deleted from the site) are kept rather than deleted, since losing
an admin's edit on a routine reseed would be worse than a stale unused row.

## Seed structure

The seed writes two collections, both flat tables of typed columns so
they're editable directly from the CMS dashboard's ordinary Collections
screen — no bespoke editor needed on the CMS side.

### `site-content`

One row per translatable string. `key` is the dot-path into this site's
`messages/{locale}.json` tree.

| key                | en                                          | ar        |
| ------------------ | -------------------------------------------- | --------- |
| `nav.home`         | Home                                         | الرئيسية  |
| `about.body`       | KSHC Logistic is an investment of the...     | ...       |
| `careers.form.cv`  | Attach your CV                               | ...       |

Editing `en`/`ar` on a row changes that key everywhere it's used on the
site (header, footer, hero copy, form labels, etc.) — same as editing
`messages/en.json` directly, just without a deploy.

### `site-images`

One row per image slot. `key` matches what `resolveImage()` looks up (see
`IMAGE_KEYS` in `scripts/seed-cms.ts` for the full list — logo, every
page's hero, client logos, news/event thumbnails, ...). `image` is the
CMS dashboard's real "Image" field: an admin drags a file onto it, the
dashboard base64-encodes it client-side and stores the resulting `data:`
URI in this field. Rows start empty (`image: ""`) — until an admin uploads
something, that key keeps rendering the site's local `/public/images` file.

## What the backend expects

Both collections are created/read/written through MOHTAWA's generic
Collections API — there's nothing quality-specific on the CMS side:

- `GET /api/collections/slug/site-content` / `.../site-images` — public,
  no auth. Returns `{ id, name, slug, items, schema, ... }`.
- `POST /api/collections` / `PUT /api/collections/:id` — admin JWT
  required (`POST /api/auth/login` first). Body: `{ name, items, schema }`.
  `schema.fields` is the typed-column definition the dashboard's row editor
  renders from (`text` / `longtext` / `image` field types here).
- Collections default to public read / admin-only write
  (`defaultPolicy('content')` on the backend) — that's what makes the `GET`
  above work with no token.

## How the site fetches it

`src/lib/cms.ts`:

1. Fetches both collections' `items` (`fetchCollectionRows`), each with a
   3s timeout and 60s revalidation — a slow or down CMS degrades to "use
   local copy" rather than blocking the page.
2. Rebuilds a nested object from `site-content`'s flat `{ key, en, ar }`
   rows for the requested locale (`setPath`, splitting `key` on `.`), and a
   flat `{ [key]: image }` map from `site-images`'s rows. Rows with an
   empty value for the current locale/image are skipped entirely, so they
   don't clobber the local fallback.
3. `src/i18n/request.ts` deep-merges that object over the bundled
   `messages/{locale}.json` (`deepMerge` — CMS wins on any key it defines,
   local value wins otherwise) and hands the result to `next-intl` as the
   request's `messages`.

Nothing downstream (pages, components) needs to know whether a given piece
of copy came from the CMS or the local bundle.
