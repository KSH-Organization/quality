import type { Metadata } from "next";
import SmartImage from "@/components/smart-image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import Reveal from "@/components/reveal";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/news-events">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "news");
}

// Local fallback images, matched to a row by its `key`, used when the CMS row
// has no uploaded image of its own.
const NEWS_IMAGES: Record<string, string> = {
  a1: "/images/news-1.png",
  a2: "/images/news-2.png",
  a3: "/images/news-3.png",
  a4: "/images/news-4.png",
};
const EVENT_IMAGES: Record<string, string> = {
  e1: "/images/event-1.png",
  e2: "/images/event-2.png",
  e3: "/images/event-3.png",
};

type ArticleRow = {
  key: string;
  date: string;
  title: string;
  body: string;
  image?: string;
};
type EventRow = {
  key: string;
  category: string;
  title: string;
  date: string;
  image?: string;
};

/** CMS-uploaded image if present, else the local fallback for this key. */
function rowImage(
  image: string | undefined,
  fallbacks: Record<string, string>,
  key: string,
): string {
  return typeof image === "string" && image.trim() !== ""
    ? image
    : (fallbacks[key] ?? "");
}

export default async function NewsEventsPage({
  params,
}: PageProps<"/[locale]/news-events">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const articles = t.raw("articles") as ArticleRow[];
  const events = t.raw("events") as EventRow[];

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
            {articles.map(({ key, date, title, body, image }) => (
              <article
                key={key}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden rounded-xl">
                  <SmartImage
                    src={rowImage(image, NEWS_IMAGES, key)}
                    alt={title}
                    width={602}
                    height={180}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="mt-4 w-fit rounded bg-accent px-2 py-1 text-xs font-semibold text-white">
                  {date}
                </span>
                <h3 className="mt-4 text-xl font-bold text-ink">{title}</h3>
                <p className="mt-3 leading-[22px] text-muted-dark">{body}</p>
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
            {events.map(({ key, category, title, date, image }) => (
              <article
                key={key}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden rounded-xl">
                  <SmartImage
                    src={rowImage(image, EVENT_IMAGES, key)}
                    alt={title}
                    width={374}
                    height={200}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="mt-4 w-fit rounded bg-accent px-2 py-1 text-xs font-semibold text-white">
                  {category}
                </span>
                <h3 className="mt-4 text-xl font-bold text-ink">{title}</h3>
                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-accent">
                  <CalendarDays className="size-4" aria-hidden />
                  {date}
                </p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
