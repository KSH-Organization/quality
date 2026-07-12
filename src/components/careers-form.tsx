"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Paperclip, CheckCircle2 } from "lucide-react";

const JOB_KEYS = ["logistics", "warehouse", "procurement", "it"] as const;

export default function CareersForm() {
  const t = useTranslations("careers.form");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-6 text-white">
        <CheckCircle2 className="size-6 text-accent" aria-hidden />
        <p className="font-semibold">{t("success")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      <div className="relative">
        <label htmlFor="job" className="sr-only">
          {t("availableJobs")}
        </label>
        <select
          id="job"
          name="job"
          required
          defaultValue=""
          className="w-full appearance-none border-b border-white/50 bg-transparent py-3 pe-8 text-white focus:border-accent focus:outline-none"
        >
          <option value="" disabled className="text-ink">
            {t("availableJobs")}
          </option>
          {JOB_KEYS.map((key) => (
            <option key={key} value={key} className="text-ink">
              {t(`jobs.${key}`)}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute inset-e-1 top-1/2 size-4 -translate-y-1/2 text-white/70"
          aria-hidden
        />
      </div>

      <div>
        <label htmlFor="career-email" className="sr-only">
          {t("email")}
        </label>
        <input
          id="career-email"
          type="email"
          name="email"
          required
          placeholder={t("email")}
          className="w-full border-b border-white/50 bg-transparent py-3 text-white placeholder:text-white/70 focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="career-name" className="sr-only">
          {t("fullName")}
        </label>
        <input
          id="career-name"
          type="text"
          name="fullName"
          required
          placeholder={t("fullName")}
          className="w-full border-b border-white/50 bg-transparent py-3 text-white placeholder:text-white/70 focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="career-phone" className="sr-only">
          {t("phone")}
        </label>
        <input
          id="career-phone"
          type="tel"
          name="phone"
          placeholder={t("phone")}
          className="w-full border-b border-white/50 bg-transparent py-3 text-white placeholder:text-white/70 focus:border-accent focus:outline-none"
        />
      </div>

      <div className="relative">
        <label
          htmlFor="career-cv"
          className="flex w-full cursor-pointer items-center justify-between border-b border-white/50 py-3 text-white/70 hover:text-white"
        >
          {t("cv")}
          <Paperclip className="size-4" aria-hidden />
        </label>
        <input
          id="career-cv"
          type="file"
          name="cv"
          accept=".pdf,.doc,.docx"
          className="sr-only"
        />
      </div>

      <div>
        <label htmlFor="career-portfolio" className="sr-only">
          {t("portfolio")}
        </label>
        <input
          id="career-portfolio"
          type="url"
          name="portfolio"
          placeholder={t("portfolio")}
          className="w-full border-b border-white/50 bg-transparent py-3 text-white placeholder:text-white/70 focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex justify-end sm:col-span-2">
        <button
          type="submit"
          className="rounded-lg bg-accent px-10 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90"
        >
          {t("submit")}
        </button>
      </div>
    </form>
  );
}
