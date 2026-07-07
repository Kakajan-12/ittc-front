"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Image from "next/image";
import "../Sponsors/Sponsors.css";
import partner1 from "@/public/partners/1.png";
import partner2 from "@/public/partners/2.png";
import partner3 from "@/public/partners/3.png";
import partner4 from "@/public/partners/4.png";
import partner5 from "@/public/partners/5.png";
import partner6 from "@/public/partners/6.png";
import partner7 from "@/public/partners/7.png";

const partnerData = [
  { id: 1, name: "Partner 1", logo: partner1, category: "media" },
  { id: 2, name: "Partner 2", logo: partner2, category: "media" },
  { id: 3, name: "Partner 3", logo: partner3, category: "knowledge" },
  { id: 4, name: "Partner 4", logo: partner4, category: "media" },
  { id: 5, name: "Partner 5", logo: partner5, category: "media" },
  { id: 6, name: "Partner 6", logo: partner6, category: "media" },
  { id: 7, name: "Partner 7", logo: partner7, category: "knowledge" },
];

function formatCategoryLabel(label: string) {
  return label
    .split(/<br\s*\/?>/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

function Partners() {
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
  }, []);

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
              {partnerData.map((partner) => {
                const categoryParts = formatCategoryLabel(
                  t(`categories.${partner.category}`),
                );

                return (
                  <div
                    key={`${copyIndex}-${partner.id}`}
                    className="w-52 shrink-0 pr-4 sm:w-48 lg:w-56"
                  >
                    <div className="flex flex-col overflow-hidden rounded bg-white shadow-partner">
                      <div className="relative aspect-4/3 w-full">
                        <Image
                          src={partner.logo}
                          alt={copyIndex === 0 ? partner.name : ""}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-contain py-2"
                        />
                      </div>
                      <div className="border-t border-[#C3D1D9] py-3 text-center font-roboto text-lg leading-6 text-brand-gray">
                        {categoryParts.map((part, index) => (
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
