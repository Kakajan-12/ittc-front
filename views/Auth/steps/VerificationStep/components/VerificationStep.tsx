"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import OtpInput from "@/shared/ui/OtpInput";
import { OTP_LENGTH } from "../../../config";
import { useVerificationStep } from "../hook";

interface VerificationStepProps {
  id?: number;
  onCompleted?: () => void;
}

export default function VerificationStep({
  id,
  onCompleted,
}: VerificationStepProps) {
  const t = useTranslations("Registration.verification");
  const tErrors = useTranslations("Registration.errors");

  const {
    draftId,
    email,
    phoneNumber,
    channel,
    code,
    setCode,
    sendCode,
    handleSubmit,
    handleResend,
    handleSwitchChannel,
    isSwitchingChannel,
    isSubmitting,
    isResending,
    resendCountdown,
    error,
  } = useVerificationStep({ t: tErrors, id });

  const isEmail = channel === "email";

  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || !draftId) return;
    sent.current = true;
    void sendCode();
  }, [draftId, email, sendCode]);

  return (
    <form
      className="flex flex-col items-center gap-5 text-center mt-16 "
      onSubmit={async (e) => {
        e.preventDefault();
        const ok = await handleSubmit();
        if (ok) onCompleted?.();
      }}
    >
      <div className="flex flex-col gap-2">
        <h2 className="font-nexa-bold text-2xl font-bold text-white">
          {t(isEmail ? "title" : "titlePhone")}
        </h2>
        <p className="font-nexa text-sm text-[#CCCBCBA8]">
          {t("sentTo")}
          <br />
          <span className="text-white/82">{isEmail ? email : phoneNumber}</span>
        </p>
      </div>

      <OtpInput value={code} onChange={setCode} />

      <p className="font-nexa text-sm text-gray-400">
        {t(isEmail ? "hint" : "hintPhone")}
      </p>

      {error && (
        <p className="font-nexa text-sm text-[#DE7A7A]">{t("error-otp")}</p>
      )}

      <button
        type="submit"
        disabled={code.join("").length !== OTP_LENGTH || isSubmitting}
        className="h-12 w-full rounded bg-[#0071BB] font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t("verifying") : t(isEmail ? "verify" : "verifyPhone")}
      </button>

      <p className="font-nexa-regular text-sm text-white">
        {t("noCode")}{" "}
        {resendCountdown > 0 ? (
          <span className="text-gray-400">
            {t("resendIn", { seconds: resendCountdown })}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={isResending}
            className="font-nexa-regular text-brand-blue hover:underline disabled:opacity-60"
          >
            {isResending ? t("resending") : t("resend")}
          </button>
        )}
      </p>

      <div className="my-6 flex w-full items-center gap-4 px-8">
        <span className="h-px flex-1 bg-[#96B9D5]/60" />
        <span className="font-nexa text-xs text-gray-400">{t("or")}</span>
        <span className="h-px flex-1 bg-[#96B9D5]/60" />
      </div>

      <button
        type="button"
        onClick={() => void handleSwitchChannel()}
        // disabled={isSwitchingChannel}
        className="flex items-center gap-3 font-nexa-regular text-sm text-white"
      >
        {isEmail ? (
          <Image src="/message.svg" alt="" width={20} height={20} />
        ) : (
          <Mail
            aria-hidden
            className="size-5 text-[#4FB5F8]"
            strokeWidth={1.5}
          />
        )}
        <span className="underline underline-offset-4">
          {t(isEmail ? "sendToPhone" : "sendToEmail")}
        </span>
      </button>
    </form>
  );
}
