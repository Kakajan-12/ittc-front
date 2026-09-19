import type { Locale } from "./localize";

/**
 * en-GB, not en-US: the design writes dates day-first ("21 November"), and
 * `Intl` would otherwise render "November 21" for English.
 */
const INTL_LOCALE: Record<Locale, string> = {
  en: "en-GB",
  ru: "ru-RU",
  tk: "tk-TM",
};

/** "2026-11-21" → "21 November" / "21 ноября" */
export function formatDayAndMonth(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/** "2026-06-10T00:00:00.000Z" → "10 June 2026" / "10 июня 2026 г." */
export function formatFullDate(iso: string | null, locale: Locale): string {
  if (!iso) return "";

  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/**
 * Sessions are stored as local event time ("14:00"). English keeps the 12-hour
 * clock the design was drawn with; Russian and Turkmen use 24-hour.
 */
export function formatTime(value: string | null, locale: Locale): string {
  if (!value) return "";

  const [hours, minutes] = value.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;

  if (locale !== "en") {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
}
