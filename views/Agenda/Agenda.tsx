"use client";

import { useTranslations } from "next-intl";
import { IoCalendarOutline } from "react-icons/io5";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { agendaData } from "./agendaData";
import DayCards from "./DayCards";
import DayTable from "./DayTable";

function Agenda() {
  const t = useTranslations("Agenda");

  return (
    <section className="px-4 py-10 lg:px-10 lg:py-16">
      <Tabs defaultValue="conference" className="gap-8">
        {/* phases */}
        <TabsList className="grid h-auto gap-4 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto grid-cols-3">
          {agendaData.map((phase) => (
            <TabsTrigger
              key={phase.id}
              value={phase.id}
              className="group/tab lg:w-76 xl:w-sm h-auto flex flex-col lg:flex-row items-start lg:items-center justify-start gap-2 lg:gap-4 rounded border border-brand-gray/15 bg-white p-3 lg:px-5 lg:py-4 text-left shadow-none after:hidden data-active:border-brand-blue data-active:bg-brand-blue data-active:text-white data-active:shadow-none"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded border border-brand-blue/30 text-brand-blue group-data-active/tab:border-white/40 group-data-active/tab:bg-white/20 group-data-active/tab:text-white">
                <IoCalendarOutline className="size-5" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm lg:text-lg font-semibold font-roboto whitespace-pre-wrap group-data-active/tab:text-white">
                  {t(`phases.${phase.id}`)}
                </span>
                <span className="text-sm lg:text-base font-medium font-roboto text-brand-blue group-data-active/tab:text-white/90">
                  {t("daysCount", { count: phase.days.length })}
                </span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* days + sessions */}
        {agendaData.map((phase) => (
          <TabsContent key={phase.id} value={phase.id}>
            <Tabs defaultValue={phase.days[0]?.id} className="gap-6">
              <TabsList
                variant="line"
                className="h-auto w-full grid grid-cols-3 xl:grid-cols-6 justify-start gap-x-2 lg:gap-x-8 rounded-none border-b border-brand-gray/15 p-0 group-data-horizontal/tabs:h-auto"
              >
                {phase.days.map((day) => (
                  <TabsTrigger
                    key={day.id}
                    value={day.id}
                    className="-mb-px h-auto max-w-56 w-full flex-none flex-col items-center gap-1 rounded-none border-b-[3px] border-transparent px-2 pb-4 after:hidden data-active:border-b-brand-blue data-active:text-brand-blue"
                  >
                    <span className="text-base lg:text-2xl font-semibold font-roboto tracking-wide uppercase">
                      {t("day", {
                        number: String(day.number).padStart(2, "0"),
                      })}
                    </span>
                    <span className="text-sm lg:text-lg font-normal font-roboto">
                      {day.date}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {phase.days.map((day) => (
                <TabsContent key={day.id} value={day.id}>
                  <div className="lg:hidden">
                    <DayCards day={day} />
                  </div>
                  <div className="hidden lg:block">
                    <DayTable day={day} />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

export default Agenda;
