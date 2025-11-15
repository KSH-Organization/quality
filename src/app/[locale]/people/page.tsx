"use client";

import { useTranslations, useLocale } from "next-intl";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

export default function PeoplePage() {
  const t = useTranslations("peoplePage");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const departmentsRow1 = [
    "procurement",
    "logistics",
    "warehousing",
    "distribution",
  ];

  const departmentsRow2 = ["scm", "planning", "quality"];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <Image
          src="/home-hero.png"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative text-white text-6xl font-bold text-center">
          <span className="text-[#F2E7BF]">KSHC</span> Logistic
        </h1>
      </section>

      {/* Departments Section */}
      <section className="py-20 px-6">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-4xl font-bold text-[#5F349C] text-center mb-16">
            {t("title")}
          </h2>

          {/* First Row - 4 cards */}
          <div dir="ltr" className="flex justify-center gap-8 mb-8">
            {departmentsRow1.map((dept) => (
              <div key={dept} className="w-80 h-80 relative">
                <div className="w-80 h-80 absolute bg-white rounded-[10px] outline outline-1 outline-neutral-400" />
                <div className="w-80 h-44 absolute bg-zinc-300 rounded-tl-[10px] rounded-tr-[10px]" />
                <div className="w-72 absolute left-[13px] top-[209px] text-center text-neutral-700 text-xl font-bold leading-5">
                  {t(`departments.${dept}`)}
                </div>
              </div>
            ))}
          </div>

          {/* Second Row - 3 cards */}
          <div dir="ltr" className="flex justify-center gap-8">
            {departmentsRow2.map((dept) => (
              <div key={dept} className="w-80 h-80 relative">
                <div className="w-80 h-80 absolute bg-white rounded-[10px] outline outline-1 outline-neutral-400" />
                <div className="w-80 h-44 absolute bg-zinc-300 rounded-tl-[10px] rounded-tr-[10px]" />
                <div className="w-72 absolute left-[13px] top-[209px] text-center text-neutral-700 text-xl font-bold leading-5">
                  {t(`departments.${dept}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
