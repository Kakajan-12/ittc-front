import React from "react";
import PageHeading from "@/shared/ui/PageHeading";
import { useTranslations } from "next-intl";

export default function NewsPage() {
  const t = useTranslations("News");
  return (
    <main>
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
      />
      <div className="mt-8 flex items-center justify-center min-h-[400px]">
        <div className="text-2xl font-bold">Coming soon!</div>
      </div>
    </main>
  );
}
