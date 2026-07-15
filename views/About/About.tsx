import React from "react";
import { useTranslations } from "next-intl";
import { FaPlay } from "react-icons/fa6";
import { SkeletonImage } from "@/components/ui/Skeleton";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";
import Organizers from "./Organizers";

function About() {
  const t = useTranslations("About");

  return (
    <section className="py-15 lg:py-20">
      <div className="px-4 lg:px-10">
        <SectionHeading title={t("title")} className="block lg:hidden" />

        <div className="grid items-center gap-3 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] 2xl:grid-cols-[1fr_700px] lg:gap-16 xl:gap-20">
          <div className="flex flex-col lg:gap-6 order-2 lg:order-1">
            <SectionHeading title={t("title")} className="hidden lg:block" />

            <p className="text-base text-brand-gray">{t("text")}</p>

            <Button text={t("more")} href="/about" className="mt-2" />
          </div>

          <div className="relative h-60 lg:h-68 xl:h-84 2xl:h-96 aspect-video w-full overflow-hidden rounded order-1 lg:order-2">
            <SkeletonImage
              src="/about/video.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
            <button
              type="button"
              aria-label={t("playAlt")}
              className="group absolute inset-0 grid place-items-center bg-black/10 transition hover:bg-black/25"
            >
              <span className="grid size-16 place-items-center rounded-full bg-white/30 backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-white/70">
                <FaPlay className="ml-1 size-6 text-white" />
              </span>
            </button>
          </div>
        </div>
        <Organizers />
      </div>
    </section>
  );
}

export default About;
