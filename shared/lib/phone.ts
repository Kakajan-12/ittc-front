// ВАЖНО: инстанс берём из @intl-tel-input/react, а не из intl-tel-input.
// React-пакет бандлит собственную копию ядра, и `loadUtils` кладёт правила
// libphonenumber именно в неё. Импорт из intl-tel-input дал бы второй,
// пустой инстанс — с `utils === undefined` валидация молча пропускала всё.
import { intlTelInput } from "@intl-tel-input/react";
import type { Country, Iso2 } from "intl-tel-input";
import { encodeError } from "./errorText";

export const loadPhoneUtils = () => import("intl-tel-input/utils");

const digitsOf = (value: string) => value.replace(/\D/g, "");

let indexes: {
  byDialCode: Map<string, Country>;
  byIso2: Map<string, Country>;
} | null = null;

const getIndexes = () => {
  if (indexes) return indexes;

  const byDialCode = new Map<string, Country>();
  const byIso2 = new Map<string, Country>();

  for (const country of intlTelInput.getAllCountries()) {
    byIso2.set(country.iso2, country);

    const current = byDialCode.get(country.dialCode);
    if (!current || country.priority < current.priority)
      byDialCode.set(country.dialCode, country);

    for (const areaCode of country.areaCodes ?? [])
      byDialCode.set(`${country.dialCode}${areaCode}`, country);
  }

  indexes = { byDialCode, byIso2 };
  return indexes;
};

/** Country an E.164 number belongs to — the longest matching prefix wins */
export const countryFromNumber = (number: string): Country | undefined => {
  const digits = digitsOf(number);
  if (!digits) return undefined;

  const { byDialCode } = getIndexes();
  // Dial codes run to 4 digits, area codes add up to 3 more
  for (let length = Math.min(digits.length, 7); length > 0; length--) {
    const country = byDialCode.get(digits.slice(0, length));
    if (country) return country;
  }
  return undefined;
};

/** Number types the widget accepts — keep in sync with `allowedNumberTypes` */
const ALLOWED_TYPES = ["MOBILE", "FIXED_LINE"] as const;

/**
 * Digit counts (after the dial code) the country's numbers may have, read off a
 * sample number per accepted type. Turkmenistan gives `[8]`, Argentina `[10, 11]`.
 * Empty while the rules are still loading, or for a country with no samples.
 */
export const expectedPhoneLengths = (
  iso2: Iso2 | string | undefined,
): number[] => {
  const utils = intlTelInput.utils;
  if (!utils || !iso2) return [];

  const country = getIndexes().byIso2.get(iso2);
  if (!country) return [];

  const lengths = new Set<number>();
  for (const type of ALLOWED_TYPES) {
    const example = utils.getExampleNumber(iso2, type, "E164");
    if (!example) continue;
    // The dial code is the only part shared by every number of the country —
    // area codes belong to the national part, so they stay counted.
    const length = digitsOf(example).length - country.dialCode.length;
    if (length > 0) lengths.add(length);
  }

  return [...lengths].sort((a, b) => a - b);
};

const joinLengths = (lengths: number[]) => lengths.join(", ");

/**
 * Возвращает ключ перевода (см. `shared/lib/errorText`), а не готовый текст:
 * валидация вызывается из zod-схем, где хука перевода нет.
 */
export const phoneErrorMessage = (value: string): string | null => {
  const number = value.trim();
  const utils = intlTelInput.utils;

  if (!number) return encodeError("Errors.phoneRequired");

  // Правила ещё не подгрузились — виджет до этого момента вообще не отдаёт
  // номер, так что значение здесь доверия не заслуживает: не пропускаем.
  if (!utils) return encodeError("Errors.phoneInvalid");

  const country = countryFromNumber(number);
  const iso2 = country?.iso2;

  // isValidNumber проверяет только общий шаблон страны, а он у многих стран
  // (Туркменистан в их числе) настолько широкий, что пропускает несуществующие
  // коды операторов: +993 00 123456 для неё валиден. Precise-версия сверяет
  // номер с конкретным шаблоном типа, поэтому годятся только реальные коды.
  if (utils.isValidNumberPrecise(number, iso2, [...ALLOWED_TYPES])) return null;

  const error = utils.getValidationError(number, iso2);
  const expected = expectedPhoneLengths(iso2);

  const isLengthError =
    error === "TOO_SHORT" ||
    error === "TOO_LONG" ||
    error === "INVALID_LENGTH" ||
    error === "IS_POSSIBLE_LOCAL_ONLY";

  if (!country || !expected.length) return encodeError("Errors.phoneInvalid");

  if (isLengthError) {
    const entered = digitsOf(number).length - country.dialCode.length;
    return encodeError("Errors.phoneLength", {
      dialCode: country.dialCode,
      expected: joinLengths(expected),
      entered,
    });
  }

  // Длина верная, но шаблон не сошёлся — почти всегда это код оператора
  return encodeError("Errors.phoneOperator", { dialCode: country.dialCode });
};
