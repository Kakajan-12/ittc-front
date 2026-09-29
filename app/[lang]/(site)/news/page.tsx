import { redirect } from "@/i18n/navigation";
import NewsListView from "@/views/News/NewsListView";
import { toLocale } from "@/shared/content/localize";
import { getNewsPage } from "@/shared/content/queries";

type PageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/** `?page=2&q=…` → номер страницы (с 1) и поисковый запрос. */
function readParams(raw: { [key: string]: string | string[] | undefined }) {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const page = Number.parseInt(first(raw.page) ?? "", 10);

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    query: (first(raw.q) ?? "").slice(0, 100),
  };
}

export default async function NewsPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const { page, query } = readParams(await searchParams);
  const locale = toLocale(lang);
  const result = await getNewsPage(locale, page, query);

  // Страницы за пределами списка (например, после удаления новостей) —
  // на последнюю существующую, а не пустой экран.
  if (page > result.pageCount && result.total > 0) {
    redirect({
      href: {
        pathname: "/news",
        query: {
          ...(result.pageCount > 1 ? { page: result.pageCount } : {}),
          ...(query ? { q: query } : {}),
        },
      },
      locale,
    });
  }

  return (
    <NewsListView
      news={result.items}
      page={page}
      pageCount={result.pageCount}
      query={query}
    />
  );
}
