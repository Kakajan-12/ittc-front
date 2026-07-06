"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Image from "next/image";
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
  { id: 1, name: "Sponsor 1", logo: sponsor1 },
  { id: 2, name: "Sponsor 2", logo: sponsor2 },
  { id: 3, name: "Sponsor 3", logo: sponsor3 },
  { id: 4, name: "Sponsor 4", logo: sponsor4 },
  { id: 5, name: "Sponsor 5", logo: sponsor5 },
  { id: 6, name: "Sponsor 6", logo: sponsor6 },
  { id: 7, name: "Sponsor 7", logo: sponsor7 },
  { id: 8, name: "Sponsor 8", logo: sponsor8 },
];

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
              className="marquee-group"
              aria-hidden={copyIndex > 0 || undefined}
            >
              {sponsorData.map((sponsor) => (
                <div
                  key={`${copyIndex}-${sponsor.id}`}
                  className="relative mx-3 flex h-36 w-44 shrink-0 items-center justify-center transition duration-300 hover:grayscale-0"
                >
                  <div className="aspect-4/3 w-full rounded bg-white">
                    <Image
                      src={sponsor.logo}
                      alt={copyIndex === 0 ? sponsor.name : ""}
                      fill
                      sizes="176px"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Sponsors;
