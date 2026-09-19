import NewsListView from "@/views/News/NewsListView";
import { toLocale } from "@/shared/content/localize";
import { getNews } from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string }> };

export default async function NewsPage({ params }: PageProps) {
  const { lang } = await params;
  const news = await getNews(toLocale(lang), 100);

  return <NewsListView news={news} />;
}
