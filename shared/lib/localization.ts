type LocalizedTitle = {
  titleEn?: string | null;
  titleRu?: string | null;
  titleTk?: string | null;
};

type LocalizedSubtitle = {
  subtitleEn?: string | null;
  subtitleRu?: string | null;
  subtitleTk?: string | null;
};

export function localizedTitle(
  item: LocalizedTitle | null | undefined,
  locale: string,
): string {
  if (!item) return "";
  if (locale === "ru") return item.titleRu ?? item.titleEn ?? "";
  if (locale === "tk") return item.titleTk ?? item.titleEn ?? "";
  return item.titleEn ?? "";
}

export function localizedSubtitle(
  item: LocalizedSubtitle | null | undefined,
  locale: string,
): string {
  if (!item) return "";
  if (locale === "ru") return item.subtitleRu ?? item.subtitleEn ?? "";
  if (locale === "tk") return item.subtitleTk ?? item.subtitleEn ?? "";
  return item.subtitleEn ?? "";
}
