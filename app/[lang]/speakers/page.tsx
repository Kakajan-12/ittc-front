"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import PageHeading from "@/shared/ui/PageHeading";
import SpeakerCard from "@/views/Speakers/SpeakerCard";
import { FiSearch, FiX } from "react-icons/fi";

type Speaker = { id: string; name: string; description: string };

const DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const SPEAKERS: Speaker[] = [
  "Aylar Myradowa",
  "John Anderson",
  "Maria Garcia",
  "Chen Wei",
  "Ahmed Hassan",
  "Sophie Martin",
  "David Johnson",
  "Elena Petrova",
  "Rustam Nazarov",
  "Yuki Tanaka",
  "Fatima Al-Sayed",
  "Michael Brown",
].map((name, i) => ({ id: `speaker-${i}`, name, description: DESCRIPTION }));

const PAGE_SIZE = 8;

function Speakers() {
  const t = useTranslations("Speakers");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SPEAKERS;
    return SPEAKERS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <main>
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
      />
      <div className="px-4 lg:px-10 py-15 lg:py-20">
        <label
          htmlFor="search"
          className="relative flex h-10 w-full items-center justify-between rounded-sm border border-[#ABB7C2] px-3 shadow-sm md:w-102 cursor-text"
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
            className="h-full min-h-0 min-w-0 items-center flex-1 bg-transparent py-0 outline-none transition-all placeholder:text-[#ABB7C2] focus:border-slate-400 [&::-webkit-search-cancel-button]:appearance-none"
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
              <FiSearch className="size-5 text-[#ABB7C2]" aria-hidden />
            </span>
          )}
        </label>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-10">
            {visible.map((s) => (
              <SpeakerCard
                key={s.id}
                id={s.id}
                name={s.name}
                description={s.description}
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

export default Speakers;
