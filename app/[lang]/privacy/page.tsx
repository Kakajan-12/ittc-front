"use client";

import PageHeading from "@/shared/ui/PageHeading";
import { useTranslations } from "next-intl";

type PrivacySection = {
  title: string;
  body: string;
  items?: string[];
};

export default function PrivacyPage() {
  const t = useTranslations("Privacy");
  const sections = t.raw("sections") as PrivacySection[];

  return (
    <main>
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
        image="/support.jpg"
      />
      <div className="px-4 lg:px-10 py-6 md:py-14 lg:py-20">
        <div className="mx-auto space-y-8">
          <p className="text-lg leading-relaxed text-brand-gray">
            {t("description")}
          </p>
          {sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-lg font-semibold text-brand-gray">
                {section.title}
              </h3>
              <p className="text-base leading-relaxed text-brand-gray">
                {section.body}
              </p>
              {section.items && (
                <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-brand-gray">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
