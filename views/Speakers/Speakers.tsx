import React from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";
import SpeakerCard from "./SpeakerCard";

const speakers = Array.from({ length: 8 });

function Speakers() {
  const t = useTranslations("Speakers");

  return (
    <section className="py-15 lg:py-20">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeading title={t("title")} />
          <Button
            text={t("more")}
            href="/speakers"
            className="hidden lg:block"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((_, i) => (
            <SpeakerCard
              key={i}
              id={`speaker-${i}`}
              name="Full Name"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
          ))}
        </div>
        <Button text={t("more")} href="/speakers" className="block lg:hidden" />
      </div>
    </section>
  );
}

export default Speakers;
