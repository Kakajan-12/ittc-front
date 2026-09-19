import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import NewsCard from "@/views/News/NewsCard";
import SectionHeading from "@/shared/ui/SectionHeading";
import { SkeletonImage } from "@/components/ui/Skeleton";
import { IoIosArrowBack } from "react-icons/io";
import { toLocale } from "@/shared/content/localize";
import { getNews, getNewsArticle } from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = await getNewsArticle(slug, toLocale(lang));

  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const t = await getTranslations({ locale, namespace: "News" });

  const article = await getNewsArticle(slug, locale);

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
        <p className="mt-8 text-brand-gray">{t("noResults", { query: "" })}</p>
      </section>
    );
  }

  const others = (await getNews(locale, 4))
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  return (
    <section className="mt-24 px-4 lg:px-10 relative">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-lg font-medium font-roboto text-brand-dark-gray transition-colors hover:text-brand-blue"
      >
        <IoIosArrowBack className="size-4 text-brand-dark-gray" />
        <span>{t("back")}</span>
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-5 lg:mt-10 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
        <div className="lg:sticky lg:top-30 top-0 self-start">
          <div className="relative aspect-video w-full overflow-hidden rounded">
            {article.image && (
              <SkeletonImage
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-medium font-roboto sm:text-3xl lg:text-4xl/7 xl:text-5xl/14">
            {article.title}
          </h1>

          <div className="flex items-center gap-11 text-sm">
            <span className="font-medium text-brand-blue-dark">
              {article.tag}
            </span>
            <span className="text-gray-400">{article.date}</span>
          </div>

          {/* Body is HTML written in the admin panel. */}
          <div
            className="prose-news text-base font-normal text-brand-dark-gray [&_a]:text-brand-blue [&_a]:underline [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>

      {others.length > 0 && (
        <div className="flex flex-col lg:gap-6 py-16 lg:py-20">
          <SectionHeading title={t("others")} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <NewsCard
                key={item.id}
                id={`news-${item.id}`}
                tag={item.tag}
                title={item.title}
                date={item.date}
                image={item.image}
                href={`/news/${item.slug}`}
                more={t("readMore")}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
