"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { CONTENT_API_URL } from "@/shared/content/config";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { STORAGE_KEYS } from "./config";

/**
 * Регистрация по QR-коду учреждения: ссылка вида
 * /register/personal-info?org=<code>. Код запоминается на всю регистрацию
 * (sessionStorage, как и остальные шаги) и уходит на платформу вместе с
 * личными данными. Список учреждений и QR-коды ведутся в админке.
 */

const CODE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type InstitutionResponse = {
  code: string;
  nameEn: string;
  nameRu: string;
  nameTk: string;
  logo: { url: string } | null;
};

export type Institution = { code: string; name: string; logo: string | null };

export function useInstitution(): Institution | null {
  const locale = useLocale();
  const [code, setCode] = usePersistentState<string | null>(
    STORAGE_KEYS.institution,
    null,
  );

  // Адрес читается в эффекте, а не через useSearchParams: так страница не
  // требует Suspense и остаётся статической.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("org");

    if (fromUrl && CODE_PATTERN.test(fromUrl) && fromUrl !== code) {
      setCode(fromUrl);
    }
  }, [code, setCode]);

  const { data } = useQuery({
    queryKey: ["institution", code],
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<InstitutionResponse | null> => {
      const response = await fetch(
        `${CONTENT_API_URL}/institutions/code/${encodeURIComponent(code!)}`,
      );
      if (!response.ok) return null;
      const body = await response.json();
      return body?.success ? (body.data as InstitutionResponse) : null;
    },
  });

  // Неизвестный или снятый с публикации код — как будто его нет: ни
  // плашки, ни отправки на платформу.
  if (!data) return null;

  const name =
    locale === "ru" ? data.nameRu : locale === "tk" ? data.nameTk : data.nameEn;

  return { code: data.code, name, logo: data.logo?.url ?? null };
}

/** Плашка в начале регистрации: от какого учреждения она идёт. */
export function InstitutionBanner() {
  const t = useTranslations("Registration");
  const institution = useInstitution();

  if (!institution) return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded border border-white/30 bg-white/10 px-4 py-3">
      {institution.logo && (
        // eslint-disable-next-line @next/next/no-img-element -- логотип из CMS, мелкий
        <img
          src={institution.logo}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded bg-white object-contain p-1"
        />
      )}
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-white/70">
          {t("institution")}
        </p>
        <p className="text-base font-medium text-white">{institution.name}</p>
      </div>
    </div>
  );
}
