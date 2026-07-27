"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Paperclip, CheckCircle2, Loader2 } from "lucide-react";
import { submitEntry } from "@/lib/submit";

type JobRow = { key: string; title: string };

export default function CareersForm() {
  const t = useTranslations("careers.form");
  const jobs = t.raw("jobs") as JobRow[];
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const raw = new FormData(form);
    // The CV input is a File; submissions are JSON, so send the filename and
    // let the applicant's portfolio/LinkedIn URL carry the actual document.
    const file = raw.get("cv");
    const data: Record<string, unknown> = Object.fromEntries(
      [...raw.entries()].filter(([, v]) => typeof v === "string"),
    );
    if (file instanceof File && file.name) data.cv = file.name;

    setSending(true);
    setError(null);
    const result = await submitEntry("job-applications", data);
    setSending(false);
    if (result.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      setError(result.error);
    }
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
          {jobs.map(({ key, title }) => (
            <option key={key} value={key} className="text-ink">
              {title}
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

      <div className="flex flex-col items-end gap-3 sm:col-span-2">
        {error && (
          <p className="text-sm font-semibold text-red-300" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-10 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("submit")}
          {sending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        </button>
      </div>
    </form>
  );
}
