import { useEffect, useState } from "react";
import { Statistic } from "antd";
import type { StatisticTimerProps } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { RESEND_OTP } from "../api";
import { C_SENT_INFO_KEY, T_SEND_OTP } from "../type";
import { VERIFICATION_ERROR_CODE } from "../errorCodes";
import { getErrorMessage } from "../dictionary";

const { Timer } = Statistic;

export function ResendButton() {
  const t = useTranslations("Registration.verification");
  const tEr = useTranslations("Registration.errors");

  const [countdownEnd, setCountdownEnd] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("========== INITIAL COUNTDOWN CHECK ==========");

    console.log(
      "[COUNTDOWN] Browser timezone:",
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );

    console.log(
      "[COUNTDOWN] Browser timezone offset:",
      new Date().getTimezoneOffset(),
      "minutes",
    );

    console.log("[COUNTDOWN] Current Date object:", new Date());
    console.log("[COUNTDOWN] Current local time:", new Date().toString());
    console.log("[COUNTDOWN] Current UTC time:", new Date().toISOString());
    console.log("[COUNTDOWN] Date.now():", Date.now());

    const rawStorage = sessionStorage.getItem(C_SENT_INFO_KEY);

    console.log("[COUNTDOWN] Storage key:", C_SENT_INFO_KEY);
    console.log("[COUNTDOWN] Raw sessionStorage value:", rawStorage);

    const sentInfo = getSentInfo();

    console.log("[COUNTDOWN] Parsed sentInfo:", sentInfo);

    if (!sentInfo) {
      console.log("[COUNTDOWN] ❌ No sentInfo found");
      console.log("============================================");
      return;
    }

    console.log("[COUNTDOWN] Backend response fields:");
    console.log("[COUNTDOWN] revId:", sentInfo.revId);
    console.log("[COUNTDOWN] email:", sentInfo.emaul);
    console.log("[COUNTDOWN] expiresAt:", sentInfo.expiresAt);
    console.log("[COUNTDOWN] nextResendAt:", sentInfo.nextResendAt);
    console.log("[COUNTDOWN] attempts:", sentInfo.attempts);

    console.log("[COUNTDOWN] nextResendAt type:", typeof sentInfo.nextResendAt);

    console.log("[COUNTDOWN] nextResendAt raw:", sentInfo.nextResendAt);

    const endTime = new Date(sentInfo.nextResendAt).getTime();
    const nowTime = Date.now();

    console.log(
      "[COUNTDOWN] Parsed resend date:",
      new Date(sentInfo.nextResendAt),
    );
    console.log(
      "[COUNTDOWN] Parsed resend date local:",
      new Date(sentInfo.nextResendAt).toString(),
    );
    console.log(
      "[COUNTDOWN] Parsed resend date UTC:",
      new Date(sentInfo.nextResendAt).toISOString(),
    );

    console.log("[COUNTDOWN] endTime timestamp:", endTime);
    console.log("[COUNTDOWN] nowTime timestamp:", nowTime);

    console.log("[COUNTDOWN] Difference milliseconds:", endTime - nowTime);

    console.log("[COUNTDOWN] Difference seconds:", (endTime - nowTime) / 1000);

    console.log(
      "[COUNTDOWN] Difference minutes:",
      (endTime - nowTime) / 1000 / 60,
    );

    console.log(
      "[COUNTDOWN] Date.now() formatted UTC:",
      new Date(nowTime).toISOString(),
    );

    console.log(
      "[COUNTDOWN] nextResendAt formatted UTC:",
      new Date(endTime).toISOString(),
    );

    console.log("[COUNTDOWN] Is endTime valid:", !Number.isNaN(endTime));

    console.log("[COUNTDOWN] Is countdown still active:", endTime > nowTime);

    if (!Number.isNaN(endTime) && endTime > nowTime) {
      console.log("[COUNTDOWN] ✅ Setting countdownEnd:", endTime);

      setCountdownEnd(endTime);
    } else {
      console.log(
        "[COUNTDOWN] ❌ Countdown is expired or nextResendAt is invalid",
      );

      if (Number.isNaN(endTime)) {
        console.log("[COUNTDOWN] Reason: invalid nextResendAt");
      } else {
        console.log("[COUNTDOWN] Reason: nextResendAt is already in the past");
      }
    }

    console.log("============================================");
  }, []);

  const resendMutation = useMutation({
    mutationFn: async ({ revId }: { revId: number }) => {
      return RESEND_OTP({ revId });
    },

    onSuccess: (data) => {
      sessionStorage.setItem(C_SENT_INFO_KEY, JSON.stringify(data));
      const endTime = new Date(data.nextResendAt).getTime();
      setCountdownEnd(Number.isNaN(endTime) ? null : endTime);
      setError("");
    },

    onError: (error) => {
      if (error instanceof Error) {
        setError(
          isErrorCode(error.message)
            ? getErrorMessage({
                t,
                errorCode: error.message,
              })
            : error.message,
        );
      }
    },
  });

  const handleResend = () => {
    if (resendMutation.isPending) {
      return;
    }

    const sentInfo = getSentInfo();

    if (!sentInfo) {
      setError(
        getErrorMessage({
          t: tEr,
          errorCode: VERIFICATION_ERROR_CODE.SEND_EMAIL_FAILED,
        }),
      );
      return;
    }

    const endTime = new Date(sentInfo.nextResendAt).getTime();

    if (!Number.isNaN(endTime) && endTime > Date.now()) {
      setCountdownEnd(endTime);
      return;
    }

    setError("");

    resendMutation.mutate({
      revId: sentInfo.revId,
    });
  };

  const handleCountdownFinish: StatisticTimerProps["onFinish"] = () => {
    setCountdownEnd(null);
  };

  const isCountingDown = countdownEnd !== null && countdownEnd > Date.now();

  const resendContent = resendMutation.isPending ? (
    t("resending")
  ) : isCountingDown ? (
    <Timer
      type="countdown"
      value={countdownEnd}
      format="ss[s]"
      onFinish={handleCountdownFinish}
      classNames={{
        content: "text-brand-blue! text-sm! font-nexa-regular!",
      }}
    />
  ) : (
    t("resend")
  );

  if (error) {
    return (
      <div className="flex flex-col gap-1">
        <p className="font-nexa-regular text-sm text-red-500">{error}</p>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendMutation.isPending || isCountingDown}
          className="font-nexa-regular text-brand-blue hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resendContent}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <p className="font-nexa-regular text-sm text-white">{t("noCode")}</p>

      <button
        type="button"
        onClick={handleResend}
        disabled={resendMutation.isPending || isCountingDown}
        className="font-nexa-regular text-brand-blue hover:underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        {resendContent}
      </button>
    </div>
  );
}

function getSentInfo(): T_SEND_OTP | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = sessionStorage.getItem(C_SENT_INFO_KEY);

  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as T_SEND_OTP;

    if (
      typeof parsed.revId !== "number" ||
      typeof parsed.nextResendAt !== "string"
    ) {
      sessionStorage.removeItem(C_SENT_INFO_KEY);
      return null;
    }

    if (Number.isNaN(new Date(parsed.nextResendAt).getTime())) {
      sessionStorage.removeItem(C_SENT_INFO_KEY);
      return null;
    }

    return parsed;
  } catch {
    sessionStorage.removeItem(C_SENT_INFO_KEY);
    return null;
  }
}

function isErrorCode(message: string): message is VERIFICATION_ERROR_CODE {
  return Object.values(VERIFICATION_ERROR_CODE).includes(
    message as VERIFICATION_ERROR_CODE,
  );
}
