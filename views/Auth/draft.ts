"use client";

import { useSyncExternalStore } from "react";
import type { RegistrationDraft } from "./types";

/**
 * Драфт регистрации в `localStorage` — ответ бэка после каждого шага. Из него
 * шаги заполняют поля, когда пользователь возвращается назад по степперу.
 */
export const DRAFT_STORAGE_KEY = "eventDraft";

const listeners = new Set<() => void>();

/**
 * raw-строка → разобранный драфт. `getSnapshot` обязан возвращать стабильную
 * ссылку, иначе React уходит в бесконечный рендер.
 */
let cache: { raw: string; draft: RegistrationDraft | null } | null = null;

/** Ручки отдают то сам драфт, то весь ответ целиком (`{ data: draft }`) */
function unwrap(parsed: unknown): RegistrationDraft | null {
  if (!parsed || typeof parsed !== "object") return null;

  const value = parsed as RegistrationDraft & { data?: RegistrationDraft };
  const draft = value.data ?? value;

  return typeof draft?.id === "number" ? draft : null;
}

export function readDraft(): RegistrationDraft | null {
  let raw: string | null = null;

  try {
    raw = localStorage.getItem(DRAFT_STORAGE_KEY);
  } catch {
    // Приватный режим или недоступное хранилище
    return null;
  }

  if (!raw) return null;
  if (cache?.raw === raw) return cache.draft;

  try {
    const draft = unwrap(JSON.parse(raw));
    cache = { raw, draft };
    return draft;
  } catch {
    // Битый JSON — считаем, что драфта нет
    return null;
  }
}

/** Сохраняет ответ шага и будит подписчиков в этой же вкладке */
export function saveDraft(response: unknown): RegistrationDraft | null {
  const draft = unwrap(response);

  if (!draft) return null;

  const raw = JSON.stringify(draft);

  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, raw);
  } catch {
    // Хранилище переполнено/недоступно — драфт просто не переживёт перезагрузку
  }

  cache = { raw, draft };
  listeners.forEach((onChange) => onChange());

  return draft;
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Хранилище недоступно — чистить нечего
  }

  cache = null;
  listeners.forEach((onChange) => onChange());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  // `storage` приходит только из других вкладок — про свои правки сообщаем сами
  const onStorage = (event: StorageEvent) => {
    if (event.key === DRAFT_STORAGE_KEY) onChange();
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Драфт текущей регистрации; `null`, пока ни один шаг не сохранён */
export function useRegistrationDraft(): RegistrationDraft | null {
  // На сервере и в момент гидрации драфта нет: разметка совпадает, значение
  // подставляется сразу после монтирования
  return useSyncExternalStore(subscribe, readDraft, () => null);
}
