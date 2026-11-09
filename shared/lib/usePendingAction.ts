import { useCallback, useRef, useState } from "react";

/**
 * Включает pending сразу по клику и держит его, пока action не вернёт false.
 * При успехе флаг не сбрасывается: дальше идёт router.push, и спиннер
 * должен крутиться до смены шага. Повторные клики во время pending игнорируются.
 */
export function usePendingAction() {
  const [isPending, setIsPending] = useState(false);
  const lock = useRef(false);

  const run = useCallback(async (action: () => Promise<boolean>) => {
    if (lock.current) return;
    lock.current = true;
    setIsPending(true);

    let ok = false;
    try {
      ok = await action();
    } finally {
      if (!ok) {
        lock.current = false;
        setIsPending(false);
      }
    }
  }, []);

  return { isPending, run };
}
