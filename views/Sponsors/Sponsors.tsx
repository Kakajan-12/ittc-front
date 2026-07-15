"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import { SkeletonImage } from "@/components/ui/Skeleton";
import "./Sponsors.css";
import sponsor1 from "@/public/sponsors/1.jpg";
import sponsor2 from "@/public/sponsors/2.jpg";
import sponsor3 from "@/public/sponsors/3.jpg";
import sponsor4 from "@/public/sponsors/4.png";
import sponsor5 from "@/public/sponsors/5.webp";
import sponsor6 from "@/public/sponsors/6.jpeg";
import sponsor7 from "@/public/sponsors/7.jpeg";
import sponsor8 from "@/public/sponsors/8.jpg";

const sponsorData = [
  { id: 1, name: "sponsors.name1", logo: sponsor1 },
  { id: 2, name: "sponsors.name2", logo: sponsor2 },
  { id: 3, name: "sponsors.name3", logo: sponsor3 },
  { id: 4, name: "sponsors.name4", logo: sponsor4 },
  { id: 5, name: "sponsors.name5", logo: sponsor5 },
  { id: 6, name: "sponsors.name6", logo: sponsor6 },
  { id: 7, name: "sponsors.name7", logo: sponsor7 },
  { id: 8, name: "sponsors.name8", logo: sponsor8 },
];

function formatSponsorName(name: string) {
  return name
    .split(/<br\s*\/?>/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

function Sponsors() {
  const t = useTranslations("Sponsors");
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
    <section className="px-4 lg:px-10 overflow-hidden">
      <SectionHeading title={t("title")} />
      <div
        ref={containerRef}
        className="w-full overflow-hidden sm:mt-3 lg:mt-8"
      >
        <div
          className="marquee-track"
          style={{ "--marquee-copies": copyCount } as React.CSSProperties}
        >
          {Array.from({ length: copyCount }, (_, copyIndex) => (
            <div
              key={copyIndex}
              ref={copyIndex === 0 ? groupRef : undefined}
              className="marquee-group py-2"
              aria-hidden={copyIndex > 0 || undefined}
            >
              {sponsorData.map((sponsor) => {
                const nameParts = formatSponsorName(t(sponsor.name));

                return (
                <div
                  key={`${copyIndex}-${sponsor.id}`}
                  className="mx-3 h-52 w-52 shrink-0"
                >
                  <div className="flex h-full flex-col overflow-hidden  rounded bg-white shadow-partner transition duration-300 hover:grayscale-0">
                    <div className="relative min-h-0 flex-1">
                      <SkeletonImage
                        src={sponsor.logo}
                        alt={copyIndex === 0 ? nameParts.join(" ") : ""}
                        fill
                        sizes="176px"
                        className="object-contain"
                      />
                    </div>
                    <div className="shrink-0 border-t border-[#C3D1D9] py-3 text-center font-roboto text-lg leading-6 text-brand-gray">
                      {nameParts.map((part, index) => (
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

export default Sponsors;
