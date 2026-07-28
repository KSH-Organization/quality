import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Bundled image URLs carry a `?v=<content-hash>` (see src/lib/asset-url.ts).
    // Next refuses local sources with a query unless they are allow-listed.
    localPatterns: [{ pathname: "/images/**", search: "" }, { pathname: "/images/**" }],
    // Safe to cache optimised output hard: changing a file changes its hash and
    // therefore its URL, so nothing serves a stale copy.
    minimumCacheTTL: 31536000,
  },
};

export default withNextIntl(nextConfig);
