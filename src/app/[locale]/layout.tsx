import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Cairo, Karma } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const karma = Karma({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-karma",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  const direction = locale === "ar" ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? cairo.className : karma.className;

  return (
    <html lang={locale} dir={direction} className="overflow-x-hidden">
      <body
        className={`${direction === "rtl" ? "rtl" : ""} ${fontClass}`.trim()}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
