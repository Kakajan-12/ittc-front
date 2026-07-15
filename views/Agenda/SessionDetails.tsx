"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import {
  type SessionDetails as SessionDetailsData,
  type SessionPerson,
} from "./agendaData";
import SectionHeading from "@/shared/ui/SectionHeading";
import Scrollbar from "@/shared/ui/Scrollbar";
import SpeakerCard from "../Speakers/SpeakerCard";

const CARD_WRAP =
  "w-full shrink-0 snap-start sm:w-[calc(50%-0.375rem)] md:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.5625rem)] xl:w-[calc(20%-0.6rem)]";

function PersonCard({ person }: { person: SessionPerson }) {
  return (
    <SpeakerCard
      id={person.name}
      name={person.name}
      description={person.description}
      image={person.image}
      className="w-full"
    />
  );
}

function PeopleCarousel({
  title,
  people,
}: {
  title: string;
  people: SessionPerson[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title={title}
        className="mb-0 text-lg lg:text-lg xl:text-lg"
      />
      <div
        ref={trackRef}
        className="flex gap-3 snap-x snap-mandatory overflow-x-auto scroll-smooth p-1 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {people.map((person, i) => (
          <div key={`${person.name}-${i}`} className={CARD_WRAP}>
            <PersonCard person={person} />
          </div>
        ))}
      </div>

      <Scrollbar targetRef={trackRef} className="mx-auto mt-2 max-w-sm" />
    </div>
  );
}

function PeopleGroup({
  label,
  people,
}: {
  label: string;
  people: SessionPerson[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title={label}
        className="mb-0 gap-2 text-lg lg:text-lg xl:text-lg"
      />
      <div className="flex flex-col gap-3">
        {people.map((person, i) => (
          <PersonCard key={`${person.name}-${i}`} person={person} />
        ))}
      </div>
    </div>
  );
}

function SessionDetails({
  details,
  onHide,
}: {
  details: SessionDetailsData;
  onHide: () => void;
}) {
  const t = useTranslations("Agenda");
  const { description, keynote, moderators, speakers } = details;

  return (
    <div className="flex flex-col gap-8 pt-10">
      <p className="max-w-4xl text-base leading-6 font-roboto">{description}</p>

      {keynote?.length || moderators?.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {keynote?.length ? (
            <PeopleGroup label={t("keynote")} people={keynote} />
          ) : null}
          {moderators?.length ? (
            <PeopleGroup label={t("moderator")} people={moderators} />
          ) : null}
        </div>
      ) : null}

      {speakers?.length ? (
        <PeopleCarousel title={t("speakers")} people={speakers} />
      ) : null}

      <div className="flex justify-center lg:justify-end">
        <button
          type="button"
          onClick={onHide}
          className="rounded bg-brand-blue w-full lg:w-fit lg:px-6 py-2 text-base font-normal text-white transition hover:bg-brand-blue/90"
        >
          {t("hide")}
        </button>
      </div>
    </div>
  );
}

export default SessionDetails;
