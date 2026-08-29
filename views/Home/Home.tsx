"use client";

import { useLocale, useTranslations } from "next-intl";
import { SkeletonImage } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { GoArrowUpRight } from "react-icons/go";
import { Link } from "@/i18n/navigation";
import About from "@/views/About/About";
import Results from "@/views/Home/Results";
import Sponsorship from "../Sponsorships/Sponsorship";
import Sponsors from "@/views/Sponsors/Sponsors";
import Speakers from "@/views/Speakers/Speakers";
import News from "@/views/News/News";
import Partners from "../Partners/Partners";
import Timer from "./Timer";
import Button from "@/shared/ui/Button";

function Home() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const brochurePath =
    locale === "ru"
      ? "/documents/Brochure ITTC 2026 ру 001.pdf"
      : "/documents/Brochure ITTC 2026 eng 01.pdf";

  const actions: Array<{
    key: string;
    href?: string;
    mobileOnly?: boolean;
    action?: () => void;
  }> = [
    { key: "register", href: "/register", mobileOnly: true },
    { key: "agenda", href: "/agenda" },
    { key: "brochure", action: () => window.open(brochurePath, "_blank") },
    {
      key: "travel-guide",
      action: () =>
        window.open("/documents/ITTC_Travel accommodation.pdf", "_blank"),
    },
    { key: "faq", href: "/faq" },
  ] as const;

  return (
    <>
      <div className="relative">
        <section className="relative isolate flex items-center overflow-hidden text-white min-h-[90vh] lg:min-h-[95vh]">
          <SkeletonImage
            src="/main.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-center"
            skeletonClassName="-z-10"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/55 to-black/25" />

          <div className="px-4 lg:px-10 py-24 lg:py-30">
            <div className="max-w-2xl lg:max-w-3xl 2xl:max-w-4xl">
              <h1 className="text-4xl font-bold font-roboto leading-tight sm:text-5xl lg:text-6xl">
                {t("title")}
              </h1>

              <p className="mt-1 flex flex-wrap items-center sm:gap-1 lg:gap-3 text-base lg:text-lg text-white/90 font-roboto">
                <span>{t("date")}</span>
                <span className="text-white hidden lg:block">|</span>
                <span>{t("location")}</span>
              </p>

              <div className="mt-8 flex flex-wrap flex-col content-start gap-2 lg:gap-4 h-66">
                {actions.map((i) => {
                  if (!!i.action) {
                    return (
                      <div
                        key={i.key}
                        onClick={i.action}
                        className={cn(
                          "group flex items-center justify-center gap-2 rounded border border-brand-blue w-35 lg:w-44 py-2.5 text-base transition hover:border-brand-blue hover:bg-brand-blue/20",
                          "mobileOnly" in i && "md:hidden",
                        )}
                      >
                        {t(i.key)}
                        <GoArrowUpRight className="size-5 text-brand-blue shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={i.key}
                      href={i.href ?? ""}
                      className={cn(
                        "group flex items-center justify-center gap-2 rounded border border-brand-blue w-35 lg:w-44 px-8 py-2.5 text-base transition hover:border-brand-blue hover:bg-brand-blue/20",
                        "mobileOnly" in i && "md:hidden",
                      )}
                    >
                      {t(i.key)}
                      <GoArrowUpRight className="size-5 text-brand-blue shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        <Timer />
      </div>
      <About />
      <Results />
      <Sponsorship />
      <Sponsors />
      <Speakers />
      <News />
      <Partners />
    </>
  );
}

export default Home;
