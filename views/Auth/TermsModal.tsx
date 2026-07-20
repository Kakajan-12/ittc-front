"use client";

import { FileText, ShieldCheck, X } from "lucide-react";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
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
              Terms of Use and Privacy Policy
            </h2>
            <p className="font-nexa text-xs lg:text-sm text-gray-400">
              Please read the following terms and policies carefully to
              understand how your data is used and your rights.
            </p>
          </div>
        </div>

        <hr className="my-6 border-[#D9D9D9]" />

        {/* Terms of Use */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <h3 className="font-nexa-bold text-base lg:text-lg font-bold text-brand-dark-gray">
              Terms of Use
            </h3>
          </div>
          <p className="font-nexa text-xs lg:text-sm leading-relaxed text-gray-400">
            By registering for ITTC 2026, you agree to provide accurate and
            complete information. Your registration is personal and
            non-transferable. We reserve the right to refuse or cancel any
            registration at our discretion.
          </p>
        </section>

        <hr className="my-6 border-[#D9D9D9]" />

        {/* Privacy Policy */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <h3 className="font-nexa-bold text-base lg:text-lg font-bold text-brand-dark-gray">
              Privacy Policy
            </h3>
          </div>
          <p className="font-nexa text-xs lg:text-sm leading-relaxed text-gray-400">
            We are committed to protecting your privacy. The personal
            information you provide will be used solely for event registration
            and related communications. We do not share your data with third
            parties without your consent.
          </p>
          <p className="mt-4 font-nexa text-xs lg:text-sm leading-relaxed text-gray-400">
            For more details, please visit our full Privacy Policy on the
            website.
          </p>
        </section>

        <button
          type="button"
          onClick={onClose}
          className="h-12 w-full rounded bg-[#0071BB] font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80"
        >
          Close
        </button>
      </div>
    </div>
  );
}
