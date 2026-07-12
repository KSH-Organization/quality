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
import Reveal from "@/components/reveal";

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
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
          <div className="animate-rise text-accent text-[83.03px] font-extrabold ">
            <span className="text-[83px] font-extrabold text-white">KSHC </span>
            <span className="text-[83px] font-extrabold text-accent">
              Logistic
            </span>
          </div>
          <div className="animate-rise-1 text-white text-[20.758px] opacity-80 mt-[24.909px]">
            Trusted provider of premium logistics solutions in Sudan.
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:items-start lg:gap-24">
          <Reveal className="flex-1">
            <h1 className="text-4xl font-extrabold text-brand sm:text-5xl">
              {t("title")}
            </h1>
            <div className="mt-8 space-y-4 text-lg leading-[29px] text-ink/80">
              {t("body")
                .split("\n\n")
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </div>
            <dl className="mt-12 gap-6 md:flex md:flex-row flex-col justify-center ">
              {STATS.map((key) => (
                <div
                  key={key}
                  className="rounded-2xl w-60 shrink-0 border border-line bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
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
          </Reveal>
          <Reveal className="w-full max-w-md shrink-0 lg:w-2/5">
            <Image
              src="/images/about-illustration.png"
              alt=""
              width={499}
              height={416}
              className="w-full"
            />
          </Reveal>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-brand px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-24">
          <Reveal className="flex-1 text-white">
            <h2 className="text-3xl font-extrabold  sm:text-4xl">
              {t("vision.title")
                .split(" ")
                .map((word, i) => (
                  <span key={i} className={i === 0 ? "text-accent" : undefined}>
                    {i === 0 ? word : ` ${word}`}
                  </span>
                ))}
            </h2>
            <p className="mt-6 text-lg leading-[29px]">{t("vision.body")}</p>
          </Reveal>
          <Reveal className="w-full max-w-lg shrink-0 lg:w-2/5">
            <Image
              src="/images/about-vision.png"
              alt={t("vision.imageAlt")}
              width={499}
              height={333}
              className="w-full rounded-2xl object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-hero-sub px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-24">
          <Reveal className="order-2 w-full max-w-lg shrink-0 lg:order-1 lg:w-2/5">
            <Image
              src="/images/about-mission.png"
              alt={t("mission.imageAlt")}
              width={499}
              height={333}
              className="w-full rounded-2xl object-cover"
            />
          </Reveal>
          <Reveal className="order-1 flex-1 lg:order-2">
            <h2 className="text-3xl font-extrabold text-brand sm:text-4xl">
              {t("mission.title")
                .split(" ")
                .map((word, i) => (
                  <span key={i} className={i === 0 ? "text-accent" : undefined}>
                    {i === 0 ? word : ` ${word}`}
                  </span>
                ))}
            </h2>
            <p className="mt-6 text-lg leading-[29px] text-ink/80">
              {t("mission.body")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-line/40 px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-extrabold text-brand sm:text-4xl">
            {t("objectives.title")}
          </h2>
          <Reveal
            stagger
            className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {OBJECTIVES.map(({ key, Icon }) => (
              <article
                key={key}
                className="group flex flex-col gap-6 rounded-2xl border border-line bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-6 " aria-hidden />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">
                    {t(`objectives.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 leading-[22px] text-muted-dark">
                    {t(`objectives.items.${key}.body`)}
                  </p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
