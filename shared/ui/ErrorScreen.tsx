"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import StatusScreen, { secondaryButtonClass } from "@/shared/ui/StatusScreen";

/** Содержимое error.tsx: одно и то же для страниц сайта и для [lang] целиком. */
export default function ErrorScreen({
  error,
  retry,
  className,
}: {
  error: Error & { digest?: string };
  retry: () => void;
  className?: string;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    // В продакшене сообщение серверной ошибки скрыто, digest связывает
    // её с записью в серверных логах.
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      title={t("title")}
      text={t("text")}
      homeLabel={t("home")}
      className={className}
      action={
        <button type="button" onClick={() => retry()} className={secondaryButtonClass}>
          {t("retry")}
        </button>
      }
    />
  );
}
