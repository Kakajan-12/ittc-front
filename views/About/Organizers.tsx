import React from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import { SkeletonImage } from "@/components/ui/Skeleton";
import type { PartnerModel } from "@/shared/content/queries";

/** Логотипы приходят из CMS: страница читает их и передаёт сюда. */
function Organizers({ organizers }: { organizers: PartnerModel[] }) {
  const t = useTranslations("Organizers");

  if (!organizers.length) return null;

  return (
    <div className="mt-15 lg:mt-18">
      <SectionHeading title={t("title")} />

      <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 justify-items-start gap-3 lg:gap-5">
        {organizers.map((organizer) => (
          <li key={organizer.id} className="flex flex-col items-center gap-2 ">
            <a
              href={organizer.website ?? "#"}
              target="_blank"
              rel="noopener"
              className="sponsorShadow group relative flex flex-col h-42 w-40 lg:w-54 xl:w-48 2xl:w-50 rounded bg-white p-2 transition hover:border-brand-blue/40 hover:shadow-sm"
            >
              <div className="relative h-full w-full">
                {organizer.logo ? (
                  <SkeletonImage
                    src={organizer.logo}
                    alt={organizer.name}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                    className="object-contain grow z-0"
                  />
                ) : null}
              </div>
              <div className="absolute bottom-0 left-0 right-0 hidden group-hover:flex items-end justify-center h-fit bg-black/45 rounded-t backdrop-blur-sm z-10 p-2">
                <p className="text-center text-sm text-white lg:text-sm">
                  {organizer.name}
                </p>
              </div>

              <p className="relative block lg:hidden group-hover:hidden z-10 text-center text-xs text-brand-gray lg:text-sm">
                {organizer.name}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Organizers;
