"use client";

import { useEffect, useRef } from "react";
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
    code,
    setCode,
    sendCode,
    handleSubmit,
    handleResend,
    isSubmitting,
    isResending,
    resendCountdown,
    error,
  } = useVerificationStep({ t: tErrors, id });

  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || !draftId) return;
    sent.current = true;
    void sendCode();
  }, [draftId, sendCode]);

  return (
    <form
      className="flex flex-col items-center gap-5 text-center mt-16"
      onSubmit={async (e) => {
        e.preventDefault();
        const ok = await handleSubmit();
        if (ok) onCompleted?.();
      }}
    >
      <div className="flex flex-col gap-2">
        <h2 className="font-nexa-bold text-2xl font-bold text-white">
          {t("title")}
        </h2>
        <p className="font-nexa text-sm text-[#CCCBCBA8]">
          {t("sentTo")}
          <br />
          <span className="text-white/82">{email}</span>
        </p>
      </div>

      <OtpInput value={code} onChange={setCode} />

      <p className="font-nexa text-sm text-gray-400">{t("hint")}</p>

      {error && <p className="font-nexa text-sm text-[#DE7A7A]">{error}</p>}

      <button
        type="submit"
        disabled={code.join("").length !== OTP_LENGTH || isSubmitting}
        className="h-12 w-full rounded bg-[#0071BB] font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t("verifying") : t("verify")}
      </button>

      {resendCountdown === 0 && (
        <p className="font-nexa-regular text-sm text-white">
          {t("noCode")}{" "}
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={isResending}
            className="font-nexa-regular text-brand-blue hover:underline disabled:opacity-60"
          >
            {isResending ? t("resending") : t("resend")}
          </button>
        </p>
      )}
    </form>
  );
}
