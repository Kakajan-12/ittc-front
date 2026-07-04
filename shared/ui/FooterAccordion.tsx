"use client";
import type { ReactNode } from "react";
import { Collapse, ConfigProvider, type CollapseProps } from "antd";
import { FiChevronUp } from "react-icons/fi";
import { Link } from "@/i18n/navigation";

type FooterLink = { label: string; href: string; icon?: ReactNode };
export type FooterSectionData = {
  key: string;
  title: string;
  links: FooterLink[];
};

export default function FooterAccordion({
  sections,
}: {
  sections: FooterSectionData[];
}) {
  const items: CollapseProps["items"] = sections.map((section) => ({
    key: section.key,
    label: (
      <span className="text-lg font-bold text-white">{section.title}</span>
    ),
    children: (
      <div className="flex flex-col gap-4 font-roboto text-base">
        {section.links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center gap-2 pl-4 text-white transition-colors hover:text-white/70"
          >
            {link.icon && <span>{link.icon}</span>}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    ),
  }));

  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            headerPadding: "16px 0",
            contentPadding: 0,
          },
        },
      }}
    >
      <Collapse
        accordion
        ghost
        items={items}
        expandIconPlacement="end"
        className="footer-collapse"
        expandIcon={({ isActive }) => (
          <FiChevronUp
            className={`size-5 text-white transition-transform duration-300 ${
              isActive ? "rotate-180" : ""
            }`}
          />
        )}
      />
    </ConfigProvider>
  );
}
