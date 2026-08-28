"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

/**
 * `sessionStorage` как внешнее хранилище для React: значение переживает
 * переход на другой маршрут. Это нужно при смене языка — она уводит с
 * `/en/...` на `/ru/...`, дерево пересоздаётся и обычный `useState`
 * обнуляется. Переживает и перезагрузку страницы, но не закрытие вкладки.
 */

const listeners = new Map<string, Set<() => void>>();

/**
 * raw-строка → распарсенное значение. `getSnapshot` обязан возвращать
 * стабильную ссылку, иначе React уходит в бесконечный рендер.
 */
const parsedCache = new Map<string, { raw: string; value: unknown }>();

function subscribe(key: string, onChange: () => void) {
  let forKey = listeners.get(key);
  if (!forKey) {
    forKey = new Set();
    listeners.set(key, forKey);
  }
  forKey.add(onChange);
  return () => {
    forKey!.delete(onChange);
    if (!forKey!.size) listeners.delete(key);
  };
}

function readRaw(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    // Приватный режим или недоступное хранилище
    return null;
  }
}

function writeRaw(key: string, raw: string) {
  try {
    sessionStorage.setItem(key, raw);
  } catch {
    // Хранилище переполнено/недоступно — состояние просто не переживёт переход
  }
}

/** `useState`, значение которого хранится в `sessionStorage` под `key` */
export function usePersistentState<T>(key: string, initial: T) {
  // Начальное значение часто передают литералом (`{}`) — фиксируем ссылку,
  // чтобы снапшот пустого хранилища не менялся от рендера к рендеру
  const initialRef = useRef(initial);

  const subscribeToKey = useCallback(
    (onChange: () => void) => subscribe(key, onChange),
    [key],
  );

  const getSnapshot = useCallback((): T => {
    const raw = readRaw(key);
    if (raw === null) return initialRef.current;

    const cached = parsedCache.get(key);
    if (cached && cached.raw === raw) return cached.value as T;

    try {
      const value = JSON.parse(raw) as T;
      parsedCache.set(key, { raw, value });
      return value;
    } catch {
      // Битый JSON — считаем, что сохранённого нет
      return initialRef.current;
    }
  }, [key]);

  // На сервере и в момент гидрации отдаём initial: разметка совпадает,
  // сохранённое значение подставляется сразу после монтирования
  const getServerSnapshot = useCallback((): T => initialRef.current, []);

  const value = useSyncExternalStore(
    subscribeToKey,
    getSnapshot,
    getServerSnapshot,
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(getSnapshot())
          : next;
      const raw = JSON.stringify(resolved);
      writeRaw(key, raw);
      parsedCache.set(key, { raw, value: resolved });
      listeners.get(key)?.forEach((onChange) => onChange());
    },
    [key, getSnapshot],
  );

  return [value, setValue] as const;
}

/** Убирает сохранённое состояние — например, после успешной регистрации */
export function clearPersisted(keys: readonly string[]) {
  for (const key of keys) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Хранилище недоступно — чистить нечего
    }
    parsedCache.delete(key);
    listeners.get(key)?.forEach((onChange) => onChange());
  }
}
