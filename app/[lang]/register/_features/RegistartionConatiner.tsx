"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/logo.svg";
import Stepper, { T_REGISTARTION_STEP } from "@/views/Auth/Stepper";
import StepHeader from "./StepHeader";
import { useTranslations } from "next-intl";

type RegistrationContainerContextValue = {
  showSuccess: boolean;
  setShowSuccess: (show: boolean) => void;
};

const RegistrationContainerContext =
  createContext<RegistrationContainerContextValue | null>(null);

export function useRegistrationContainer() {
  const context = useContext(RegistrationContainerContext);

  if (!context) {
    throw new Error(
      "useRegistrationContainer must be used inside RegistrationContainer",
    );
  }

  return context;
}

export default function RegistrationContainer({
  children,
}: {
  children: ReactNode;
}) {
  const t = useTranslations("Registration");
  const [showSuccess, setShowSuccess] = useState(false);
  const steps: T_REGISTARTION_STEP[] = [
    {
      key: "PERSONAL_INFO",
      link: "personal-info",
      i18key: "steps.personal",
    },
    {
      key: "ORGANOZATION_INFO",
      link: "organization-info",
      i18key: "steps.company",
    },
    {
      key: "SERVICES",
      link: "services",
      i18key: "steps.services",
    },
    {
      key: "PAYMENT",
      link: "payment",
      i18key: "steps.payment",
    },
    {
      key: "VERIFICATION",
      link: "verification",
      i18key: "steps.verification",
    },
  ];
  /* height: 100%;
min-height: 0%;
overflow: hidden; */
  return (
    <RegistrationContainerContext.Provider
      value={{ showSuccess, setShowSuccess }}
    >
      <div className="flex justify-between lg:w-1/2 lg:pr-8 lg:py-8 items-start ">
        <div className="relative lg:glass lg:min-h-0 flex h-full overflow-hidden min-h-0 w-full flex-col gap-4 rounded-2xl px-4 pb-6">
          <StepHeader />
          <div className="flex flex-col gap-5 w-full items-center justify-center">
            <Link href="/" className="shrink-0">
              <Image
                src={logo}
                alt="logoIttc"
                loading="eager"
                width={198}
                height={48}
                className="h-10 w-auto brightness-0 invert sm:h-12"
              />
            </Link>
            <span className="text-base text-white/74 font-nexa font-light">
              {t("platform")}
            </span>
          </div>
          {!showSuccess && <Stepper steps={steps} />}
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </RegistrationContainerContext.Provider>
  );
}
