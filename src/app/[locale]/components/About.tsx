"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("about");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section id="about" className="bg-[#F2E7BF] py-16 md:py-20">
      <div
        className={`mx-auto max-w-[1440px] flex flex-col ${
          isRtl ? "md:flex-row" : "md:flex-row"
        } gap-8 md:gap-12 lg:gap-16 items-center`}
      >
        <div className={`flex-[4] ${isRtl ? "text-right" : "text-left"}`}>
          <h2 className="text-4xl font-semibold text-[#5F349C] mb-6 leading-[76px]">
            {t("heading")}
          </h2>
          <p className="text-gray-700 text-xl leading-relaxed">{t("body")}</p>
        </div>
        <div className="flex-[3] flex justify-center shrink-0">
          <Image
            src="/Illustration.png"
            alt="About illustration"
            className="drop-shadow-[0px_10px_30px_rgba(0,0,0,0.15)]"
            width={450}
            height={350}
            priority
          />
        </div>
      </div>
    </section>
  );
}
