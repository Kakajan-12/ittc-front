"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { SlLocationPin } from "react-icons/sl";

import type { T_LOCALE } from "@/shared/lib/types";
import SessionIcon from "./SessionIcon";
import SessionDetails, {
  getSessionDescription,
  sortBySortOrder,
} from "./SessionDetails";
import { T_AGENDA } from "./type";
import { localizedTitle } from "@/shared/helpers";
import { useQuery } from "@tanstack/react-query";
import { API_V2 } from "@/shared/api_v2";

type AgendaEntry = T_AGENDA.ENTRY.FIELDS;
type AgendaDay = T_AGENDA.DAY.FIELDS & { entries: AgendaEntry[] };

function DayTable({ day }: { readonly day: AgendaDay }) {
  const locale = useLocale() as T_LOCALE;
  const [openSession, setOpenSession] = useState<number | null>(null);
  const entries = sortBySortOrder(day.entries);

  const roomQuery = useQuery({
    queryKey: ["get_agenda_rooms"],
    queryFn: async () =>
      API_V2.AGENDA.ROOM.LIST({
        offset: 0,
        limit: 999,
      }),
  });

  return (
    <div className="flex flex-col gap-10 px-1 pt-6 md:gap-3 md:pt-0">
      {entries.map((entry) => {
        const isOpen = openSession === entry.id;
        // prettier-ignore
        const room = roomQuery.data?.rows.find((i) => i.id === entry.agendaRoomId);

        return (
          <SessionCard
            key={entry.id}
            entry={entry}
            title={localizedTitle({ ...entry, locale })}
            roomTitle={room ? localizedTitle({ ...room, locale }) : ""}
            hasDetails={
              !!getSessionDescription(entry, locale) ||
              entry.speakers.length > 0
            }
            isOpen={isOpen}
            onToggle={() => setOpenSession(isOpen ? null : entry.id)}
          />
        );
      })}
    </div>
  );
}

export default DayTable;

function SessionCard({
  entry,
  title,
  roomTitle,
  hasDetails,
  isOpen,
  onToggle,
}: {
  readonly entry: AgendaEntry;
  readonly title: string;
  readonly roomTitle: string;
  readonly hasDetails: boolean;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
}) {
  const t = useTranslations("Agenda");
  // prettier-ignore
  const sponsors = sortBySortOrder(entry.sponsors).filter((sponsor) => !!sponsor.logo);

  return (
    <article className="relative rounded bg-white px-4 pt-9 pb-4 shadow-faq md:px-12 md:py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
        <div className="font-roboto text-base font-semibold md:w-40 md:shrink-0 md:text-lg">
          <SessionTime entry={entry} />
        </div>

        <div className="flex flex-1 items-center gap-5">
          {/* На мобильных иконка «висит» над верхним краем карточки */}
          <span className="absolute -top-6 left-4 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[#C3D1D9] bg-white text-brand-blue md:static md:size-11">
            <SessionIcon sessionType={entry.type} />
          </span>

          <div className="flex max-w-xl flex-col gap-2 md:gap-3">
            <p className="font-roboto text-base font-semibold md:text-lg">
              {title}
            </p>

            {!!roomTitle && (
              <p className="flex items-center gap-1 text-brand-gray">
                <SlLocationPin className="size-4 shrink-0" />
                <span className="font-roboto text-sm font-normal md:text-base">
                  {roomTitle}
                </span>
              </p>
            )}
          </div>
        </div>

        {sponsors.length > 0 && (
          <div className="flex flex-col items-start gap-2 md:max-w-sm md:flex-row md:items-center md:justify-end md:gap-3">
            <span className="shrink-0 font-roboto text-sm font-normal text-brand-gray md:text-base">
              {t("sponsoredBy")}
            </span>

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              {sponsors.map((sponsor) => (
                <Image
                  key={sponsor.id}
                  src={sponsor.logo!}
                  alt={sponsor.name}
                  width={120}
                  height={60}
                  className="h-10 w-auto shrink-0 object-contain md:h-12"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {hasDetails && (
        <>
          {isOpen && (
            <div className="mt-6">
              <SessionDetails entry={entry} />
            </div>
          )}

          <div className="mt-4 flex md:justify-end">
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              className="w-full rounded bg-brand-blue px-6 py-2 font-roboto text-sm font-normal text-white transition hover:bg-brand-blue/90 md:w-auto"
            >
              {isOpen ? t("hide") : t("view")}
            </button>
          </div>
        </>
      )}
    </article>
  );
}

function SessionTime({ entry }: { readonly entry: AgendaEntry }) {
  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Ashgabat",
    });

  return (
    <div className="flex flex-col">
      <span className="block lg:inline">{formatTime(entry.startAt)}</span>
      <span className="block text-gray-400 lg:inline">
        {formatTime(entry.endAt)}
      </span>
    </div>
  );
}
