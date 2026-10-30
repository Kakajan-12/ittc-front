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
const HEADING_CLASS = "mb-0 text-lg lg:text-lg xl:text-lg";

// prettier-ignore
export const sortBySortOrder = <T extends { sortOrder: number }>(items: T[] | null | undefined) => [...(items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

// prettier-ignore
export const getSessionDescription = (entry: Pick<T_AGENDA.ENTRY.FIELDS, "descriptionEn" | "descriptionRu" | "descriptionTk">, locale: T_LOCALE) =>
  localizedTitle({ titleEn: entry.descriptionEn, titleRu: entry.descriptionRu, titleTk: entry.descriptionTk, locale });

function PersonCard({ person }: { readonly person: T_AGENDA.ENTRY.SPEAKER }) {
  // prettier-ignore
  const fullName = [person.firstName, person.lastName, person.patronymicName].filter(Boolean).join(" ");

  return (
    <div className={CARD_WRAP}>
      <SpeakerCard
        id={`person-${person.id}`}
        name={fullName}
        image={person.avatar ?? undefined}
        className="w-full"
      />
    </div>
  );
}

// prettier-ignore
function SessionDetails({ entry }: { readonly entry: T_AGENDA.ENTRY.FIELDS }) {
  const t = useTranslations("Agenda");
  const locale = useLocale() as T_LOCALE;
  const trackSpeakersRef = useRef<HTMLDivElement>(null);

  const description = getSessionDescription(entry, locale);
  const sortedSpeakers = sortBySortOrder(entry.speakers);
  const moderator = sortedSpeakers.find((person) => person.id === entry.moderatorId);
  const speakers = sortedSpeakers.filter((person) => person !== moderator);

  return (
    <div className="flex flex-col gap-8">
      {description ? (
        <p className="max-w-4xl whitespace-normal wrap-break-word text-base leading-6 font-roboto">
          {description}
        </p>
      ) : null}

      {moderator ? (
        <div className="flex flex-col gap-6">
          <SectionHeading title={t("moderator")} className={HEADING_CLASS} />
          <div className="flex p-1">
            <PersonCard person={moderator} />
          </div>
        </div>
      ) : null}

      {speakers.length ? (
        <div className="flex flex-col gap-6">
          <SectionHeading title={t("speakers")} className={HEADING_CLASS} />
          <div
            ref={trackSpeakersRef}
            className="flex gap-3 snap-x snap-mandatory overflow-x-auto scroll-smooth p-1 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {speakers.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>

          <Scrollbar targetRef={trackSpeakersRef} className="mx-auto mt-2 max-w-sm" />
        </div>
      ) : null}
    </div>
  );
}

export default SessionDetails;
