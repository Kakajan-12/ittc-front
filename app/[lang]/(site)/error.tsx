"use client";

import ErrorScreen from "@/shared/ui/ErrorScreen";

/** Ошибка страницы сайта: шапка и футер из (site)/layout остаются на месте. */
export default function SiteError(props: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <ErrorScreen {...props} className="pt-32" />;
}
