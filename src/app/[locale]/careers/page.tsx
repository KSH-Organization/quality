import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import CareersForm from "@/components/careers-form";
import Reveal from "@/components/reveal";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/careers">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "careers");
}

export default async function CareersPage({
  params,
}: PageProps<"/[locale]/careers">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");
  const tMeta = await getTranslations("meta");

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-80 items-center justify-center overflow-hidden w-full sm:h-105 lg:h-130">
        <Image
          src="/images/hero-careers.png"
          alt={t("tagline")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/50" aria-hidden />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center gap-y-6">
          <span className="animate-rise rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-white ">
            {t("badge")}
          </span>
          <h1 className="animate-rise-1 text-7xl font-extrabold text-white sm:text-6xl">
            {tMeta("careers.title")
              .split(" ")
              .map((word, i) => (
                <span key={i} className={i === 1 ? "text-accent" : undefined}>
                  {i === 0 ? word : ` ${word}`}
                </span>
              ))}
          </h1>
          <p className="animate-rise-2 text-lg font-semibold leading-[normal] text-hero-sub sm:text-xl">
            {tMeta("careers.description")}
          </p>
        </div>
      </section>

      {/* Join / apply */}
      <section className="bg-brand px-4 py-16 sm:px-6 lg:px-[5.5556vw] lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Heading row */}
          <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wide text-accent">
                {t("label")}
              </p>
              <div className="mt-2 text-5xl font-extrabold leading-[1.1] sm:text-6xl lg:text-7xl">
                {(() => {
                  const words = tMeta("siteName").split(" ");
                  const last = words.pop();
                  return (
                    <>
                      <span className="block text-white">
                        {words.join(" ")}
                      </span>
                      <span className="block text-accent">{last}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                {t("heading")}
              </h2>
            </div>
          </Reveal>

          {/* Contact + form row */}
          <div className="mt-16 flex flex-col gap-12 lg:mt-24 lg:flex-row lg:gap-20">
            {/* Contact column */}
            <Reveal className="w-full shrink-0 lg:w-80">
              <h3 className="text-xs font-bold uppercase tracking-wide text-accent">
                {t("office.label")}
              </h3>
              <p className="mt-3 text-xl font-bold text-white">
                {t("office.city")}
              </p>
              <p className="mt-3 text-muted">{t("office.address")}</p>

              <hr className="my-6 border-white/10" />

              <h3 className="text-xs font-bold uppercase tracking-wide text-accent">
                {t("getInTouch.label")}
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href={`tel:${t("getInTouch.phone").replace(/\s/g, "")}`}
                    className="flex items-center gap-3 font-semibold text-white transition-colors hover:text-accent"
                  >
                    <Phone
                      className="size-4 shrink-0 text-accent"
                      aria-hidden
                    />
                    <span dir="ltr">{t("getInTouch.phone")}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${t("getInTouch.email")}`}
                    className="flex items-center gap-3 font-semibold text-white transition-colors hover:text-accent"
                  >
                    <Mail className="size-4 shrink-0 text-accent" aria-hidden />
                    {t("getInTouch.email")}
                  </a>
                </li>
              </ul>
            </Reveal>

            {/* Form column */}
            <Reveal className="flex-1">
              <CareersForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
