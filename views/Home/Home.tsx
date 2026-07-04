import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GoArrowUpRight } from "react-icons/go";
import { Link } from "@/i18n/navigation";
import About from "@/views/About.tsx/About";
import Results from "@/views/Home/Results";
import Sponsorship from "../Sponsorships/Sponsorship";
import Sponsors from "@/views/Sponsors/Sponsors";
import Speakers from "@/views/Speakers/Speakers";
import News from "@/views/News/News";

function Home() {
  const t = useTranslations("Hero");

  const actions = [
    { key: "agenda", href: "/agenda" },
    { key: "sponsors", href: "/sponsors" },
    { key: "brochure", href: "/brochure" },
    { key: "faq", href: "/faq" },
    { key: "organizers", href: "/organizers" },
  ] as const;

  return (
    <>
      <section className="relative isolate flex items-center overflow-hidden text-white min-h-[90vh] lg:min-h-[95vh]">
        <Image
          src="/main.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/55 to-black/25" />

        <div className="container mx-auto px-4 lg:px-10 py-24 lg:py-30">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold font-roboto leading-tight sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            <p className="mt-1 flex flex-wrap items-center sm:gap-1 lg:gap-3 text-base lg:text-lg text-white/90 font-roboto">
              <span>{t("date")}</span>
              <span className="text-white hidden lg:block">|</span>
              <span>{t("location")}</span>
            </p>

            <div className="mt-8 flex flex-wrap flex-col content-start gap-2 lg:gap-4 h-66">
              {actions.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  className="group flex items-center justify-center gap-2 rounded border border-brand-blue w-35 lg:w-36 px-8 py-2.5 text-base transition hover:border-brand-blue hover:bg-brand-blue/20"
                >
                  {t(key)}
                  <GoArrowUpRight className="size-5 text-brand-blue shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <About />
      <Results />
      <Sponsorship />
      <Sponsors />
      <Speakers />
      <News />
    </>
  );
}

export default Home;
