import React from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";
import { SkeletonImage } from "@/components/ui/Skeleton";

function Sponsorship() {
  const t = useTranslations("Sponsorship");

  return (
    <section className="py-15 lg:py-20">
      <div className="px-4 lg:px-10">
        <SectionHeading title={t("title")} className="block lg:hidden" />

        <div className="grid items-center gap-3 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] 2xl:grid-cols-[1fr_700px] lg:gap-16 xl:gap-20">
          <div className="flex flex-col justify-center lg:gap-10 h-full order-2 lg:order-1">
            <div className="flex flex-col gap-6">
              <SectionHeading title={t("title")} className="hidden lg:flex" />

              <p className="text-base xl:text-lg whitespace-pre-line text-brand-gray">
                {t("text")}
              </p>
            </div>

            <Button text={t("more")} href="/sponsorship" />
          </div>
          <div className="relative h-60 lg:h-68 xl:h-84 2xl:h-96 aspect-4/3 w-full overflow-hidden rounded order-1 lg:order-2">
            <SkeletonImage
              src="/event.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sponsorship;
