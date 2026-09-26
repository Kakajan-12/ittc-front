import React from "react";
import { LuMail, LuPhone } from "react-icons/lu";
import { PiTelegramLogo } from "react-icons/pi";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SlSocialLinkedin } from "react-icons/sl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { SiteContactsModel } from "@/shared/content/queries";
import type { SocialNetwork } from "@/shared/content/types";
import FooterAccordion from "@/shared/ui/FooterAccordion";

/** Иконка и подпись по сети; сами ссылки приходят из админки. */
const SOCIAL_META: Record<
  SocialNetwork,
  { label: string; icon: React.ReactNode }
> = {
  TELEGRAM: { label: "Telegram", icon: <PiTelegramLogo /> },
  WHATSAPP: { label: "WhatsApp", icon: <FaWhatsapp /> },
  INSTAGRAM: { label: "Instagram", icon: <FaInstagram /> },
  LINKEDIN: { label: "LinkedIn", icon: <SlSocialLinkedin /> },
  FACEBOOK: { label: "Facebook", icon: <FaFacebookF /> },
  YOUTUBE: { label: "YouTube", icon: <FaYoutube /> },
  X: { label: "X", icon: <FaXTwitter /> },
  TIKTOK: { label: "TikTok", icon: <FaTiktok /> },
};

type FooterLinkItem = { label: string; href: string; icon?: React.ReactNode };
type FooterLinkConfig = {
  labelKey?: string;
  label?: string;
  href: string;
  icon?: React.ReactNode;
};

type FooterSectionConfig = { titleKey: string; links: FooterLinkConfig[] };

/** Contacts come from the admin panel, the rest are routes that live in code. */
function buildSections(contacts: SiteContactsModel): FooterSectionConfig[] {
  return [
  {
    titleKey: "info",
    links: [
      { labelKey: "agenda", href: "/agenda" },
      { labelKey: "speakers", href: "/speakers" },
      { labelKey: "brochure", href: "/brochure" },
      { labelKey: "news", href: "/news" },
    ],
  },
  {
    titleKey: "links",
    links: [
      { labelKey: "support", href: "/officialsupport" },
      { labelKey: "register", href: "/register" },
      { labelKey: "faq", href: "/faq" },
    ],
  },
  {
    titleKey: "contact",
    links: [
      // Every configured contact, not just the one the header has room for.
      ...contacts.phones.map((phone) => ({
        label: phone.label ? `${phone.label}: ${phone.value}` : phone.value,
        href: phone.href,
        icon: <LuPhone />,
      })),
      ...contacts.emails.map((email) => ({
        label: email.label ? `${email.label}: ${email.value}` : email.value,
        href: email.href,
        icon: <LuMail />,
      })),
    ],
  },
  ];
}

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

export default function Footer({
  contacts,
}: {
  contacts: SiteContactsModel;
}) {
  const t = useTranslations("Footer");
  const sections = buildSections(contacts);
  return (
    <footer className="bg-gradient-footer relative bg-brand-blue-dark font-proxima-nova">
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-brand-blue-dark/60 to-brand-blue-dark z-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[url('/pattern.svg')] bg-repeat bg-size-[680px] opacity-20"
      />
      <div className=" px-4 lg:px-10 pt-15 md:pt-20 relative z-30">
        <div className="mainContent flex flex-col  md:flex-row justify-between gap-10 pb-10">
          <div className="flex flex-col justify-between gap-9">
            <div className="flex flex-col items-start justify-between h-full gap-7 lg:gap-9">
              <Image src="/logo.svg" alt="Oguz Forum" width={248} height={60} />

              {contacts.socials.length > 0 && (
                <ul className="flex flex-wrap items-center gap-4">
                  {contacts.socials.map(({ id, network, url }) => (
                    <li key={`${network}-${id}-${url}`}>
                      <a
                        href={url}
                        aria-label={SOCIAL_META[network].label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid size-10 place-items-center rounded-full bg-white text-2xl text-brand-blue-dark transition hover:bg-white/80"
                      >
                        {SOCIAL_META[network].icon}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-6 md:gap-10 lg:gap-30 md:flex-row justify-center">
            {sections.map((section) => (
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
              sections={sections.map((section) => ({
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
        {/* Один блок на все ширины: ссылки, под ними копирайт и Hebent. На
            десктопе — в строку, как раньше; на мобильном тот же порядок. */}
        <div className="flex flex-col gap-3 border-t border-white/40 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 text-xs font-normal text-white sm:flex-row sm:flex-wrap sm:gap-x-3.5 lg:text-sm">
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
          <div className="flex items-center justify-between gap-4 lg:justify-start">
            <span className="text-xs font-normal text-white lg:text-sm">
              © {new Date().getFullYear()}, {t("copyright")}
            </span>
            <Image src="/hebent.svg" alt="Hebent" width={72} height={18} />
          </div>
        </div>
      </div>
    </footer>
  );
}
