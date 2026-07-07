"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";
import SpeakerCard from "./SpeakerCard";
import { speakersData } from "./speakersData";

function useSlidesPerView(onResize: () => void) {
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setSlidesPerView(mq.matches ? 2 : 1);
    update();
    const handleChange = () => {
      update();
      onResize();
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [onResize]);

  return slidesPerView;
}

function Speakers() {
  const t = useTranslations("Speakers");
  const trackRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  const resetCarousel = useCallback(() => {
    trackRef.current?.scrollTo({ left: 0 });
    setActivePage(0);
  }, []);

  const slidesPerView = useSlidesPerView(resetCarousel);
  const pageCount = Math.ceil(speakersData.length / slidesPerView);
  const currentPage = Math.min(activePage, pageCount - 1);

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
        <div className="mt-8 hidden gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4">
          {speakersData.map((speaker, i) => (
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
        <div className="lg:mt-5 lg:hidden">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {speakersData.map((speaker, i) => (
              <div
                key={i}
                className="w-full sm:w-1/2 shrink-0 snap-start pl-0.5 pr-2 py-1 "
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
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === currentPage}
                onClick={() => goToPage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentPage
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
