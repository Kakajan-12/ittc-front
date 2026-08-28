"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Field from "@/shared/ui/Field";
import { useErrorText } from "@/shared/lib/errorText";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { STORAGE_KEYS } from "./config";

export interface SignInValues {
  registrationId: string;
  password: string;
}

// interface SignInProps {
//   onSubmit: (values: SignInValues) => void;
//   onForgotId?: () => void;
//   isPending?: boolean;
//   errorMessage?: string;
// }

// const REGISTRATION_ID_PATTERN = /^[A-Za-z]{3}-\d{4}-[A-Za-z0-9]{4,}$/;

export default function SignIn() {
// {
//   // onSubmit,
//   // onForgotId,
//   // isPending = false,
//   // errorMessage,
// }: SignInProps,
  const t = useTranslations("Registration.signIn");
  // const errorText = useErrorText();
  // ID переживает смену языка, пароль — нет: его в хранилище не кладём
  // const [registrationId, setRegistrationId] = usePersistentState(
  //   STORAGE_KEYS.signInId,
  //   "",
  // );
  // const [password, setPassword] = useState("");
  // const [errors, setErrors] = useState<Partial<SignInValues>>({});
  // const [showPassword, setShowPassword] = useState(false);

  // const values: SignInValues = { registrationId, password };

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  // ) => {
  //   const { name, value } = e.target;
  //   if (name === "registrationId") setRegistrationId(value);
  //   else setPassword(value);
  //   setErrors((prev) => (prev[name as keyof SignInValues] ? {} : prev));
  // };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (isPending) return;

  //   const next: Partial<SignInValues> = {};
  //   const registrationId = values.registrationId.trim();

  //   if (!registrationId)
  //     next.registrationId = "Registration.signIn.errors.idRequired";
  //   else if (!REGISTRATION_ID_PATTERN.test(registrationId))
  //     next.registrationId = "Registration.signIn.errors.idFormat";
  //   if (!values.password)
  //     next.password = "Registration.signIn.errors.passwordRequired";

  //   if (Object.keys(next).length) {
  //     setErrors(next);
  //     return;
  //   }

  //   setErrors({});
  //   onSubmit({ registrationId, password: values.password });
  // };

  return (
    <div className="flex w-full h-full flex-col gap-6 justify-start items-center mt-10">
      {/* <Field
        id="registration-id"
        name="registrationId"
        label={t("registrationId")}
        placeholder={t("registrationIdPlaceholder")}
        autoComplete="username"
        required
        value={values.registrationId}
        onChange={handleChange}
        error={errorText(errors.registrationId)}
      />

      <Field
        id="password"
        name="password"
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        required
        value={values.password}
        onChange={handleChange}
        error={errorText(errors.password)}
        suffix={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            className="text-white/60 mt-1 transition-colors hover:text-white"
          >
            {showPassword ? (
              <IoEyeOutline size={20} />
            ) : (
              <IoEyeOffOutline size={20} />
            )}
          </button>
        }
      /> */}

      {/* {errorMessage ? (
        <p role="alert" className="font-nexa text-sm text-[#DE7A7A]">
          {errorMessage}
        </p>
      ) : null} */}

      <a
        // disabled={isPending}
        href="#"
        className="mt-4 h-12 px-10 flex items-center justify-center rounded bg-[#0071BB] font-nexa-bold font-bold text-white shadow-promo-code transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* {isPending ? t("submitting") : t("submit")} */}
        {t("to-platform")}
      </a>

      {/* <button
        type="button"
        onClick={onForgotId}
        className="font-nexa text-sm text-white transition-colors hover:text-white/70"
      >
        {t("forgotId")}
      </button> */}
    </div>
  );
}
