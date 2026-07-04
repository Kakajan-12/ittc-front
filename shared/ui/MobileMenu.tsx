"use client";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/shared/ui/NavBar";

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
            className="text-base font-roboto transition hover:text-brand-blue"
          >
            {homeLabel}
          </Link>

          {items.map((item) =>
            item.children ? (
              <div key={item.key} className="flex flex-col gap-5">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="text-base font-roboto transition hover:text-brand-blue"
                >
                  {item.label}
                </Link>
                <ul className="flex flex-col gap-6 pl-2.5 text-brand-gray">
                  {item.children.map((child) => {
                    const active = pathname === child.href;
                    return (
                      <li key={child.href} className="flex items-center gap-3">
                        <span className="size-2 shrink-0 rounded-full bg-brand-blue" />
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className={`text-base transition hover:text-brand-blue ${
                            active ? "text-brand-blue" : "text-brand-gray"
                          }`}
                        >
                          {child.label}
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
                className="text-lg font-bold text-black transition hover:text-brand-blue"
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
