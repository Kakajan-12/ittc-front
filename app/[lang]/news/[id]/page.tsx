"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { newsData } from "@/views/News/newsData";
import NewsCard from "@/views/News/NewsCard";
import SectionHeading from "@/shared/ui/SectionHeading";
import { SkeletonImage } from "@/components/ui/Skeleton";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslations } from "next-intl";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("News");
  const article = newsData.find((n) => String(n.id) === String(id));

  const others = newsData
    .filter((n) => String(n.id) !== String(id))
    .slice(0, 3);

  if (!article) {
    return (
      <section className="bg-white px-4 lg:px-10 pt-28 pb-16 lg:pt-32">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-[#1268B3]"
        >
          <IoIosArrowBack className="size-4" />
          {t("back")}
        </Link>
        <p className="mt-8 text-brand-gray">{t("notResults")}</p>
      </section>
    );
  }

  return (
    <section className="mt-24 px-4 lg:px-10 relative">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-lg font-medium font-roboto text-[#424A4E] transition-colors hover:text-brand-blue"
      >
        <IoIosArrowBack className="size-4 text-[#424A4E]" />
        <span>{t("back")}</span>
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-5 lg:mt-10 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
        <div className="relative lg:sticky lg:top-30 top-0 aspect-video w-full overflow-hidden rounded">
          <SkeletonImage
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium font-roboto sm:text-3xl lg:text-4xl/7 xl:text-5xl/14">
            {article.title}
          </h2>

          <div className="flex items-center gap-11 text-sm">
            <span className="font-medium text-brand-blue-dark">
              {article.tag}
            </span>
            <span className="text-gray-400">{article.date}</span>
          </div>
          <p className="text-base font-normal text-[#424A4E]">
            {article.description}
          </p>
        </div>
      </div>

      {others.length > 0 && (
        <div className="flex flex-col lg:gap-6 py-16 lg:py-20">
          <SectionHeading title={t("others")} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((n) => (
              <NewsCard
                key={n.id}
                id={`news-${n.id}`}
                tag={n.tag}
                title={n.title}
                date={n.date}
                href={`/news/${n.id}`}
                more={t("readMore")}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
