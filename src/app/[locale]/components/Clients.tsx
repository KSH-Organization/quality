"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Clients() {
  const t = useTranslations("clients");

  return (
    <section id="clients" className="bg-white py-16 px-6 text-center">
      {/* Our Clients Section */}
      <div className="mb-[104px]">
        <h2 className="text-3xl font-bold text-[#5F349C] mb-10">
          {t("ourClients")}
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-65">
          <Image
            src="/Logo-5.png"
            alt="Client 1"
            className="h-auto w-auto object-contain"
            width={350}
            height={90}
          />
          <Image
            src="/Logo-4.png"
            alt="Client 2"
            className="h-auto w-auto object-contain"
            width={300}
            height={85}
          />
          <Image
            src="/Logo-3.png"
            alt="Client 3"
            className="h-auto w-auto object-contain"
            width={250}
            height={150}
          />
        </div>
      </div>

      {/* Strategic Partners Section */}
      <div>
        <h2 className="text-3xl font-bold text-[#5F349C] mb-10">
          {t("strategicPartners")}
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-35">
          <Image
            src="/Logo-2.png"
            alt="Partner 1"
            className="h-auto w-auto object-contain"
            width={450}
            height={120}
          />
          <Image
            src="/Logo-4.png"
            alt="Partner 2"
            className="h-auto w-auto object-contain"
            width={300}
            height={85}
          />
          <Image
            src="/Tad.png"
            alt="Partner 3"
            className="h-auto w-auto object-contain"
            width={240}
            height={240}
          />
          <Image
            src="/Logo.png"
            alt="Partner 4"
            className="h-auto w-auto object-contain"
            width={360}
            height={120}
          />
        </div>
      </div>
    </section>
  );
}
