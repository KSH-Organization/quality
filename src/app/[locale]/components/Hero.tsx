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
      <div className="relative z-10 px-4 max-w-full">
        {isRTL ? (
          <div className="max-w-[857px] w-full mx-auto h-auto py-8 text-center justify-center">
            <span className="text-white text-3xl sm:text-4xl md:text-5xl font-bold font-['Cairo'] leading-tight md:leading-[100px]">
              الشركة الكويتية السودانية القابضة
              <br />
            </span>
            <span className="text-yellow-600 text-3xl sm:text-4xl md:text-5xl font-bold font-['Cairo'] leading-tight md:leading-[100px]">
              اللوجستيات
            </span>
          </div>
        ) : (
          <div className="max-w-[646px] w-full mx-auto justify-start text-center md:text-left">
            <span className="text-white text-4xl sm:text-6xl md:text-8xl font-bold font-['Karma'] leading-tight">
              {" "}
            </span>
            <span className="text-yellow-600 text-4xl sm:text-6xl md:text-8xl font-bold font-['Karma'] leading-tight">
              KSHC
            </span>
            <span className="text-white text-4xl sm:text-6xl md:text-8xl font-bold font-['Karma'] leading-tight">
              {" "}
              Logistic
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
