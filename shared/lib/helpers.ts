import { T_LOCALE } from "./types";

export function PRINT(...args: any[]) {
  console.log(`✅ ============================= ✅`);
  args.forEach((arg) => {
    if (typeof arg === "object") {
      console.log(`:`, JSON.stringify(arg, null, 2));
    } else {
      console.log(`:`, arg);
    }
  });
  console.log(`✅ ============================= ✅`);
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getMediaUrl = (path?: string | null): string => {
  if (!path) return "";
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;

  const base = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(/\/+$/, "");
  return `${base}/${path.replace(/^\/+/, "")}`;
};

export const getLocalizedTitle = ({
  titleEn,
  titleRu,
  titleTk,
  locale,
}: {
  titleEn: string;
  titleRu: string;
  titleTk: string;
  locale: T_LOCALE;
}): string => {
  switch (locale) {
    case "ru":
      return titleRu;

    case "tk":
      return titleTk;

    case "en":
    default:
      return titleEn;
  }
};
