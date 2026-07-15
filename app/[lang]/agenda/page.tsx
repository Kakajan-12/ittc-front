import React from "react";
import PageHeading from "@/shared/ui/PageHeading";
import { useTranslations } from "next-intl";
import Agenda from "@/views/Agenda/Agenda";

export default function AgendaPage() {
  const t = useTranslations("Agenda");
  return (
    <main>
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
        image="/agenda.webp"
        objectPosition="top"
      />
      <Agenda />
    </main>
  );
}
