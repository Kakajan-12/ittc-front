export interface PromoCode {
  id: number;
  code: string;
  discount: number;
  expiresAt: string;
}

export const promoCodesData: PromoCode[] = [
  { id: 1, code: "TULM202611", discount: 10, expiresAt: "2026-11-30" },
];
export function validatePromoCode(input: string): PromoCode | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  const found = promoCodesData.find((p) => p.code.toLowerCase() === trimmed);
  if (!found) return null;

  const isExpired = new Date(found.expiresAt).getTime() < Date.now();
  return isExpired ? null : found;
}
