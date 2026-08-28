import { T_LOCALE } from "@/shared/lib/types";

export function getPathWithoutLocale(pathname: string) {
  const locales: T_LOCALE[] = ["en", "tk", "ru"];
  const segments = pathname.split("/");
  const maybeLocale = segments[1] as T_LOCALE;
  if (locales.includes(maybeLocale)) {
    return "/" + segments.slice(2).join("/");
  }
}
