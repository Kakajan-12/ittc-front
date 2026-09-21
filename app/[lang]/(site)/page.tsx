import Home from "@/views/Home/Home";
import { toLocale } from "@/shared/content/localize";
import {
  getHeroBanner,
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

  const [hero, stats, sponsors, speakers, news, partners] = await Promise.all([
    getHeroBanner(locale),
    getStats(locale),
    getSponsors(locale),
    getSpeakers(locale),
    getNews(locale, 3),
    getPartners(locale),
  ]);

  return (
    <Home
      hero={hero}
      stats={stats}
      sponsors={sponsors}
      speakers={speakers}
      news={news}
      partners={partners}
    />
  );
}
