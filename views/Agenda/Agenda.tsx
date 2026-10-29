"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { IoCalendarOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { API_V2 } from "@/shared/api_v2";
import { localizedTitle } from "@/shared/helpers";
import { T_LOCALE } from "@/shared/lib/types";
import DayTable from "./DayTable";
import { Spin } from "antd";

function Agenda() {
  const t = useTranslations();
  const locale = useLocale() as T_LOCALE;
  const [currentDayId, setCurrentDayId] = useState<number>();

  const daysQuery = useQuery({
    queryKey: ["get_agenda_v2", "days"],
    queryFn: async () => API_V2.AGENDA.DAY.LIST({ offset: 0, limit: 99 }),
  });

  const entriesQuery = useQuery({
    queryKey: ["get_agenda_v2", "entries"],
    queryFn: async () => API_V2.AGENDA.ENTRY.LIST({ offset: 0, limit: 999 }),
  });

  const days = daysQuery.data?.rows ?? [];
  const entries = entriesQuery.data?.rows ?? [];

  useEffect(() => {
    if (!days.length) {
      setCurrentDayId(undefined);
      return;
    }

    setCurrentDayId((currentId) =>
      currentId !== undefined && days.some((day) => day.id === currentId)
        ? currentId
        : days[0].id,
    );
  }, [days]);

  const entriesByDay = useMemo(() => {
    const grouped = new Map<number, typeof entries>();

    for (const entry of entries) {
      const dayEntries = grouped.get(entry.agendaDayId) ?? [];
      dayEntries.push(entry);
      grouped.set(entry.agendaDayId, dayEntries);
    }

    for (const [dayId, dayEntries] of grouped) {
      grouped.set(
        dayId,
        [...dayEntries].sort((a, b) => a.sortOrder - b.sortOrder),
      );
    }

    return grouped;
  }, [entries]);

  const daysWithMetadata = useMemo(
    () =>
      days.map((day, index) => ({
        ...day,
        number: index + 1,
        date: new Date(day.startAt).toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
          timeZone: "UTC",
        }),
      })),
    [days, locale],
  );

  const formatDayDate = (date: string, locale: string) => {
    const parsedDate = new Date(date);
    const day = parsedDate.getUTCDate();
    const month = t(
      `month.${parsedDate.toLocaleString("en", { month: "long", timeZone: "UTC" }).toLowerCase()}`,
    );

    return locale === "en" ? `${month} ${day}` : `${day} ${month}`;
  };

  if (daysQuery.isPending || entriesQuery.isPending) {
    return (
      <section className="px-4 py-10 lg:px-10 lg:py-16 flex justify-center items-center ">
        <Spin />
      </section>
    );
  }

  if (daysQuery.isError || entriesQuery.isError) {
    return (
      <section className="px-4 py-10 lg:px-10 lg:py-16">
        <p className="text-center text-red-500">{t("Something went wrong")}</p>
      </section>
    );
  }

  if (!days.length) return null;

  return (
    <section className="px-4 py-10 lg:px-10 lg:py-16">
      <Tabs
        value={currentDayId === undefined ? undefined : String(currentDayId)}
        onValueChange={(value) => setCurrentDayId(Number(value))}
        className="gap-8"
      >
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-4 overflow-x-auto rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto lg:flex-nowrap">
          {daysWithMetadata.map((day) => {
            const date = new Date(day.startAt);
            const month = date
              .toLocaleString("en", {
                month: "long",
                timeZone: "UTC",
              })
              .toLowerCase();

            const dayNumber = date.getUTCDate();
            const monthName = t(`month.${month}`);
            const formattedDate =
              locale === "en"
                ? `${monthName} ${dayNumber}`
                : `${dayNumber} ${monthName}`;
            const title = localizedTitle({ ...day, locale });

            return (
              <TabsTrigger
                key={day.id}
                value={String(day.id)}
                className="group/tab flex h-auto shrink-0 flex-row items-center justify-start gap-3 rounded border border-brand-gray/15 bg-white p-3 text-left text-brand-gray shadow-none after:hidden hover:text-brand-gray data-active:border-brand-blue data-active:bg-brand-blue data-active:text-white data-active:shadow-none data-active:hover:text-white"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded border border-brand-blue/30 text-brand-blue group-data-active/tab:border-white/40 group-data-active/tab:bg-white/20 group-data-active/tab:text-white">
                  <IoCalendarOutline className="size-5" />
                </span>

                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="whitespace-nowrap font-roboto text-xs font-semibold text-brand-gray group-data-active/tab:text-white">
                    {formattedDate}
                  </span>

                  {title && (
                    <span className="whitespace-nowrap text-sm text-brand-gray group-data-active/tab:text-white">
                      {title}
                    </span>
                  )}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {daysWithMetadata.map((day) => {
          const dayEntries = entriesByDay.get(day.id) ?? [];

          return (
            <TabsContent key={day.id} value={String(day.id)} className="mt-0">
              <div className="block">
                <DayTable
                  day={{
                    ...day,
                    entries: dayEntries,
                  }}
                />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}

export default Agenda;
