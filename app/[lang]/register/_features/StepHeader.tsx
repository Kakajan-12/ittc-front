"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import LangSwitcher from "@/shared/LangSwither";
import { IoChevronBack } from "react-icons/io5";

export default function StepHeader() {
  const router = useRouter();
  const t = useTranslations("Common");
  return (
    <>
      <div className="flex justify-between w-full pt-8 items-start">
        <div className="">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label={t("back")}
            className="glass flex h-10 w-10 items-center justify-center rounded bg-white/10 text-white transition-colors hover:bg-white/20 hover:text-white/80"
          >
            <IoChevronBack className="size-5 xl:size-7" />
          </button>
        </div>

        <div className="">
          <LangSwitcher registration className="" />
        </div>
      </div>
    </>
  );
}
