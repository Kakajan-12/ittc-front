"use client";

import { useEffect, useState } from "react";

/**
 * Значение с задержкой — чтобы запрос уходил не на каждое нажатие, а когда
 * пользователь перестал печатать.
 */
export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
