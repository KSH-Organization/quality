import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type MetaNamespace =
    | "home"
    | "about"
    | "departments"
    | "services"
    | "news"
    | "careers"
    | "contact";

const paths: Record<MetaNamespace, string> = {
    home: "",
    about: "/about",
    departments: "/departments",
    services: "/services",
    news: "/news-events",
    careers: "/careers",
    contact: "/contact",
};

export async function buildPageMetadata(
    locale: Locale,
    page: MetaNamespace,
): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "meta" });
    const path = paths[page];

    const languages = Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    );

    return {
        title: page === "home" ? { absolute: t("home.title") } : t(`${page}.title`),
        description: t(`${page}.description`),
        alternates: {
            canonical: `${SITE_URL}/${locale}${path}`,
            languages: {
                ...languages,
                "x-default": `${SITE_URL}/${routing.defaultLocale}${path}`,
            },
        },
        openGraph: {
            title: t(`${page}.title`),
            description: t(`${page}.description`),
            url: `${SITE_URL}/${locale}${path}`,
        },
    };
}
