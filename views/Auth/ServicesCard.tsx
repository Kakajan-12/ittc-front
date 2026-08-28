"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Collapse } from "antd";
import { IoCheckmarkSharp } from "react-icons/io5";
import { formatPrice } from "./servicesData";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { EventPackages } from "./EventPackages/type";
import { localizedTitle } from "@/shared/lib/localization";

interface ServicesCardProps {
  service: EventPackages;
  selectedPackages: Record<
    string,
    {
      eventPackageId: number;
      quantity: number;
    }
  >;
  setSelectedPackages: Dispatch<
    SetStateAction<
      Record<
        string,
        {
          eventPackageId: number;
          quantity: number;
        }
      >
    >
  >;
}
const MAX_QUANTITY = 99;

export default function ServicesCard({
  service,
  selectedPackages,
  setSelectedPackages,
}: ServicesCardProps) {
  const t = useTranslations("Registration.services");
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const { price, currency } = service;
  const title = localizedTitle(service, locale);
  const quantity = selectedPackages[String(service.id)]?.quantity ?? 0;
  const total = price * quantity;
  const stopToggle = (event: React.MouseEvent) => event.stopPropagation();

  const selectPackage = () => {
    setSelectedPackages((prev) => ({
      ...prev,
      [service.id]: {
        eventPackageId: service.id,
        quantity: 1,
      },
    }));
  };

  const onIncrement = () => {
    setSelectedPackages((prev) => {
      const current = service.id in prev ? prev[service.id] : undefined;
      if (!current) return prev;

      if (current.quantity < MAX_QUANTITY) {
        return {
          ...prev,
          [service.id]: {
            eventPackageId: service.id,
            quantity: ++prev[service.id].quantity,
          },
        };
      } else {
        return { ...prev };
      }
    });
  };

  const onDecrement = () => {
    setSelectedPackages((prev) => {
      const current = service.id in prev ? prev[service.id] : undefined;
      if (!current) return prev;

      if (current.quantity > 1) {
        return {
          ...prev,
          [service.id]: {
            eventPackageId: service.id,
            quantity: prev[service.id].quantity - 1,
          },
        };
      } else {
        delete prev[service.id];
        return { ...prev };
      }
    });
  };

  const stepper = (
    <div className="flex items-center overflow-hidden rounded border border-[#9D9D9D99] bg-white">
      <button
        type="button"
        onClick={onDecrement}
        aria-label={t("card.decrease", { title })}
        className="flex h-10 w-10 items-center justify-center text-xl text-[#0071BB] transition-colors hover:bg-gray-100"
      >
        −
      </button>
      {selectedPackages?.hasOwnProperty(service.id) && (
        <span className="flex h-10 w-10 items-center justify-center border-x border-[#9D9D9D99] px-2 font-nexa-bold text-base">
          {selectedPackages[service.id].quantity}
        </span>
      )}
      <button
        type="button"
        onClick={onIncrement}
        disabled={selectedPackages?.[service.id]?.quantity >= MAX_QUANTITY}
        aria-label={t("card.increase", { title })}
        className="flex h-10 w-10 items-center justify-center text-xl text-[#0071BB] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );

  const header = (
    <div
      className={`flex flex-wrap items-start justify-between gap-x-2.5 gap-y-3 m-0! px-3 sm:items-center ${
        expanded ? "py-2 lg:py-3" : "py-2 lg:py-4"
      }`}
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-nexa-bold text-sm font-bold">{title}</h3>

        {!expanded && service.packageFeatures.length > 0 && (
          <span className="mt-1 flex items-center gap-2 font-nexa text-xs text-brand-blue">
            <ArrowIcon />
            <span>
              {t("card.allFeatures", { count: service.packageFeatures.length })}
            </span>
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="shrink-0 text-right">
          <p className="font-nexa-bold font-bold leading-none">
            <span className="text-xl">{formatPrice(price)}</span>{" "}
            <span className="text-[10px]">{currency}</span>
          </p>

          {!!service.eventPackageFee ? (
            <div className="flex gap-2 items-center ">
              <p className="font-nexa text-[10px] text-[#9D9D9D]">
                +{service.eventPackageFee.price}
                {service.eventPackageFee.currency}
              </p>
              <p className="font-nexa text-[10px] text-[#9D9D9D]">
                {localizedTitle(service.eventPackageFee, locale)}
              </p>
            </div>
          ) : null}
        </div>

        {/* На телефоне управление вынесено под карточку — см. mobileActions */}
        <div
          onClick={stopToggle}
          className="hidden h-10 shrink-0 items-center sm:flex"
        >
          {quantity > 0 ? (
            stepper
          ) : (
            <button
              type="button"
              onClick={selectPackage}
              className="h-8 w-28 md:h-11 md:w-30 rounded bg-[#0071BB] flex items-center justify-center font-nexa-bold text-base font-bold text-white transition-colors hover:bg-[#0071BB]/80"
            >
              {t("card.select")}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  /** На телефоне кнопка/счётчик занимают всю ширину под содержимым карточки */
  const mobileActions = (
    <div className="px-3 pb-3 sm:hidden">
      {quantity > 0 ? (
        <div className="flex items-center justify-between gap-3 border-t border-brand-blue/30 pt-3">
          {stepper}

          <p className="font-nexa-bold text-xl font-bold text-[#0071BB]">
            {formatPrice(total)} {currency}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={selectPackage}
          className="flex h-11 w-full items-center justify-center rounded bg-[#0071BB] font-nexa-bold text-base font-bold text-white transition-colors hover:bg-[#0071BB]/80"
        >
          {t("card.select")}
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full overflow-hidden rounded bg-[#EDF6FF] text-[#333333]">
      <Collapse
        ghost
        activeKey={expanded ? ["features"] : []}
        onChange={(keys) => setExpanded(keys.length > 0)}
        expandIcon={() => null}
        className="services-card w-full"
        items={[
          {
            key: "features",
            label: header,
            children: (
              <div>
                <ul className="flex flex-col gap-1.5 border-t border-brand-blue/30 pt-3">
                  {service.packageFeatures.map((feature) => (
                    <li
                      key={feature.id}
                      className="flex items-start gap-2 font-nexa font-light text-sm"
                    >
                      <IoCheckmarkSharp className="mt-0.5 size-4 shrink-0 text-brand-blue sm:size-5" />
                      <span>{localizedTitle(feature, locale)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="mt-3 flex items-center gap-2 font-nexa text-xs text-brand-blue"
                >
                  <ArrowIcon className="rotate-180" />
                  <span>{t("card.showLess")}</span>
                </button>
              </div>
            ),
          },
        ]}
      />

      {mobileActions}
    </div>
  );
}
