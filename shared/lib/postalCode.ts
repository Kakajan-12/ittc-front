import {
  postcodeValidator,
  postcodeValidatorExistsForCountry,
} from "postcode-validator";

/**
 * Запасной шаблон: у части стран (ОАЭ, Гонконг, Панама …) индексов нет вообще
 * или в postcode-validator нет правила — тогда проверяем только общий вид.
 */
const GENERIC_POSTAL_CODE = /^[A-Za-z0-9][A-Za-z0-9 -]{2,11}$/;

/**
 * Индекс проверяется по правилам страны из формы (ISO-2 из `shared/data/countries`).
 * Страна ещё не выбрана — остаётся общая проверка, ошибку покажет поле страны.
 */
export const isValidPostalCode = (value: string, countryCode: string) => {
  const code = value.trim();
  if (!code) return false;

  if (countryCode && postcodeValidatorExistsForCountry(countryCode))
    return postcodeValidator(code, countryCode);

  return GENERIC_POSTAL_CODE.test(code);
};
