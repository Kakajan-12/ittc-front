"use client";

import { useTranslations } from "next-intl";
import { SkeletonImage } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { GoArrowUpRight } from "react-icons/go";
import { Link } from "@/i18n/navigation";
import About from "@/views/About/About";
import Results from "@/views/Home/Results";
import Sponsorship from "../Sponsorships/Sponsorship";
import Sponsors from "@/views/Sponsors/Sponsors";
import Speakers from "@/views/Speakers/Speakers";
import News from "@/views/News/News";
import Partners from "../Partners/Partners";
import Timer from "./Timer";
import type {
  HeroModel,
  NewsCardModel,
  PartnerModel,
  SpeakerModel,
  SponsorModel,
  StatModel,
} from "@/shared/content/queries";

/** Content is fetched by the page (a server component) and passed in. */
export type HomeProps = {
  hero: HeroModel;
  /** PDF брошюры на языке страницы; null — в CMS её ещё нет. */
  brochureUrl: string | null;
  /** PDF путеводителя на языке страницы; null — в CMS его ещё нет. */
  travelGuideUrl: string | null;
  resultsTitle: string | null;
  sponsorsTitle: string | null;
  organizers: PartnerModel[];
  stats: StatModel[];
  sponsors: SponsorModel[];
  speakers: SpeakerModel[];
  news: NewsCardModel[];
  partners: PartnerModel[];
};

function Home({
  hero,
  brochureUrl,
  travelGuideUrl,
  resultsTitle,
  sponsorsTitle,
  organizers,
  stats,
  sponsors,
  speakers,
  news,
  partners,
}: HomeProps) {
  const t = useTranslations("Hero");
  const actions: Array<{
    key: string;
    href: string;
    /** PDF из CMS — открывается в новой вкладке обычной ссылкой. */
    external?: boolean;
    /** Только пока шапка в мобильном виде: там кнопки регистрации нет. */
    mobileOnly?: boolean;
  }> = [
    { key: "register", href: "/register", mobileOnly: true },
    { key: "agenda", href: "/agenda" },
    // Файл приходит из CMS; пока его там нет — ведём на страницу брошюры,
    // она объяснит, что документ ещё не опубликован.
    brochureUrl
      ? { key: "brochure", href: brochureUrl, external: true }
      : { key: "brochure", href: "/brochure" },
    // Как и брошюра, приходит из CMS. Пока файла нет — кнопки тоже нет:
    // отдельной страницы у путеводителя не существует, вести некуда.
    ...(travelGuideUrl
      ? [{ key: "travel-guide", href: travelGuideUrl, external: true }]
      : []),
    { key: "faq", href: "/faq" },
  ];

  /** Nothing is set in the CMS yet — fall back to the photo in the build. */
  const bannerSrc = hero.image ?? "/main.jpg";

  return (
    <>
      <div className="relative">
        <section className="relative isolate flex items-center overflow-hidden text-white min-h-[90vh] lg:min-h-[95vh]">
          <SkeletonImage
            src={bannerSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-center"
            skeletonClassName="-z-10"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/55 to-black/25" />

          <div className="px-4 lg:px-10 py-24 lg:py-30">
            <div className="max-w-2xl lg:max-w-3xl 2xl:max-w-4xl">
              <h1 className="text-4xl font-bold font-roboto leading-tight sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>

              <p className="mt-1 flex flex-wrap items-center gap-1 lg:gap-3 text-base lg:text-lg text-white/90 font-roboto">
                <span>{hero.date}</span>
                <span className="text-white hidden lg:block">|</span>
                <span>{hero.location}</span>
              </p>

              <div className="mt-8 flex flex-wrap flex-col content-start gap-2 lg:gap-4 h-66">
                {actions.map((action) => {
                  const className = cn(
                    "group flex items-center justify-center gap-2 rounded border border-brand-blue w-50 px-4 py-2.5 text-base transition hover:border-brand-blue hover:bg-brand-blue/20",
                    action.mobileOnly && "nav:hidden",
                  );
                  const content = (
                    <>
                      {t(action.key)}
                      <GoArrowUpRight className="size-5 text-brand-blue shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  );

                  // PDF живёт на API, а не на сайте, поэтому обычная ссылка,
                  // а не Link: локаль к адресу приставлять не нужно.
                  return action.external ? (
                    <a
                      key={action.key}
                      href={action.href}
                      target="_blank"
                      rel="noopener"
                      className={className}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link key={action.key} href={action.href} className={className}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        <Timer
          eventsStart={hero.eventStartsAt ? new Date(hero.eventStartsAt) : null}
        />
      </div>
      <About organizers={organizers} />
      <Results stats={stats} title={resultsTitle} />
      <Sponsorship />
      <Sponsors sponsors={sponsors} title={sponsorsTitle} />
      <Speakers speakers={speakers} />
      <News news={news} />
      <Partners partners={partners} />
    </>
  );
}

export default Home;
