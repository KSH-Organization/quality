"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  // Get the path without locale
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  // Toggle to the other language
  const toggleLocale = locale === "ar" ? "en" : "ar";
  const switchUrl = `/${toggleLocale}${pathWithoutLocale}`;

  return (
    <Link
      href={switchUrl}
      className="px-4 py-2 bg-white text-[#5F349C] rounded-md text-sm font-semibold hover:bg-[#F2E7BF] transition-colors"
    >
      {locale === "ar" ? "En" : "عربي"}
    </Link>
  );
}
