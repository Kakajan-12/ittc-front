"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import Field from "@/shared/ui/Field";
import Select from "@/shared/ui/Select";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";
import { localizedTitle } from "@/shared/lib/localization";

import { useOrganizationStepForm } from "../hook";
import { API } from "@/shared/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { API_V2 } from "@/shared/api_v2";

interface OrganizationStepProps {
  id?: number;
}

export default function OrganizationStepForm({ id }: OrganizationStepProps) {
  const t = useTranslations("Registration.company");
  const tErrors = useTranslations("Registration.errors");
  const router = useRouter();

  const tCommon = useTranslations("Common");

  const locale = useLocale();

  const [countryQuery, setCountryQuery] = useState("");

  const debouncedQuery = useDebouncedValue(countryQuery, 800);

  const {
    data: countries,
    isFetching: isFetchingCountries,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    initialPageParam: 0,
    // enabled: !!currentWelayat.id,
    queryKey: ["countries", debouncedQuery, locale],

    queryFn: async ({ pageParam }) => {
      const res = await API_V2.COUNTRIES.LIST({
        offset: pageParam,
        limit: 50,
        // search: debouncedQuery.trim() || undefined,
        // searchFields: ["titleEn", "titleRu", "titleTk", "code"],
      });
      console.log(res.rows);
      return res.rows;
    },

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.flat().length;
    },
  });

  const {
    organizationForm,
    setOrganizationForm,
    handleSubmit,
    isSubmitting,
    error,
  } = useOrganizationStepForm({
    t: tErrors,
    id,
  });

  const countryOptions = countries?.pages.flat().map((item) => ({
    value: String(item.id),
    label: localizedTitle(item, locale),
  }));

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pt-2.5 pr-1">
        <Field
          id="organization-name"
          label={t("companyName")}
          placeholder={t("companyNamePlaceholder")}
          name="organizationName"
          value={organizationForm.organizationName}
          onChange={(e) =>
            setOrganizationForm((prev) => ({
              ...prev,
              organizationName: e.target.value,
            }))
          }
          required
        />

        <Field
          id="organization-website"
          label={t("companyWebsite")}
          placeholder={t("companyWebsitePlaceholder")}
          name="website"
          value={organizationForm.website ?? ""}
          onChange={(e) =>
            setOrganizationForm((prev) => ({
              ...prev,
              website: e.target.value,
            }))
          }
        />

        <Field
          id="organization-address"
          label={t("companyAddress")}
          placeholder={t("companyAddressPlaceholder")}
          name="address"
          value={organizationForm.address}
          onChange={(e) =>
            setOrganizationForm((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
          required
        />

        <Select
          id="organization-country"
          label={t("companyCountry")}
          placeholder={
            isFetchingCountries
              ? tCommon("loading")
              : t("companyCountryPlaceholder")
          }
          options={countryOptions ?? []}
          value={
            organizationForm.countryId ? String(organizationForm.countryId) : ""
          }
          searchPending={isFetchingCountries}
          onChange={(value) =>
            setOrganizationForm((prev) => ({
              ...prev,
              countryId: Number(value),
            }))
          }
          searchable
          onSearchChange={setCountryQuery}
          required
          onLoadMore={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoadingMore={isFetchingNextPage}
        />

        <Field
          id="city"
          label={t("city")}
          placeholder={t("cityPlaceholder")}
          name="city"
          value={organizationForm.city}
          onChange={(e) =>
            setOrganizationForm((prev) => ({
              ...prev,
              city: e.target.value,
            }))
          }
          required
        />

        <Field
          id="postal-code"
          label={t("postalCode")}
          placeholder={t("postalCodePlaceholder")}
          name="postalCode"
          value={organizationForm.postalCode}
          onChange={(e) =>
            setOrganizationForm((prev) => ({
              ...prev,
              postalCode: e.target.value,
            }))
          }
          required
        />
      </div>

      {error && (
        <p className="mt-3 shrink-0 font-nexa text-sm text-[#DE7A7A]">
          {error}
        </p>
      )}

      <button
        disabled={isSubmitting}
        onClick={async () => {
          const ok = await handleSubmit();

          if (ok) {
            router.push("services");
          }
        }}
        className="mt-5 h-12 shrink-0 rounded bg-[#0071BB] text-base font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t("sending") : t("next")}
      </button>
    </div>
  );
}
