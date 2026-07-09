import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact-form";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale as Locale, "contact");
}

const INFO = [
  { key: "phone", icon: Phone },
  { key: "email", icon: Mail },
  { key: "address", icon: MapPin },
] as const;

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      {/* Hero */}
      <section className="bg-brand px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="text-lg font-medium leading-relaxed text-hero-sub sm:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-[5.5556vw] lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr]">
          {/* Info */}
          <div>
            <h2 className="text-3xl font-extrabold text-brand">
              {t("info.title")}
            </h2>
            <ul className="mt-8 space-y-6">
              {INFO.map(({ key, icon: Icon }) => (
                <li
                  key={key}
                  className="flex items-center gap-4 rounded-2xl border border-line p-5"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-dark">
                      {t(`info.${key}.label`)}
                    </p>
                    <p
                      className="mt-1 font-bold text-brand"
                      dir={key === "phone" ? "ltr" : undefined}
                    >
                      {t(`info.${key}.value`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-10">
            <h2 className="text-2xl font-extrabold text-brand">
              {t("form.title")}
            </h2>
            <p className="mt-2 text-muted-dark">{t("form.subtitle")}</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
