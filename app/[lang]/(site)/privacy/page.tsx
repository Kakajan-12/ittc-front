import { getTranslations } from "next-intl/server";
import CmsPageView from "@/views/Pages/CmsPageView";
import { toLocale } from "@/shared/content/localize";
import { getPage } from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string }> };

export default async function PrivacyPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const t = await getTranslations({ locale, namespace: "Privacy" });

  return (
    <CmsPageView
      page={await getPage("privacy", locale)}
      fallbackTitle={t("title")}
    />
  );
}
