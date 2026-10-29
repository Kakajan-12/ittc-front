"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Scrollbar from "@/shared/ui/Scrollbar";
import SpeakerCard from "../Speakers/SpeakerCard";
import { T_AGENDA } from "./type";
import { localizedTitle } from "@/shared/helpers";
import { T_LOCALE } from "@/shared/lib/types";

// prettier-ignore
const CARD_WRAP = "w-full shrink-0 snap-start sm:w-[calc(50%-0.375rem)] md:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.5625rem)] xl:w-[calc(20%-0.6rem)]";

// prettier-ignore
const sortBySortOrder = <T extends { sortOrder: number }>(items: T[] | null | undefined) => [...(items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

// prettier-ignore
function SessionDetails({details }: { readonly details: {moderatorId:number | null, speakers: T_AGENDA.ENTRY.SPEAKER[];  descriptions: { descriptionEn?: string | null;  descriptionRu?: string | null; descriptionTk?: string | null }};}) {
  const t = useTranslations("Agenda");
  const locale = useLocale() as T_LOCALE;
  const trackSpeakersRef = useRef<HTMLDivElement>(null);
  const { speakers, descriptions, moderatorId } = details;

  // prettier-ignore
  const sortedSpeakers = sortBySortOrder(speakers).sort((a, b) => Number(b.id === moderatorId) - Number(a.id === moderatorId));
  const description = localizedTitle({ titleEn: descriptions.descriptionEn, titleRu: descriptions.descriptionRu, titleTk: descriptions.descriptionTk, locale});

  return (
    <div className="flex flex-col gap-8">

      {description ? (
  <p className="max-w-4xl whitespace-normal wrap-break-word text-base leading-6 font-roboto">
    {description}
  </p>
) : null}

      {speakers.length ? (
        <div className="flex flex-col gap-6">
          {/* prettier-ignore */}
          <SectionHeading title={t("speakers")} className="mb-0 text-lg lg:text-lg xl:text-lg"/>
          <div
            ref={trackSpeakersRef}
            className="flex gap-3 snap-x snap-mandatory overflow-x-auto scroll-smooth p-1 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >

            {sortedSpeakers.map((person) => {
              const fullName = `${person.firstName} ${person.lastName} ${person.patronymicName}`;

              return (
                <div key={person.id} className={CARD_WRAP}>
                  <SpeakerCard
                    id={`person-${person.id}`}
                    name={fullName}
                    description={""}
                    image={person.avatar ?? undefined}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>

          {/* prettier-ignore */}
          <Scrollbar targetRef={trackSpeakersRef} className="mx-auto mt-2 max-w-sm"/>
        </div>
      ) :  null}

    </div>
  );
}

export default SessionDetails;
