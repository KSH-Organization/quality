import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

const PATHS = [
    "",
    "/about",
    "/departments",
    "/services",
    "/news-events",
    "/careers",
    "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
    return PATHS.map((path) => ({
        url: `${SITE_URL}/${routing.defaultLocale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "/news-events" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: {
            languages: Object.fromEntries(
                routing.locales.map((locale) => [
                    locale,
                    `${SITE_URL}/${locale}${path}`,
                ]),
            ),
        },
    }));
}
