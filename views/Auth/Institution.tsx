"use client";

import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { CONTENT_API_URL } from "@/shared/content/config";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { STORAGE_KEYS } from "./config";

/**
 * Учреждение, от которого идёт регистрация. Учреждения — это организаторы,
 * отмеченные в админке «Учреждение в регистрации». Выбор обязателен и
 * делается на экране /register/institution перед «Личными данными»; QR-код
 * учреждения (/register?org=<id>) выбирает его сразу. Выбор хранится в
 * sessionStorage, как и остальные шаги, и уходит на платформу вместе с
 * личными данными.
 */

/** id организатора или «Другое / не от учреждения». */
export type InstitutionChoice = number | "other";

type Partner = {
  id: number;
  nameEn: string;
  nameRu: string;
  nameTk: string;
  logo: { url: string } | null;
};

export type InstitutionOption = { id: number; name: string; nameEn: string; logo: string | null };

function localizedName(partner: Partner, locale: string) {
  return locale === "ru" ? partner.nameRu : locale === "tk" ? partner.nameTk : partner.nameEn;
}

async function apiGet<T>(path: string): Promise<T | null> {
  const response = await fetch(`${CONTENT_API_URL}/${path}`);
  if (!response.ok) return null;
  const body = await response.json();
  return body?.success ? (body.data as T) : null;
}

export function useInstitutionChoice() {
  return usePersistentState<InstitutionChoice | null>(STORAGE_KEYS.institution, null);
}

/** Список учреждений для экрана выбора — опубликованные, по порядку. */
export function useInstitutions() {
  const locale = useLocale();
  const filters = encodeURIComponent(
    JSON.stringify([
      { field: "kind", op: "eq", val: "ORGANIZER" },
      { field: "isInstitution", op: "eq", val: true },
    ]),
  );

  return useQuery({
    queryKey: ["institutions", locale],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<InstitutionOption[]> => {
      const data = await apiGet<{ items: Partner[] }>(
        `partners?limit=50&orderBy=order&orderDirection=asc&filters=${filters}`,
      );
      return (data?.items ?? []).map((partner) => ({
        id: partner.id,
        name: localizedName(partner, locale),
        nameEn: partner.nameEn,
        logo: partner.logo?.url ?? null,
      }));
    },
  });
}

/** Выбранное учреждение: само учреждение, «Другое» или ничего не выбрано. */
export function useInstitution():
  | { kind: "institution"; option: InstitutionOption }
  | { kind: "other" }
  | null {
  const locale = useLocale();
  const [choice] = useInstitutionChoice();
  const id = typeof choice === "number" ? choice : null;

  const { data } = useQuery({
    queryKey: ["institution", id, locale],
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<InstitutionOption | null> => {
      const partner = await apiGet<Partner & { isInstitution?: boolean }>(`partners/${id}`);
      if (!partner || !partner.isInstitution) return null;
      return {
        id: partner.id,
        name: localizedName(partner, locale),
        nameEn: partner.nameEn,
        logo: partner.logo?.url ?? null,
      };
    },
  });

  if (choice === "other") return { kind: "other" };
  if (data) return { kind: "institution", option: data };
  return null;
}

/** Поля для платформы: какое учреждение выбрано. */
export function institutionFields(
  institution: ReturnType<typeof useInstitution>,
): { institutionId?: number | null; institutionName?: string } {
  if (!institution) return {};
  if (institution.kind === "other") return { institutionId: null, institutionName: "Other" };
  return { institutionId: institution.option.id, institutionName: institution.option.nameEn };
}

/** Плашка в начале «Личных данных»: выбранное учреждение и ссылка «Изменить». */
export function InstitutionBanner() {
  const t = useTranslations("Registration");
  const institution = useInstitution();

  if (!institution) return null;

  const option = institution.kind === "institution" ? institution.option : null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded border border-white/30 bg-white/10 px-4 py-3">
      {option?.logo && (
        // eslint-disable-next-line @next/next/no-img-element -- логотип из CMS, мелкий
        <img
          src={option.logo}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded bg-white object-contain p-1"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-white/70">{t("institution")}</p>
        <p className="text-base font-medium text-white">
          {option ? option.name : t("institutionOther")}
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
