import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";

function Sponsorship() {
  const t = useTranslations("Sponsorship");

  return (
    <section className="py-15 lg:py-20">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] justify-start items-start gap-10 lg:gap-20">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded">
            <Image
              src="/event.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-6">
              <SectionHeading title={t("title")} />

              <p className="text-base leading-8 whitespace-pre-line text-brand-gray">
                {t("text")}
              </p>
            </div>

            <Button text={t("more")} href="/sponsorship" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sponsorship;
