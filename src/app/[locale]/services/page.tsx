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
} from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import SectionHeader from "@/components/section-header";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "services");
}

const SERVICES = [
  { key: "purchasing", Icon: Truck },
  { key: "shipping", Icon: Package },
  { key: "storage", Icon: Warehouse },
  { key: "integrated", Icon: Layers },
  { key: "archiving", Icon: FileText },
  { key: "quality", Icon: Shield },
] as const;

export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tMeta = await getTranslations("meta");

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-100 items-center justify-center overflow-hidden px-4 py-24 lg:min-h-150">
        <Image
          src="/images/hero-services.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/65" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold text-white sm:text-6xl">
            {tMeta("services.title")}
          </h1>
          <p className="mt-6 text-lg font-semibold leading-relaxed text-hero-sub sm:text-xl">
            {tMeta("services.description")}
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label={t("label")} title={t("title")} />
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
            {SERVICES.map(({ key, Icon }) => (
              <article
                key={key}
                className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-8 transition-shadow hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand">
                  <Icon className="size-6 text-accent" aria-hidden />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-ink">
                    {t(`items.${key}.title`)}
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted-dark">
                    {t(`items.${key}.body`)}
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
