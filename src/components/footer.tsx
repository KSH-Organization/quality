import Image from "next/image";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/social-icons";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const socials = [
    { label: t("social.instagram"), Icon: InstagramIcon, href: "#" },
    { label: t("social.linkedin"), Icon: LinkedinIcon, href: "#" },
    { label: t("social.twitter"), Icon: TwitterIcon, href: "#" },
  ];

  return (
    <footer className="bg-brand">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-md">
            <Image
              src="/images/logo.png"
              alt="KSHC Logistic"
              width={96}
              height={56}
              className="h-14 w-auto object-contain"
            />
            <p className="mt-6 text-base leading-relaxed text-muted">
              {t("blurb")}
            </p>
            <ul className="mt-6 flex gap-4">
              {socials.map(({ label, Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-12 sm:flex-row sm:gap-20">
            <nav aria-label={t("company")}>
              <h3 className="text-xl font-semibold text-white">
                {t("company")}
              </h3>
              <ul className="mt-6 space-y-3 text-sm font-medium text-muted">
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
              <h3 className="text-xl font-semibold text-white">
                {t("contactTitle")}
              </h3>
              <form className="mt-6" action="/contact">
                <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-white p-1 ps-4 sm:w-80">
                  <label htmlFor="footer-message" className="sr-only">
                    {t("yourMessage")}
                  </label>
                  <input
                    id="footer-message"
                    type="text"
                    name="message"
                    placeholder={t("yourMessage")}
                    className="w-full bg-transparent py-2 text-sm text-ink placeholder:text-muted focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label={t("send")}
                    className="flex size-10 shrink-0 items-center justify-center rounded-md text-brand transition-colors hover:bg-accent hover:text-white"
                  >
                    <Send className="size-5 rtl:-scale-x-100" aria-hidden />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-line-dark pt-10 text-center">
          <p className="text-sm text-muted-dark">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
