"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  readInstitutionParam,
  useInstitutionChoice,
} from "@/views/Auth/Institution";
import { useInstitutions } from "@/views/Auth/steps/Institution/hook";
import {
  REGISTRATION_STEPS,
  unlockStep,
  useReachedStep,
} from "@/views/Auth/progress";

/** Не пускает на шаг, до которого человек ещё не дошёл, — уводит на последний открытый. */
export default function StepGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reached = useReachedStep();
  const [, setInstitution] = useInstitutionChoice();
  const { data: institutions } = useInstitutions();

  const step = pathname.split("/")[2] as (typeof REGISTRATION_STEPS)[number];
  const current = REGISTRATION_STEPS.indexOf(step);
  // Страница вне списка шагов — не охраняем
  const allowed = current === -1 || (reached !== null && current <= reached);

  // Ссылка учреждения `/register/personal-info?institutionId=<id>`: учреждение
  // из неё и есть выбор, а сам шаг открыт, даже если человек пришёл впервые.
  useEffect(() => {
    if (step !== "personal-info" || !institutions) return;

    const id = readInstitutionParam();
    if (id === null) return;

    // Такого учреждения нет — не показываем вместо него прошлый выбор
    if (!institutions.some((item) => item.id === id)) {
      router.replace("/register/institution");
      return;
    }

    setInstitution(id);
    unlockStep("personal-info");
  }, [step, institutions, setInstitution, router]);

  useEffect(() => {
    if (reached === null || allowed) return;
    // Ссылку учреждения разбирает эффект выше: он откроет шаг или уведёт на выбор
    if (step === "personal-info" && readInstitutionParam() !== null) return;

    router.replace(`/register/${REGISTRATION_STEPS[reached]}`);
  }, [reached, allowed, step, institutions, router]);

  return allowed ? children : null;
}
