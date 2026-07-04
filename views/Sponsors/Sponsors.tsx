import React from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";

const sponsors = Array.from({ length: 12 });

function Sponsors() {
  const t = useTranslations("Sponsors");

  return (
    <section className="container mx-auto px-4 lg:px-10 overflow-hidden">
      <div className="overflow-hidden">
        <SectionHeading title={t("title")} />
        <div className="flex w-max animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
          <div className="flex shrink-0 items-center sm:mt-3 lg:mt-8">
            {sponsors.map((_, i) => (
              <div
                key={i}
                className="relative mx-3 flex h-36 w-44 shrink-0 items-center justify-center  transition duration-300 hover:grayscale-0"
              >
                <span className="aspect-4/3 w-full rounded bg-gray-400" />
                {/* <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="176px"
                  className="object-contain"
                /> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sponsors;
