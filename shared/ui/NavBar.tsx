"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FiMenu } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import NavDropdown from "@/shared/ui/NavDropdown";
import MobileMenu from "@/shared/ui/MobileMenu";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

// function NavDropdown({ item }: { item: NavItem }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const onDoc = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("click", onDoc);
//     return () => document.removeEventListener("click", onDoc);
//   }, []);

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         type="button"
//         onClick={() => setOpen((v) => !v)}
//         aria-expanded={open}
//         className="flex items-center gap-1.5 py-2 text-base text-white/90 transition hover:text-white"
//       >
//         {item.label}
//         <FaChevronDown
//           className={`size-3 transition ${open ? "rotate-180" : ""}`}
//           aria-hidden
//         />
//       </button>
//       {open ? (
//         <div className="absolute left-0 top-full z-50 mt-2 min-w-52 rounded-md border border-white/10 bg-brand-blue-dark py-2 shadow-xl">
//           {item.children?.map((child) => (
//             <Link
//               key={child.href}
//               href={child.href}
//               onClick={() => setOpen(false)}
//               className="block px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
//             >
//               {child.label}
//             </Link>
//           ))}
//         </div>
//       ) : null}
//     </div>
//   );
// }

export default function NavBar() {
  const t = useTranslations("Navbar");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      href: "/about",
      children: [
        { label: t("agenda"), href: "/agenda" },
        { label: t("speakers"), href: "/speakers" },
        { label: t("sponsors"), href: "/sponsors" },
        { label: t("support"), href: "/support" },
        { label: t("register"), href: "/register" },
        { label: t("faq"), href: "/faq" },
      ],
    },
    {
      key: "travel",
      label: t("travel"),
      href: "/travel",
      children: [
        { label: t("visa"), href: "/visa" },
        { label: t("flight"), href: "/flight" },
        { label: t("hotel"), href: "/hotel" },
      ],
    },
    { key: "news", label: t("news"), href: "/news" },
  ];

  return (
    <nav
      className={`fixed top-11 left-0 right-0 z-70 transition-colors duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-10 flex items-center justify-between py-3 ">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.svg"
            alt={t("logoAlt")}
            width={198}
            height={48}
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {items.map((item) =>
            item.children ? (
              <NavDropdown key={item.key} item={item} scrolled={scrolled} />
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className={`py-2 text-base transition-colors ${
                  scrolled
                    ? "text-brand-blue-dark hover:text-brand-blue"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}

          <Link
            href="/register"
            className="rounded bg-brand-blue px-5 py-2.5 text-base font-bold text-white transition hover:bg-brand-blue/85"
          >
            {t("register")}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t("openMenu")}
          aria-expanded={menuOpen}
          className="flex items-center justify-center rounded-md bg-brand-blue p-2.5 text-white transition hover:bg-brand-blue/85 md:hidden"
        >
          <FiMenu className="size-6" />
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
