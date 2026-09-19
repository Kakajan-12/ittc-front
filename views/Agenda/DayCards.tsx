"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoIosPin } from "react-icons/io";

import type { AgendaDayModel } from "@/shared/content/queries";
import SessionIcon from "./SessionIcon";
import SessionDetails from "./SessionDetails";

function CardLogos({ label, logos }: { label: string; logos: string[] }) {
  return (
    <div className="mt-5 flex flex-col items-start gap-1">
      <span className="text-sm font-normal font-roboto text-brand-gray">
        {label}
      </span>
      <div className="flex gap-2">
        {logos.map((logo, i) => (
          <Image
            key={`${logo}-${i}`}
            src={logo}
            alt=""
            width={96}
            height={48}
            className="h-12 w-auto object-contain"
          />
        ))}
      </div>
    </div>
  );
}

function DayCards({ day }: { day: AgendaDayModel }) {
  const t = useTranslations("Agenda");
  const [openSession, setOpenSession] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-10 pt-6">
      {day.sessions.map((session, i) => {
        const isOpen = openSession === i;

        return (
          <div
            key={session.id}
            className="relative rounded bg-white px-4 pt-8.5 pb-4 shadow-faq"
          >
            <span className="absolute -top-6 left-5 flex size-12 items-center justify-center rounded-full border-2 border-[#C3D1D9] bg-white text-brand-blue">
              <SessionIcon icon={session.icon} className="size-6" />
            </span>

            <p className="text-lg font-semibold font-roboto">
              {session.startTime}
              {session.endTime ? ` - ${session.endTime}` : null}
            </p>

            <p className="mt-4 text-base font-semibold font-roboto">
              {session.title}
            </p>

            {session.room ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-brand-gray">
                <IoIosPin className="size-3" />
                {session.room}
              </p>
            ) : null}

            {session.sponsors.length ? (
              <CardLogos label={t("sponsoredBy")} logos={session.sponsors} />
            ) : null}

            {session.details && isOpen ? (
              <SessionDetails
                details={session.details}
                onHide={() => setOpenSession(null)}
              />
            ) : null}

            {session.details && !isOpen ? (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setOpenSession(i)}
                  className="rounded bg-brand-blue w-full py-2 text-base font-normal font-roboto text-white transition hover:bg-brand-blue/90"
                >
                  {t("view")}
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default DayCards;
