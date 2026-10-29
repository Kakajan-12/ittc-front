"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { SlLocationPin } from "react-icons/sl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { T_LOCALE } from "@/shared/lib/types";
import SessionIcon from "./SessionIcon";
import SessionDetails from "./SessionDetails";
import { T_AGENDA } from "./type";
import { localizedTitle } from "@/shared/helpers";
import { useQuery } from "@tanstack/react-query";
import { API_V2 } from "@/shared/api_v2";

type AgendaEntry = T_AGENDA.ENTRY.FIELDS;
type AgendaDay = T_AGENDA.DAY.FIELDS & { entries: AgendaEntry[] };

function DayTable({ day }: { readonly day: AgendaDay }) {
  const t = useTranslations("Agenda");
  const locale = useLocale() as T_LOCALE;
  const [openSession, setOpenSession] = useState<number | null>(null);
  const entries = [...day.entries].sort((a, b) => a.sortOrder - b.sortOrder);

  const roomQuery = useQuery({
    queryKey: ["get_agenda_rooms"],
    queryFn: async () =>
      API_V2.AGENDA.ROOM.LIST({
        offset: 0,
        limit: 999,
      }),
  });

  return (
    <Table className="border-separate border-spacing-y-3 px-1">
      <TableHeader className="sr-only">
        <TableRow>
          <TableHead>{t("columns.time")}</TableHead>
          <TableHead>{t("columns.session")}</TableHead>
          <TableHead>{t("columns.sponsors")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {entries.map((entry) => {
          const isOpen = openSession === entry.id;
          // prettier-ignore
          const room = roomQuery.data?.rows.find((i) => i.id === entry.agendaRoomId);
          // prettier-ignore
          const sortedSponsors = entry.sponsors.toSorted((a, b) => a.sortOrder - b.sortOrder);

          return (
            <Fragment key={entry.id}>
              <TableRow
                // className="block cursor-pointer bg-white shadow-faq hover:bg-brand-blue/5 md:table-row"
                className="mb-3 block cursor-pointer bg-white shadow-faq hover:bg-brand-blue/5 md:mb-0 md:table-row"
                onClick={() => setOpenSession(isOpen ? null : entry.id)}
              >
                <TableCell className="block w-full whitespace-normal px-4 py-3 align-middle font-roboto text-base font-semibold md:table-cell md:w-71 md:py-5 md:pl-12 md:text-lg">
                  <SessionTime entry={entry} />
                </TableCell>

                <TableCell className="block w-full whitespace-normal px-4 py-3 md:table-cell md:py-5">
                  <SessionTitle
                    title={localizedTitle({ ...entry, locale })}
                    sessionType={entry.type}
                    roomTitle={localizedTitle({ ...room, locale })}
                  />
                </TableCell>

                {sortedSponsors.length > 0 && (
                  <TableCell className="block w-full whitespace-normal px-4 py-3 md:table-cell md:py-5 md:pr-6">
                    <div className="flex flex-col items-start gap-3 md:items-end">
                      {sortedSponsors.map((sponsor) => {
                        if (!sponsor.logo) return null;

                        return (
                          <div
                            key={sponsor.id}
                            className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2 md:justify-end"
                          >
                            <span className="font-roboto text-base font-normal text-brand-gray">
                              {t("sponsoredBy")}
                            </span>

                            <Image
                              src={sponsor.logo}
                              alt={sponsor.name}
                              width={120}
                              height={60}
                              className="h-15 w-auto shrink-0 object-contain"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                )}
              </TableRow>

              {isOpen && (
                <TableRow className="block bg-white hover:bg-white md:table-row">
                  <TableCell
                    colSpan={3}
                    className="block w-full p-0 md:table-cell"
                  >
                    <div className="w-full px-4 py-5 md:px-12 md:py-6">
                      <SessionDetails
                        details={{
                          descriptions: {
                            descriptionEn: entry.descriptionEn,
                            descriptionRu: entry.descriptionRu,
                            descriptionTk: entry.descriptionTk,
                          },
                          speakers: entry.speakers,
                          moderatorId: entry.moderatorId,
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default DayTable;

function SessionTime({ entry }: { readonly entry: AgendaEntry }) {
  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

  return (
    <div className="flex flex-col">
      <span className="block lg:inline">{formatTime(entry.startAt)}</span>
      <span className="block lg:inline text-gray-400">
        {formatTime(entry.endAt)}
      </span>
    </div>
  );
}

function SessionTitle({
  title,
  sessionType,
  roomTitle,
}: {
  readonly title: string;
  readonly sessionType: T_AGENDA.ENTRY.TYPE;
  readonly roomTitle: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#C3D1D9] text-brand-blue">
        <SessionIcon sessionType={sessionType} />
      </span>
      <div className="flex max-w-xl flex-col gap-3">
        <p className="text-lg font-semibold font-roboto">{title}</p>

        {!!roomTitle && (
          <p className="flex items-center gap-1 text-brand-gray">
            <SlLocationPin className="size-4" />
            <span className="text-base font-normal font-roboto">
              {roomTitle}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

// [
//                         {
//                           id: 1,
//                           sortOrder: 2,
//                           name: "Organization",
//                           logo: "https://api.event.oguzforum.com/api/v1/media/4ac836f6-4f6f-4542-a204-3f0fa86f82df-2381558171.jpg",
//                           iconLink:
//                             "https://api.event.oguzforum.com/api/v1/media/4ac836f6-4f6f-4542-a204-3f0fa86f82df-2381558171.jpg",
//                           webLink:
//                             "https://api.event.oguzforum.com/api/v1/media/4ac836f6-4f6f-4542-a204-3f0fa86f82df-2381558171.jpg",
//                           organizationType: "GOVERNMENT",
//                         },

//                         {
//                           id: 2,
//                           sortOrder: 1,
//                           name: "Organization",
//                           logo: "https://api.event.oguzforum.com/api/v1/media/WhatsApp Image 2026-09-18 at 16.17.13 (2)-3296015701-8728583932.jpeg",
//                           iconLink:
//                             "https://api.event.oguzforum.com/api/v1/media/WhatsApp Image 2026-09-18 at 16.17.13 (2)-3296015701-8728583932.jpeg",
//                           webLink:
//                             "https://api.event.oguzforum.com/api/v1/media/WhatsApp Image 2026-09-18 at 16.17.13 (2)-3296015701-8728583932.jpeg",
//                           organizationType: "GOVERNMENT",
//                         },
//                       ]
