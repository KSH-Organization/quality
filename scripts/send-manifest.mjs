#!/usr/bin/env node
/**
 * Sends kshc.manifest.json to the CMS, which applies it (POST /api/seed).
 * All the creating logic lives in the CMS — this just logs in and posts.
 *
 * CMS_API_URL=http://localhost:3000/api \
 * CMS_ADMIN_EMAIL=... CMS_ADMIN_PASSWORD=... npm run seed:cms
 */
import { readFile } from "node:fs/promises";

const API = (process.env.CMS_API_URL ?? "http://localhost:3000/api").replace(/\/+$/, "");
const manifest = JSON.parse(
  await readFile(process.argv[2] ?? "kshc.manifest.json", "utf8"),
);

const login = await fetch(`${API}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: process.env.CMS_ADMIN_EMAIL,
    password: process.env.CMS_ADMIN_PASSWORD,
  }),
});
if (!login.ok) {
  console.error(`Login failed (${login.status}) — check CMS_ADMIN_* and CMS_API_URL`);
  process.exit(1);
}
const { access_token } = await login.json();

const res = await fetch(`${API}/seed`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  },
  body: JSON.stringify(manifest),
});
if (!res.ok) {
  console.error(`Seed failed (${res.status}): ${await res.text()}`);
  process.exit(1);
}
const summary = await res.json();
console.log(`Seeded ${API}`);
for (const [k, items] of Object.entries(summary))
  if (items.length) console.log(`  ${k}: ${items.join(", ")}`);
