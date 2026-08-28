"use client";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/shared/ui/NavBar";
import { IoLockClosedOutline } from "react-icons/io5";

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

        <nav className="mt-10 flex flex-col gap-7">
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
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`text-base font-roboto transition hover:text-brand-blue ${
                    isActive(item.href)
                      ? "font-semibold text-brand-blue"
                      : "text-black"
                  }`}
                >
                  {item.label}
                </Link>
                <ul className="flex flex-col gap-6 pl-2.5 text-brand-gray">
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
      </div>
    </div>
  );
}
