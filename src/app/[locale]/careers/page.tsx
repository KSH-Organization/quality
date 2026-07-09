import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import CareersForm from "@/components/careers-form";

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

  return (
    <>
      {/* Hero */}
      <section className="relative h-80 w-full sm:h-105 lg:h-130">
        <Image
          src="/images/hero-careers.png"
          alt={t("tagline")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/50" aria-hidden />
      </section>

      {/* Intro */}
      <section className="bg-white px-4 pt-20 sm:px-6 lg:px-[5.5556vw] lg:pt-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">
              {t("label")}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-brand sm:text-5xl">
              {t("titleA")}
              <br />
              {t("titleB")}
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-muted-dark">
            {t("tagline")}
          </p>
        </div>
      </section>

      {/* Contact + Form */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-[1fr_2fr]">
          {/* Contact column */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-accent">
              {t("office.label")}
            </h2>
            <p className="mt-4 text-2xl font-bold text-brand">
              {t("office.city")}
            </p>
            <p className="mt-2 leading-relaxed text-muted-dark">
              {t("office.address")}
            </p>

            <hr className="my-8 border-line" />

            <h2 className="text-sm font-bold uppercase tracking-wide text-accent">
              {t("getInTouch.label")}
            </h2>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href={`tel:${t("getInTouch.phone").replace(/\s/g, "")}`}
                  className="flex items-center gap-3 font-medium text-brand hover:text-accent"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-brand text-white">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <span dir="ltr">{t("getInTouch.phone")}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${t("getInTouch.email")}`}
                  className="flex items-center gap-3 font-medium text-brand hover:text-accent"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-brand text-white">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  {t("getInTouch.email")}
                </a>
              </li>
            </ul>
          </div>

          {/* Form column */}
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-10">
            <CareersForm />
          </div>
        </div>
      </section>
    </>
  );
}
