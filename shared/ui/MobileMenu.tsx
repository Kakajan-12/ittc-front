"use client";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/shared/ui/NavBar";
import { IoLockClosedOutline } from "react-icons/io5";
import { useLocale, useTranslations } from "next-intl";
import { portalLoginUrl } from "@/shared/config/portal";

export default function MobileMenu({
  open,
  onClose,
  items,
  homeLabel,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  homeLabel: string;
}) {
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const locale = useLocale();

  // "#" — заглушка (раздел ещё не готов), такие ссылки активными не считаем
  const isActive = (href: string) =>
    href !== "#" &&
    (href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden" aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-80 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-80 flex w-4/5 max-w-sm flex-col overflow-y-auto bg-white px-6 py-10 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="self-end text-brand-blue transition hover:text-brand-blue/70"
        >
          <IoClose className="size-7 text-brand-blue" />
        </button>

        <nav className="mt-4 flex flex-col gap-7">
          <Link
            href="/"
            onClick={onClose}
            aria-current={isActive("/") ? "page" : undefined}
            className={`text-base font-roboto transition hover:text-brand-blue ${
              isActive("/") ? "font-semibold text-brand-blue" : "text-black"
            }`}
          >
            {homeLabel}
          </Link>

          {items.map((item) =>
            item.children ? (
              <div key={item.key} className="flex flex-col gap-5">
                {/* Заголовок группы не кликабельный — как и на десктопе,
                    где это button, раскрывающий список. */}
                <h2
                  id={`mobile-nav-${item.key}`}
                  className="text-base font-roboto text-black"
                >
                  {item.label}
                </h2>
                <ul
                  aria-labelledby={`mobile-nav-${item.key}`}
                  className="flex flex-col gap-6 pl-2.5 text-brand-gray"
                >
                  {item.children.map((child, index) => {
                    const active = isActive(child.href);
                    return (
                      <li
                        key={`${child.href}-${index}`}
                        className="flex items-center gap-3"
                      >
                        <span
                          className={`shrink-0 size-2 rounded-full transition-all ${
                            active ? "bg-brand-blue" : "bg-brand-blue/40"
                          }`}
                        />
                        <Link
                          href={child.href}
                          onClick={onClose}
                          aria-current={active ? "page" : undefined}
                          className="text-base transition w-full flex items-center justify-between hover:text-brand-blue group"
                        >
                          <span
                            className={
                              active
                                ? "font-semibold text-brand-blue"
                                : "text-black group-hover:text-brand-blue"
                            }
                          >
                            {child.label}
                          </span>
                          {child.href === "#" ? (
                            <IoLockClosedOutline
                              size={16}
                              className="text-gray-400"
                            />
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                onClick={onClose}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`text-base font-roboto transition hover:text-brand-blue ${
                  isActive(item.href) ? "text-brand-blue" : "text-black"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* mt-auto прижимает кнопки к низу панели, когда меню короче экрана;
            когда пунктов много — они просто идут за навигацией и скроллятся
            вместе с ней. shrink-0 не даёт flex-контейнеру их сплющить. */}
        <div className="mt-auto flex shrink-0 flex-col gap-3 pt-10">
          <Link
            href={portalLoginUrl(locale)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded border border-brand-gray px-5 text-base font-normal text-brand-gray transition"
          >
            <span className="leading-none">{t("login")}</span>
            <span className="w-2" />
          </Link>

          <Link
            href="/register"
            onClick={onClose}
            className="flex h-10 w-full items-center justify-center rounded bg-brand-blue px-5 text-base font-normal text-white transition hover:bg-brand-blue/85"
          >
            {t("register")}
          </Link>
        </div>
      </div>
    </div>
  );
}
