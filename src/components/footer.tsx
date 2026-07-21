"use client";

import SmartImage from "@/components/smart-image";
import { useMessages, useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/social-icons";
import { resolveImage } from "@/lib/images";

export default function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const images = useMessages().images as Record<string, unknown> | undefined;

  // The careers page ends with a dark apply section, so the footer switches
  // to a light theme there to keep visual separation (matches the design).
  const isLight = pathname === "/careers";

  const socials = [
    { label: t("social.instagram"), Icon: InstagramIcon, href: "#" },
    { label: t("social.linkedin"), Icon: LinkedinIcon, href: "#" },
    { label: t("social.twitter"), Icon: TwitterIcon, href: "#" },
  ];

  return (
    <footer className={isLight ? "bg-line" : "bg-brand"}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-[5.5556vw] lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-md">
            <SmartImage
              src={resolveImage(images, "logo", "/images/logo.png")}
              alt="KSHC Logistic"
              width={135}
              height={80}
              className="h-[80px]  object-contain"
            />
            <p
              className={`mt-6 text-base leading-relaxed ${
                isLight ? "text-brand" : "text-muted"
              }`}
            >
              {t("blurb")}
            </p>
            <ul className="mt-6 flex gap-4">
              {socials.map(({ label, Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className={`flex size-9 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-white ${
                      isLight
                        ? "bg-brand/10 text-brand"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-12 sm:flex-row sm:gap-20">
            <nav aria-label={t("company")}>
              <h3
                className={`text-xl font-semibold ${
                  isLight ? "text-accent" : "text-white"
                }`}
              >
                {t("company")}
              </h3>
              <ul
                className={`mt-6 space-y-3 text-sm font-medium ${
                  isLight ? "text-brand" : "text-muted"
                }`}
              >
                <li>
                  <Link href="/about" className="hover:text-accent">
                    {t("aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-accent">
                    {t("people")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-accent">
                    {t("contactUs")}
                  </Link>
                </li>
              </ul>
            </nav>

            <div>
              <h3
                className={`text-xl font-semibold ${
                  isLight ? "text-accent" : "text-white"
                }`}
              >
                {t("contactTitle")}
              </h3>
              <form className="mt-6" action="/contact">
                <div
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border p-1 ps-4 sm:w-80 ${
                    isLight ? "border-line bg-brand" : "border-line bg-white"
                  }`}
                >
                  <label htmlFor="footer-message" className="sr-only">
                    {t("yourMessage")}
                  </label>
                  <input
                    id="footer-message"
                    type="text"
                    name="message"
                    placeholder={t("yourMessage")}
                    className={`w-full bg-transparent py-2 text-sm focus:outline-none ${
                      isLight
                        ? "text-white placeholder:text-white/70"
                        : "text-ink placeholder:text-muted"
                    }`}
                  />
                  <button
                    type="submit"
                    aria-label={t("send")}
                    className={`flex size-10 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-white ${
                      isLight ? "text-white" : "text-brand"
                    }`}
                  >
                    <Send className="size-5 rtl:-scale-x-100" aria-hidden />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className={"mt-16 border-t border-line-dark pt-10 text-center"}>
          <p className="text-sm text-muted-dark">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
