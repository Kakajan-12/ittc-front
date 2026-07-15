"use client";
import React from "react";

import PageHeading from "@/shared/ui/PageHeading";
import NewsCard from "@/views/News/NewsCard";
import { FiSearch, FiX } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { newsData } from "@/views/News/newsData";

const PAGE_SIZE = 8;

export default function NewsPage() {
  const t = useTranslations("News");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return newsData;
    return newsData.filter((n) => n.title.toLowerCase().includes(q));
  }, [query, t]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <main>
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
        image="/news.webp"
      />
      <div className="px-4 lg:px-10 py-15 lg:py-20">
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

        {pageCount > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  type="button"
                  aria-label={`Page ${p}`}
                  aria-current={p === currentPage ? "page" : undefined}
                  onClick={() => setPage(p)}
                  className={`flex size-9 items-center justify-center rounded-sm border text-sm transition-colors ${
                    p === currentPage
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-[#ABB7C2] text-brand-gray hover:border-brand-blue"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
