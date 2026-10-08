"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  type InstitutionChoice,
  useInstitutionChoice,
  useInstitutions,
} from "@/views/Auth/Institution";

/**
 * Первый экран регистрации: от какого учреждения участник. Выбор обязателен,
 * для иностранных делегатов и всех остальных есть «Другое». QR-код
 * учреждения (/register?org=<id>) выбирает его сам и сразу ведёт дальше.
 */
export default function InstitutionStep() {
  const t = useTranslations("Registration");
  const router = useRouter();
  const [stored, setStored] = useInstitutionChoice();
  // Сохранённый выбор появляется только после гидратации, поэтому он —
  // запасное значение, а не начальное состояние.
  const [picked, setPicked] = useState<InstitutionChoice | null>(null);
  const selected = picked ?? stored;
  const { data: institutions, isLoading } = useInstitutions();

  // Пришли по QR-коду: учреждение из ссылки выбирается сразу.
  useEffect(() => {
    if (!institutions) return;

    const org = Number(new URLSearchParams(window.location.search).get("org"));

    if (org && institutions.some((item) => item.id === org)) {
      setStored(org);
      router.replace("/register/personal-info");
    }
  }, [institutions, setStored, router]);

  const proceed = () => {
    if (selected === null) return;
    setStored(selected);
    router.push("/register/personal-info");
  };

  const option = (value: InstitutionChoice, label: string, logo?: string | null) => {
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
            <span className="flex size-10 shrink-0 items-center justify-center rounded bg-white p-1">
              {logo && (
                // eslint-disable-next-line @next/next/no-img-element -- логотип из CMS, мелкий
                <img src={logo} alt="" width={40} height={40} className="size-full object-contain" />
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

      <ul role="radiogroup" aria-label={t("institutionTitle")} className="mt-4 flex min-h-0 flex-col gap-2 overflow-y-auto scrollbar-none">
        {isLoading ? (
          <li className="text-sm text-white/70">…</li>
        ) : (
          (institutions ?? []).map((item) => option(item.id, item.name, item.logo))
        )}
        {option("other", t("institutionOther"))}
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
