"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { SlLocationPin } from "react-icons/sl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type AgendaDay, type AgendaSession } from "./agendaData";
import SessionDetails from "./SessionDetails";

function SessionLogos({
  label,
  logos,
}: {
  label: string;
  logos: StaticImageData[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
      <span className="text-base font-normal font-roboto text-brand-gray">
        {label}
      </span>
      <div className="flex flex-col gap-2">
        {logos.map((logo, i) => (
          <Image
            key={`${logo.src}-${i}`}
            src={logo}
            alt=""
            className="h-15 w-auto shrink-0 object-contain"
          />
        ))}
      </div>
    </div>
  );
}

function SessionTime({ session }: { session: AgendaSession }) {
  return (
    <>
      {session.startTime} <br />
      {session.endTime ? (
        <>
          {" - "}
          <span className="block lg:inline">{session.endTime}</span>
        </>
      ) : null}
    </>
  );
}

function SessionTitle({ session }: { session: AgendaSession }) {
  const Icon = session.icon;

  return (
    <div className="flex items-center gap-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#C3D1D9] text-brand-blue">
        <Icon className="size-6" />
      </span>
      <div className="flex flex-col gap-3 max-w-xl">
        <p className="text-lg font-semibold font-roboto">{session.title}</p>
        {session.room ? (
          <p className="flex items-center gap-1 text-brand-gray">
            <SlLocationPin className="size-4" />
            <span className="text-base font-normal font-roboto">
              {session.room}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function SessionSponsors({ session }: { session: AgendaSession }) {
  const t = useTranslations("Agenda");

  return (
    <>
      {session.sponsors ? (
        <SessionLogos label={t("sponsoredBy")} logos={session.sponsors} />
      ) : null}
    </>
  );
}

function DayTable({ day }: { day: AgendaDay }) {
  const t = useTranslations("Agenda");
  const [openSession, setOpenSession] = useState<number | null>(null);

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
        {day.sessions.map((session, i) => {
          const isOpen = openSession === i;
          if (session.details && isOpen) {
            return (
              <TableRow key={`${day.id}-${i}`} className="shadow-faq py-5">
                <TableCell colSpan={3} className="whitespace-normal py-5 px-7">
                  <div className="flex items-center gap-5">
                    <div className="w-60 shrink-0 text-lg font-semibold font-roboto pl-5">
                      <SessionTime session={session} />
                    </div>
                    <div className="flex-1 ">
                      <SessionTitle session={session} />
                    </div>
                    <div className="shrink-0">
                      <SessionSponsors session={session} />
                    </div>
                  </div>

                  <SessionDetails
                    details={session.details}
                    onHide={() => setOpenSession(null)}
                  />
                </TableCell>
              </TableRow>
            );
          }

          return (
            <TableRow
              key={`${day.id}-${i}`}
              className="bg-white shadow-faq hover:bg-brand-blue/5 py-5 "
            >
              <TableCell className="w-71 pl-12 align-middle text-lg font-semibold font-roboto whitespace-normal">
                <SessionTime session={session} />
              </TableCell>

              <TableCell className="whitespace-normal py-5">
                <SessionTitle session={session} />
              </TableCell>

              <TableCell className="py-5 pr-6 whitespace-normal">
                <div className="flex flex-col items-end gap-3">
                  <SessionSponsors session={session} />
                  {session.details ? (
                    <button
                      type="button"
                      onClick={() => setOpenSession(i)}
                      className="rounded bg-brand-blue px-6 py-2 text-base font-medium font-roboto whitespace-nowrap text-white transition hover:bg-brand-blue/90"
                    >
                      {t("view")}
                    </button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default DayTable;
