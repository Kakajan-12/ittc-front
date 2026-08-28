"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  const t = useTranslations("Registration.termsModal");

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-lg bg-white p-3 shadow-xl sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 pr-12">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#D7ECF9] text-brand-blue">
            <ShieldCheck className="size-8" strokeWidth={1.5} />
          </div>
          <div>
            <h2
              id="terms-modal-title"
              className="mb-2 font-nexa-bold text-base lg:text-2xl font-bold text-brand-dark-gray"
            >
              {t("title")}
            </h2>
            <p className="font-nexa text-xs lg:text-sm text-gray-400">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <hr className="my-6 border-[#D9D9D9]" />

        {/* Terms of Use */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <h3 className="font-nexa-bold text-base lg:text-lg font-bold text-brand-dark-gray">
              {t("termsTitle")}
            </h3>
          </div>
          <p className="font-nexa text-xs lg:text-sm leading-relaxed text-gray-400">
            {t("termsText")}
          </p>
        </section>

        <hr className="my-6 border-[#D9D9D9]" />

        {/* Privacy Policy */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <h3 className="font-nexa-bold text-base lg:text-lg font-bold text-brand-dark-gray">
              {t("privacyTitle")}
            </h3>
          </div>
          <p className="font-nexa text-xs lg:text-sm leading-relaxed text-gray-400">
            {t("privacyText")}
          </p>
          <p className="mt-4 font-nexa text-xs lg:text-sm leading-relaxed text-gray-400">
            {t("privacyMore")}
          </p>
        </section>

        <button
          type="button"
          onClick={onClose}
          className="h-12 w-full rounded bg-[#0071BB] font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
