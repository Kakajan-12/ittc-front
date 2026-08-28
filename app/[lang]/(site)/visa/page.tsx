import React from "react";
import PageHeading from "@/shared/ui/PageHeading";
import { useTranslations } from "next-intl";
import VisaForm from "@/views/Visa/VisaForm";

export default function VisaPage() {
  const t = useTranslations("Visa");
  return (
    <main>
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
      />
      <VisaForm />
    </main>
  );
}
