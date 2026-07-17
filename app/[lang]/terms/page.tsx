"use client";

import PageHeading from "@/shared/ui/PageHeading";
import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("Terms");
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <main>
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
        image="/support.jpg"
      />
      <div className="px-4 lg:px-10 py-6 md:py-14 lg:py-20">
        <div className="mx-auto space-y-6">
          <p className="text-lg leading-relaxed text-brand-gray">
            {t("description")}
          </p>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-relaxed text-brand-gray"
            >
              {paragraph}
            </p>
          ))}
          <p className="text-base leading-relaxed text-brand-gray">
            {t("contact")} {t("email")}
          </p>
        </div>
      </div>
    </main>
  );
}
