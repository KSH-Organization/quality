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
      <section className="relative w-full h-[997px] flex justify-center items-center">
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
        <div className="relative z-10 w-[944px] h-[887px] bg-black/40 rounded-2xl px-36 py-24 flex flex-col justify-start items-center">
          {/* Title */}
          <h1
            className={`w-[757px] text-center text-red-50 text-3xl font-bold leading-10 mb-14 ${
              isRtl ? "text-right" : "text-center"
            }`}
          >
            {t("title")}
          </h1>

          {/* Form */}
          <form className="w-[819px] flex flex-col gap-14">
            {/* Name Input */}
            <div className="relative border-b border-neutral-400 pb-2">
              <label
                className={`absolute top-0 text-white text-xl font-normal leading-9 pointer-events-none ${
                  isRtl ? "right-0" : "left-0"
                }`}
              >
                {t("form.name")}
              </label>
              <input
                type="text"
                className="w-full bg-transparent text-white text-xl outline-none border-none pt-10"
              />
            </div>

            {/* Email Input */}
            <div className="relative border-b border-neutral-400 pb-2">
              <label
                className={`absolute top-0 text-white text-xl font-normal leading-9 pointer-events-none ${
                  isRtl ? "right-0" : "left-0"
                }`}
              >
                {t("form.email")}
              </label>
              <input
                type="email"
                className="w-full bg-transparent text-white text-xl outline-none border-none pt-10"
              />
            </div>

            {/* Phone Input */}
            <div className="relative border-b border-neutral-400 pb-2">
              <label
                className={`absolute top-0 text-white text-xl font-normal leading-9 pointer-events-none ${
                  isRtl ? "right-0" : "left-0"
                }`}
              >
                {t("form.phone")}
              </label>
              <input
                type="tel"
                className="w-full bg-transparent text-white text-xl outline-none border-none pt-10"
              />
            </div>

            {/* Message Input */}
            <div className="relative border-b border-neutral-400 pb-2">
              <label
                className={`absolute top-0 text-white text-xl font-normal leading-9 pointer-events-none ${
                  isRtl ? "right-0" : "left-0"
                }`}
              >
                {t("form.message")}
              </label>
              <input
                type="text"
                className="w-full bg-transparent text-white text-xl outline-none border-none pt-10"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-44 h-16 bg-[#5F349C] rounded-2xl text-white text-xl font-semibold hover:bg-purple-700 transition-colors ${
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
