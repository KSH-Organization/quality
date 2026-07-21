import type { Metadata } from "next";
import SmartImage from "@/components/smart-image";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import {
  Truck,
  Package,
  Warehouse,
  Layers,
  FileText,
  Shield,
  Zap,
  ShieldCheck,
  Globe,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import SectionHeader from "@/components/section-header";
import Reveal from "@/components/reveal";
import { resolveImage } from "@/lib/images";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "home");
}

// Icons/logos stay in code, matched to each CMS list row by its `key`. The rows
// themselves (labels, order, which ones exist) come from the CMS.
const CAPABILITY_ICONS: Record<string, LucideIcon> = {
  purchasing: Truck,
  shipping: Package,
  storage: Warehouse,
  integrated: Layers,
  archiving: FileText,
  quality: Shield,
};

const STAT_ICONS: Record<string, LucideIcon> = {
  delivery: Zap,
  security: ShieldCheck,
  global: Globe,
};

const CLIENT_IMAGES: Record<string, { src: string; w: number; h: number }> = {
  bank: { src: "/images/client-bank.png", w: 479, h: 129 },
  zain: { src: "/images/client-zain.jpg", w: 946, h: 268 },
  samil: { src: "/images/client-samil.png", w: 329, h: 198 },
};

type CapabilityRow = { key: string; title: string };
type ClientRow = { key: string; name: string };
type StatRow = { key: string; value: string; label: string };

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tMeta = await getTranslations("meta");
  const messages = await getMessages();
  const images = messages.images as Record<string, unknown> | undefined;
  const logoSrc = resolveImage(images, "logo", "/images/logo.png");

  const capabilities = t.raw("capabilities.items") as CapabilityRow[];
  const clients = t.raw("clients.items") as ClientRow[];
  const stats = t.raw("edge.stats") as StatRow[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KSHC Logistic",
    url: SITE_URL,
    logo:
      logoSrc.startsWith("http") || logoSrc.startsWith("data:")
        ? logoSrc
        : `${SITE_URL}${logoSrc}`,
    description: tMeta("home.description"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Khartoum",
      addressCountry: "SD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative flex min-h-150 items-center justify-center overflow-hidden px-4 py-24 lg:min-h-185">
        <SmartImage
          src={resolveImage(images, "hero-home", "/images/hero-home.png")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/65" aria-hidden />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="animate-rise rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
            {t("hero.badge")}
          </span>
          <h1 className="animate-rise-1 text-5xl font-extrabold text-white sm:text-6xl lg:text-7xl">
            {t("hero.titleA")}{" "}
            <span className="text-accent">{t("hero.titleB")}</span>
          </h1>
          <p className="animate-rise-2 text-lg font-semibold leading-relaxed text-hero-sub sm:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="animate-rise-3 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/services"
              className="rounded bg-accent px-8 py-3.5 text-lg font-bold text-white transition hover:opacity-90 active:scale-95"
            >
              {t("hero.viewServices")}
            </Link>
            <Link
              href="/about"
              className="rounded border border-accent px-8 py-3.5 text-base font-semibold text-accent transition-colors hover:bg-accent hover:text-white active:scale-95"
            >
              {t("hero.ourStory")}
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-[5.5556vw] lg:py-30">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label={t("capabilities.label")}
            title={t("capabilities.title")}
          />
          <Reveal
            stagger
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            {capabilities.map(({ key, title }) => {
              const Icon = CAPABILITY_ICONS[key] ?? Shield;
              return (
                <article
                  key={key}
                  className="group flex flex-col items-start gap-6 rounded-2xl border border-line bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-6 text-white" aria-hidden />
                  </div>
                  <h3 className="text-2xl font-bold text-ink">{title}</h3>
                  <Link
                    href="/services"
                    className="group/link mt-auto flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                  >
                    {t("capabilities.explore")}
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover/link:translate-x-1 rtl:-scale-x-100 rtl:group-hover/link:-translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </article>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Clients */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-[5.5556vw] lg:py-25">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label={t("clients.label")}
            title={t("clients.title")}
          />
          <Reveal
            stagger
            className="mt-34 flex flex-wrap items-center justify-center gap-12 lg:justify-between"
          >
            {clients.map(({ key, name }) => {
              const img = CLIENT_IMAGES[key] ?? { src: "", w: 200, h: 80 };
              return (
                <SmartImage
                  key={key}
                  src={resolveImage(images, `client-${key}`, img.src)}
                  alt={name}
                  width={img.w}
                  height={img.h}
                  className="h-16 w-auto object-contain grayscale transition duration-300 hover:grayscale-0 sm:h-20"
                />
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Different / Edge */}
      <section className="bg-line px-4 py-24 sm:px-6 lg:px-[5.5556vw] lg:py-30">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-16 lg:flex-row lg:items-center lg:gap-20">
          <Reveal className="flex flex-1 flex-col gap-8">
            <SectionHeader
              label={t("edge.label")}
              title={`${t("edge.titleA")} ${t("edge.titleB")}${t("edge.titleC")}`}
            />
            <div className="space-y-4 text-lg leading-[normal]  text-brand">
              <p>{t("edge.p1")}</p>
              <p>{t("edge.p2")}</p>
              <p>{t("edge.p3")}</p>
              <p>{t("edge.p4")}</p>
            </div>
            <Link
              href="/about"
              className="w-fit rounded bg-accent px-8 py-3.5 text-lg font-bold text-white transition hover:opacity-90 active:scale-95"
            >
              {t("edge.aboutUs")}
            </Link>
          </Reveal>
          <Reveal
            stagger
            className="grid w-full flex-1 grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {stats.map(({ key, value, label }) => {
              const Icon = STAT_ICONS[key] ?? Zap;
              return (
                <div
                  key={key}
                  className="flex flex-col gap-4 rounded-2xl border border-line-dark bg-brand p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-3xl bg-accent shadow-lg shadow-accent/20">
                    <Icon className="size-6 text-brand" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[32px] font-extrabold text-white">
                      {value}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
                      {label}
                    </p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>
    </>
  );
}
