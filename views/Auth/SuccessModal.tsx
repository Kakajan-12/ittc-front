"use client";

import { IoCheckmarkOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  /** Без затемнения — фон под модалкой остаётся чистым (экран регистрации) */
  plainBackdrop?: boolean;
}

export default function SuccessModal({
  open,
  onClose,
  plainBackdrop = false,
}: SuccessModalProps) {
  const t = useTranslations("Registration.success");

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      className={`absolute inset-0 z-50 flex items-center justify-center p-4 ${
        plainBackdrop ? "" : "bg-black/30"
      }`}
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-sm flex-col items-center glass rounded-lg p-5 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-white text-white">
          <IoCheckmarkOutline size={30} />
        </div>

        <h2
          id="success-modal-title"
          className="mb-3 font-nexa-bold text-base lg:text-xl font-bold text-white"
        >
          {t("title")}
        </h2>

        <p className="mb-8 font-nexa text-xs lg:text-sm text-white">
          {t("text")}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="h-12 w-full rounded glass font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
