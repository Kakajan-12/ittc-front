"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

interface DateProps {
  eventsStart: Date | null;
}

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

const getServerSnapshot = () => null;

function Timer({ eventsStart }: DateProps) {
  const t = useTranslations("Timer");

  const getSecondsLeft = () => {
    if (!eventsStart) return 0;

    return Math.max(0, Math.floor((eventsStart.getTime() - Date.now()) / 1000));
  };

  const total = useSyncExternalStore(
    subscribe,
    getSecondsLeft,
    getServerSnapshot,
  );

  const units = [
    {
      key: "days",
      value: total === null ? null : Math.floor(total / 86400),
      pad: 1,
    },
    {
      key: "hours",
      value: total === null ? null : Math.floor(total / 3600) % 24,
      pad: 2,
    },
    {
      key: "minutes",
      value: total === null ? null : Math.floor(total / 60) % 60,
      pad: 2,
    },
    {
      key: "seconds",
      value: total === null ? null : total % 60,
      pad: 2,
    },
  ] as const;

  return (
    <div className="absolute -bottom-15 left-0 right-0 z-10 mx-auto w-fit overflow-hidden rounded-3xl bg-brand-blue-dark">
      <div className="absolute inset-0 -z-10 bg-black/30" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-[url('/pattern.svg')] bg-repeat bg-size-[680px] opacity-20"
      />

      <div className="relative z-30 flex h-full items-center justify-center gap-6 px-5 py-6 text-white sm:gap-12 sm:px-10 md:px-15 lg:gap-30">
        {units.map(({ key, value, pad }) => (
          <div key={key} className="flex flex-col items-center gap-3">
            <span className="font-capitana text-3xl font-bold leading-none tabular-nums sm:text-4xl lg:text-5xl">
              {String(value ?? 0).padStart(pad, "0")}
            </span>

            <span className="font-roboto text-xs font-medium text-white/70 sm:text-base">
              {t(key)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timer;
