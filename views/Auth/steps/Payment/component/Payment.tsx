"use client";

import { useEffect, useState } from "react";
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
import { formatPrice } from "@/views/Auth/servicesData";
import { APPLY_PROMOCODE_REQUEST } from "@/views/Auth/Promocodes/api";
import { findPromocode } from "@/views/Auth/Promocodes/utils";
import { T_Promocode } from "@/views/Auth/Promocodes/type";
import { usePayment } from "../hook";
import { useRouter } from "next/navigation";

export default function PaymentForm() {
  const t = useTranslations("Registration.payment");
  const tErrors = useTranslations("Registration.errors");
  const locale = useLocale();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<T_Promocode | null>(null);
  const [savedDraft, setSavedDraft] = useState<RegistrationDraft>();
  const [draftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );

  const {
    paymentMethodId: selectedPaymentMethodId,
    setPaymentMethodId: setSelectedPaymentMethodId,
    handleSubmit,
    isSubmitting,
    error: submitError,
  } = usePayment({ t: tErrors, draft: savedDraft });

  const {
    data: eventPackages,
    isLoading: isEventPackagesLoading,
    isError: IsEventPackagesError,
  } = useQuery({
    enabled: !!savedDraft?.packages?.length,
    queryKey: ["eventPackagesList", savedDraft?.packages],
    queryFn: async () => {
      const res = await API.EVENT_PACKAGES.LIST({
        offset: 0,
        limit: 100,
        filters: [
          {
            field: "id",
            op: "in",
            val: savedDraft?.packages?.map((i) => i.eventPackageId) ?? [],
          },
        ],
      });
      return res.items;
    },
  });

  const {
    data: paymentMethod,
    isLoading: isPaymentMethodLoading,
    isError: IsPaymentMethodError,
  } = useQuery({
    queryKey: ["paymentMethod"],
    queryFn: async () => {
      const res = await API.PAYMONT_METHOD.LIST({
        offset: 0,
        limit: 100,
        filters: [{ field: "status", op: "eq", val: "ACTIVE" }],
      });
      console.log("paymentMethod", res.items);
      setSelectedPaymentMethodId(res.items[0].id);
      return res.items;
    },
  });

  const {
    data: promoCodesList,
    isLoading: isPromocodesListLoading,
    isError: IsPromocodesListError,
  } = useQuery({
    queryKey: ["promocodesList"],
    queryFn: async () => {
      const res = await API.PROMOCODE.LIST({
        offset: 0,
        limit: 100,
        filters: [{ field: "status", op: "eq", val: "ACTIVE" }],
      });
      return res.items;
    },
  });

  const applyPromoCodeMutation = useMutation({
    mutationFn: async (promo: T_Promocode) => {
      const id = draftId ?? savedDraft?.id;
      if (!id) throw new Error("NO ID PROVIDED");

      const draft = await APPLY_PROMOCODE_REQUEST({
        draftId: String(id),
        code: promo.code,
      });

      return { draft, promo };
    },
    onSuccess: ({ draft, promo }) => {
      localStorage.setItem("eventDraft", JSON.stringify(draft));
      setSavedDraft(draft);
      setAppliedPromo(promo);
      setPromoCode(promo.code);
      setPromoError("");
    },
    onError: (error) => {
      setAppliedPromo(null);
      setPromoError(error instanceof Error ? error.message : t("invalidPromo"));
    },
  });

  const onApplyPromoCode = () => {
    setPromoError("");

    const found = findPromocode(promoCodesList ?? [], promoCode);

    if (!found) {
      setAppliedPromo(null);
      setPromoError(t("invalidPromo"));
      return;
    }

    applyPromoCodeMutation.mutate(found);
  };

  useEffect(() => {
    const raw = localStorage.getItem("eventDraft");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const draft: RegistrationDraft = parsed?.data ?? parsed;
    setSavedDraft(draft);
    if (draft?.promocodeCode) setPromoCode(draft.promocodeCode);
  }, []);

  const applied =
    appliedPromo ??
    (savedDraft?.promocodeId
      ? (promoCodesList?.find((promo) => promo.id === savedDraft.promocodeId) ??
        null)
      : null);

  const discountRows = [
    { currency: "TMT", amount: savedDraft?.discountAmountTmt ?? 0 },
    { currency: "USD", amount: savedDraft?.discountAmountUsd ?? 0 },
  ].filter((row) => row.amount > 0);

  const totalRows = [
    { currency: "TMT", amount: savedDraft?.totalAmountTmt ?? 0 },
    { currency: "USD", amount: savedDraft?.totalAmountUsd ?? 0 },
  ].filter((row) => row.amount > 0);

  PRINT("savedDraftsss", savedDraft);
  // PRINT("eventPackages", eventPackages);
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-y-auto pt-2.5">
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
              onClick={onApplyPromoCode}
              disabled={
                !promoCode.length ||
                isPromocodesListLoading ||
                applyPromoCodeMutation.isPending
              }
              className={`glass h-12 shrink-0 rounded bg-white/14 px-8 font-nexa-bold text-sm leading-normal transition-colors ${
                !!promoCode.length &&
                !isPromocodesListLoading &&
                !applyPromoCodeMutation.isPending
                  ? "text-white hover:bg-white/20"
                  : "cursor-not-allowed text-white/44"
              }`}
            >
              {applyPromoCodeMutation.isPending ? t("loading") : t("apply")}
            </button>
          </div>
          {applied && !promoError && (
            <p className="font-nexa text-sm text-white/80">
              {applied.discountType === "PERCENTAGE"
                ? t("applied", {
                    code: applied.code,
                    discount: applied.discountValue,
                  })
                : t("appliedFixed", {
                    code: applied.code,
                    discount: formatPrice(applied.discountValue),
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
              {savedDraft?.packages?.map((i) => {
                const found = eventPackages.find(
                  (k) => k.id === i.eventPackageId,
                );
                return (
                  <li
                    key={i.id}
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
                <span>
                  {applied?.discountType === "PERCENTAGE"
                    ? t("discount", { discount: applied.discountValue })
                    : t("discountFixed")}
                </span>
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
