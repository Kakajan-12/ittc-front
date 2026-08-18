"use client";
import { FaChevronDown } from "react-icons/fa6";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { GrLanguage } from "react-icons/gr";
export default function LangSwitcher({
  registration,
  isOpen,
  className,
}: {
  registration?: boolean;
  isOpen?: boolean;
  className?: string;
}) {
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
    <div className={`relative w-fit shrink-0 group ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center text-white gap-2 text-base ${
          registration
            ? "w-fit justify-center rounded glass bg-white/10 hover:bg-white/52 px-2 py-1 h-10 text-base hover:text-[#0071BB] transition-colors"
            : " group-hover:text-white/80"
        }`}
        aria-expanded={open}
      >
        <GrLanguage
          className={`size-6 text-white hover:text-[#0071BB] ${registration ? "block" : "hidden"}`}
        />

        <span className={registration ? "" : "mt-0.5 font-normal"}>
          {shortLabel}
        </span>
        <FaChevronDown
          className={`size-3 transition text-white group-hover:text-white/80 ${open ? "rotate-180" : ""} ${registration ? "hidden" : "block"}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          className={`absolute top-full left-0 right-0 z-100 mt-2 overflow-hidden rounded cursor-pointer ${
            registration
              ? "glass bg-white/15 py-1 w-17"
              : " bg-white/90 py-2 w-fit shadow-lg backdrop-blur-sm"
          }`}
        >
          {routing.locales
            .filter((loc) => loc !== locale)
            .map((loc, i, arr) => (
              <div key={loc} className="px-3">
                <button
                  type="button"
                  className={`block w-full text-center transition-colors py-1 text-base ${
                    registration
                      ? `leading-none text-white hover:text-white/80 ${i > 0 ? "pt-2" : ""}`
                      : ` ${isOpen ? "text-black hover:text-white hover:bg-brand-blue" : "text-black hover:bg-white"}`
                  }`}
                  onClick={() => switchLocale(loc)}
                >
                  <span>
                    {loc === "en" ? t("en") : loc === "ru" ? t("ru") : t("tk")}
                  </span>
                </button>
                {registration && i < arr.length - 1 ? (
                  <span className="block h-px w-full bg-white/80" />
                ) : null}
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
}
