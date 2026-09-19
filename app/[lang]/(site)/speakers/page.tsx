import SpeakersListView from "@/views/Speakers/SpeakersListView";
import { toLocale } from "@/shared/content/localize";
import { getSpeakers } from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string }> };

export default async function SpeakersPage({ params }: PageProps) {
  const { lang } = await params;
  const speakers = await getSpeakers(toLocale(lang));

  return <SpeakersListView speakers={speakers} />;
}
