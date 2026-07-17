"use client";

import PageHeading from "@/shared/ui/PageHeading";
import { useTranslations } from "next-intl";

export default function CookiePage() {
  const t = useTranslations("Cookie");

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
          <p className="text-base leading-relaxed text-brand-gray">
            {t("text")}
          </p>
        </div>
      </div>
    </main>
  );
}
