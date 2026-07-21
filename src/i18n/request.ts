import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { deepMerge, fetchCmsSiteContent } from "@/lib/cms";

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    const localMessages = (await import(`../../messages/${locale}.json`))
        .default;

    // CMS-authored copy overrides the local bundle key-by-key; anything the
    // CMS doesn't define (or the CMS being unreachable) falls back to it.
    const cmsContent = await fetchCmsSiteContent(locale);

    return {
        locale,
        messages: deepMerge(localMessages, cmsContent),
    };
});
