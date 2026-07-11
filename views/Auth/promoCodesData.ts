export interface PromoCode {
  id: number;
  code: string;
  discount: number;
  /** ISO date (YYYY-MM-DD). A date in the past means the code has expired. */
  expiresAt: string;
}

export const promoCodesData: PromoCode[] = [
  { id: 1, code: "TULM10", discount: 10, expiresAt: "2027-01-01" },
  // { id: 2, code: "ITTC2026", discount: 15, expiresAt: "2026-12-31" },
  // { id: 3, code: "OGUZ25", discount: 25, expiresAt: "2027-06-30" },
  // { id: 4, code: "VIPACCESS", discount: 50, expiresAt: "2027-12-31" },
  // // Example of an already expired code
  // { id: 5, code: "EARLYBIRD", discount: 20, expiresAt: "2025-01-01" },
];

/**
 * Look up a promo code (case-insensitive) and make sure it hasn't expired.
 * Returns the matching code or `null` when it doesn't exist / has expired.
 */
export function validatePromoCode(input: string): PromoCode | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  const found = promoCodesData.find((p) => p.code.toLowerCase() === trimmed);
  if (!found) return null;

  const isExpired = new Date(found.expiresAt).getTime() < Date.now();
  return isExpired ? null : found;
}
