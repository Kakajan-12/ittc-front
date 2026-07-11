"use client";

import { useState } from "react";
import promo from "@/public/promo.svg";
import { validatePromoCode } from "./promoCodesData";
import Image from "next/image";
import { IoCheckmarkOutline } from "react-icons/io5";

interface PromoCodeProps {
  value: string;
  onSubmit: (code: string) => void;
  onSkip: () => void;
}

export default function PromoCode({ value, onSubmit, onSkip }: PromoCodeProps) {
  const [input, setInput] = useState(value);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const promo = validatePromoCode(input);

    if (!promo) {
      setAccepted(false);
      setError(
        "Promo code not found or has expired. Please check and try again",
      );
      return;
    }

    setError("");
    setAccepted(true);
    // Show the "accepted" message briefly before switching to the form.
    setTimeout(() => onSubmit(promo.code), 2000);
  };

  return (
    <form
      className="flex h-full max-h-[400px] lg:max-h-[520px] flex-col items-center text-center justify-between"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col justify-center items-center">
        <div className="mb-7 flex size-16 items-center justify-center rounded-full text-[#9AA5AC]">
          <Image src={promo} alt="promo" width={56} height={56} />
        </div>

        <h2 className="mb-6 font-nexa-bold text-lg font-bold text-[#797979]">
          Promo Code
        </h2>

        <p className="mb-11 max-w-xs font-nexa text-sm text-[#849299]">
          If you have a promo code from the organizers — enter it to get access
        </p>
        <input
          id="promo-code"
          name="promoCode"
          type="text"
          placeholder="Enter the promo code"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError("");
            if (accepted) setAccepted(false);
          }}
          aria-invalid={!!error}
          className={`h-12 w-full rounded border px-4 text-base text-center font-nexa text-[#797979] outline-none transition-colors placeholder:text-[#9AA5AC] ${
            error
              ? "border-red-500"
              : input
                ? "border-brand-blue-dark"
                : "border-[#849299]"
          }`}
        />

        {error ? (
          <p className="mt-3 font-nexa text-sm text-red-500">{error}</p>
        ) : accepted ? (
          <p className="mt-3 flex items-center gap-2 font-nexa text-sm text-[#6CD278]">
            <IoCheckmarkOutline size={16} className="text-[#6CD278]" />
            <span>Promo code accepted</span>
          </p>
        ) : (
          <p className="mt-3 font-nexa text-xs text-[#9AA5AC]">
            Promo codes are issued by the event organizers
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3 w-full mt-10">
        <button
          type="submit"
          disabled={accepted}
          className="h-12 w-full rounded bg-[#0071BB] font-nexa-bold font-bold shadow-promo-code text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="w-full rounded h-12 font-nexa-bold font-bold bg-[#D7ECF9] text-base text-[#424A4E] shadow-promo-code transition-colors hover:text-brand-blue"
        >
          Skip
        </button>
      </div>
    </form>
  );
}
