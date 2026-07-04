"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Carousel } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";
import SpeakerCard from "./SpeakerCard";

const speakers = Array.from({ length: 8 });

const description =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const SLIDES_TO_SHOW = 2;
const SLIDES_TO_SCROLL = 2;
const PAGE_COUNT = Math.ceil(speakers.length / SLIDES_TO_SCROLL);

function Speakers() {
  const t = useTranslations("Speakers");
  const carouselRef = useRef<CarouselRef>(null);
  const [current, setCurrent] = useState(0);

  const activePage = Math.floor(current / SLIDES_TO_SCROLL);

  return (
    <section className="pt-15 lg:pt-20">
      <div className="container mx-auto px-4 lg:px-10">
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
          {speakers.map((_, i) => (
            <SpeakerCard
              key={i}
              id={`speaker-${i}`}
              name="Full Name"
              description={description}
            />
          ))}
        </div>

        {/* mobile carousel */}
        <div className="mt-5 md:hidden">
          <Carousel
            ref={carouselRef}
            dots={false}
            slidesToShow={SLIDES_TO_SHOW}
            slidesToScroll={SLIDES_TO_SCROLL}
            infinite={false}
            afterChange={setCurrent}
          >
            {speakers.map((_, i) => (
              <div key={i} className="p-2">
                <SpeakerCard
                  id={`speaker-${i}`}
                  name="Full Name"
                  description={description}
                />
              </div>
            ))}
          </Carousel>

          {/* custom dots, outside the carousel */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: PAGE_COUNT }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activePage}
                onClick={() =>
                  carouselRef.current?.goTo(i * SLIDES_TO_SCROLL)
                }
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
