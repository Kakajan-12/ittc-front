import React from "react";
import { LuMail, LuPhone } from "react-icons/lu";
import { PiTelegramLogo } from "react-icons/pi";
import { FaWhatsapp, FaInstagram } from "react-icons/fa6";
import { SlSocialLinkedin } from "react-icons/sl";
// import { FiLinkedin } from "react-icons/fi";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import FooterAccordion from "@/shared/ui/FooterAccordion";

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  { label: "Telegram", href: "#", icon: <PiTelegramLogo /> },
  { label: "WhatsApp", href: "#", icon: <FaWhatsapp /> },
  { label: "Instagram", href: "#", icon: <FaInstagram /> },
  { label: "LinkedIn", href: "#", icon: <SlSocialLinkedin /> },
];

type FooterLinkItem = { label: string; href: string; icon?: React.ReactNode };
type FooterLinkConfig = {
  labelKey?: string;
  label?: string;
  href: string;
  icon?: React.ReactNode;
};

const SECTIONS: { titleKey: string; links: FooterLinkConfig[] }[] = [
  {
    titleKey: "info",
    links: [
      { labelKey: "agenda", href: "/agenda" },
      { labelKey: "speakers", href: "/speakers" },
      { labelKey: "sponsors", href: "/sponsors" },
      { labelKey: "brochure", href: "/brochure" },
      { labelKey: "news", href: "/news" },
    ],
  },
  {
    titleKey: "links",
    links: [
      { labelKey: "support", href: "/support" },
      { labelKey: "register", href: "/register" },
      { labelKey: "faq", href: "/faq" },
    ],
  },
  {
    titleKey: "contact",
    links: [
      {
        label: "+99361 480 080",
        href: "tel:+99361 480 080",
        icon: <LuPhone />,
      },
      {
        label: "info@oguzforum.com",
        href: "mailto:info@oguzforum.com",
        icon: <LuMail />,
      },
    ],
  },
];

function FooterLink({ href, label, icon }: FooterLinkItem) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-white transition-colors hover:text-white/70"
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}

function FooterSection({
  title,
  links,
}: {
  title: string;
  links: FooterLinkItem[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-white text-lg font-bold border-b border-white/40 pb-4">
        {title}
      </h3>
      {links.map((link) => (
        <FooterLink key={link.label} {...link} />
      ))}
    </div>
  );
}

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-gradient-footer relative bg-brand-blue-dark font-proxima-nova">
      <div className="absolute inset-0 bg-black/30 z-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[url('/pattern.svg')] bg-repeat bg-size-[680px] opacity-20"
      />
      <div className="container mx-auto px-4 lg:px-10 pt-15 md:pt-20 relative z-30">
        <div className="mainContent flex flex-col  md:flex-row justify-between gap-10 pb-10">
          <div className="flex flex-col justify-between gap-9">
            <div className="flex flex-col items-start justify-between h-full gap-9">
              <Image src="/logo.svg" alt="Oguz Forum" width={248} height={60} />

              <ul className="flex items-center gap-4">
                {SOCIALS.map(({ label, href, icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid size-10 place-items-center rounded-full bg-white text-2xl text-brand-blue-dark transition hover:bg-white/80"
                    >
                      {icon}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-6 md:gap-10 lg:gap-30 md:flex-row justify-center">
            {SECTIONS.map((section) => (
              <FooterSection
                key={section.titleKey}
                title={t(section.titleKey)}
                links={section.links.map((link) => ({
                  href: link.href,
                  icon: link.icon,
                  label: link.labelKey ? t(link.labelKey) : link.label!,
                }))}
              />
            ))}
          </div>

          <div className="md:hidden">
            <FooterAccordion
              sections={SECTIONS.map((section) => ({
                key: section.titleKey,
                title: t(section.titleKey),
                links: section.links.map((link) => ({
                  href: link.href,
                  icon: link.icon,
                  label: link.labelKey ? t(link.labelKey) : link.label!,
                })),
              }))}
            />
          </div>
        </div>
        <div className="hidden lg:flex flex-row justify-between items-center border-t border-white/40 py-3">
          <div className="flex gap-3.5 text-sm font-normal text-white">
            <Link
              href="/terms"
              className="transition-colors hover:text-white/70"
            >
              {t("terms")}
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-white/70"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/cookie"
              className="transition-colors hover:text-white/70"
            >
              {t("cookie")}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white text-sm font-normal">
              © {new Date().getFullYear()}, {t("copyright")}
            </span>
            <Image src="/hebent.svg" alt="Hebent" width={72} height={18} />
          </div>
        </div>
        <div className="flex lg:hidden flex-col justify-between items-start gap-2 border-t border-white/40 py-3">
          <span className="text-white text-xs font-normal">
            © {new Date().getFullYear()}, {t("copyright")}
          </span>
          <div className="flex gap-3.5 text-xs font-normal text-white">
            <Link
              href="/terms"
              className="transition-colors hover:text-white/70"
            >
              {t("terms")}
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-white/70"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/cookie"
              className="transition-colors hover:text-white/70"
            >
              {t("cookie")}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Image src="/hebent.svg" alt="Hebent" width={88} height={22} />
          </div>
        </div>
      </div>
    </footer>
  );
}
