import type { Metadata } from "next";
import SmartImage from "@/components/smart-image";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import {
  Truck,
  Package,
  Warehouse,
  Layers,
  FileText,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import SectionHeader from "@/components/section-header";
import Reveal from "@/components/reveal";
import { resolveImage } from "@/lib/images";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "services");
}

// Icons stay in code, matched to each CMS list row by its `key`.
const SERVICE_ICONS: Record<string, LucideIcon> = {
  purchasing: Truck,
  shipping: Package,
  storage: Warehouse,
  integrated: Layers,
  archiving: FileText,
  quality: Shield,
};

type ServiceRow = { key: string; title: string; body: string };

export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tMeta = await getTranslations("meta");
  const messages = await getMessages();
  const images = messages.images as Record<string, unknown> | undefined;
  const items = t.raw("items") as ServiceRow[];

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-100 items-center justify-center overflow-hidden px-4 py-24 lg:min-h-150">
        <SmartImage
          src={resolveImage(
            images,
            "hero-services",
            "/images/hero-services.png",
          )}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/65" aria-hidden />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center gap-y-6">
          <span className="animate-rise rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-white ">
            {t("badge")}
          </span>
          <h1 className="animate-rise-1 text-7xl font-extrabold text-white sm:text-6xl">
            {tMeta("services.title")
              .split(" ")
              .map((word, i) => (
                <span key={i} className={i === 1 ? "text-accent" : undefined}>
                  {i === 0 ? word : ` ${word}`}
                </span>
              ))}
          </h1>
          <p className="animate-rise-2 text-lg font-semibold leading-[normal] text-hero-sub sm:text-xl">
            {tMeta("services.description")}
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label={t("label")} title={t("title")} />
          <Reveal
            stagger
            className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            {items.map(({ key, title, body }) => {
              const Icon = SERVICE_ICONS[key] ?? Shield;
              return (
                <article
                  key={key}
                  className="group flex flex-col gap-6 rounded-2xl border border-line bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-6 text-accent" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-ink">{title}</h2>
                    <p className="mt-4 leading-[normal] text-muted-dark">
                      {body}
                    </p>
                  </div>
                </article>
              );
            })}
          </Reveal>
        </div>
      </section>
    </>
  );
}
