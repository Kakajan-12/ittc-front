import { getTranslations } from "next-intl/server";
import PageHeading from "@/shared/ui/PageHeading";
import Agenda from "@/views/Agenda/Agenda";
import { toLocale } from "@/shared/content/localize";

type PageProps = { params: Promise<{ lang: string }> };

export default async function AgendaPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const t = await getTranslations({ locale, namespace: "Agenda" });

  return (
    <main>
      <PageHeading
        title={t("title")}
        crumbs={[{ label: t("title") }]}
        image="/agenda.webp"
        objectPosition="top"
      />
      <Agenda />
    </main>
  );
}
