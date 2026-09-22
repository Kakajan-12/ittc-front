import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FiDownload } from "react-icons/fi";

import PageHeading from "@/shared/ui/PageHeading";
import { toLocale } from "@/shared/content/localize";
import { getBrochure } from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string }> };

const LOCALE_OF: Record<string, string> = { EN: "en", RU: "ru", TK: "tk" };

export default async function BrochurePage({ params }: PageProps) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const t = await getTranslations({ locale, namespace: "Brochure" });
  const brochure = await getBrochure(locale);

  // Файл нашёлся, но на другом языке — стоит предупредить, а не молчать.
  const isFallback = brochure !== null && LOCALE_OF[brochure.locale] !== locale;

  return (
    <main>
      <PageHeading title={t("title")} crumbs={[{ label: t("title") }]} />

      <div className="px-4 py-15 lg:px-10 lg:py-20">
        {brochure ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            {brochure.cover ? (
              <Image
                src={brochure.cover}
                alt={brochure.title ?? t("title")}
                width={320}
                height={452}
                className="h-auto w-56 rounded shadow-lg lg:w-72"
              />
            ) : null}

            <h2 className="text-2xl font-bold font-roboto text-brand-dark-gray lg:text-3xl">
              {brochure.title ?? t("title")}
            </h2>

            {brochure.description ? (
              <p className="text-base leading-relaxed text-brand-gray">
                {brochure.description}
              </p>
            ) : null}

            {isFallback ? (
              <p className="text-sm text-brand-gray">{t("fallbackNote")}</p>
            ) : null}

            <a
              href={brochure.url}
              target="_blank"
              rel="noopener"
              download
              className="flex h-12 items-center justify-center gap-2 rounded bg-brand-blue px-8 text-base font-normal text-white transition hover:bg-brand-blue/85"
            >
              <FiDownload className="size-5 shrink-0" />
              {t("download")}
            </a>
          </div>
        ) : (
          <p className="text-center text-lg text-brand-gray">{t("empty")}</p>
        )}
      </div>
    </main>
  );
}
