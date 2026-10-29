import { T_LOCALE } from "./lib/types";

export const localizedTitle = <
  T extends {
    titleEn?: string | null;
    titleRu?: string | null;
    titleTk?: string | null;
  },
>({
  titleEn,
  titleRu,
  titleTk,
  locale,
}: T & { locale: T_LOCALE }): string => {
  switch (locale) {
    case "ru":
      return titleRu ?? titleEn ?? titleTk ?? "";

    case "tk":
      return titleTk ?? titleEn ?? titleRu ?? "";

    case "en":
    default:
      return titleEn ?? titleRu ?? titleTk ?? "";
  }
};
