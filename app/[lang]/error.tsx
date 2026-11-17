"use client";

import ErrorScreen from "@/shared/ui/ErrorScreen";

/**
 * Ловит то, до чего не дотягивается (site)/error.tsx: падение самого
 * (site)/layout и страниц регистрации. Шапки здесь нет — она часть того
 * layout, который и упал.
 */
export default function LocaleError(props: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="flex flex-1 items-center bg-white">
      <ErrorScreen {...props} />
    </main>
  );
}
