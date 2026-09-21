import React from "react";
import PageHeading from "@/shared/ui/PageHeading";
import { useTranslations } from "next-intl";

export default function FlightPage() {
  const t = useTranslations("Flight");
  const tCommon = useTranslations("Common");
  return (
    <main>
      <PageHeading
        title={t("title")}
        crumbs={[{ label: t("title") }]}
      />
      <div className="mt-8 flex items-center justify-center min-h-[400px]">
        <div className="text-2xl font-bold">{tCommon("comingSoon")}</div>
      </div>
    </main>
  );
}
