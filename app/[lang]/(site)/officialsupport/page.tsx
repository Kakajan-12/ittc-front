"use client";

import PageHeading from "@/shared/ui/PageHeading";
import { useTranslations } from "next-intl";
import Image from "next/image";
import supportImage from "@/public/support.png";

function OfficialSupportPage() {
  const t = useTranslations("Support");

  return (
    <main className="flex flex-col">
      <PageHeading
        title={t("title")}
        homeLabel="Home"
        crumbs={[{ label: t("title") }]}
        image="/support.jpg"
        objectPosition="top"
      />
      <section className="px-4 py-15 lg:px-10 lg:py-20">
        <div className="mx-auto flex justify-center">
          <Image
            src={supportImage}
            alt={t("title")}
            className="h-auto w-full max-w-[802px] shadow-sm"
            priority
          />
        </div>
      </section>
    </main>
  );
}

export default OfficialSupportPage;
