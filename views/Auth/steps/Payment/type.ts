export type T_PAYMENT = {
  paymentMethodId: number | null;
  promocodeId?: number | null;
  promocodeCode?: string | null;
  subtotalUsd?: number;
  subtotalTmt?: number;
  discountAmountUsd?: number;
  discountAmountTmt?: number;
  totalAmountUsd?: number;
  totalAmountTmt?: number;
};
