"use client";
import { FaChevronDown } from "react-icons/fa6";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LangSwitcher({ isOpen }: { isOpen?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Footer");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const switchLocale = (next: string) => {
    setOpen(false);
    router.replace(pathname, { locale: next });
  };

  const shortLabel =
    locale === "en" ? t("en") : locale === "ru" ? t("ru") : t("tk");

  return (
    <div className="relative w-fit px-2 shrink-0 group " ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 text-base text-white group-hover:text-white/80`}
        aria-expanded={open}
      >
        {shortLabel}
        <FaChevronDown
          className={`size-3 transition text-white group-hover:text-white/80 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="absolute top-full left-0 right-0 z-100 mt-2 min-w-max rounded bg-white/90 py-2 shadow-lg backdrop-blur-sm">
          {routing.locales
            .filter((loc) => loc !== locale)
            .map((loc) => (
              <button
                key={loc}
                type="button"
                className={`block w-full px-2 py-1 lg:py-2 text-center text-base ${isOpen ? " text-black hover:text-white hover:bg-brand-blue" : " text-black hover:bg-white"}`}
                onClick={() => switchLocale(loc)}
              >
                {loc === "en" ? t("en") : loc === "ru" ? t("ru") : t("tk")}
              </button>
            ))}
        </div>
      ) : null}
    </div>
  );
}
