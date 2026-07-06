import React from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";
import NewsCard from "./NewsCard";

const news = Array.from({ length: 3 });

function News() {
  const t = useTranslations("News");

  return (
    <section className="py-15 lg:py-20">
      <div className="px-4 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeading title={t("title")} />
          <Button text={t("more")} href="/news" className="hidden lg:flex" />
        </div>

        <div className="lg:mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((_, i) => (
            <NewsCard
              key={i}
              id={`news-${i}`}
              tag={t("tag")}
              title={t("sampleTitle")}
              date={t("sampleDate")}
              href="/news"
              more={t("details")}
            />
          ))}
        </div>
        <Button text={t("more")} href="/news" className="flex lg:hidden" />
      </div>
    </section>
  );
}

export default News;
