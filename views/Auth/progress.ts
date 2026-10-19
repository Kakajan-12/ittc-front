"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "./config";

/**
 * Докуда человек дошёл в регистрации. Шаг открывается только после того, как
 * пройден предыдущий, — прямой переход по ссылке дальше не пускает.
 * Хранится в `sessionStorage`, как и остальное состояние регистрации.
 */
export const REGISTRATION_STEPS = [
  "institution",
  "personal-info",
  "organization-info",
  "services",
  "payment",
  "verification",
  "success",
] as const;

export type T_REGISTRATION_STEP_LINK = (typeof REGISTRATION_STEPS)[number];

const listeners = new Set<() => void>();

/** Индекс самого дальнего открытого шага; выбор учреждения открыт всегда */
function readReached(): number {
  try {
    const value = Number(sessionStorage.getItem(STORAGE_KEYS.reachedStep));
    return Number.isInteger(value) && value > 0 ? value : 0;
  } catch {
    // Хранилище недоступно — пускаем только на первый шаг
    return 0;
  }
}

/** Открывает шаг — вызывается, когда предыдущий успешно пройден */
export function unlockStep(step: T_REGISTRATION_STEP_LINK) {
  const index = REGISTRATION_STEPS.indexOf(step);
  if (index <= readReached()) return;

  try {
    sessionStorage.setItem(STORAGE_KEYS.reachedStep, String(index));
  } catch {
    // Хранилище недоступно — шаг не откроется после перезагрузки
  }

  listeners.forEach((onChange) => onChange());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/**
 * Индекс самого дальнего открытого шага. На сервере и при гидратации — `null`:
 * хранилище ещё не прочитано, и решать, пускать ли на шаг, рано.
 */
export function useReachedStep(): number | null {
  return useSyncExternalStore(subscribe, readReached, () => null);
}
