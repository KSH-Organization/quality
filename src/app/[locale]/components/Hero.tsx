"use client";

import { useLocale } from "next-intl";

interface HeroProps {
  imageUrl?: string;
}

export default function Hero({ imageUrl = "/hero.png" }: HeroProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section
      className="relative h-[500px] md:h-[650px] bg-cover bg-center rounded-b-[80px] flex items-center justify-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {/* Dark overlay */}
      {/* <div className="absolute inset-0 bg-black/40 rounded-b-[80px]" /> */}

      {/* Title */}
      <div className="relative z-10">
        {isRTL ? (
          <div className="w-[857px] h-52 text-center justify-center">
            <span className="text-white text-5xl font-bold font-['Cairo'] leading-[100px]">
              الشركة الكويتية السودانية القابضة
              <br />
            </span>
            <span className="text-yellow-600 text-5xl font-bold font-['Cairo'] leading-[100px]">
              اللوجستيات
            </span>
          </div>
        ) : (
          <div className="w-[646px] justify-start">
            <span className="text-white text-8xl font-bold font-['Karma'] leading-[8.01px]">
              {" "}
            </span>
            <span className="text-yellow-600 text-8xl font-bold font-['Karma'] leading-[8.01px]">
              KSHC
            </span>
            <span className="text-white text-8xl font-bold font-['Karma'] leading-[8.01px]">
              {" "}
              Logistic
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
