"use client";

import { useTranslations } from "next-intl";

/**
 * Валидация живёт вне React (zod-схемы, shared/lib/phone), поэтому вместо
 * готового текста она отдаёт ключ перевода — при необходимости с параметрами,
 * дописанными через `|` в виде JSON: `Errors.phoneLength|{"entered":7}`.
 * Компоненты прогоняют это значение через `useErrorText`.
 */
export const encodeError = (
  key: string,
  values?: Record<string, string | number>,
) => (values ? `${key}|${JSON.stringify(values)}` : key);

/** Ключ перевода (или готовый текст) → текст на языке страницы */
export function useErrorText() {
  const t = useTranslations();

  return (raw?: string) => {
    if (!raw) return undefined;

    const separator = raw.indexOf("|");
    const key = separator === -1 ? raw : raw.slice(0, separator);
    if (!t.has(key)) return raw;

    if (separator === -1) return t(key);
    return t(key, JSON.parse(raw.slice(separator + 1)));
  };
}
