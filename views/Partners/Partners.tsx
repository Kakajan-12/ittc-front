"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import { SkeletonImage } from "@/components/ui/Skeleton";
import type { PartnerModel } from "@/shared/content/queries";
import "../Sponsors/Sponsors.css";

function formatLabel(label: string) {
  return label
    .split(/<br\s*\/?>/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

function Partners({ partners }: { partners: PartnerModel[] }) {
  const t = useTranslations("Partner");
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [copyCount, setCopyCount] = useState(2);

  useEffect(() => {
    const container = containerRef.current;
    const group = groupRef.current;
    if (!container || !group) return;

    const updateCopyCount = () => {
      const containerWidth = container.offsetWidth;
      const groupWidth = group.offsetWidth;
      if (!groupWidth) return;

      const needed = Math.ceil(containerWidth / groupWidth) + 1;
      setCopyCount((prev) => {
        const next = Math.max(2, needed);
        return prev === next ? prev : next;
      });
    };

    updateCopyCount();

    const observer = new ResizeObserver(updateCopyCount);
    observer.observe(container);
    observer.observe(group);

    return () => observer.disconnect();
  }, [partners.length]);

  if (!partners.length) return null;

  return (
    <section className="overflow-x-hidden px-4 pb-10 lg:px-10 lg:pb-20">
      <SectionHeading title={t("title")} />
      <div ref={containerRef} className="mt-8 w-full overflow-x-hidden py-1">
        <div
          className="marquee-track"
          style={{ "--marquee-copies": copyCount } as React.CSSProperties}
        >
          {Array.from({ length: copyCount }, (_, copyIndex) => (
            <div
              key={copyIndex}
              ref={copyIndex === 0 ? groupRef : undefined}
              className="marquee-group"
              aria-hidden={copyIndex > 0 || undefined}
            >
              {partners.map((partner) => {
                // The caption under the logo is the partner's role, which the
                // CMS stores as the localized name.
                const labelParts = formatLabel(partner.name);

                return (
                  <div
                    key={`${copyIndex}-${partner.id}`}
                    className="w-52 shrink-0 pr-4 sm:w-48 lg:w-56"
                  >
                    <div className="flex flex-col overflow-hidden rounded bg-white shadow-partner">
                      <div className="relative aspect-4/3 w-full">
                        {partner.logo && (
                          <SkeletonImage
                            src={partner.logo}
                            alt={copyIndex === 0 ? partner.name : ""}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-contain py-2"
                          />
                        )}
                      </div>
                      <div className="border-t border-[#C3D1D9] py-3 text-center font-roboto text-lg leading-6 text-brand-gray">
                        {labelParts.map((part, index) => (
                          <Fragment key={index}>
                            {index > 0 && <br />}
                            {part}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
