import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ShoppingCart,
  Truck,
  Warehouse,
  Package,
  Cpu,
  BarChart2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import Reveal from "@/components/reveal";
import RowIcon from "@/components/row-icon";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/departments">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "departments");
}

// Icons stay in code, matched to each CMS list row by its `key`. `qa` is
// rendered full-width below, so it lives here too but isn't in the grid.
const DEPARTMENT_ICONS: Record<string, LucideIcon> = {
  procurement: ShoppingCart,
  logistics: Truck,
  warehousing: Warehouse,
  distribution: Package,
  technology: Cpu,
  planning: BarChart2,
  qa: ShieldCheck,
};

type DepartmentRow = { key: string; title: string; body: string; icon?: string };

export default async function DepartmentsPage({
  params,
}: PageProps<"/[locale]/departments">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("departments");
  const items = t.raw("items") as DepartmentRow[];
  const gridItems = items.filter((i) => i.key !== "qa");
  const qa = items.find((i) => i.key === "qa");

  return (
    <>
      {/* Hero */}
      <section className="bg-brand px-4 py-24 sm:px-6 lg:px-[5.5556vw] lg:py-36">
        <div className="mx-auto max-w-7xl">
          <h1 className="animate-rise text-4xl font-extrabold text-white sm:text-6xl lg:text-7xl">
            {t("hero.title")
              .split(" ")
              .map((word, i) => (
                <span key={i} className={i === 1 ? "text-accent" : undefined}>
                  {i === 0 ? word : ` ${word}`}
                </span>
              ))}
          </h1>
          <p className="animate-rise-1 mt-6 max-w-3xl text-lg font-medium leading-relaxed text-hero-sub sm:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Departments grid */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-extrabold text-brand sm:text-4xl">
            {t("section.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-dark leading-[normal]">
            {t("section.subtitle")}
          </p>
          <Reveal
            stagger
            className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {gridItems.map(({ key, title, body, icon }) => {
              return (
                <article
                  key={key}
                  className="group flex flex-col gap-6 rounded-2xl border border-line bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-14 items-center justify-center rounded-xl bg-[rgba(255,_184,_0,_0.10)] transition-transform duration-300 group-hover:scale-110">
                    <RowIcon
                      src={icon}
                      fallback={DEPARTMENT_ICONS[key] ?? ShieldCheck}
                      className="size-7 text-accent"
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
            {qa && (
              <article className="group flex flex-col gap-6 rounded-2xl border border-line bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg md:col-span-2 lg:col-span-3">
                <div className="flex size-14 items-center justify-center rounded-xl bg-[rgba(255,_184,_0,_0.10)] transition-transform duration-300 group-hover:scale-110">
                  <ShieldCheck className="size-7 text-accent" aria-hidden />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">{qa.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-dark">
                    {qa.body}
                  </p>
                </div>
              </article>
            )}
          </Reveal>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#15052d] px-4 py-16 sm:px-6 lg:px-[5.5556vw] lg:py-20">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-lg leading-[normal] text-hero-sub">
              {t("cta.subtitle")}
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-lg bg-accent px-8 py-4 text-lg font-bold text-white transition hover:opacity-90 active:scale-95"
          >
            {t("cta.button")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
