/**
 * Seeds this site's copy into a MOHTAWA CMS instance over its public HTTP
 * API only — no direct database access, no dependency on the CMS repo's
 * internals. That's deliberate: this script (and the row shapes it writes)
 * is meant to be copied into any frontend that wants its content managed by
 * MOHTAWA, not something that lives inside the CMS itself.
 *
 * See docs/CMS_INTEGRATION.md for the full write-up (row shapes, what the
 * backend expects, how the site reads the result back).
 *
 * Usage (from the repo root):
 *   CMS_API_URL=http://localhost:3000/api \
 *   CMS_ADMIN_EMAIL=admin@example.com \
 *   CMS_ADMIN_PASSWORD=Admin12345! \
 *   npm run seed:cms
 *
 * Safe to re-run: it never overwrites a row an admin has already edited in
 * the dashboard. Existing rows (matched by `key`) are left untouched; only
 * keys that don't exist yet (e.g. new copy added to the site later) are
 * inserted. Rows whose key no longer exists in this site's messages.json are
 * kept, not deleted — losing an admin's edit on a routine reseed would be
 * worse than a stale unused row.
 */
import enContent from "../messages/en.json";
import arContent from "../messages/ar.json";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:3000/api").replace(
  /\/+$/,
  "",
);
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;

type TextRow = { key: string; en: string; ar: string };
type ImageRow = { key: string; image: string };
type JsonObject = Record<string, unknown>;

// Every image src/lib/images.ts looks up by key — see that file's call sites
// (header, footer, and every page's hero/illustration/client-logo images)
// for the full picture.
const IMAGE_KEYS = [
  "logo",
  "hero-home",
  "client-bank",
  "client-zain",
  "client-samil",
  "hero-about",
  "about-illustration",
  "about-vision",
  "about-mission",
  "hero-careers",
  "hero-services",
  "news-1",
  "news-2",
  "news-3",
  "news-4",
  "event-1",
  "event-2",
  "event-3",
];

function flattenText(
  en: JsonObject,
  ar: JsonObject,
  prefix = "",
  out: TextRow[] = [],
): TextRow[] {
  for (const k of Object.keys(en)) {
    const path = prefix ? `${prefix}.${k}` : k;
    const enValue = en[k];
    const arValue = (ar as JsonObject | undefined)?.[k];

    if (enValue !== null && typeof enValue === "object" && !Array.isArray(enValue)) {
      flattenText(enValue as JsonObject, (arValue ?? {}) as JsonObject, path, out);
    } else {
      out.push({
        key: path,
        en: enValue == null ? "" : String(enValue),
        ar: arValue == null ? "" : String(arValue),
      });
    }
  }
  return out;
}

/** Keep any existing row for a key untouched; only add rows for new keys. */
function mergeByKey<T extends { key: string }>(freshRows: T[], existingRows: T[]): T[] {
  const existingByKey = new Map(existingRows.map((r) => [r.key, r]));
  const merged = freshRows.map((r) => existingByKey.get(r.key) ?? r);
  const freshKeys = new Set(freshRows.map((r) => r.key));
  const orphaned = existingRows.filter((r) => !freshKeys.has(r.key));
  return [...merged, ...orphaned];
}

function looksLikeRows(items: unknown): items is Array<{ key: unknown }> {
  return (
    Array.isArray(items) &&
    (items.length === 0 ||
      (typeof items[0] === "object" && items[0] !== null && "key" in (items[0] as object)))
  );
}

async function login(): Promise<string> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "Set CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD (the CMS's admin login) before running this script.",
    );
  }
  const res = await fetch(`${CMS_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Login failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function findCollectionBySlug(
  slug: string,
  token: string,
): Promise<{ id: string; items: JsonObject[] } | null> {
  const res = await fetch(`${CMS_API_URL}/collections/slug/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GET collections/slug/${slug} failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { id: string; items: JsonObject[] };
  return { id: data.id, items: data.items };
}

async function upsertCollection(
  token: string,
  name: string,
  slug: string,
  fields: { id: string; type: string; label: string }[],
  freshItems: Array<{ key: string } & JsonObject>,
): Promise<void> {
  const existing = await findCollectionBySlug(slug, token);

  const items = existing
    ? mergeByKey(
        freshItems,
        looksLikeRows(existing.items) ? (existing.items as Array<{ key: string }>) : [],
      )
    : freshItems;

  const res = existing
    ? await fetch(`${CMS_API_URL}/collections/${existing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, items, schema: { fields } }),
      })
    : await fetch(`${CMS_API_URL}/collections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, items, schema: { fields } }),
      });

  if (!res.ok) {
    throw new Error(
      `${existing ? "PUT" : "POST"} collection "${slug}" failed (${res.status}): ${await res.text()}`,
    );
  }
  console.log(
    `${existing ? "Updated" : "Created"} "${slug}" (${items.length} rows).`,
  );
}

async function run(): Promise<void> {
  const token = await login();

  const textRows = flattenText(enContent, arContent);
  await upsertCollection(
    token,
    "Site Content",
    "site-content",
    [
      { id: "key", type: "text", label: "Key" },
      { id: "en", type: "longtext", label: "English" },
      { id: "ar", type: "longtext", label: "Arabic" },
    ],
    textRows,
  );

  const imageRows: ImageRow[] = IMAGE_KEYS.map((key) => ({ key, image: "" }));
  await upsertCollection(
    token,
    "Site Images",
    "site-images",
    [
      { id: "key", type: "text", label: "Key" },
      { id: "image", type: "image", label: "Image" },
    ],
    imageRows,
  );
}

run().catch((err) => {
  console.error("Seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
