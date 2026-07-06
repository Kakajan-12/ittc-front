import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";

function Sponsorship() {
  const t = useTranslations("Sponsorship");

  return (
    <section className="py-15 lg:py-20">
      <div className="px-4 lg:px-10">
        <SectionHeading title={t("title")} className="block lg:hidden" />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr] justify-start items-start gap-3 lg:gap-20">
          <div className="flex flex-col gap-10 h-full order-2 lg:order-1">
            <div className="flex flex-col gap-6">
              <SectionHeading title={t("title")} className="hidden lg:flex" />

              <p className="text-base whitespace-pre-line text-brand-gray">
                {t("text")}
              </p>
            </div>

            <Button text={t("more")} href="/sponsorship" />
          </div>
          <div className="relative aspect-4/3 w-full overflow-hidden rounded order-1 lg:order-2">
            <Image
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
