import React from "react";
import PageHeading from "@/shared/ui/PageHeading";
import { useTranslations } from "next-intl";

export default function SponsorshipPage() {
  const t = useTranslations("Sponsorship");
  return (
    <main>
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
      />
      <div className="my-8 flex items-center justify-center min-h-100 text-brand-gray">
        <div className="text-base lg:text-2xl font-normal px-4 lg:px-10 flex flex-col gap-2">
          Sponsorship provides an opportunity to position your brand in front of
          a highly relevant international audience and engage directly with key
          stakeholders from both the public and private sectors. <br />
          <ul className="flex pl-4 lg:pl-8 flex-col list-disc marker:text-brand-blue justify-center text-base lg:text-2xl">
            Through ITTC 2026, sponsors can:
            <li>Increase international brand visibility</li>
            <li>Connect with government representatives and decision-makers</li>
            <li>
              Build relationships with potential clients and strategic partners
            </li>
            <li>
              Engage with industry leaders and international organizations
            </li>
            <li>Showcase products, services and expertise</li>
            <li>Participate in high-level networking opportunities</li>
            <li>
              Strengthen brand positioning within the transport, logistics and
              infrastructure sectors
            </li>
            <li>
              Generate new business opportunities and long-term partnerships
            </li>
          </ul>
          Who Will You Meet?
          <br />
          <ul className="flex pl-8 flex-col list-disc marker:text-brand-blue justify-center">
            ITTC 2026 is expected to bring together representatives from:
            <li>Government & Public Sector</li>
            <li>
              Ministries, transport authorities, infrastructure institutions and
              regulatory bodies
            </li>
            <li>
              International Organizations Multilateral institutions, development
              organizations and regional cooperation platforms
            </li>
            <li>
              Business & Industry Transport operators, logistics companies,
              infrastructure developers, technology providers and industry
              leaders
            </li>
            <li>
              Investment & Finance Investors, financial institutions,
              development banks and project stakeholders
            </li>
            <li>
              Innovation & Technology Companies developing solutions for smart
              transport, logistics, digitalization and connectivity
            </li>
          </ul>
          <p>
            Sponsorship Opportunities ITTC 2026 offers flexible sponsorship
            opportunities designed to meet different business objectives and
            levels of participation.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <p className="font-semibold">Interested in Sponsorship?</p>
            <p>Contact Our Team:</p>
            <p>
              E-mail:{" "}
              <a
                href="mailto:e.akmyradova@oguzforum.com"
                className="text-brand-blue underline-offset-4 hover:underline"
              >
                e.akmyradova@oguzforum.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+99361480090"
                className="text-brand-blue underline-offset-4 hover:underline"
              >
                +993 61 48 00 90
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
