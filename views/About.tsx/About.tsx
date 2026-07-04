import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaPlay } from "react-icons/fa6";
import SectionHeading from "@/shared/ui/SectionHeading";
import Button from "@/shared/ui/Button";
import Organizers from "./Organizers";

function About() {
  const t = useTranslations("About");

  return (
    <section className="py-15 lg:py-20">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <SectionHeading title={t("title")} />

            <p className="text-base leading-8 text-brand-gray">{t("text")}</p>

            <Button text={t("more")} href="/about" className="mt-2" />
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded">
            <Image
              src="/event.jpg"
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
