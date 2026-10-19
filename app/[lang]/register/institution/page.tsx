"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  personalInfoHref,
  readInstitutionParam,
  useInstitutionChoice,
} from "@/views/Auth/Institution";
import { useInstitutions } from "@/views/Auth/steps/Institution/hook";
import { unlockStep } from "@/views/Auth/progress";
import { localizedTitle } from "@/shared/lib/localization";
import { getMediaUrl } from "@/shared/lib/helpers";

/**
 * Первый экран регистрации: от какого учреждения участник. Выбор обязателен,
 * «Другое» приходит из справочника как обычное учреждение. QR-код
 * учреждения (/register?institutionId=<id>) выбирает его сам и сразу ведёт дальше.
 */
export default function InstitutionStep() {
  const t = useTranslations("Registration");
  const locale = useLocale();
  const router = useRouter();
  const [stored, setStored] = useInstitutionChoice();
  const [picked, setPicked] = useState<number | null>(null);
  const selected = picked ?? stored;
  const { data: institutions, isLoading } = useInstitutions();

  // Пришли по QR-коду: учреждение из ссылки выбирается сразу.
  useEffect(() => {
    if (!institutions) return;

    const org = readInstitutionParam();

    if (org !== null && institutions.some((item) => item.id === org)) {
      setStored(org);
      unlockStep("personal-info");
      router.replace(personalInfoHref(org));
    }
  }, [institutions, setStored, router]);

  const proceed = () => {
    if (selected === null) return;
    setStored(selected);
    unlockStep("personal-info");
    router.push(personalInfoHref(selected));
  };

  const option = (value: number, label: string, logo?: string | null) => {
    const active = selected === value;

    return (
      <li key={String(value)}>
        <button
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => setPicked(value)}
          className={`flex w-full items-center gap-3 rounded border px-4 py-3 text-left transition-colors ${
            active
              ? "border-white bg-white/20"
              : "border-white/30 bg-white/5 hover:bg-white/10"
          }`}
        >
          {logo !== undefined && (
            <span className="flex size-10 shrink-0 items-center justify-center rounded bg-white">
              {logo && (
                // eslint-disable-next-line @next/next/no-img-element -- логотип из CMS, мелкий
                <img
                  src={logo}
                  alt=""
                  width={40}
                  height={40}
                  className="size-full object-contain rounded"
                />
              )}
            </span>
          )}
          <span className="flex-1 text-base text-white">{label}</span>
          <span
            aria-hidden
            className={`size-4 shrink-0 rounded-full border-2 ${
              active ? "border-white bg-white" : "border-white/60"
            }`}
          />
        </button>
      </li>
    );
  };

  return (
    <div className="mt-5 flex min-h-0 flex-1 flex-col text-white">
      <h2 className="text-lg font-semibold">{t("institutionTitle")}</h2>
      <p className="mt-1 text-sm text-white/70">{t("institutionHint")}</p>

      <ul
        role="radiogroup"
        aria-label={t("institutionTitle")}
        className="mt-4 flex min-h-0 flex-col gap-2 overflow-y-auto scrollbar-none"
      >
        {isLoading ? (
          <li className="text-sm text-white/70">…</li>
        ) : (
          (institutions ?? []).map((item) =>
            option(
              item.id,
              localizedTitle(item, locale),
              getMediaUrl(item.logo),
            ),
          )
        )}
      </ul>

      <button
        type="button"
        onClick={proceed}
        disabled={selected === null}
        className="mt-5 h-12 shrink-0 rounded bg-[#0071BB] font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {t("institutionNext")}
      </button>
    </div>
  );
}
