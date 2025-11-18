"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export default function Different() {
  const t = useTranslations("different");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section
      id="different"
      className={`bg-[#F2E7BF] py-12 md:py-16 px-4 md:px-6 ${
        isRtl ? "text-right" : "text-left"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 flex flex-col lg:flex-row justify-between items-center gap-8">
        {" "}
        {/* Image Section - Left in Arabic, Right in English */}
        {isRtl && (
          <div className="flex justify-center flex-shrink-0">
            <Image
              src="/different.png"
              alt={t("title")}
              width={449}
              height={449}
              className="w-64 h-64 md:w-96 md:h-96 object-contain"
            />
          </div>
        )}
        {/* Text Section */}
        <div
          className={`w-full max-w-[661px] flex flex-col justify-start items-start gap-6 md:gap-8 ${
            isRtl ? "text-right" : "text-left"
          }`}
        >
          <div className="w-full max-w-[601px] flex flex-col justify-start items-start gap-4">
            {" "}
            {/* Title */}
            <h2
              className={`self-stretch text-2xl md:text-4xl ${
                isRtl ? "justify-start" : ""
              }`}
            >
              <span className="text-[#5F349C] font-semibold leading-tight md:leading-10">
                {t("titlePart1")}
              </span>
              <span className="text-yellow-600 font-semibold leading-tight md:leading-10">
                {t("titlePart2")}
              </span>
              <span className="text-[#5F349C] font-semibold leading-tight md:leading-10">
                {t("titlePart3")}
              </span>
            </h2>
            {/* Description */}
            <div
              className={`self-stretch ${
                isRtl ? "justify-start" : ""
              } text-neutral-500 text-lg font-normal leading-5 whitespace-pre-line`}
            >
              {t("description")}
            </div>
          </div>

          {/* Button */}
          <Link href={`/${locale}/about`}>
            <button className="px-8 py-3.5 bg-[#5F349C] rounded inline-flex justify-center items-center gap-2.5 hover:bg-[#4a2879] transition-colors">
              <span className="text-center text-white text-base font-medium leading-6">
                {t("button")}
              </span>
            </button>
          </Link>
        </div>
        {/* Image Section - Right in English */}
        {!isRtl && (
          <div className="flex justify-center flex-shrink-0">
            <Image
              src="/different.png"
              alt={t("title")}
              width={449}
              height={449}
              className="w-64 h-64 md:w-96 md:h-96 object-contain"
            />
          </div>
        )}
      </div>
    </section>
  );
}
