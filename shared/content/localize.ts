import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

const SUFFIX: Record<string, "En" | "Ru" | "Tk"> = {
  en: "En",
  ru: "Ru",
  tk: "Tk",
};

export function toLocale(value: string): Locale {
  return (routing.locales as readonly string[]).includes(value)
    ? (value as Locale)
    : routing.defaultLocale;
}

/**
 * Picks `<field><Locale>` off an entity, falling back to English — editors
 * translate at their own pace and a missing Turkmen title must not render blank.
 */
export function localized<T extends Record<string, unknown>>(
  entity: T | null | undefined,
  field: string,
  locale: Locale,
): string {
  if (!entity) return "";

  const value = entity[`${field}${SUFFIX[locale] ?? "En"}`];

  if (typeof value === "string" && value.trim()) return value;

  const fallback = entity[`${field}En`];

  return typeof fallback === "string" ? fallback : "";
}

/** Same, but keeps `null` when no translation exists at all. */
export function localizedOrNull<T extends Record<string, unknown>>(
  entity: T | null | undefined,
  field: string,
  locale: Locale,
): string | null {
  const value = localized(entity, field, locale);

  return value ? value : null;
}
