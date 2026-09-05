"use client";

import { useEffect, useRef, useState } from "react";
import { ConfigProvider, Radio, type RadioChangeEvent } from "antd";
import { useLocale, useTranslations } from "next-intl";
import Field from "@/shared/ui/Field";
import { localizedSubtitle, localizedTitle } from "@/shared/lib/localization";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "@/shared/api";
import { PRINT } from "@/shared/lib/helpers";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { RegistrationDraft } from "@/views/Auth/types";
import { STORAGE_KEYS } from "@/views/Auth/config";
import { saveDraft, useRegistrationDraft } from "@/views/Auth/draft";
import { formatPrice } from "@/views/Auth/servicesData";
// import { findPromocode } from "@/views/Auth/Promocodes/utils";
// import { T_Promocode } from "@/views/Auth/Promocodes/type";
import { usePayment } from "../hook";
import { useRouter } from "next/navigation";
import { API_V2 } from "@/shared/api_v2";
import { T_PAYMENT } from "../type";

export default function PaymentForm() {
  const t = useTranslations("Registration.payment");
  const tErrors = useTranslations("Registration.errors");
  const locale = useLocale();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const savedDraft = useRegistrationDraft();
  const [draftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );

  // const applyPromoCodeMutation = useMutation({
  //   mutationFn: async (code: string): Promise<RegistrationDraft> => {
  //     if (!draftId) throw new Error("NO_ID_PROVIDED");

  //     return API_V2.PAYMENT.APPLY_PROMOCODE({
  //       draftId,
  //       payload: { promocodeCode: code } as T_PAYMENT,
  //     });
  //   },

  //   onSuccess: (updatedDraft) => {
  //     const draft = updatedDraft?.data ?? updatedDraft;

  //     localStorage.setItem("eventDraft", JSON.stringify(draft));
  //     setSavedDraft(draft);
  //     setPromoCode(draft.promocodeCode ?? promoCode);
  //     setPromoError("");
  //   },

  //   onError: (error) => {
  //     setPromoError(error instanceof Error ? error.message : t("invalidPromo"));
  //   },
  // });

  // const onApplyPromoCode = () => {
  //   const code = promoCode.trim().toUpperCase();

  //   if (!code) return;

  //   setPromoError("");
  //   applyPromoCodeMutation.mutate(code);
  // };

  const {
    paymentMethodId: selectedPaymentMethodId,
    setPaymentMethodId: setSelectedPaymentMethodId,
    handleSubmit,
    isSubmitting,
    error: submitError,
  } = usePayment({ t: tErrors, draft: savedDraft ?? undefined });

  const currentDraftId = draftId ?? savedDraft?.id ?? null;

  const { data: draftPackages } = useQuery({
    enabled: !!currentDraftId,
    queryKey: ["draftPackages", currentDraftId],
    queryFn: async () => {
      const res = await API_V2.PAYMENT.DRAFT_PACKAGES_LIST({
        draftId: currentDraftId!,
      });
      return res.rows;
    },
  });

  const packageRows = draftPackages ?? savedDraft?.draftPackageRows ?? [];

  const {
    data: eventPackages,
    isLoading: isEventPackagesLoading,
    isError: IsEventPackagesError,
  } = useQuery({
    enabled: !!packageRows.length,
    queryKey: ["eventPackagesList", packageRows.map((i) => i.eventPackageId)],
    queryFn: async () => {
      const res = await API_V2.EVENT_PACKAGES.LIST({
        offset: 0,
        limit: 100,
        // filters: [
        //   {
        //     field: "id",
        //     op: "in",
        //     val: savedDraft?.packages?.map((i) => i.eventPackageId) ?? [],
        //   },
        // ],
      });
      return res.rows;
    },
  });

  const {
    data: paymentMethod,
    isLoading: isPaymentMethodLoading,
    isError: IsPaymentMethodError,
  } = useQuery({
    queryKey: ["paymentMethod"],
    queryFn: async () => {
      const res = await API_V2.PAYMONT_METHOD.LIST({
        offset: 0,
        limit: 100,
        filter: {
          status: {
            op: "=",
            val: "ACTIVE",
          },
        },
      });
      return res.rows;
    },
  });

  // Возврат на шаг назад: отмечаем способ из драфта, иначе первый доступный
  useEffect(() => {
    if (selectedPaymentMethodId !== null || !paymentMethod?.length) return;

    const fromDraft = paymentMethod.find(
      (method) => method.id === savedDraft?.paymentMethodId,
    );

    setSelectedPaymentMethodId(fromDraft?.id ?? paymentMethod[0].id);
  }, [
    paymentMethod,
    savedDraft?.paymentMethodId,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
  ]);

  // const applyPromoCode = useMutation({
  //   mutationFn: (payload: T_PAYMENT): Promise<RegistrationDraft> => {
  //     if (!draftId) {
  //       throw new Error("NO ID PROVIDED");
  //     }

  //     return API_V2.PAYMENT.APPLY_PROMOCODE({
  //       draftId: draftId,
  //       payload,
  //     });
  //   },
  //   onSuccess: (updated) => {
  //     localStorage.setItem("eventDraft", JSON.stringify(updated));
  //   },
  // });

  const applyPromoCodeMutation = useMutation({
    mutationFn: async (promoCode: string) => {
      const id = draftId ?? savedDraft?.id;
      if (!id) throw new Error("NO ID PROVIDED");

      const draft = await API_V2.PAYMENT.APPLY_PROMOCODE({
        draftId: id,
        code: promoCode,
      });

      return draft;
    },
    onSuccess: (draft) => {
      const saved = saveDraft(draft);
      setPromoCode(saved?.promocodeCode ?? promoCode);
      setPromoError("");
    },
    onError: (error) => {
      setPromoError(error instanceof Error ? error.message : t("invalidPromo"));
    },
  });

  const handleApplyPromoCode = () => {
    setPromoError("");

    if (!promoCode.length) {
      setPromoError(t("invalidPromo"));
      return;
    }

    applyPromoCodeMutation.mutate(promoCode);
  };

  // Промокод, применённый до ухода с шага, подставляем один раз: дальше поле
  // принадлежит пользователю — он мог начать вводить другой код
  const hydratedPromoCode = useRef(false);

  useEffect(() => {
    if (hydratedPromoCode.current || !savedDraft?.promocodeCode) return;

    hydratedPromoCode.current = true;
    setPromoCode(savedDraft.promocodeCode);
  }, [savedDraft?.promocodeCode]);

  const discountRows = [
    { currency: "TMT", amount: savedDraft?.discountAmountTmt ?? 0 },
    { currency: "USD", amount: savedDraft?.discountAmountUsd ?? 0 },
  ].filter((row) => row.amount > 0);

  const totalRows = [
    { currency: "TMT", amount: savedDraft?.totalAmountTmt ?? 0 },
    { currency: "USD", amount: savedDraft?.totalAmountUsd ?? 0 },
  ].filter((row) => row.amount > 0);

  const appliedPromoCode = savedDraft?.promocodeCode ?? null;
  const appliedDiscount = discountRows
    .map((row) => `${formatPrice(row.amount)} ${row.currency}`)
    .join(" + ");

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-y-auto pt-6">
        {/* Promo code */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <Field
                id="promo-code"
                name="promoCode"
                label={t("promoCode")}
                placeholder={t("promoCodePlaceholder")}
                className="h-12!"
                autoComplete="off"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.trim().toUpperCase());
                  setPromoError("");
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleApplyPromoCode}
              disabled={!promoCode.length || applyPromoCodeMutation.isPending}
              className={`glass h-12 shrink-0 rounded bg-white/14 px-8 font-nexa-bold text-sm leading-normal transition-colors ${
                !!promoCode.length && !applyPromoCodeMutation.isPending
                  ? "text-white hover:bg-white/20"
                  : "cursor-not-allowed text-white/44"
              }`}
            >
              {applyPromoCodeMutation.isPending ? t("loading") : t("apply")}
            </button>
          </div>
          {!promoError && appliedPromoCode && (
            <p className="font-nexa text-sm text-white/80">
              {t("appliedFixed", {
                code: appliedPromoCode,
                discount: appliedDiscount,
              })}
            </p>
          )}
          {promoError && (
            <p className="font-nexa text-sm text-[#DE7A7A]">{promoError}</p>
          )}
        </div>
        {!isEventPackagesLoading && eventPackages && (
          <div className="glass rounded bg-white/10 p-4">
            <h3 className="font-nexa-bold text-lg font-bold text-white sm:text-xl pb-3 border-b border-white/30">
              {t("title")}
            </h3>

            <ul className="mt-4 flex flex-col">
              {packageRows.map((i) => {
                const found = eventPackages.find(
                  (k) => k.id === i.eventPackageId,
                );
                return (
                  <li
                    key={i.eventPackageId}
                    className="flex items-start justify-between gap-3  py-3 first:border-t-0 first:pt-0"
                  >
                    <div className="min-w-0">
                      <p className="font-nexa text-sm text-white sm:text-base">
                        {localizedTitle(found, locale)}
                      </p>
                      <p className="font-nexa text-xs text-white/60">
                        {i.quantity} x {formatPrice(i.unitPrice)}{" "}
                        {found?.currency}
                      </p>
                    </div>
                    <p className="shrink-0 font-nexa-bold text-base font-bold text-white sm:text-xl">
                      {formatPrice(i.totalPrice)} {found?.currency}
                    </p>
                  </li>
                );
              })}
            </ul>

            {discountRows.map((row) => (
              <div
                key={`discount-${row.currency}`}
                className="flex items-center justify-between gap-3 py-3 font-nexa text-sm text-[#DE7A7A] sm:text-base"
              >
                <span>{t("discountFixed")}</span>
                <span className="font-nexa-regular">
                  −{formatPrice(row.amount)} {row.currency}
                </span>
              </div>
            ))}

            <div className="mt-2 flex items-start justify-between gap-3 border-t border-white/30 pt-4">
              <span className="font-nexa-bold text-lg font-bold text-white sm:text-xl">
                {t("total")}
              </span>
              <span className="text-right font-nexa-bold text-xl font-bold text-white sm:text-2xl">
                {totalRows.length
                  ? totalRows
                      .map(
                        (row) => `${formatPrice(row.amount)} ${row.currency}`,
                      )
                      .join(" + ")
                  : `${formatPrice(0)} TMT`}
              </span>
            </div>
          </div>
        )}

        {/* Payment method */}
        <div className="flex flex-col gap-3">
          <h3 className="font-nexa-bold text-base text-white sm:text-lg">
            {t("methodTitle")}
          </h3>

          <ConfigProvider
            theme={{
              token: { colorPrimary: "#0071BB" },
              components: {
                Radio: {
                  radioSize: 20,
                  dotSize: 10,
                  colorPrimary: "#0071BB",
                  colorBgContainer: "#ffffff",
                  colorBorder: "#ffffff99",
                },
              },
            }}
          >
            <Radio.Group
              name="payment-method"
              value={selectedPaymentMethodId ?? null}
              onChange={(e: RadioChangeEvent) => {
                console.log(e.target.value);
                setSelectedPaymentMethodId(e.target.value);
              }}
              className="flex w-full flex-col gap-3"
            >
              {paymentMethod?.map((method) => {
                const isActive = selectedPaymentMethodId === method.id;
                return (
                  <div
                    key={method.id}
                    className={`rounded p-4 transition-colors ${
                      isActive ? "glass" : "border border-brand-blue/30"
                    }`}
                  >
                    <Radio value={method.id} className="payment-radio">
                      <span className="min-w-0">
                        <span className="block font-nexa-bold text-sm text-white sm:text-base">
                          {localizedTitle(method, locale)}
                        </span>
                        <span className="block font-nexa text-xs text-white/60">
                          {localizedSubtitle(method, locale)}
                        </span>
                      </span>
                    </Radio>
                  </div>
                );
              })}
            </Radio.Group>
          </ConfigProvider>

          {!paymentMethod?.length && (
            <p className="font-nexa text-sm text-white/60">
              {isPaymentMethodLoading ? t("methodsLoading") : t("methodsEmpty")}
            </p>
          )}
        </div>
      </div>

      {submitError && (
        <p className="mt-3 shrink-0 font-nexa text-sm text-[#DE7A7A]">
          {submitError}
        </p>
      )}

      <button
        type="button"
        onClick={async () => {
          const ok = await handleSubmit();

          if (ok) {
            router.push("verification");
          }
        }}
        disabled={isSubmitting}
        className="mt-5 h-12 w-full shrink-0 rounded bg-[#0071BB] font-nexa-bold text-base font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t("sending") : t("submit")}
      </button>
    </div>
  );
}
