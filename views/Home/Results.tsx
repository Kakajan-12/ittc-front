"use client";

import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import CountUp from "@/components/CountUp";
import { resultsData } from "./resultsData";

function Results({ className }: { className?: string }) {
  const t = useTranslations("Results");

  return (
    <section className="relative isolate overflow-hidden bg-brand-blue-dark text-white ">
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[url('/pattern.svg')] bg-repeat opacity-30"
      />

      <div className={`px-4 lg:px-10 relative py-15 lg:py-20 z-0 ${className}`}>
        <SectionHeading title={t("title")} />

        <dl className="mt-8 grid grid-cols-2 gap-x-3 lg:gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {resultsData.map(({ key, value }) => (
            <div key={key} className="relative">
              <span className="relative font-capitana text-4xl leading-none sm:text-5xl lg:text-6xl">
                +
                <CountUp
                  from={0}
                  to={value}
                  separator=","
                  direction="up"
                  duration={1}
                  delay={0}
                />
              </span>
              <dt className="relative mt-3 text-base font-capitana text-results">
                {t(key)}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Results;
