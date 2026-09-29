"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import { Link, useRouter } from "@/i18n/navigation";
import PageHeading from "@/shared/ui/PageHeading";
import NewsCard from "@/views/News/NewsCard";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";
import type { NewsCardModel } from "@/shared/content/queries";

function getPageList(current: number, total: number): (number | "dots")[] {
  if (total <= 4) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  const pages: (number | "dots")[] = [1];
  if (left > 2) pages.push("dots");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("dots");
  pages.push(total);
  return pages;
}

const PAGE_BUTTON =
  "flex size-9 items-center justify-center rounded-sm border border-[#ABB7C2] text-brand-gray transition-colors hover:border-brand-blue hover:text-brand-blue";

/**
 * Список новостей. Страницу и поиск считает API: сюда приходят только
 * новости текущей страницы. Номер страницы и запрос живут в адресе
 * (`/news?page=2&q=…`), поэтому страницу можно открыть по ссылке, а кнопки
 * пагинации — обычные ссылки.
 */
export default function NewsListView({
  news,
  page,
  pageCount,
  query,
}: {
  news: NewsCardModel[];
  page: number;
  pageCount: number;
  query: string;
}) {
  const t = useTranslations("News");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [input, setInput] = useState(query);
  const debounced = useDebouncedValue(input, 400);

  // Запрос уходит, когда пользователь перестал печатать; новый поиск
  // всегда начинается с первой страницы.
  useEffect(() => {
    const next = debounced.trim();
    if (next === query.trim()) return;

    startTransition(() => {
      router.replace(
        { pathname: "/news", query: next ? { q: next } : {} },
        { scroll: false },
      );
    });
  }, [debounced, query, router]);

  const hrefFor = (p: number) => ({
    pathname: "/news" as const,
    query: { ...(p > 1 ? { page: p } : {}), ...(query ? { q: query } : {}) },
  });

  return (
    <main>
      <PageHeading
        title={t("title")}
        crumbs={[{ label: t("title") }]}
        image="/news.webp"
      />
      <div className="px-4 lg:px-10 py-15 lg:py-20 scroll-mt-24">
        <label
          htmlFor="search"
          className="relative flex h-10 w-full items-center justify-between rounded-sm border border-[#797979] px-3 shadow-sm transition-colors focus-within:border-brand-blue md:w-1/2 cursor-text"
        >
          <input
            id="search"
            type="search"
            placeholder={t("placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-full min-h-0 min-w-0 flex-1 bg-transparent py-0 outline-none placeholder:text-[#ABB7C2] [&::-webkit-search-cancel-button]:appearance-none"
          />
          {input.trim() ? (
            <button
              type="button"
              aria-label={t("clear")}
              onClick={() => setInput("")}
              className="flex shrink-0 items-center text-brand-blue transition-colors hover:text-brand-blue-dark"
            >
              <FiX className="size-5" aria-hidden />
            </button>
          ) : (
            <span className="flex shrink-0 items-center">
              <FiSearch className="size-5 text-[#797979]" aria-hidden />
            </span>
          )}
        </label>

        <div
          aria-busy={isPending}
          className={`transition-opacity ${isPending ? "opacity-50" : ""}`}
        >
          {news.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-10">
              {news.map((item) => (
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
          ) : (
            <p className="mt-10 text-brand-gray">
              {t("noResults", { query })}
            </p>
          )}
        </div>

        {pageCount > 1 && (
          <nav
            aria-label={t("title")}
            className="mt-10 flex items-center justify-center gap-2"
          >
            {page > 1 ? (
              <Link href={hrefFor(page - 1)} aria-label={tCommon("previousPage")} className={PAGE_BUTTON}>
                <FiChevronLeft size={18} />
              </Link>
            ) : (
              <span aria-hidden className={`${PAGE_BUTTON} cursor-not-allowed opacity-40`}>
                <FiChevronLeft size={18} />
              </span>
            )}

            {getPageList(page, pageCount).map((p, i) =>
              p === "dots" ? (
                <span
                  key={`dots-${i}`}
                  className="flex size-9 items-center justify-center text-[#ABB7C2]"
                >
                  …
                </span>
              ) : (
                <Link
                  key={p}
                  href={hrefFor(p)}
                  aria-label={tCommon("page", { number: p })}
                  aria-current={p === page ? "page" : undefined}
                  className={`flex size-9 items-center justify-center rounded-sm border text-sm font-medium transition-colors ${
                    p === page
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-[#ABB7C2] text-brand-gray hover:border-brand-blue hover:text-brand-blue"
                  }`}
                >
                  {p}
                </Link>
              ),
            )}

            {page < pageCount ? (
              <Link href={hrefFor(page + 1)} aria-label={tCommon("nextPage")} className={PAGE_BUTTON}>
                <FiChevronRight size={18} />
              </Link>
            ) : (
              <span aria-hidden className={`${PAGE_BUTTON} cursor-not-allowed opacity-40`}>
                <FiChevronRight size={18} />
              </span>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
