"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "@/app/[locale]/components/LanguageSwitcher";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const isRTL = locale === "ar";

  const logoPositionStyle = isRTL
    ? { left: "1226px", right: "auto" }
    : { left: "31px", right: "auto" };
  const navPositionStyle = isRTL
    ? { left: "266px", right: "auto" }
    : { left: "863.5px", right: "auto" };
  const ctaPositionStyle = isRTL
    ? { left: "95px", right: "auto" }
    : { left: "1182.5px", right: "auto" };
  return (
    <header
      className={`bg-slate-50 h-20 w-full overflow-hidden${
        isRTL ? " lg:[direction:rtl]" : ""
      }`}
    >
      {/* Mobile / small screens: hamburger menu */}
      <div
        className={`lg:hidden h-full w-full flex items-center justify-between px-6${
          isRTL ? " flex-row-reverse" : ""
        }`}
      >
        <Link href="/">
          <img src="/q.png" alt="Logo" className="h-12 cursor-pointer" />
        </Link>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md text-neutral-700 hover:bg-neutral-200/60 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          {open ? (
            // X icon
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 12H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="lg:hidden absolute top-20 inset-x-0 z-50 bg-slate-50 border-t border-neutral-200 shadow-sm">
          <div
            className={`px-6 py-4 flex flex-col gap-4${
              isRTL ? " text-right" : ""
            }`}
          >
            <Link
              onClick={() => setOpen(false)}
              href="/"
              className="text-neutral-700 text-base font-medium hover:text-[#5F349C]"
            >
              {t("nav.home")}
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/about"
              className="text-neutral-700 text-base hover:text-[#5F349C]"
            >
              {t("nav.about")}
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/people"
              className="text-neutral-700 text-base hover:text-[#5F349C]"
            >
              {t("nav.people")}
            </Link>
            <div className={`pt-2${isRTL ? " text-right" : ""}`}>
              <button className="w-full px-5 py-2.5 bg-[#5F349C] text-white text-sm font-medium rounded-md hover:opacity-90">
                {t("nav.contact")}
              </button>
            </div>
            <div className={`pt-2${isRTL ? " text-right" : ""}`}>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}

      {/* Desktop: pixel-perfect per Figma */}
      <div className="hidden lg:block h-full">
        <div className="relative w-[1440px] h-20 mx-auto">
          {/* Logo block */}
          <div
            className="absolute top-[8px] inline-flex justify-start items-center gap-[2.67px]"
            style={logoPositionStyle}
          >
            <Link href="/">
              <img
                src="/q.png"
                alt="Logo"
                className="w-32 h-20 object-contain cursor-pointer"
              />
            </Link>
          </div>

          {/* Center nav */}
          <nav
            className={`absolute top-[26px] inline-flex justify-center items-center gap-12 overflow-hidden${
              isRTL ? "" : ""
            }`}
            style={navPositionStyle}
          >
            <div
              className={`flex justify-start items-center gap-2.5${
                isRTL ? "" : ""
              }`}
            >
              <Link
                href="/"
                className="text-neutral-600 text-base font-normal leading-6 hover:text-[#5F349C]"
              >
                {t("nav.home")}
              </Link>
            </div>
            <div
              className={`flex justify-start items-center gap-2.5${
                isRTL ? "" : ""
              }`}
            >
              <Link
                href="/about"
                className="text-neutral-600 text-base font-normal leading-6 hover:text-[#5F349C]"
              >
                {t("nav.about")}
              </Link>
            </div>
            <div
              className={`flex justify-start items-center gap-2.5${
                isRTL ? "" : ""
              }`}
            >
              <Link
                href="/people"
                className="text-neutral-600 text-base font-medium leading-6 hover:text-[#5F349C]"
              >
                {t("nav.people")}
              </Link>
            </div>
          </nav>

          {/* Contact button */}
          <div
            className="absolute top-[18px] inline-flex justify-start items-start gap-3.5 overflow-hidden"
            style={ctaPositionStyle}
          >
            <button
              className={`px-5 py-2.5 bg-[#5F349C] rounded-md flex justify-start items-center gap-2.5 text-white text-sm font-medium leading-5 hover:opacity-90${
                isRTL ? "" : ""
              }`}
            >
              {t("nav.contact")}
            </button>
          </div>

          {/* Language Switcher */}
          <div
            className="absolute top-[25px]"
            style={isRTL ? { left: "31px" } : { left: "1310px" }}
          >
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
