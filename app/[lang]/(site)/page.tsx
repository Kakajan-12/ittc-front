import Home from "@/views/Home/Home";
import { toLocale } from "@/shared/content/localize";
import {
  getNews,
  getPartners,
  getSpeakers,
  getSponsors,
  getStats,
} from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string }> };

/** Content comes from the CMS on the server, so it ships inside the HTML. */
export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const locale = toLocale(lang);

  const [stats, sponsors, speakers, news, partners] = await Promise.all([
    getStats(locale),
    getSponsors(locale),
    getSpeakers(locale),
    getNews(locale, 3),
    getPartners(locale),
  ]);

  return (
    <Home
      stats={stats}
      sponsors={sponsors}
      speakers={speakers}
      news={news}
      partners={partners}
    />
  );
}
