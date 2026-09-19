import React from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";
import NewsCard from "./NewsCard";
import type { NewsCardModel } from "@/shared/content/queries";

function News({ news }: { news: NewsCardModel[] }) {
  const t = useTranslations("News");

  if (!news.length) return null;

  return (
    <section className="py-15 lg:py-20">
      <div className="px-4 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeading title={t("title")} />
          <Button text={t("more")} href="/news" className="hidden lg:flex" />
        </div>

        <div className="lg:mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {news.slice(0, 3).map((item) => (
            <NewsCard
              key={item.id}
              id={`news-${item.id}`}
              tag={item.tag}
              title={item.title}
              date={item.date}
              image={item.image}
              href={`/news/${item.slug}`}
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
