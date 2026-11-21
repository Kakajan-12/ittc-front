"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import PageHeading from "@/shared/ui/PageHeading";
import SpeakerCard from "@/views/Speakers/SpeakerCard";
import type { SpeakerModel } from "@/shared/content/queries";

/**
 * Колонки сетки по брейкпоинтам Tailwind (md, lg, xl, 2xl) — те же, что в
 * классах сетки ниже. Страница вмещает целое число рядов, поэтому последний
 * ряд на странице всегда полный (кроме последней страницы списка).
 */
const COLUMNS: Array<[query: string, columns: number]> = [
  ["(min-width: 96rem)", 5],
  ["(min-width: 80rem)", 4],
  ["(min-width: 64rem)", 3],
  ["(min-width: 48rem)", 2],
];

/** Около 10–12 карточек: 5×2, 4×3, 3×4, 2×5, на телефоне 10 подряд. */
const PAGE_SIZE_BY_COLUMNS: Record<number, number> = { 1: 10, 2: 10, 3: 12, 4: 12, 5: 10 };

const PAGE_BUTTON =
  "flex size-9 items-center justify-center rounded-sm border border-[#ABB7C2] text-brand-gray transition-colors hover:border-brand-blue hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#ABB7C2] disabled:hover:text-brand-gray";

function subscribe(onChange: () => void) {
  const queries = COLUMNS.map(([query]) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () =>
    queries.forEach((query) => query.removeEventListener("change", onChange));
}

function currentColumns() {
  return COLUMNS.find(([query]) => window.matchMedia(query).matches)?.[1] ?? 1;
}

/** Сколько карточек на странице при текущей ширине; на сервере — для 5 колонок. */
function usePageSize() {
  const columns = useSyncExternalStore(subscribe, currentColumns, () => 5);
  return PAGE_SIZE_BY_COLUMNS[columns];
}

export default function SpeakersListView({
  speakers,
}: {
  speakers: SpeakerModel[];
}) {
  const t = useTranslations("Speakers");
  const tCommon = useTranslations("Common");
  const listTop = useRef<HTMLLabelElement>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = usePageSize();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return speakers;
    return speakers.filter(
      (speaker) =>
        speaker.name.toLowerCase().includes(q) ||
        speaker.description.toLowerCase().includes(q),
    );
  }, [query, speakers]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Новая страница карточек — к началу списка, иначе остаёмся внизу у
  // пагинации. Прокрутка — после отрисовки новой страницы: начатая раньше
  // плавная прокрутка обрывается, когда React меняет карточки.
  const scrollPending = useRef(false);
  const goTo = (p: number) => {
    scrollPending.current = true;
    setPage(p);
  };
  useEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  return (
    <main>
      <PageHeading
        title={t("title")}
        crumbs={[{ label: t("title") }]}
        image="/speakers.jpg"
        objectPosition="top"
      />
      <div className="px-4 lg:px-10 py-15 lg:py-20">
        <label
          ref={listTop}
          htmlFor="search"
          className="scroll-mt-32 relative flex h-10 w-full items-center justify-between rounded-sm border border-[#797979] px-3 shadow-sm transition-colors focus-within:border-brand-blue md:w-1/2 cursor-text"
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
            {visible.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                id={`speaker-${speaker.id}`}
                name={speaker.name}
                description={speaker.description}
                image={speaker.image ?? undefined}
                href={`/speakers/${speaker.slug}`}
              />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-brand-gray">
            {t("noResults", { query: query.trim() })}
          </p>
        )}

        {pageCount > 1 && (
          <nav
            aria-label={t("title")}
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              aria-label={tCommon("previousPage")}
              disabled={currentPage === 1}
              onClick={() => goTo(currentPage - 1)}
              className={PAGE_BUTTON}
            >
              <FiChevronLeft size={18} aria-hidden />
            </button>
            {Array.from({ length: pageCount }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  type="button"
                  aria-label={tCommon("page", { number: p })}
                  aria-current={p === currentPage ? "page" : undefined}
                  onClick={() => goTo(p)}
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
            <button
              type="button"
              aria-label={tCommon("nextPage")}
              disabled={currentPage === pageCount}
              onClick={() => goTo(currentPage + 1)}
              className={PAGE_BUTTON}
            >
              <FiChevronRight size={18} aria-hidden />
            </button>
          </nav>
        )}
      </div>
    </main>
  );
}
