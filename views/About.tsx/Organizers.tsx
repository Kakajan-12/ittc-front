import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";

const logos = [1, 2, 3, 4, 5, 6, 7] as const;

function Organizers() {
  const t = useTranslations("Organizers");

  return (
    <div className="mt-15 lg:mt-18">
      <SectionHeading title={t("title")} />

      <ul className="mt-8 grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 justify-items-center gap-5">
        {logos.map((n) => (
          <li
            key={n}
            className="sponsorShadow flex h-28 w-33 lg:h-42 lg:w-54  rounded bg-white p-2 transition hover:border-brand-blue/40 hover:shadow-sm"
          >
            <div className="relative h-full w-full ">
              <Image
                src={`/logos/${n}.svg`}
                alt={`Organizer logo ${n}`}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="object-contain grow"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Organizers;
