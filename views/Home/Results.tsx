import React from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";

const stats = [
  { key: "speakers", value: "40" },
  { key: "delegates", value: "500" },
  { key: "countries", value: "50" },
  { key: "sponsors", value: "10" },
  { key: "sessions", value: "5" },
] as const;

function Results() {
  const t = useTranslations("Results");

  return (
    <section className="relative isolate overflow-hidden bg-brand-blue-dark text-white ">
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[url('/pattern.svg')] bg-repeat opacity-30"
      />

      <div className="container mx-auto px-4 lg:px-10 relative py-15 lg:py-20 z-0">
        <SectionHeading title={t("title")} />

        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ key, value }) => (
            <div key={key} className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-3 left-0 select-none font-capitana text-7xl font-bold leading-none text-white/15 sm:text-7xl"
              >
                {value}
              </span>
              <dd className="relative font-capitana text-4xl leading-none sm:text-5xl">
                {value}
              </dd>
              <dt className="relative mt-3 text-base text-results">{t(key)}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Results;
