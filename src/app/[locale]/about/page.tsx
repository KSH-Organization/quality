import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Lightbulb,
  Star,
  Shield,
  TrendingUp,
  Users,
  Earth,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "about");
}

const OBJECTIVES = [
  { key: "innovation", Icon: Lightbulb },
  { key: "quality", Icon: Star },
  { key: "safety", Icon: Shield },
  { key: "expansion", Icon: TrendingUp },
  { key: "people", Icon: Users },
  { key: "transfer", Icon: Earth },
] as const;

const STATS = ["space", "origin", "experience"] as const;

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      {/* Hero banner */}
      <section className="relative h-80 overflow-hidden sm:h-110 lg:h-160">
        <Image
          src="/images/hero-about.jpg"
          alt={t("heroAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/40" aria-hidden />
      </section>

      {/* About */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:items-start lg:gap-24">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-brand sm:text-5xl">
              {t("title")}
            </h1>
            <div className="mt-8 space-y-4 text-lg leading-relaxed text-ink/80">
              {t("body")
                .split("\n\n")
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </div>
            <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STATS.map((key) => (
                <div
                  key={key}
                  className="rounded-2xl border border-line bg-white p-6 shadow-sm"
                >
                  <dt className="text-sm font-semibold text-muted-dark">
                    {t(`stats.${key}.label`)}
                  </dt>
                  <dd className="mt-2 text-2xl font-extrabold text-brand sm:text-3xl">
                    {t(`stats.${key}.value`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="w-full max-w-md shrink-0 lg:w-2/5">
            <Image
              src="/images/about-illustration.png"
              alt=""
              width={499}
              height={416}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-line/40 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-24">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-brand sm:text-4xl">
              {t("vision.title")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              {t("vision.body")}
            </p>
          </div>
          <div className="w-full max-w-lg shrink-0 lg:w-2/5">
            <Image
              src="/images/about-vision.png"
              alt={t("vision.imageAlt")}
              width={499}
              height={333}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-24">
          <div className="order-2 w-full max-w-lg shrink-0 lg:order-1 lg:w-2/5">
            <Image
              src="/images/about-mission.png"
              alt={t("mission.imageAlt")}
              width={499}
              height={333}
              className="w-full rounded-2xl object-cover"
            />
          </div>
          <div className="order-1 flex-1 lg:order-2">
            <h2 className="text-3xl font-extrabold text-brand sm:text-4xl">
              {t("mission.title")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              {t("mission.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-line/40 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-extrabold text-brand sm:text-4xl">
            {t("objectives.title")}
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {OBJECTIVES.map(({ key, Icon }) => (
              <article
                key={key}
                className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-8 transition-shadow hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand">
                  <Icon className="size-6 text-accent" aria-hidden />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">
                    {t(`objectives.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-dark">
                    {t(`objectives.items.${key}.body`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
