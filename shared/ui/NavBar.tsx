"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FiMenu } from "react-icons/fi";
import { Link, usePathname } from "@/i18n/navigation";
import NavDropdown from "@/shared/ui/NavDropdown";
import MobileMenu from "@/shared/ui/MobileMenu";
import type { SiteContactsModel } from "@/shared/content/queries";
import { portalLoginUrl } from "@/shared/config/portal";

export type NavChild = {
  label: string;
  href: string;
  /** Внешняя платформа: обычная ссылка в новой вкладке, без локали в адресе. */
  external?: boolean;
};

/**
 * Пункт меню — либо ссылка, либо группа. У группы нет href: её заголовок по ТЗ
 * не кликабельный, он только раскрывает вложенный список. Отсутствие поля не
 * даёт снова превратить заголовок в ссылку — в том числе на несуществующий
 * маршрут, как было с "/travel".
 */
export type NavItem =
  | { key: string; label: string; href: string; children?: undefined }
  | { key: string; label: string; children: NavChild[] };

export default function NavBar({
  menuOpen,
  setMenuOpen,
  travel,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  travel: SiteContactsModel["travel"];
}) {
  const t = useTranslations("Navbar");
  const locale = useLocale();

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // На странице конкретной новости (/news/[id]) фон светлый,
  // поэтому текст навбара должен быть тёмным даже наверху страницы.
  const isNewsDetail = /^\/news\/[^/]+$/.test(pathname);
  const darkText = scrolled || isNewsDetail;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items: NavItem[] = [
    {
      key: "about",
      label: t("about"),
      children: [
        { label: t("about"), href: "/about" },
        { label: t("agenda"), href: "/agenda" },
        { label: t("speakers"), href: "/speakers" },
        { label: t("support"), href: "/officialsupport" },
        { label: t("faq"), href: "/faq" },
      ],
    },
    {
      key: "travel",
      label: t("travel"),
      // Адреса внешних платформ задаются в админке («Настройки сайта»).
      // Пока адреса нет, пункт — заглушка "#" под замком.
      children: [
        { label: t("visa"), url: travel.visa },
        { label: t("flight"), url: travel.flight },
        { label: t("hotel"), url: travel.hotel },
      ].map(({ label, url }) =>
        url ? { label, href: url, external: true } : { label, href: "#" },
      ),
    },
    { key: "news", label: t("news"), href: "/news" },
  ];

  return (
    <nav
      className={`fixed top-11 left-0 right-0 z-70 transition-colors duration-300 ${
        scrolled ? "bg-white shadow-header" : "bg-transparent"
      }`}
    >
      <div className="px-4 lg:px-10 flex items-center justify-between py-3 ">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.svg"
            alt={t("logoAlt")}
            width={198}
            height={48}
            priority
          />
        </Link>
        <div className="hidden items-center nav:gap-2 lg:gap-4 xl:gap-8 nav:flex">
          {items.map((item) =>
            item.children ? (
              <NavDropdown key={item.key} item={item} scrolled={darkText} />
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className={`py-1 lg:py-2 text-sm xl:text-lg transition-colors ${
                  darkText
                    ? "text-brand-gray hover:text-brand-blue"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        <div className="hidden nav:flex items-center gap-2">
          <Link
            href={portalLoginUrl(locale)}
            className={`flex h-10 items-center justify-center rounded border px-3 text-sm font-normal transition sm:px-4 lg:px-5 lg:text-base ${
              darkText
                ? "border-brand-gray text-brand-gray hover:bg-brand-gray/10"
                : "border-white text-white hover:bg-white/15"
            }`}
          >
            <span className="leading-none">{t("login")}</span>
          </Link>

          <Link
            href="/register"
            className="flex h-10 items-center justify-center rounded bg-brand-blue px-3 text-sm font-normal text-white transition hover:bg-brand-blue/85 sm:px-4 lg:px-5 lg:text-base"
          >
            {t("register")}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t("openMenu")}
          aria-expanded={menuOpen}
          className=" flex items-center justify-center rounded bg-brand-blue p-2.5 text-white transition hover:bg-brand-blue/85 nav:hidden"
        >
          <FiMenu className="size-5" />
        </button>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={items}
        homeLabel={t("home")}
      />
    </nav>
  );
}
