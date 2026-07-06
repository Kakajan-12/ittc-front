"use client";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  return (
    <Accordion type="single" collapsible className="w-full">
      {sections.map((section) => (
        <AccordionItem
          key={section.key}
          value={section.key}
          className="border-none"
        >
          <AccordionTrigger className="py-4 text-lg font-bold text-white hover:no-underline [&>svg]:size-5 [&>svg]:text-white">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-4">
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
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
