"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { localizedTitle } from "@/shared/lib/localization";
import { getMediaUrl } from "@/shared/lib/helpers";
import { STORAGE_KEYS } from "./config";
import { useInstitutions } from "./steps/Institution/hook";
import type { T_INSTITUTE } from "./steps/Institution/type";

/**
 * Учреждение, от которого идёт регистрация. Справочник учреждений ведёт
 * платформа (/api/v1/institution). Выбор обязателен и делается на экране
 * /register/institution перед «Личными данными»; QR-код учреждения
 * (/register?org=<id>) выбирает его сразу. Выбор хранится в sessionStorage,
 * как и остальные шаги, и уходит на платформу вместе с личными данными.
 */

/** id учреждения или «Другое / не от учреждения». */
export type InstitutionChoice = number | "other";

export function useInstitutionChoice() {
  return usePersistentState<InstitutionChoice | null>(
    STORAGE_KEYS.institution,
    null,
  );
}

export function useInstitution():
  | { kind: "institution"; id: number; option: T_INSTITUTE | null }
  | { kind: "other" }
  | null {
  const [choice] = useInstitutionChoice();
  const { data: institutions } = useInstitutions();

  if (choice === "other") return { kind: "other" };
  if (typeof choice !== "number") return null;

  const option = institutions?.find((item) => item.id === choice) ?? null;
  // Список загружен, а учреждения в нём нет — выбор устарел.
  if (institutions && !option) return null;

  return { kind: "institution", id: choice, option };
}

/** Поля для платформы: какое учреждение выбрано. */
export function institutionFields(
  institution: ReturnType<typeof useInstitution>,
): { institutionId?: number | null } {
  if (!institution) return {};
  return {
    institutionId: institution.kind === "other" ? null : institution.id,
  };
}

/** Плашка в начале «Личных данных»: выбранное учреждение и ссылка «Изменить». */
export function InstitutionBanner() {
  const t = useTranslations("Registration");
  const locale = useLocale();
  const institution = useInstitution();

  if (!institution) return null;

  const option = institution.kind === "institution" ? institution.option : null;
  // Учреждение выбрано, но список ещё не пришёл — показывать пока нечего.
  if (institution.kind === "institution" && !option) return null;

  // Платформа отдаёт логотип как путь без хоста (/api/v1/media/…).
  const logo = getMediaUrl(option?.logo);

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
          {option ? localizedTitle(option, locale) : t("institutionOther")}
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
