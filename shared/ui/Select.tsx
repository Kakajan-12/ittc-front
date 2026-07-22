"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
};

export default function Select({
  id,
  label,
  placeholder = "Select option",
  options,
  value,
  onChange,
  required = false,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <label
        htmlFor={id}
        className="label-style font-nexa flex items-center gap-1 text-brand-dark-gray text-xs"
      >
        {label}
        {required ? (
          <span className="absolute -top-1 right-0 text-base"> *</span>
        ) : (
          <span>(optional)</span>
        )}
      </label>

      <button
        id={id}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          `input-style flex w-full items-center justify-between text-left border rounded ${value ? "border-gray-300" : "border-gray-400"}`,
          !selectedOption && "text-[#aab4bd]",
        )}
      >
        <span className="truncate text-black">
          {selectedOption?.label ?? placeholder}
        </span>
        <FaChevronDown
          className={cn(
            "ml-2 size-3 shrink-0 text-brand-gray transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded border border-gray-400 bg-white py-1 shadow-lg"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
            >
              <button
                type="button"
                onClick={() => selectOption(option.value)}
                className={cn(
                  "flex w-full px-4 py-3 text-left text-base transition-colors hover:text-white hover:bg-brand-blue",
                  value === option.value && "text-white bg-brand-blue",
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
