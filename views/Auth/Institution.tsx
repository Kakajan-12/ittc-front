"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { localizedTitle } from "@/shared/lib/localization";
import { getMediaUrl } from "@/shared/lib/helpers";
import { STORAGE_KEYS } from "./config";
import { useInstitutions } from "./steps/Institution/hook";
import type { T_INSTITUTE } from "./steps/Institution/type";

export const INSTITUTION_PARAM = "institutionId";

export function readInstitutionParam(): number | null {
  const value = new URLSearchParams(window.location.search).get(
    INSTITUTION_PARAM,
  );
  return value && /^\d+$/.test(value) ? Number(value) : null;
}

/** «Личные данные» с выбранным учреждением в ссылке */
export function personalInfoHref(institutionId: number) {
  return `/register/personal-info?${INSTITUTION_PARAM}=${institutionId}`;
}

export function useInstitutionChoice() {
  const [stored, setStored] = usePersistentState<number | null>(
    STORAGE_KEYS.institution,
    null,
  );
  return [typeof stored === "number" ? stored : null, setStored] as const;
}

export function useInstitution(): {
  id: number;
  option: T_INSTITUTE | null;
} | null {
  const [choice] = useInstitutionChoice();
  const { data: institutions } = useInstitutions();

  if (choice === null) return null;

  const option = institutions?.find((item) => item.id === choice) ?? null;
  if (institutions && !option) return null;

  return { id: choice, option };
}

/** Поля для платформы: какое учреждение выбрано. */
export function institutionFields(
  institution: ReturnType<typeof useInstitution>,
): { institutionId?: number } {
  return institution ? { institutionId: institution.id } : {};
}

export function InstitutionBanner() {
  const t = useTranslations("Registration");
  const locale = useLocale();
  const institution = useInstitution();

  const option = institution?.option;
  if (!option) return null;

  const logo = getMediaUrl(option.logo);

  return (
    <div className="mb-4 flex items-center gap-3 rounded border border-white/30 bg-white/10 px-4 py-3">
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element -- логотип из платформы, мелкий
        <img
          src={logo}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded bg-white object-contain p-1"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-white/70">
          {t("institution")}
        </p>
        <p className="text-base font-medium text-white">
          {localizedTitle(option, locale)}
        </p>
      </div>
      <Link
        href="/register/institution"
        className="shrink-0 text-sm text-white underline underline-offset-4 hover:text-white/80"
      >
        {t("institutionChange")}
      </Link>
    </div>
  );
}
