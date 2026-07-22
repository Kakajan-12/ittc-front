import type { ChangeEvent } from "react";

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function Field({
  id,
  label,
  placeholder,
  type = "text",
  name,
  required = false,
  value,
  onChange,
}: FieldProps) {
  return (
    <div className="relative group">
      <label
        htmlFor={id}
        className="label-style font-nexa hidden items-center gap-1 text-brand-dark-gray text-xs group-focus-within:flex"
      >
        {label}
        {required ? (
          <span className="absolute -top-1 right-0 text-base"> *</span>
        ) : (
          <span>(optional)</span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`input-style border ${value ? "border-gray-300" : "border-gray-400"}`}
      />
    </div>
  );
}
