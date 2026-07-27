import type { Metadata } from "next";
import SmartImage from "@/components/smart-image";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import {
  Lightbulb,
  Star,
  Shield,
  TrendingUp,
  Users,
  Earth,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import Reveal from "@/components/reveal";
import RowIcon from "@/components/row-icon";
import { resolveImage } from "@/lib/images";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "about");
}

// Icons stay in code, matched to each CMS objective row by its `key`.
const OBJECTIVE_ICONS: Record<string, LucideIcon> = {
  innovation: Lightbulb,
  quality: Star,
  safety: Shield,
  expansion: TrendingUp,
  people: Users,
  transfer: Earth,
};

type StatRow = { key: string; label: string; value: string };
type ObjectiveRow = { key: string; title: string; body: string; icon?: string };

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const messages = await getMessages();
  const images = messages.images as Record<string, unknown> | undefined;
  const stats = t.raw("stats") as StatRow[];
  const objectives = t.raw("objectives.items") as ObjectiveRow[];

  return (
    <div className="overflow-x-clip">
      {/* Hero banner */}
      <section className="relative h-80 overflow-hidden sm:h-110 lg:h-160">
        <SmartImage
          src={resolveImage(images, "hero-about", "/images/hero-about.jpg")}
          alt={t("heroAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/40" aria-hidden />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
          <div className="animate-rise text-accent text-4xl sm:text-6xl lg:text-[83px] font-extrabold">
            <span className="text-white">{t("hero.titleA")} </span>
            <span className="text-accent">{t("hero.titleB")}</span>
          </div>
          <div className="animate-rise-1 text-white text-base sm:text-lg lg:text-[20.758px] opacity-80 mt-6 lg:mt-[24.909px]">
            {t("hero.tagline")}
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
            <div className="mt-12 flex flex-col gap-6 md:flex-row justify-center">
              {" "}
              {stats.map(({ key, label, value }) => (
                <div
                  key={key}
                  className="rounded-2xl w-60 max-w-full min-w-0 border border-line bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <dt className="text-sm font-semibold text-muted-dark">
                    {label}
                  </dt>
                  <dd className="mt-2 text-2xl font-extrabold text-brand sm:text-3xl">
                    {value}
                  </dd>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="w-full max-w-md shrink-0 lg:w-2/5">
            <SmartImage
              src={resolveImage(
                images,
                "about-illustration",
                "/images/about-illustration.png",
              )}
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
            <SmartImage
              src={resolveImage(
                images,
                "about-vision",
                "/images/about-vision.png",
              )}
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
            <SmartImage
              src={resolveImage(
                images,
                "about-mission",
                "/images/about-mission.png",
              )}
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
            {objectives.map(({ key, title, body, icon }) => {
              return (
                <article
                  key={key}
                  className="group flex flex-col gap-6 rounded-2xl border border-line bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent transition-transform duration-300 group-hover:scale-110">
                    <RowIcon
                      src={icon}
                      fallback={OBJECTIVE_ICONS[key] ?? Lightbulb}
                      className="size-6"
                      alt={title}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink">{title}</h3>
                    <p className="mt-3 leading-[22px] text-muted-dark">{body}</p>
                  </div>
                </article>
              );
            })}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
