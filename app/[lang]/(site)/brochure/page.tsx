import React from "react";
import { getTranslations } from "next-intl/server";
import { FiDownload } from "react-icons/fi";

import PageHeading from "@/shared/ui/PageHeading";
import { toLocale } from "@/shared/content/localize";
import { getBrochure } from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string }> };

export default async function BrochurePage({ params }: PageProps) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const t = await getTranslations({ locale, namespace: "Brochure" });
  const brochure = await getBrochure(locale);

  return (
    <main>
      <PageHeading title={t("title")} crumbs={[{ label: t("title") }]} />

      <div className="px-4 py-15 lg:px-10 lg:py-20">
        {brochure ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
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
