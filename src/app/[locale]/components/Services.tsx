"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

const services = [
  {
    titleKey: "purchasing.title",
    descKey: "purchasing.desc",
    img: "/image-4.png",
  },
  {
    titleKey: "shipping.title",
    descKey: "shipping.desc",
    img: "/image-2.png",
  },
  {
    titleKey: "storage.title",
    descKey: "storage.desc",
    img: "/image-5.png",
  },
  {
    titleKey: "logistics.title",
    descKey: "logistics.desc",
    img: "/image-1.png",
  },
  {
    titleKey: "archiving.title",
    descKey: "archiving.desc",
    img: "/image-3.png",
  },
  {
    titleKey: "quality.title",
    descKey: "quality.desc",
    img: "/image.png",
  },
];

export default function Services() {
  const t = useTranslations("services");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section id="services" className="bg-gray-50 py-20 px-6">
      <div
        className=" max-w-[1500] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-23"
        dir="ltr"
      >
        {services.map((service, i) => (
          <div
            key={i}
            className="w-full bg-white rounded-xl border border-neutral-400 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Image */}
            <div className="relative w-full h-72">
              <Image
                src={service.img}
                alt={t(service.titleKey)}
                fill
                className="object-cover rounded-t-xl"
              />
            </div>

            {/* Content */}
            <div
              className={`p-3 flex flex-col gap-3 flex-grow ${
                isRtl ? "text-right" : "text-left"
              }`}
            >
              <h3 className="text-black text-3xl font-bold leading-9">
                {t(service.titleKey)}
              </h3>
              <p className="text-neutral-600 text-xl font-normal leading-relaxed flex-grow">
                {t(service.descKey)}
              </p>

              {/* Button */}
              <button className="self-start px-3.5 py-2 bg-[#5F349C] rounded-md text-white text-base font-semibold hover:bg-[#4a2879] transition-colors">
                {t("exploreButton")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
