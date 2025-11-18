"use client";

import { useTranslations, useLocale } from "next-intl";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

export default function ContactPage() {
  const t = useTranslations("contactPage");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Contact Form Section */}
      <section className="relative w-full min-h-screen md:h-[997px] flex justify-center items-center py-8 md:py-0 px-4 md:px-0">
        {/* Background Image */}
        <Image
          src="/Contact.png"
          alt="Contact Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Form Container */}
        <div className="relative z-10 w-full max-w-[944px] bg-black/40 rounded-2xl px-6 sm:px-8 md:px-24 lg:px-36 py-8 sm:py-12 md:py-24 flex flex-col justify-start items-center my-8 md:my-0">
          {/* Title */}
          <h1
            className={`w-full text-center text-red-50 text-lg sm:text-xl md:text-3xl font-bold leading-tight md:leading-10 mb-6 sm:mb-8 md:mb-14 px-2 ${
              isRtl ? "text-right" : "text-center"
            }`}
          >
            {t("title")}
          </h1>

          {/* Form */}
          <form className="w-full flex flex-col gap-6 sm:gap-8 md:gap-14">
            {/* Name Input */}
            <div className="relative border-b border-neutral-400 pb-2">
              <label
                className={`absolute top-0 text-white text-sm sm:text-base md:text-xl font-normal leading-6 md:leading-9 pointer-events-none ${
                  isRtl ? "right-0" : "left-0"
                }`}
              >
                {t("form.name")}
              </label>
              <input
                type="text"
                className="w-full bg-transparent text-white text-sm sm:text-base md:text-xl outline-none border-none pt-7 sm:pt-8 md:pt-10"
                placeholder=""
              />
            </div>

            {/* Email Input */}
            <div className="relative border-b border-neutral-400 pb-2">
              <label
                className={`absolute top-0 text-white text-sm sm:text-base md:text-xl font-normal leading-6 md:leading-9 pointer-events-none ${
                  isRtl ? "right-0" : "left-0"
                }`}
              >
                {t("form.email")}
              </label>
              <input
                type="email"
                className="w-full bg-transparent text-white text-sm sm:text-base md:text-xl outline-none border-none pt-7 sm:pt-8 md:pt-10"
                placeholder=""
              />
            </div>

            {/* Phone Input */}
            <div className="relative border-b border-neutral-400 pb-2">
              <label
                className={`absolute top-0 text-white text-sm sm:text-base md:text-xl font-normal leading-6 md:leading-9 pointer-events-none ${
                  isRtl ? "right-0" : "left-0"
                }`}
              >
                {t("form.phone")}
              </label>
              <input
                type="tel"
                className="w-full bg-transparent text-white text-sm sm:text-base md:text-xl outline-none border-none pt-7 sm:pt-8 md:pt-10"
                placeholder=""
              />
            </div>

            {/* Message Input */}
            <div className="relative border-b border-neutral-400 pb-2">
              <label
                className={`absolute top-0 text-white text-sm sm:text-base md:text-xl font-normal leading-6 md:leading-9 pointer-events-none ${
                  isRtl ? "right-0" : "left-0"
                }`}
              >
                {t("form.message")}
              </label>
              <textarea
                className="w-full bg-transparent text-white text-sm sm:text-base md:text-xl outline-none border-none pt-7 sm:pt-8 md:pt-10 resize-none h-20 md:h-auto"
                placeholder=""
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-32 sm:w-36 md:w-44 h-10 sm:h-12 md:h-16 bg-[#5F349C] rounded-xl md:rounded-2xl text-white text-base sm:text-lg md:text-xl font-semibold hover:bg-purple-700 transition-colors ${
                isRtl ? "self-start" : "self-end"
              }`}
            >
              {t("form.submit")}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
