"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Globe } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "departments", href: "/departments" },
  { key: "services", href: "/services" },
  { key: "news", href: "/news-events" },
  { key: "careers", href: "/careers" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <header className="sticky top-0 z-50 bg-brand shadow-lg">
      <div className="mx-auto flex h-22 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-[5.5556vw]">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.png"
            alt="KSHC Logistic"
            width={135}
            height={79}
            className="h-19 w-auto object-contain"
            priority
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map(({ key, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`text-base font-medium transition-colors hover:text-accent ${
                  active ? "text-accent" : "text-nav"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            locale={otherLocale}
            className="flex items-center gap-1.5 rounded-lg border border-line-dark px-3 py-2 text-sm font-semibold text-nav transition-colors hover:border-accent hover:text-accent"
          >
            <Globe className="size-4" aria-hidden />
            {t("switchLocale")}
          </Link>
          <Link
            href="/contact"
            className="hidden rounded-lg bg-accent px-5 py-3 text-base font-bold text-white transition-opacity hover:opacity-90 sm:block"
          >
            {t("contactUs")}
          </Link>
          <button
            type="button"
            className="text-white lg:hidden"
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="border-t border-line-dark bg-brand px-4 pb-6 pt-2 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-white/5 hover:text-accent ${
                    pathname === href ? "text-accent" : "text-nav"
                  }`}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-accent px-5 py-3 text-center text-base font-bold text-white"
              >
                {t("contactUs")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
