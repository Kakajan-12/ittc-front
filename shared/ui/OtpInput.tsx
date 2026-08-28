"use client";

import { useRef } from "react";

interface OtpInputProps {
  /** One entry per box — a digit or an empty string */
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

/** Row of single-digit boxes with auto-advance, backspace and paste support */
export default function OtpInput({
  value,
  onChange,
  className = "",
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const length = value.length;

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!digits) return;
    onChange(Array.from({ length }, (_, i) => digits[i] ?? ""));
    inputsRef.current[Math.min(digits.length, length - 1)]?.focus();
  };

  return (
    <div className={`flex justify-center gap-2 sm:gap-3 ${className}`}>
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${i + 1}`}
          className="w-10 h-12 rounded border border-[#96B9D5] text-center font-nexa-bold text-xl font-bold text-white outline-none transition-colors focus:border-brand-blue"
        />
      ))}
    </div>
  );
}
