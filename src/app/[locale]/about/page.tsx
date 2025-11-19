"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function AboutPage() {
  const t = useTranslations("aboutPage");
  const locale = useLocale();

  // Animated stats
  const [stats, setStats] = useState({
    storage: 0,
    height: 0,
    experience: 0,
  });
  const targetStats = {
    storage: 20000,
    height: 17,
    experience: 10,
  };
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let frame: number;
    let direction = 1;
    let current = { ...stats };
    // Calculate increments so all reach max in 60 frames
    const increments: Record<keyof typeof targetStats, number> = {
      storage: targetStats.storage / 60,
      height: targetStats.height / 60,
      experience: targetStats.experience / 60,
    };
    const animate = () => {
      let done = true;
      (Object.keys(targetStats) as Array<keyof typeof targetStats>).forEach(
        (key) => {
          const target = direction === 1 ? targetStats[key] : 0;
          const increment = increments[key];
          if (direction === 1 && current[key] < target) {
            current[key] += increment;
            if (current[key] > target) current[key] = target;
            done = false;
          } else if (direction === -1 && current[key] > target) {
            current[key] -= increment;
            if (current[key] < target) current[key] = target;
            done = false;
          }
        }
      );
      setStats({
        storage: Math.round(current.storage),
        height: Math.round(current.height),
        experience: Math.round(current.experience),
      });
      if (!done) {
        frame = window.requestAnimationFrame(animate);
      } else {
        direction = direction === 1 ? -1 : 1;
        setTimeout(() => {
          frame = window.requestAnimationFrame(animate);
        }, 1200);
      }
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [hasAnimated]);
  const isRtl = locale === "ar";

  return (
    <main className="flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero imageUrl="/hero-about.png" />

      {/* About Section */}
      <section className="bg-white">
        <div className="self-stretch rounded-bl-[50px] rounded-br-[50px] flex flex-col justify-center items-center">
          <div className="max-w-[1600px] w-full px-4 sm:px-8 md:px-16 lg:px-24 py-8 md:py-16 lg:py-24 bg-white flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-16 lg:gap-24">
            <div
              className={`flex-1 flex flex-col justify-start items-start gap-8 ${
                isRtl ? "order-2" : "order-1"
              }`}
            >
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div
                  className={`self-stretch ${
                    isRtl ? "text-right" : ""
                  } justify-start text-[#5F349C] text-4xl font-semibold leading-[76px]`}
                >
                  {t("title")}
                </div>
                <div
                  className={`self-stretch ${
                    isRtl ? "text-right" : ""
                  } justify-start text-neutral-500 text-lg font-normal leading-5 whitespace-pre-line`}
                >
                  {t("description")}
                </div>
              </div>
            </div>
            <Image
              src="/about_us.png"
              alt={t("title")}
              width={334}
              height={257}
              className={`w-80 h-64 relative rounded-tr-3xl rounded-bl-3xl ${
                isRtl ? "order-1" : "order-2"
              }`}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="flex justify-center items-center py-12 px-4"
        >
          <div
            className={`w-full max-w-[1000px] h-auto md:h-44 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-2 border-[#BC940F] flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 py-6 md:py-0 ${
              isRtl ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Storage Space */}
            <div className="w-72 h-24 p-3.5 bg-white rounded-2xl inline-flex flex-col justify-center items-start gap-2.5">
              <div
                className={`flex-1 inline-flex justify-start items-center gap-2.5 ${
                  isRtl ? "flex-row-reverse" : ""
                }`}
              >
                {!isRtl && (
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="w-14 h-14 bg-[#C4A748] opacity-20 rounded-full absolute" />
                    <div className="w-10 h-10 bg-[#CCB664] opacity-[0.21] rounded-full absolute" />
                    <Image
                      src="/house.png"
                      alt="Storage"
                      width={24}
                      height={24}
                      className="w-6 h-6 relative z-10"
                    />
                  </div>
                )}
                <div
                  className={`inline-flex flex-col justify-center items-start gap-2 ${
                    isRtl ? "items-end" : ""
                  }`}
                >
                  <div
                    className={`justify-start text-[#BC940F] text-base font-semibold capitalize [text-shadow:_0px_2px_2px_rgb(0_0_0_/_0.25)] ${
                      isRtl ? "text-right" : ""
                    }`}
                  >
                    {t("stats.storageSpace")}
                  </div>
                  <div
                    className={`justify-start text-[#BC940F] text-[22px] font-bold font-['Roboto_Condensed'] capitalize ${
                      isRtl ? "text-right" : ""
                    }`}
                  >
                    {stats.storage.toLocaleString()}+ M²
                  </div>
                </div>
                {isRtl && (
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="w-14 h-14 bg-[#C4A748] opacity-20 rounded-full absolute" />
                    <div className="w-10 h-10 bg-[#CCB664] opacity-[0.21] rounded-full absolute" />
                    <Image
                      src="/house.png"
                      alt="Storage"
                      width={24}
                      height={24}
                      className="w-6 h-6 relative z-10"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Height */}
            <div className="w-72 h-24 p-3.5 bg-white rounded-2xl inline-flex flex-col justify-center items-start gap-2.5">
              <div
                className={`flex-1 inline-flex justify-start items-center gap-2.5 ${
                  isRtl ? "flex-row-reverse" : ""
                }`}
              >
                {!isRtl && (
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="w-14 h-14 bg-[#C4A748] opacity-20 rounded-full absolute" />
                    <div className="w-10 h-10 bg-[#CCB664] opacity-[0.21] rounded-full absolute" />
                    <Image
                      src="/ruler.png"
                      alt="Height"
                      width={24}
                      height={24}
                      className="w-6 h-6 relative z-10"
                    />
                  </div>
                )}
                <div
                  className={`inline-flex flex-col justify-center items-start gap-2 ${
                    isRtl ? "items-end" : ""
                  }`}
                >
                  <div
                    className={`justify-start text-[#BC940F] text-base font-semibold capitalize [text-shadow:_0px_2px_2px_rgb(0_0_0_/_0.25)] ${
                      isRtl ? "text-right" : ""
                    }`}
                  >
                    {t("stats.height")}
                  </div>
                  <div
                    className={`justify-start text-[#BC940F] text-[22px] font-bold font-['Roboto_Condensed'] capitalize ${
                      isRtl ? "text-right" : ""
                    }`}
                  >
                    {stats.height}+
                  </div>
                </div>
                {isRtl && (
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="w-14 h-14 bg-[#C4A748] opacity-20 rounded-full absolute" />
                    <div className="w-10 h-10 bg-[#CCB664] opacity-[0.21] rounded-full absolute" />
                    <Image
                      src="/ruler.png"
                      alt="Height"
                      width={24}
                      height={24}
                      className="w-6 h-6 relative z-10"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Years of Experience */}
            <div className="w-72 h-24 p-3.5 bg-white rounded-2xl inline-flex flex-col justify-center items-start gap-2.5">
              <div
                className={`flex-1 inline-flex justify-start items-center gap-2.5 ${
                  isRtl ? "flex-row-reverse" : ""
                }`}
              >
                {!isRtl && (
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="w-14 h-14 bg-[#C4A748] opacity-20 rounded-full absolute" />
                    <div className="w-10 h-10 bg-[#CCB664] opacity-[0.21] rounded-full absolute" />
                    <Image
                      src="/star.png"
                      alt="Experience"
                      width={24}
                      height={24}
                      className="w-6 h-6 relative z-10"
                    />
                  </div>
                )}
                <div
                  className={`inline-flex flex-col justify-center items-start gap-2 ${
                    isRtl ? "items-end" : ""
                  }`}
                >
                  <div
                    className={`justify-start text-[#BC940F] text-base font-semibold capitalize [text-shadow:_0px_2px_2px_rgb(0_0_0_/_0.25)] ${
                      isRtl ? "text-right" : ""
                    }`}
                  >
                    {t("stats.experience")}
                  </div>
                  <div
                    className={`justify-start text-[#BC940F] text-[22px] font-bold font-['Roboto_Condensed'] capitalize ${
                      isRtl ? "text-right" : ""
                    }`}
                  >
                    {stats.experience}+
                  </div>
                </div>
                {isRtl && (
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="w-14 h-14 bg-[#C4A748] opacity-20 rounded-full absolute" />
                    <div className="w-10 h-10 bg-[#CCB664] opacity-[0.21] rounded-full absolute" />
                    <Image
                      src="/star.png"
                      alt="Experience"
                      width={24}
                      height={24}
                      className="w-6 h-6 relative z-10"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-slate-100 py-24 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-16">
          {/* Vision */}
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-16 bg-[#5F349C] rounded-tr-[50px] rounded-bl-[50px] flex justify-center items-center">
            <div
              className={`flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-14 ${
                isRtl ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full lg:w-[542px] flex flex-col justify-center items-start gap-6 lg:gap-12">
                <h3
                  className={`self-stretch ${
                    isRtl ? "text-right" : "text-left"
                  } text-white text-2xl md:text-4xl font-bold leading-8 md:leading-10`}
                >
                  {t("vision.title")}
                </h3>
                <p
                  className={`self-stretch ${
                    isRtl ? "text-right" : "text-left"
                  } text-white text-base md:text-lg font-semibold leading-6`}
                >
                  {t("vision.description")}
                </p>
              </div>
              <Image
                src="/Rectangle 728-1.png"
                alt={t("vision.title")}
                width={416}
                height={306}
                className="w-full max-w-[384px] lg:w-96 h-64 lg:h-80 rounded-xl object-cover"
              />
            </div>
          </div>

          {/* Mission */}
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-16 bg-[#5F349C] rounded-tl-[50px] rounded-br-[50px] flex justify-center items-center">
            <div
              className={`flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-14 ${
                isRtl ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full lg:w-[542px] flex flex-col justify-center items-start gap-6 lg:gap-12">
                <h3
                  className={`self-stretch ${
                    isRtl ? "text-right" : "text-left"
                  } text-white text-2xl md:text-4xl font-bold leading-8 md:leading-10`}
                >
                  {t("mission.title")}
                </h3>
                <p
                  className={`self-stretch ${
                    isRtl ? "text-right" : "text-left"
                  } text-white text-base md:text-lg font-semibold leading-6`}
                >
                  {t("mission.description")}
                </p>
              </div>
              <Image
                src="/Rectangle 728.png"
                alt={t("mission.title")}
                width={416}
                height={306}
                className="w-full max-w-[384px] lg:w-96 h-64 lg:h-80 rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-5xl font-bold text-[#5F349C] mb-20 text-center">
            {t("objectives.title")}
          </h2>

          <div
            dir="ltr"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 max-w-6xl mx-auto"
          >
            {/* Continuous Innovation */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Image
                  src="/mdi_lightbulb-on-outline.svg"
                  alt="Innovation"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {t("objectives.items.innovation.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("objectives.items.innovation.description")}
              </p>
            </div>

            {/* Excellence in Quality */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Image
                  src="/mdi_star-check-outline.svg"
                  alt="Quality"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {t("objectives.items.excellence.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("objectives.items.excellence.description")}
              </p>
            </div>

            {/* Safety & Reliability */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Image
                  src="/mdi_shield-check-outline.svg"
                  alt="Safety"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {t("objectives.items.safety.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("objectives.items.safety.description")}
              </p>
            </div>

            {/* Expansion & Leadership */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Image
                  src="/mdi_trending-up.svg"
                  alt="Expansion"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {t("objectives.items.expansion.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("objectives.items.expansion.description")}
              </p>
            </div>

            {/* Investment in Human Capital */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Image
                  src="/oui_users.svg"
                  alt="Human Capital"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {t("objectives.items.human.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("objectives.items.human.description")}
              </p>
            </div>

            {/* Transfer our Exceptional */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Image
                  src="/famicons_earth-outline.svg"
                  alt="Global Expansion"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {t("objectives.items.transfer.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("objectives.items.transfer.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
