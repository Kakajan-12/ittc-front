"use client";
import React, { useRef } from "react";

import PageHeading from "@/shared/ui/PageHeading";
import NewsCard from "@/views/News/NewsCard";
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { newsData } from "@/views/News/newsData";

const PER_PAGE = 8;

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

export default function NewsPage() {
  const t = useTranslations("News");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return newsData;
    return newsData.filter((n) => n.title.toLowerCase().includes(q));
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );
  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetPage = () => setPage(1);

  return (
    <main>
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
        image="/news.webp"
      />
      <div ref={topRef} className="px-4 lg:px-10 py-15 lg:py-20 scroll-mt-24">
        <label
          htmlFor="search"
          className="relative flex h-10 w-full items-center justify-between rounded-sm border border-[#797979] px-3 shadow-sm transition-colors focus-within:border-brand-blue md:w-1/2 cursor-text"
        >
          <input
            id="search"
            type="search"
            placeholder={t("placeholder")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="h-full min-h-0 min-w-0 flex-1 bg-transparent py-0 outline-none placeholder:text-[#ABB7C2] [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query.trim() ? (
            <button
              type="button"
              aria-label={t("clear")}
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
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
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-10">
            {visible.map((n) => (
              <NewsCard
                key={n.id}
                id={`news-${n.id}`}
                tag={n.tag}
                title={n.title}
                date={n.date}
                href={`/news/${n.id}`}
                more="Read more"
              />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-brand-gray">
            {t("noResults", { query: query.trim() })}
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="flex size-9 items-center justify-center rounded-sm border border-[#ABB7C2] text-brand-gray transition-colors hover:border-brand-blue hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft size={18} />
            </button>

            {getPageList(currentPage, totalPages).map((p, i) =>
              p === "dots" ? (
                <span
                  key={`dots-${i}`}
                  className="flex size-9 items-center justify-center text-[#ABB7C2]"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  aria-label={`Page ${p}`}
                  aria-current={p === currentPage ? "page" : undefined}
                  onClick={() => goTo(p)}
                  className={`size-9 rounded-sm border text-sm font-medium transition-colors ${
                    p === currentPage
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-[#ABB7C2] text-brand-gray hover:border-brand-blue hover:text-brand-blue"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="flex size-9 items-center justify-center rounded-sm border border-[#ABB7C2] text-brand-gray transition-colors hover:border-brand-blue hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
