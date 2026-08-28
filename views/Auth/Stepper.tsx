"use client";

import { useTranslations } from "next-intl";
import StepTab, { TabVariant, tabWidth } from "./StepTab";
import { PRINT } from "@/shared/lib/helpers";
import { usePathname, useRouter } from "@/i18n/navigation";

export type T_REGISTARTION_STEP = {
  key: string;
  link?: string;
  i18key: string;
};

interface StepperProps {
  steps: Array<T_REGISTARTION_STEP>;
}

export default function Stepper({ steps }: StepperProps) {
  const t = useTranslations("Registration");
  const currentPath = usePathname();
  PRINT(currentPath.split("/")[2]);
  const router = useRouter();

  const currentStep = currentPath.split("/")[2];

  const currentStepIndex = steps.findIndex((step) => step.link === currentStep);
  return (
    <div className="flex justify-center items-center gap-1 pb-3 border-b border-[#05518B]/80">
      {steps.map((i, index) => {
        const isActive = index === currentStepIndex;

        // Completed ONLY if the step is before current step

        const isCompleted = index < currentStepIndex;

        // Future step

        const isLocked = index > currentStepIndex;

        const strokeClass = isCompleted ? "text-[#72B7EC]" : "text-[#579CD0]";

        const fillColor = isCompleted ? "#55AAEC8F" : "none";

        const textColor =
          isCompleted || isActive ? "text-white" : "text-[#579CD0]";
        return (
          <button
            type="button"
            key={i.key}
            aria-label={t(i.i18key)}
            aria-current={isActive ? "step" : undefined}
            // disabled={isLocked}
            onClick={() => i.link && router.push(i.link)}
            style={{ flexGrow: tabWidth(isActive) }}
            className={`relative min-w-0 basis-0`}
            // ${
            //   isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            // }
          >
            <StepTab
              variant={String(index) as TabVariant}
              active={isActive}
              fill={fillColor}
              className={`h-auto w-full ${strokeClass}`}
            />
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center font-nexa text-[10px] sm:text-xs md:text-sm lg:text-xs xl:text-base ${textColor}`}
            >
              <span className="text-center leading-2 sm:leading-4 max-w-16 xl:max-w-24">
                {isActive ? t(i.i18key) : index + 1}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
