"use client";

import { useTranslations } from "next-intl";
import PageHeading from "@/shared/ui/PageHeading";
import Results from "@/views/Home/Results";

const sectionIds = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

function AboutPage() {
  const t = useTranslations("About");

  return (
    <main className="flex flex-col">
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
      />
      <div className="py-15 lg:py-20 text-brand-gray">
        <h2 className="px-4 lg:px-10 text-lg font-bold font-roboto">
          {t("subtitle")}
        </h2>
        <p className="px-4 lg:px-10 mt-4 text-base lg:mb-28">{t("text")}</p>
        <Results className=" hidden lg:block" />
        <h3 className="px-4 lg:px-10 mt-4 lg:mt-18 text-lg font-bold font-roboto">
          {t("section.title")}
        </h3>
        <div className="px-4 lg:px-10 mt-4 flex list-decimal flex-col gap-4 lg:gap-8 marker:font-bold marker:font-roboto">
          {sectionIds.map((id) => (
            <div key={id}>
              <h4 className="text-base font-bold font-roboto">
                {id}. {t(`section.${id}.title`)}
              </h4>
              <p className="mt-4 text-base">{t(`section.${id}.text`)}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default AboutPage;
