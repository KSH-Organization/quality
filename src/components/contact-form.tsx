"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Send } from "lucide-react";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-line/50 p-6 text-brand">
        <CheckCircle2 className="size-6 text-accent" aria-hidden />
        <p className="font-semibold">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="contact-name"
          className="mb-2 block text-sm font-semibold text-brand"
        >
          {t("name.label")}
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          required
          placeholder={t("name.placeholder")}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-2 block text-sm font-semibold text-brand"
        >
          {t("email.label")}
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          placeholder={t("email.placeholder")}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-phone"
          className="mb-2 block text-sm font-semibold text-brand"
        >
          {t("phone.label")}
        </label>
        <input
          id="contact-phone"
          type="tel"
          name="phone"
          placeholder={t("phone.placeholder")}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-sm font-semibold text-brand"
        >
          {t("message.label")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder={t("message.placeholder")}
          className="w-full resize-y rounded-lg border border-line bg-white px-4 py-3 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90"
      >
        {t("submit")}
        <Send className="size-4 rtl:-scale-x-100" aria-hidden />
      </button>
    </form>
  );
}
