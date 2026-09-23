import Home from "@/views/Home/Home";
import { toLocale } from "@/shared/content/localize";
import {
  getBrochure,
  getHeroBanner,
  getNews,
  getOrganizers,
  getPartners,
  getSectionTitles,
  getSpeakers,
  getSponsors,
  getStats,
} from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string }> };

/** Content comes from the CMS on the server, so it ships inside the HTML. */
export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const locale = toLocale(lang);

  const [
    hero,
    brochure,
    travelGuide,
    titles,
    organizers,
    stats,
    sponsors,
    speakers,
    news,
    partners,
  ] = await Promise.all([
    getHeroBanner(locale),
    getBrochure(locale),
    getBrochure(locale, "TRAVEL_GUIDE"),
    getSectionTitles(locale),
    getOrganizers(locale),
    getStats(locale),
    getSponsors(locale),
    getSpeakers(locale),
    getNews(locale, 3),
    getPartners(locale),
  ]);

  return (
    <Home
      hero={hero}
      brochureUrl={brochure?.url ?? null}
      travelGuideUrl={travelGuide?.url ?? null}
      resultsTitle={titles.results}
      sponsorsTitle={titles.sponsors}
      organizers={organizers}
      stats={stats}
      sponsors={sponsors}
      speakers={speakers}
      news={news}
      partners={partners}
    />
  );
}
