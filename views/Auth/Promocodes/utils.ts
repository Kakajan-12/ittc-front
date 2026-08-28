import { T_Promocode } from "./type";

/**
 * Код действует: активен, окно дат открыто и общий лимит не исчерпан.
 * `perUserLimit` тут не проверить — счётчик по пользователю знает только бэкенд.
 */
export function isUsablePromocode(
  promo: T_Promocode,
  now: number = Date.now(),
): boolean {
  if (promo.status !== "ACTIVE") return false;
  if (promo.startDate && new Date(promo.startDate).getTime() > now)
    return false;
  if (promo.expiredAt && new Date(promo.expiredAt).getTime() < now)
    return false;
  if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit)
    return false;
  return true;
}

export function findPromocode(
  promocodes: T_Promocode[],
  input: string,
): T_Promocode | null {
  const code = input.trim().toLowerCase();
  if (!code) return null;
  return (
    promocodes.find(
      (promo) => promo.code.toLowerCase() === code && isUsablePromocode(promo),
    ) ?? null
  );
}
