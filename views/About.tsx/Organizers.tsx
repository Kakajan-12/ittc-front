import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";

const logos = [
  { key: 1, name: "logo1" },
  { key: 2, name: "logo2" },
  { key: 3, name: "logo3" },
  { key: 4, name: "logo4" },
  { key: 5, name: "logo5" },
  { key: 6, name: "logo6" },
  { key: 7, name: "logo7" },
] as const;

function Organizers() {
  const t = useTranslations("Organizers");

  return (
    <div className="mt-15 lg:mt-18">
      <SectionHeading title={t("title")} />

      <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 justify-items-center gap-3 lg:gap-5">
        {logos.map(({ key, name }) => (
          <li key={key} className="flex flex-col items-center gap-2 ">
            <div className="sponsorShadow group relative flex flex-col h-42 w-40 lg:w-54 rounded  bg-white p-2 transition hover:border-brand-blue/40 hover:shadow-sm">
              <div className="relative h-full w-full">
                <Image
                  src={`/logos/${key}.svg`}
                  alt={t(name)}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  className="object-contain grow z-0"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 hidden group-hover:flex items-end justify-center h-fit bg-black/45 rounded-t backdrop-blur-sm z-10 p-2">
                <p className="text-center text-sm text-white lg:text-sm">
                  {t(name)}
                </p>
              </div>

              <p className="relative block lg:hidden group-hover:hidden z-10 text-center text-xs text-brand-gray lg:text-sm">
                {t(name)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Organizers;
