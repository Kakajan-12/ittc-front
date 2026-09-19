import FaqView from "@/views/FAQ/FaqView";
import { toLocale } from "@/shared/content/localize";
import { getFaq } from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string }> };

export default async function FaqPage({ params }: PageProps) {
  const { lang } = await params;
  const items = await getFaq(toLocale(lang));

  return <FaqView items={items} />;
}
