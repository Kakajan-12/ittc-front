import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/shared/ui/NavBar";

export default function NavDropdown({
  item,
  scrolled = false,
}: {
  item: NavItem;
  scrolled?: boolean;
}) {
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

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 py-2 text-base transition-colors ${
          scrolled
            ? "text-brand-blue-dark hover:text-brand-blue"
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
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:text-brand-blue transition-colors hover:translate-x-1"
            >
              {child.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
