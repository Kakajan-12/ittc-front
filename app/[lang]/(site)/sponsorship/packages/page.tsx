import { redirect } from "next/navigation";

type T_LOCALE = "en" | "ru" | "tk";

const PDF_BY_LOCALE: Record<T_LOCALE, string> = {
  en: "/documents/SponsorshipEn.pdf",
  ru: "/documents/SponsorshipRu.pdf",
  tk: "/documents/SponsorshipEn.pdf",
};

export default async function SponsorshipPage({
  params,
}: {
  params: Promise<{ locale: T_LOCALE }>;
}) {
  const { locale } = await params;

  redirect(PDF_BY_LOCALE[locale] ?? PDF_BY_LOCALE.ru);
}
