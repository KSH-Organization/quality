import type { Metadata } from "next";
import SmartImage from "@/components/smart-image";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import Reveal from "@/components/reveal";
import { resolveImage } from "@/lib/images";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/news-events">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "news");
}

const ARTICLES = [
  { key: "a1", imageKey: "news-1", image: "/images/news-1.png" },
  { key: "a2", imageKey: "news-2", image: "/images/news-2.png" },
  { key: "a3", imageKey: "news-3", image: "/images/news-3.png" },
  { key: "a4", imageKey: "news-4", image: "/images/news-4.png" },
] as const;

const EVENTS = [
  { key: "e1", imageKey: "event-1", image: "/images/event-1.png" },
  { key: "e2", imageKey: "event-2", image: "/images/event-2.png" },
  { key: "e3", imageKey: "event-3", image: "/images/event-3.png" },
] as const;

export default async function NewsEventsPage({
  params,
}: PageProps<"/[locale]/news-events">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const messages = await getMessages();
  const images = messages.images as Record<string, unknown> | undefined;

  return (
    <>
      {/* Hero */}
      <section className="bg-brand px-4 py-24 sm:px-6 lg:px-[5.5556vw] lg:py-36">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="animate-rise rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-white ">
            {t("hero.badge")}
          </span>
          <h1 className="animate-rise-1 text-4xl font-extrabold text-white sm:text-6xl">
            {t("hero.title")
              .split(" ")
              .map((word, i) => (
                <span key={i} className={i !== 0 ? "text-accent" : undefined}>
                  {i === 0 ? word : ` ${word}`}
                </span>
              ))}
          </h1>
          <p className="animate-rise-2 text-lg font-medium leading-[normal] text-hero-sub sm:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* News */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-wide text-accent">
            {t("newsSection.label")}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-brand sm:text-4xl">
            {t("newsSection.title")}
          </h2>
          <Reveal
            stagger
            className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2"
          >
            {ARTICLES.map(({ key, imageKey, image }) => (
              <article
                key={key}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden rounded-xl">
                  <SmartImage
                    src={resolveImage(images, imageKey, image)}
                    alt={t(`articles.${key}.title`)}
                    width={602}
                    height={180}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="mt-4 w-fit rounded bg-accent px-2 py-1 text-xs font-semibold text-white">
                  {t(`articles.${key}.date`)}
                </span>
                <h3 className="mt-4 text-xl font-bold text-ink">
                  {t(`articles.${key}.title`)}
                </h3>
                <p className="mt-3 leading-[22px] text-muted-dark">
                  {t(`articles.${key}.body`)}
                </p>
                <a
                  href="#"
                  className="group/link mt-5 flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                >
                  {t("newsSection.readMore")}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover/link:translate-x-1 rtl:-scale-x-100 rtl:group-hover/link:-translate-x-1"
                    aria-hidden
                  />
                </a>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Events */}
      <section className="bg-line/40 px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-wide text-accent">
            {t("eventsSection.label")}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-brand sm:text-4xl">
            {t("eventsSection.title")}
          </h2>
          <Reveal
            stagger
            className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {EVENTS.map(({ key, imageKey, image }) => (
              <article
                key={key}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden rounded-xl">
                  <SmartImage
                    src={resolveImage(images, imageKey, image)}
                    alt={t(`events.${key}.title`)}
                    width={374}
                    height={200}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="mt-4 w-fit rounded bg-accent px-2 py-1 text-xs font-semibold text-white">
                  {t(`events.${key}.category`)}
                </span>
                <h3 className="mt-4 text-xl font-bold text-ink">
                  {t(`events.${key}.title`)}
                </h3>
                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-accent">
                  <CalendarDays className="size-4" aria-hidden />
                  {t(`events.${key}.date`)}
                </p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
