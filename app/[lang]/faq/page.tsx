"use client";
import { useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import PageHeading from "@/shared/ui/PageHeading";
import { useTranslations } from "next-intl";
import { faqData } from "@/views/FAQ/faqData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const t = useTranslations("Faq");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqData;
    return faqData.filter((item) => {
      const question = t(`items.${item.id}.question`).toLowerCase();
      const answer = t(`items.${item.id}.answer`).toLowerCase();
      return question.includes(q) || answer.includes(q);
    });
  }, [query, t]);

  return (
    <>
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
        image="/faq.jpg"
        objectPosition="top"
      />

      <section className="text-brand-gray flex flex-col items-center justify-center">
        <div className="py-6 md:py-14 lg:py-20 w-full">
          <div className="px-4 lg:px-10 mx-auto w-full md:w-1/2">
            {/* Search */}
            <label
              htmlFor="search"
              className="relative flex h-10 w-full items-center justify-between rounded border border-[#797979] px-3 shadow-sm transition-colors focus-within:border-brand-blue cursor-text"
            >
              <input
                id="search"
                type="search"
                placeholder={t("placeholder")}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  //   setPage(1);
                }}
                className="h-full min-h-0 min-w-0 flex-1 bg-transparent py-0 outline-none placeholder:text-[#ABB7C2] [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query.trim() ? (
                <button
                  type="button"
                  aria-label={t("clear")}
                  onClick={() => {
                    setQuery("");
                    // setPage(1);
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

            {filtered.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                className="space-y-3 lg:space-y-4 mx-auto mt-10"
              >
                {filtered.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={`faq-${item.id}`}
                    className="overflow-hidden rounded shadow-faq w-full p-4 lg:p-8"
                  >
                    <AccordionTrigger className="text-base md:text-lg font-roboto font-semibold [&>svg]:size-6 [&>svg]:text-black">
                      {t(`items.${item.id}.question`)}
                    </AccordionTrigger>
                    <AccordionContent className="text-base font-normal leading-relaxed text-brand-gray">
                      {t(`items.${item.id}.answer`)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-brand-gray mt-8">
                {t("noResults", { query: query.trim() })}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
