"use client";

import { useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

import SpeakerCard from "@/views/Speakers/SpeakerCard";
import { speakersData } from "@/views/Speakers/speakersData";
import Scrollbar from "@/shared/ui/Scrollbar";
import { cn } from "@/lib/utils";

export type Person = {
  id: number | string;
  name: string;
  description: string;
  image?: string | StaticImageData;
};

export type PeopleGroup = {
  key: string;
  title: string;
  people: Person[];
};

/* -------------------------------------------------------------------------- */
/*  Group heading (small, short gradient underline — matches the mockup)       */
/* -------------------------------------------------------------------------- */

function GroupHeading({ title }: { title: string }) {
  return (
    <h3 className="w-fit font-roboto">
      <span className="text-base font-semibold text-black lg:text-lg">
        {title}
      </span>
      <span className="mt-2 block h-0.5 w-10 bg-linear-to-r from-brand-blue to-[#B9E7FF]" />
    </h3>
  );
}

/* -------------------------------------------------------------------------- */
/*  A single group: heading + horizontally scrolling row of cards              */
/* -------------------------------------------------------------------------- */

function PeopleRow({
  group,
  showScrollbar = false,
  className,
}: {
  group: PeopleGroup;
  showScrollbar?: boolean;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("flex flex-col", className)}>
      <GroupHeading title={group.title} />

      <div
        ref={trackRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {group.people.map((person) => (
          <SpeakerCard
            key={`${group.key}-${person.id}`}
            id={`${group.key}-${person.id}`}
            name={person.name}
            description={person.description}
            image={person.image}
            className="w-64 shrink-0 snap-start sm:w-56 lg:w-52"
          />
        ))}
      </div>

      {showScrollbar && (
        <Scrollbar targetRef={trackRef} className="mx-auto mt-6 max-w-sm" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Full showcase: featured groups side-by-side, main group full-width          */
/* -------------------------------------------------------------------------- */

function PeopleShowcase({
  featured,
  main,
  actionLabel = "Hide",
}: {
  featured: PeopleGroup[];
  main: PeopleGroup;
  actionLabel?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="px-4 py-15 lg:px-10 lg:py-20">
      {!collapsed && (
        <>
          {featured.length > 0 && (
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
              {featured.map((group) => (
                <PeopleRow key={group.key} group={group} />
              ))}
            </div>
          )}

          <div className="mt-12">
            <PeopleRow group={main} showScrollbar />
          </div>
        </>
      )}

      <div className="mt-10 flex lg:justify-end">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="w-full rounded bg-brand-blue px-8 py-2.5 text-base font-medium font-roboto text-white transition hover:bg-brand-blue/90 lg:w-auto"
        >
          {collapsed ? "Show" : actionLabel}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Wiring to the existing speakers dataset + translations.                     */
/*  NOTE: keynote/moderator grouping is placeholder until real role data        */
/*  exists — swap `featured`/`main` for real groups when available.             */
/* -------------------------------------------------------------------------- */

export function SpeakersShowcase() {
  const t = useTranslations("Speakers");

  const toPerson = (s: (typeof speakersData)[number]): Person => ({
    id: s.id,
    name: t(`speakers.${s.id}.name`),
    description: t(`speakers.${s.id}.description`),
    image: s.image,
  });

  const featured: PeopleGroup[] = [
    { key: "keynote", title: "Keynote", people: [toPerson(speakersData[0])] },
    {
      key: "moderator",
      title: "Moderator",
      people: [toPerson(speakersData[1])],
    },
  ];

  const main: PeopleGroup = {
    key: "speakers",
    title: t("title"),
    people: speakersData.map(toPerson),
  };

  return <PeopleShowcase featured={featured} main={main} />;
}

export default PeopleShowcase;
