"use client";

import { useTranslations } from "next-intl";
import PageHeading from "@/shared/ui/PageHeading";
import Results from "@/views/Home/Results";
import SectionHeading from "@/shared/ui/SectionHeading";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import card1 from "@/public/about/1.svg";
import card2 from "@/public/about/2.svg";
import card3 from "@/public/about/3.svg";
import card4 from "@/public/about/4.svg";
import card5 from "@/public/about/5.svg";
import card6 from "@/public/about/6.svg";
import card7 from "@/public/about/7.svg";
import card8 from "@/public/about/8.svg";
import SectionCard from "@/views/About/SectionCard";

const sectionIds = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

function AboutPage() {
  const t = useTranslations("About");

  return (
    <main className="flex flex-col">
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
        image="/about/main.jpg"
      />
      <div className="py-15 lg:py-20">
        <div className="px-4 lg:px-10 mb-10 lg:mb-20 grid items-center gap-5 lg:gap-16 xl:gap-20 grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] 2xl:grid-cols-[1fr_700px]">
          <div className="order-2 lg:order-1">
            <SectionHeading
              title={t("subtitle")}
              className="text-3xl font-bold font-roboto"
            />
            <p className="mt-6 xl:mt-8 text-base text-brand-gray">
              {t("text")}
            </p>
          </div>
          <div className="relative h-60 lg:h-68 xl:h-84 2xl:h-96 aspect-video w-full overflow-hidden rounded order-1 lg:order-2">
            <Image
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
        <Results className=" hidden lg:block" />
        <SectionHeading
          title={t("section.title")}
          className="px-4 lg:px-10 mt-4 lg:mt-18 text-3xl font-bold font-roboto"
        />
        <div className="px-4 lg:px-10 mt-8 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.2fr] gap-4">
            <SectionCard
              number="01"
              category={t("section.1.category")}
              title={t("section.1.title")}
              description={t("section.1.text")}
              image={card1}
              smaller
            />
            <SectionCard
              number="02"
              category={t("section.2.category")}
              title={t("section.2.title")}
              description={t("section.2.text")}
              image={card2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] gap-4">
            <SectionCard
              number="03"
              category={t("section.3.category")}
              title={t("section.3.title")}
              description={t("section.3.text")}
              image={card3}
            />
            <SectionCard
              number="04"
              category={t("section.4.category")}
              title={t("section.4.title")}
              description={t("section.4.text")}
              image={card4}
              smaller
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.2fr] gap-4">
            <SectionCard
              number="05"
              category={t("section.5.category")}
              title={t("section.5.title")}
              description={t("section.5.text")}
              image={card5}
              smaller
            />
            <SectionCard
              number="06"
              category={t("section.6.category")}
              title={t("section.6.title")}
              description={t("section.6.text")}
              image={card6}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] gap-4">
            <SectionCard
              number="07"
              category={t("section.7.category")}
              title={t("section.7.title")}
              description={t("section.7.text")}
              image={card7}
            />
            <SectionCard
              number="08"
              category={t("section.8.category")}
              title={t("section.8.title")}
              description={t("section.8.text")}
              image={card8}
              smaller
            />
          </div>
        </div>
        {/* <div className="px-4 lg:px-10 mt-4 flex list-decimal flex-col gap-4 lg:gap-8 marker:font-bold marker:font-roboto">
          {sectionIds.map((id) => (
            <div key={id}>
              <h4 className="text-base font-bold font-roboto">
                {id}. {t(`section.${id}.title`)}
              </h4>
              <p className="mt-4 text-base">{t(`section.${id}.text`)}</p>
            </div>
          ))}
        </div> */}
      </div>
    </main>
  );
}

export default AboutPage;
