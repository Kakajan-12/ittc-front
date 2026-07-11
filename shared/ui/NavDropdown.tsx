import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/shared/ui/NavBar";
import { IoLockClosedOutline } from "react-icons/io5";

export default function NavDropdown({
  item,
  scrolled = false,
}: {
  item: NavItem;
  scrolled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  // true on devices with a real pointer (desktop) → open on hover;
  // false on touch devices (phones) → open on tap/click.
  const [canHover, setCanHover] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={canHover ? () => setOpen(true) : undefined}
      onMouseLeave={canHover ? () => setOpen(false) : undefined}
    >
      <button
        type="button"
        onClick={canHover ? undefined : () => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 py-1 lg:py-2 text-sm lg:text-lg  transition-colors ${
          scrolled
            ? "text-brand-gray hover:text-brand-blue"
            : "text-white hover:text-white/80"
        }`}
      >
        {item.label}
        <FaChevronDown
          className={`size-3 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 w-full rounded bg-white/95 py-2 shadow-xl">
          {item.children?.map((child) => (
            <Link
              key={`${child.label}-${child.href}`}
              href={child.href}
              onClick={() => setOpen(false)}
              className=" px-4 py-2 text-sm flex items-center justify-between gap-2 transition-colors hover:translate-x-1"
            >
              <span className="text-black hover:text-brand-blue">
                {child.label}
              </span>
              {child.href === "#" ? (
                <IoLockClosedOutline size={16} className="text-[#849299]" />
              ) : null}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
