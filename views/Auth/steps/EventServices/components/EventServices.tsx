"use client";

import { useCallback, useMemo, useState } from "react";
import { ConfigProvider, Segmented } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { localizedTitle } from "@/shared/lib/localization";
import { API } from "@/shared/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EventPackageType } from "@/views/Auth/EventPackageTypes/type";
import ServicesCard from "@/views/Auth/ServicesCard";
import { fallbackCurrency, formatPrice } from "@/views/Auth/servicesData";
import { STORAGE_KEYS } from "@/views/Auth/config";
import { EVENT_SERVICE_STEP_REQUEST } from "../api";
import { eventServicesSchema } from "../validation";
import { EVENT_SERVICES_ERROR_CODE } from "../errorCodes";
import { getErrorMessage } from "../dictionary";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";

export default function EventServices() {
  const t = useTranslations("Registration.services");
  const tCommon = useTranslations("Common");
  const tErrors = useTranslations("Registration.errors");
  const locale = useLocale();
  const router = useRouter();

  const [selectedPackages, setSelectedPackages] = useState<
    Record<string, { eventPackageId: number; quantity: number }>
  >({});
  const [error, setError] = useState<string>("");

  const [packageType, setPackageType] = useState<
    EventPackageType | undefined
  >();

  const [isLocal, setIsLocal] = useState(false);

  const [draftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );

  const {
    data: eventPackageTypes,
    isLoading: isEventPackagesTypeLoading,
    isError: IsEventPackageTypeError,
  } = useQuery({
    queryKey: ["eventPackageTypesList"],
    queryFn: async () => {
      const res = await API.EVENT_PACKAGE_TYPES.LIST({ offset: 0, limit: 100 });
      setPackageType(res.items[0]);
      return res.items;
    },
  });

  const {
    data: eventPackages,
    isLoading: isEventPackagesLoading,
    isError: IsEventPackagesError,
  } = useQuery({
    queryKey: ["eventPackagesList", packageType?.id, isLocal],
    queryFn: async () => {
      const res = await API.EVENT_PACKAGES.LIST({
        offset: 0,
        limit: 100,
        filters: [
          { field: "id", op: "eq", val: packageType?.id },
          { field: "isLocal", op: "eq", val: isLocal },
        ],
      });
      return res.items;
    },
    enabled: !!packageType?.id,
  });

  const summary = useMemo(() => {
    const totals = new Map<string, number>();
    let positions = 0;
    for (const pkg of eventPackages ?? []) {
      const quantity = selectedPackages[String(pkg.id)]?.quantity ?? 0;
      if (!quantity) continue;
      positions += quantity;
      totals.set(
        pkg.currency,
        (totals.get(pkg.currency) ?? 0) + pkg.price * quantity,
      );
    }
    return { positions, totals };
  }, [eventPackages, selectedPackages]);

  const totalLines = [...summary.totals.entries()].map(
    ([currency, total]) => `${formatPrice(total)} ${currency}`,
  );

  const nextMutation = useMutation({
    mutationFn: (
      packages: Array<{ eventPackageId: number; quantity: number }>,
    ) => {
      if (!packages.length) throw new Error("PACKAGE_IS_REQUIRED");
      if (!draftId) throw new Error("NO ID PROVIDED");

      return EVENT_SERVICE_STEP_REQUEST({
        draftId: String(draftId),
        payload: { packages },
      });
    },

    onSuccess: (response) => {
      localStorage.setItem("eventDraft", JSON.stringify(response));
    },
  });

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    try {
      setError("");

      const result = eventServicesSchema.safeParse({
        packages: Object.values(selectedPackages),
      });

      if (!result.success) {
        throw result.error;
      }

      await nextMutation.mutateAsync(result.data.packages);

      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];

        setError(
          getErrorMessage({
            t: tErrors,
            errorCode: firstError.message as EVENT_SERVICES_ERROR_CODE,
          }),
        );
      } else if (error instanceof Error) {
        // Ошибка бэкенда — иначе кнопка молча ничего не делает
        setError(error.message);
      }

      return false;
    }
  }, [selectedPackages, nextMutation, tErrors]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
        <div className="glass-btn shrink-0 rounded bg-white/10 p-3">
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 4,
              },
              components: {
                Segmented: {
                  trackBg: "#55AAEC8F",
                  trackPadding: 4,
                  controlHeight: 38,
                  controlHeightLG: 38,
                  controlHeightSM: 38,
                  itemColor: "#ffffff",
                  itemHoverColor: "#ffffff",
                  itemHoverBg: "transparent",
                  itemActiveBg: "transparent",
                  itemSelectedBg: "#FFFFFF",
                  itemSelectedColor: "#0071BB",
                },
              },
            }}
          >
            <Segmented<boolean>
              block
              size="large"
              value={isLocal}
              onChange={(val) => setIsLocal(val)}
              options={[
                {
                  value: false,
                  label: t(`audience.international`),
                },
                {
                  value: true,
                  label: t(`audience.local`),
                },
              ]}
              className="auth-segmented w-full font-nexa-bold"
            />
          </ConfigProvider>

          <div className="mt-3 flex flex-wrap gap-2">
            {isEventPackagesTypeLoading && (
              <span className="font-nexa text-xs text-white/60">
                {tCommon("loading")}
              </span>
            )}

            {eventPackageTypes?.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setPackageType(type)}
                aria-pressed={packageType?.id === type.id}
                className={` rounded-full px-5 py-1 font-nexa text-xs ${
                  packageType?.id === type.id
                    ? "text-white bg-white/20 border border-white "
                    : " text-white glass-btn"
                }`}
              >
                {localizedTitle(type, locale)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-10">
          {eventPackages?.map((pkg) => (
            <ServicesCard
              key={pkg.id}
              service={pkg}
              selectedPackages={selectedPackages}
              setSelectedPackages={setSelectedPackages}
            />
          ))}
          {/* {!isLoading && !loadError && !visiblePackages.length && (
            <p className="font-nexa text-sm text-white/60">
              {tCommon("notFound")}
            </p>
          )}

          {isLoading && (
            <p className="font-nexa text-sm text-white/60">
              {tCommon("loading")}
            </p>
          )}

          {loadError && (
            <p className="font-nexa text-sm text-[#DE7A7A]">{loadError}</p>
          )} */}
        </div>
      </div>

      <div className="shrink-0 border-t border-white/20 bg-white p-4 -mx-4 -mb-6 rounded-none lg:rounded-b-2xl">
        <div className="flex items-center justify-between gap-3">
          <span className="font-nexa text-sm text-[#9D9D9D] sm:text-base">
            {t("positions", { count: summary.positions })}
          </span>
          <span className="text-right font-nexa-bold text-lg font-bold sm:text-2xl text-black">
            {totalLines.length > 0
              ? totalLines.join(" + ")
              : `${formatPrice(0)} ${fallbackCurrency(!!isLocal ? "local" : "international")}`}
          </span>
        </div>
        {error && (
          <p className="mt-2 font-nexa text-sm text-[#DE7A7A]">{error}</p>
        )}

        <button
          onClick={async () => {
            const ok = await handleSubmit();

            if (ok) {
              router.push("payment");
            }
          }}
          disabled={
            nextMutation.isPending || !Object.values(selectedPackages).length
          }
          className="mt-4 h-12 w-full rounded bg-[#0071BB] font-nexa-bold text-base font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {nextMutation.isPending ? t("sending") : t("next")}
        </button>
      </div>
    </div>
  );
}
