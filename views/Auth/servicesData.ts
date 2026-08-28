export type ServiceAudience = "international" | "local";

const FALLBACK_CURRENCY: Record<ServiceAudience, string> = {
  international: "USD",
  local: "TMT",
};

export const fallbackCurrency = (audience: ServiceAudience) =>
  FALLBACK_CURRENCY[audience];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
