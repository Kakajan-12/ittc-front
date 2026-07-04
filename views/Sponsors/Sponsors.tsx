import React from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";

const sponsors = Array.from({ length: 6 });

function Sponsors() {
  const t = useTranslations("Sponsors");

  return (
    <section className="py-15 lg:py-20">
      <div className="container mx-auto px-4 lg:px-10">
        <SectionHeading title={t("title")} />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {sponsors.map((_, i) => (
            <div key={i} className="aspect-4/3 w-full rounded bg-gray-400" />
          ))}
        </div>
      </div>
    </section>
  );
}
{
  /* <div className="flex w-max animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]"> */
}

export default Sponsors;
