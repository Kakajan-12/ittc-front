"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const TARGET = Date.UTC(2026, 10, 24, 4, 0, 0);

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

// Seconds left is stable within a tick, so it is a valid store snapshot.
const getSecondsLeft = () =>
  Math.max(0, Math.floor((TARGET - Date.now()) / 1000));
const getServerSnapshot = () => null;

function Timer() {
  const t = useTranslations("Timer");
  const total = useSyncExternalStore(
    subscribe,
    getSecondsLeft,
    getServerSnapshot,
  );

  const units = [
    {
      key: "days",
      value: total === null ? null : Math.floor(total / 86400),
      pad: 3,
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
    { key: "seconds", value: total === null ? null : total % 60, pad: 2 },
  ] as const;

  return (
    <div className="absolute -bottom-15 left-0 right-0 rounded-3xl bg-brand-blue-dark z-10 mx-auto w-fit overflow-hidden">
      <div className="absolute inset-0 bg-black/30 -z-10" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-[url('/pattern.svg')] bg-repeat bg-size-[680px] opacity-20"
      />

      <div className="relative z-30 flex h-full items-center justify-center gap-6 sm:gap-12 lg:gap-30 py-6 px-5 sm:px-10 md:px-15 text-white">
        {units.map(({ key, value, pad }) => (
          <div key={key} className="flex flex-col items-center gap-3">
            <span className="font-capitana text-3xl sm:text-4xl lg:text-5xl font-bold tabular-nums leading-none">
              {String(value ?? 0).padStart(pad, "0")}
            </span>
            <span className="font-roboto font-medium text-xs sm:text-base text-white/70">
              {t(key)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timer;
