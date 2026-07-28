#!/usr/bin/env node
/**
 * Fingerprints everything in public/images so replacing a file busts its cache.
 *
 * next/image serves optimised copies with `cache-control: public, max-age=…`,
 * keyed on the request URL. Overwriting an image in place keeps the same URL,
 * so browsers (and the optimiser's own on-disk cache) keep serving the old
 * bytes until that TTL expires — the site looks stale for hours even after a
 * deploy, and a hard reload is the only cure.
 *
 * Writing a short content hash into the URL (`/images/x.jpg?v=ab12cd34`) fixes
 * both ends of that: an unchanged file keeps its URL and stays cached, while a
 * changed file gets a URL nothing has ever cached, so it appears immediately.
 *
 * Runs from `prebuild`, so `npm run build` always ships current hashes.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, posix, relative } from "node:path";

const ROOT = process.cwd();
const IMAGES_DIR = join(ROOT, "public", "images");
const OUT = join(ROOT, "src", "lib", "asset-hashes.json");

function walk(dir) {
    const out = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) out.push(...walk(full));
        else out.push(full);
    }
    return out;
}

const hashes = {};
let files = [];
try {
    files = walk(IMAGES_DIR);
} catch {
    // No public/images yet — emit an empty map so the import still resolves.
}

for (const file of files) {
    // Key by the public URL the site actually requests.
    const url = "/" + posix.join("images", relative(IMAGES_DIR, file).split(/[\\/]/).join("/"));
    hashes[url] = createHash("sha256")
        .update(readFileSync(file))
        .digest("hex")
        .slice(0, 8);
}

writeFileSync(OUT, JSON.stringify(hashes, null, 2) + "\n", "utf8");
console.log(`asset hashes: ${Object.keys(hashes).length} files -> ${relative(ROOT, OUT)}`);
