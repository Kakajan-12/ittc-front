"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./[lang]/globals.css";

/**
 * Последний рубеж: срабатывает, если упал сам корневой [lang]/layout.
 * Тогда нет ни <html>, ни NextIntlClientProvider, поэтому документ и
 * переводы — здесь же, а язык берётся из первого сегмента адреса.
 */
const TEXTS = {
  en: {
    title: "Something went wrong",
    text: "We couldn't load this page. Please try again in a moment.",
    retry: "Try again",
    home: "Go to homepage",
  },
  ru: {
    title: "Что-то пошло не так",
    text: "Не удалось загрузить страницу. Попробуйте ещё раз через минуту.",
    retry: "Попробовать снова",
    home: "На главную",
  },
  tk: {
    title: "Näsazlyk ýüze çykdy",
    text: "Sahypany ýükläp bolmady. Biraz soňra gaýtadan synanyşyň.",
    retry: "Gaýtadan synanyşmak",
    home: "Baş sahypa",
  },
} as const;

type Lang = keyof typeof TEXTS;

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const pathname = usePathname();
  const segment = pathname?.split("/")[1];
  const lang: Lang = segment && segment in TEXTS ? (segment as Lang) : "en";
  const t = TEXTS[lang];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={lang} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white">
        <title>{t.title}</title>
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="text-2xl font-medium text-brand-dark-gray sm:text-3xl lg:text-4xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-xl text-base text-brand-gray lg:text-lg">
            {t.text}
          </p>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => retry()}
              className="flex w-full cursor-pointer items-center justify-center rounded border border-brand-blue px-8 py-2.5 text-base text-brand-blue transition hover:bg-brand-blue/5 sm:w-fit"
            >
              {t.retry}
            </button>
            {/* Обычная ссылка, а не Link: роутер мог упасть вместе с layout. */}
            <a
              href={`/${lang}`}
              className="flex w-full items-center justify-center rounded bg-brand-blue px-8 py-2.5 text-base text-white transition hover:bg-brand-blue/90 sm:w-fit"
            >
              {t.home}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
