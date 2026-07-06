"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";
import SpeakerCard from "./SpeakerCard";
import speaker1 from "@/public/speakers/1.png";
import speaker2 from "@/public/speakers/2.png";
import speaker3 from "@/public/speakers/3.png";
import speaker4 from "@/public/speakers/4.png";
import speaker5 from "@/public/speakers/5.png";
import speaker6 from "@/public/speakers/6.png";
import speaker7 from "@/public/speakers/7.webp";
import speaker8 from "@/public/speakers/8.png";

const speakers = [
  {
    id: 1,
    image: speaker1,
  },
  {
    id: 2,
    image: speaker2,
  },
  {
    id: 3,
    image: speaker3,
  },
  {
    id: 4,
    image: speaker4,
  },
  {
    id: 5,
    image: speaker5,
  },
  {
    id: 6,
    image: speaker6,
  },
  {
    id: 7,
    image: speaker7,
  },
  {
    id: 8,
    image: speaker8,
  },
];
const SLIDES_TO_SCROLL = 2;
const PAGE_COUNT = Math.ceil(speakers.length / SLIDES_TO_SCROLL);

function Speakers() {
  const t = useTranslations("Speakers");
  const trackRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  const goToPage = (page: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: page * track.clientWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActivePage(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <section className="pt-15 lg:pt-20">
      <div className="px-4 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeading title={t("title")} />
          <Button
            text={t("more")}
            href="/speakers"
            className="hidden lg:flex"
          />
        </div>

        {/* desktop / tablet grid */}
        <div className="mt-8 hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
          {speakers.map((speaker, i) => (
            <SpeakerCard
              key={i}
              id={`speaker-${speaker.id}`}
              name={t(`speakers.${speaker.id}.name`)}
              description={t(`speakers.${speaker.id}.description`)}
              image={speaker.image}
            />
          ))}
        </div>

        {/* mobile carousel */}
        <div className="lg:mt-5 md:hidden">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {speakers.map((speaker, i) => (
              <div
                key={i}
                className="w-1/2 shrink-0 snap-start pl-0.5 pr-2 py-1 "
              >
                <SpeakerCard
                  id={`speaker-${speaker.id}`}
                  name={t(`speakers.${speaker.id}.name`)}
                  description={t(`speakers.${speaker.id}.description`)}
                  image={speaker.image}
                />
              </div>
            ))}
          </div>

          {/* custom dots */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: PAGE_COUNT }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activePage}
                onClick={() => goToPage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activePage
                    ? "w-6 bg-brand-blue-dark"
                    : "w-4 bg-brand-gray/40"
                }`}
              />
            ))}
          </div>
        </div>

        <Button
          text={t("more")}
          href="/speakers"
          className="mt-8 flex lg:hidden"
        />
      </div>
    </section>
  );
}

export default Speakers;
