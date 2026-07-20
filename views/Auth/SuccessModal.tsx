"use client";

import { IoCheckmarkOutline } from "react-icons/io5";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessModal({ open, onClose }: SuccessModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col items-center rounded-lg bg-white p-4 text-center shadow-xl sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex size-20 items-center justify-center rounded-full border-2 border-[#6CD278] text-[#6CD278]">
          <IoCheckmarkOutline size={40} />
        </div>

        <h2
          id="success-modal-title"
          className="mb-3 font-nexa-bold text-base lg:text-2xl font-bold text-brand-dark-gray"
        >
          Application Submitted
        </h2>

        <p className="mb-8 font-nexa text-xs lg:text-base text-gray-400">
          Thank you for registering.
          <br />
          We have received your application successfully.
        </p>

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
