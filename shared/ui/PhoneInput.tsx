"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  countries,
  defaultCountry,
  findCountry,
  type Country,
} from "@/shared/data/countries";
import CountryFlag from "@/shared/ui/CountryFlag";
import { cn } from "@/lib/utils";

type PhoneInputProps = {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  countryCode?: string;
  onChange: (phone: string) => void;
  onCountryChange?: (country: Country) => void;
  className?: string;
  required?: boolean;
};

export default function PhoneInput({
  id = "phone",
  name = "phone",
  label,
  placeholder = "Mobile number",
  value,
  countryCode = defaultCountry.code,
  onChange,
  onCountryChange,
  className,
  required = true,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedCountry = findCountry(countryCode);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.dialCode.includes(search) ||
      country.code.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const selectCountry = (country: Country) => {
    onCountryChange?.(country);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={cn("relative group", className)} ref={containerRef}>
      {label ? (
        <label
          htmlFor={id}
          className="label-style font-nexa hidden items-center gap-1 text-brand-dark-gray text-xs group-focus-within:flex"
        >
          {label}
          <span className="absolute -top-1 right-0 text-base"> *</span>
        </label>
      ) : null}

      <div
        className={`flex h-12 items-stretch overflow-hidden rounded border transition-colors group-focus-within:border-brand-blue ${value ? "border-gray-300" : "border-gray-400"}`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((prev) => !prev)}
          className="flex shrink-0 items-center gap-1.5 border-r border-[#c7ced4] px-3 text-sm transition-colors hover:bg-[#f5f7f8]"
        >
          <CountryFlag
            code={selectedCountry.code}
            title={selectedCountry.name}
          />
          <span className="text-sm text-brand-dark-gray">
            {selectedCountry.dialCode}
          </span>
          <FaChevronDown
            className={cn(
              "size-2.5 text-brand-gray transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        <input
          id={id}
          name={name}
          type="tel"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          autoComplete="tel-national"
          className="min-w-0 flex-1 px-3 text-sm text-brand-dark-gray outline-none placeholder:text-[#aab4bd]"
          required={required}
        />
      </div>

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded border border-gray-400 bg-white shadow-lg">
          <div className="border-b border-[#e8ecef] p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              autoFocus
              className="w-full rounded border border-[#c7ced4] px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </div>
          <ul
            role="listbox"
            className="max-h-52 overflow-y-auto py-1"
            aria-label="Countries"
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <li key={country.code} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onClick={() => selectCountry(country)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f7f8]",
                      country.code === selectedCountry.code &&
                        "bg-[#eaf4fb] text-brand-blue",
                    )}
                  >
                    <CountryFlag code={country.code} title={country.name} />
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="shrink-0 text-brand-gray">
                      {country.dialCode}
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-brand-gray">
                No countries found
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
