import { getTranslations } from "next-intl/server";
import CmsPageView from "@/views/Pages/CmsPageView";
import { toLocale } from "@/shared/content/localize";
import { getPage } from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string }> };

export default async function TermsPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const t = await getTranslations({ locale, namespace: "Terms" });

  return (
    <CmsPageView
      page={await getPage("terms", locale)}
      fallbackTitle={t("title")}
    />
  );
}
