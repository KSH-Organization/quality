import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import SectionHeader from "@/components/section-header";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "home");
}

const SERVICES = [
  { key: "purchasing", Icon: Truck },
  { key: "shipping", Icon: Package },
  { key: "storage", Icon: Warehouse },
  { key: "integrated", Icon: Layers },
  { key: "archiving", Icon: FileText },
  { key: "quality", Icon: Shield },
] as const;

const CLIENTS = [
  { key: "bank", src: "/images/client-bank.png", w: 479, h: 129 },
  { key: "zain", src: "/images/client-zain.jpg", w: 946, h: 268 },
  { key: "samil", src: "/images/client-samil.png", w: 329, h: 198 },
] as const;

const STATS = [
  { key: "delivery", Icon: Zap },
  { key: "security", Icon: ShieldCheck },
  { key: "global", Icon: Globe },
] as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tMeta = await getTranslations("meta");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KSHC Logistic",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
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
        <Image
          src="/images/hero-home.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/65" aria-hidden />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
            {t("hero.badge")}
          </span>
          <h1 className="text-5xl font-extrabold text-white sm:text-6xl lg:text-7xl">
            {t("hero.titleA")}{" "}
            <span className="text-accent">{t("hero.titleB")}</span>
          </h1>
          <p className="text-lg font-semibold leading-relaxed text-hero-sub sm:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/services"
              className="rounded bg-accent px-8 py-3.5 text-lg font-bold text-white transition-opacity hover:opacity-90"
            >
              {t("hero.viewServices")}
            </Link>
            <Link
              href="/about"
              className="rounded border border-accent px-8 py-3.5 text-base font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
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
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {SERVICES.map(({ key, Icon }) => (
              <article
                key={key}
                className="flex flex-col items-start gap-6 rounded-2xl border border-line bg-white p-8 transition-shadow hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand">
                  <Icon className="size-6 text-white" aria-hidden />
                </div>
                <h3 className="text-2xl font-bold text-ink">
                  {t(`capabilities.items.${key}`)}
                </h3>
                <Link
                  href="/services"
                  className="mt-auto flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                >
                  {t("capabilities.explore")}
                  <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-[5.5556vw] lg:py-25">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label={t("clients.label")}
            title={t("clients.title")}
          />
          <div className="mt-34 flex flex-wrap items-center justify-center gap-12 lg:justify-between">
            {CLIENTS.map(({ key, src, w, h }) => (
              <Image
                key={key}
                src={src}
                alt={t(`clients.${key}`)}
                width={w}
                height={h}
                className="h-16 w-auto object-contain sm:h-20"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Different / Edge */}
      <section className="bg-line px-4 py-24 sm:px-6 lg:px-[5.5556vw] lg:py-30">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-16 lg:flex-row lg:items-center lg:gap-20">
          <div className="flex flex-1 flex-col gap-8">
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
              className="w-fit rounded bg-accent px-8 py-3.5 text-lg font-bold text-white transition-opacity hover:opacity-90"
            >
              {t("edge.aboutUs")}
            </Link>
          </div>
          <div className="grid w-full flex-1 grid-cols-1 gap-6 sm:grid-cols-3">
            {STATS.map(({ key, Icon }) => (
              <div
                key={key}
                className="flex flex-col gap-4 rounded-2xl border border-line-dark bg-brand p-8"
              >
                <div className="flex size-12 items-center justify-center rounded-3xl bg-accent shadow-lg shadow-accent/20">
                  <Icon className="size-6 text-brand" aria-hidden />
                </div>

                <div>
                  <p className="text-[32px] font-extrabold text-white">
                    {t(`edge.stats.${key}.value`)}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
                    {t(`edge.stats.${key}.label`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
