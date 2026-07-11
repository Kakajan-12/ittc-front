"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { IoChevronBack } from "react-icons/io5";
import Image from "next/image";
import TabActive1 from "@/public/tab1active.svg";
import TabFull1 from "@/public/tab1full.svg";
import TabGray2 from "@/public/tab2gray.svg";
import TabActive2 from "@/public/tab2.svg";
import TabFull2 from "@/public/tab2full.svg";
import TabGray3 from "@/public/tab3gray.svg";
import TabActive3 from "@/public/tab3active.svg";
import { StaticImageData } from "next/image";
import Field from "@/shared/ui/Field";
import PhoneInput from "@/shared/ui/PhoneInput";
import Select from "@/shared/ui/Select";
import { defaultCountry, findCountry } from "@/shared/data/countries";
import { participatingTypes } from "@/shared/data/participatingTypes";
import Link from "next/link";
import PromoCode from "./PromoCode";
import SuccessModal from "./SuccessModal";
import TermsModal from "./TermsModal";

// type Tab = "signin" | "register";
type Step = {
  iconFull: StaticImageData;
  iconGray: StaticImageData;
  activeIcon: StaticImageData;
  label: string;
};

const steps: Step[] = [
  {
    iconFull: TabFull1,
    activeIcon: TabActive1,
    iconGray: TabFull1,
    label: "Promo code",
  },
  {
    iconFull: TabFull2,
    iconGray: TabGray2,
    activeIcon: TabActive2,
    label: "Personal information",
  },
  {
    iconFull: TabActive3,
    iconGray: TabGray3,
    activeIcon: TabActive3,
    label: "Company information",
  },
];

export default function Registration() {
  const router = useRouter();
  // const [tab, setTab] = useState<Tab>("register");
  const [step, setStep] = useState<Step>(steps[1]);
  const [showPromo, setShowPromo] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const codeInputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    patronymic: "",
    email: "",
    phone: "",
    countryCode: defaultCountry.code,
    companyName: "",
    position: "",
    companyWebsite: "",
    participatingType: "",
    promoCode: "",
  });

  const stepIndex = steps.findIndex((s) => s.label === step.label);
  const isLastStep = stepIndex === steps.length - 1;

  const isPersonalValid =
    formData.name.trim() !== "" &&
    formData.surname.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    accepted;

  // Доступ к шагу разрешён только если заполнены все предыдущие.
  const canAccessStep = (i: number) => {
    if (i <= 1) return true; // Promo code и Personal information доступны всегда
    return isPersonalValid; // Company information — только после Personal information
  };

  const goNext = () => {
    if (stepIndex < steps.length - 1) setStep(steps[stepIndex + 1]!);
  };

  const goPrev = () => {
    if (stepIndex > 0) setStep(steps[stepIndex - 1]!);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  {
    /* <Verificatiom> */
  }
  const handleCodeChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) codeInputsRef.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!digits) return;
    setCode((prev) => {
      const next = [...prev];
      for (let i = 0; i < 6; i++) next[i] = digits[i] ?? "";
      return next;
    });
    const focusIndex = Math.min(digits.length, 5);
    codeInputsRef.current[focusIndex]?.focus();
  };

  const sendByMail = () => {
    const lines = [
      `Name: ${formData.name}`,
      `Surname: ${formData.surname}`,
      `Patronymic: ${formData.patronymic}`,
      `Email: ${formData.email}`,
      `Phone: ${findCountry(formData.countryCode).dialCode} ${formData.phone}`,
      `Company name: ${formData.companyName}`,
      `Position: ${formData.position}`,
      `Company website: ${formData.companyWebsite}`,
      `Participating type: ${formData.participatingType}`,
      `Promo code: ${formData.promoCode}`,
    ];
    const subject = encodeURIComponent("Registration ITTC");
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:info@oguzforum.com?subject=${subject}&body=${body}`;
    setShowSuccess(true);
  };

  return (
    <div className="flex min-h-screen">
      <div className=" flex w-full overflow-hidden justify-end">
        {/* Left visual */}
        <div className="absolute inset-0 hidden w-full lg:block z-0">
          <Image
            src="/register.webp"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-blue-dark/40 z-10" />
          <a
            href="https://oguzforum.com"
            target="_blank"
            className="absolute left-10 top-10 flex flex-col gap-3 text-white z-20"
          >
            <Image
              src="/logoOguz.svg"
              alt="OGUZ Forum Expo"
              width={220}
              height={80}
              style={{ width: "auto", height: "auto" }}
              className="brightness-0 invert object-contain"
              priority
            />
            <span className="text-base font-nexa font-light">
              Event participant platform
            </span>
          </a>
        </div>

        {/* Right form */}
        <div className="relative z-30 flex w-full lg:w-1/2 bg-white m-6 rounded items-center h-full">
          <Link
            href="/"
            className="absolute top-3 left-1/2 -translate-x-1/2 lg:top-10 lg:right-26 lg:left-auto lg:translate-x-0"
          >
            <Image
              src="/logo.svg"
              alt=""
              width={70}
              height={70}
              className="object-cover"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>

          <div className="sm:p-20 lg:p-15 xl:p-26 w-full">
            {!showPromo && stepIndex >= 1 && (
              <button
                type="button"
                onClick={() => {
                  if (stepIndex === 1) setShowPromo(true);
                  else goPrev();
                }}
                aria-label="Back"
                className="absolute top-0 left-0 lg:top-6 lg:left-6 flex items-center h-10 w-10 justify-center text-[#424A4E] rounded bg-[#E9E9E9] backdrop-blur-lg transition-colors hover:text-brand-blue hover:bg-gray-200/90"
              >
                <IoChevronBack className="size-5 xl:size-7" />
              </button>
            )}
            <h1 className="mb-6 font-nexa-bold text-[28px] font-bold text-[#424A4E]">
              Registration
            </h1>
            <>
              {showPromo ? (
                <PromoCode
                  value={formData.promoCode}
                  onSubmit={(promoCode) => {
                    setFormData((prev) => ({ ...prev, promoCode }));
                    setShowPromo(false);
                  }}
                  onSkip={() => {
                    setFormData((prev) => ({ ...prev, promoCode: "" }));
                    setShowPromo(false);
                  }}
                />
              ) : (
                <>
                  {/* Stepper */}
                  <div className="mb-10 flex justify-center items-center gap-1 pb-3 border-b border-[#D9D9D9]">
                    {steps.map((s, i) => {
                      const isCompleted = i < stepIndex;
                      const isActive = i === stepIndex;
                      const isLocked = !canAccessStep(i);
                      const icon = isCompleted
                        ? s.iconFull
                        : isActive
                          ? s.activeIcon
                          : s.iconGray;
                      const textColor = isCompleted
                        ? "text-white"
                        : isActive
                          ? "text-[#0071BB]"
                          : "text-[#aab4bd]";
                      return (
                        <button
                          type="button"
                          key={s.label}
                          disabled={isLocked}
                          onClick={() => {
                            if (i === 0) setShowPromo(true);
                            else setStep(steps[i]!);
                          }}
                          className={`relative min-w-0 flex-1 ${
                            isLocked
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer"
                          }`}
                        >
                          <Image
                            src={icon}
                            alt={s.label}
                            width={144}
                            height={40}
                            sizes="(max-width: 1024px) 33vw, 20vw"
                            className="h-auto w-full object-contain"
                          />
                          <div
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center font-nexa text-[10px] sm:text-xs md:text-sm lg:text-xs xl:text-base ${textColor}`}
                          >
                            <span className="text-center leading-2 sm:leading-4 max-w-16 xl:max-w-24">
                              {s.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {stepIndex === 1 && (
                    <form
                      className="flex flex-col gap-5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        goNext();
                      }}
                    >
                      <Field
                        id="name"
                        label="Name"
                        placeholder="Enter your name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <Field
                        id="surname"
                        label="Surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                        placeholder="Enter your surname"
                      />
                      <Field
                        id="patronymic"
                        label="Patronymic"
                        placeholder="Enter your patronymic"
                        name="patronymic"
                        value={formData.patronymic}
                        onChange={handleChange}
                      />
                      <Field
                        id="email"
                        label="Email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        type="email"
                      />

                      <PhoneInput
                        label="Mobile number"
                        placeholder="Mobile number"
                        value={formData.phone}
                        countryCode={formData.countryCode}
                        onChange={(phone) =>
                          setFormData((prev) => ({ ...prev, phone }))
                        }
                        onCountryChange={(country) =>
                          setFormData((prev) => ({
                            ...prev,
                            countryCode: country.code,
                          }))
                        }
                      />

                      {/* Terms */}
                      <label className="flex items-start gap-2 text-sm text-brand-gray">
                        <input
                          type="checkbox"
                          checked={accepted}
                          onChange={(e) => setAccepted(e.target.checked)}
                          className="mt-0.5 size-4 accent-brand-blue"
                        />
                        <span>
                          I accept the{" "}
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-brand-blue hover:underline capitalize"
                          >
                            terms of use
                          </button>{" "}
                          and{" "}
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-brand-blue hover:underline capitalize"
                          >
                            privacy policy
                          </button>
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={!accepted}
                        className="mt-1 h-12 rounded bg-[#0071BB] font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Next
                      </button>
                    </form>
                  )}
                  {stepIndex === 2 && (
                    <form
                      className="flex flex-col gap-5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!formData.participatingType) return;
                        sendByMail();
                      }}
                    >
                      <Field
                        id="company-name"
                        label="Company name"
                        placeholder="Company name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                      />
                      <Field
                        id="position"
                        label="Position"
                        placeholder="Position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                      />
                      <Field
                        id="company-website"
                        label="Company website"
                        placeholder="Company website"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                      />
                      <Select
                        id="participating-type"
                        label="Participating type"
                        placeholder="Participating type"
                        options={participatingTypes}
                        value={formData.participatingType}
                        onChange={(participatingType) =>
                          setFormData((prev) => ({
                            ...prev,
                            participatingType,
                          }))
                        }
                        required
                      />
                      {/* <Field
                    id="promo-code"
                    label="Promo code"
                    placeholder="Promo code"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleChange}
                  /> */}
                      <button
                        type="submit"
                        disabled={!formData.participatingType}
                        className="mt-1 h-12 rounded bg-[#0071BB] text-base font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Submit a request
                      </button>
                    </form>
                  )}
                  {stepIndex === 3 && (
                    <form
                      className="flex flex-col items-center gap-5 text-center"
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendByMail();
                      }}
                    >
                      <ShieldCheck
                        className="size-16 text-[#9AA5AC]"
                        strokeWidth={1.5}
                      />

                      <div className="flex flex-col gap-2">
                        <h2 className="font-nexa-bold text-2xl font-bold text-[#424A4E]">
                          Verify your email
                        </h2>
                        <p className="font-nexa text-sm text-[#9AA5AC]">
                          We&apos;ve sent a 6-digit code to
                          <br />
                          <span className="text-[#424A4E]">
                            {formData.email || "example@gmail.com"}
                          </span>
                        </p>
                      </div>

                      <div className="flex justify-center gap-2 sm:gap-3">
                        {code.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => {
                              codeInputsRef.current[i] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleCodeChange(i, e.target.value)
                            }
                            onKeyDown={(e) => handleCodeKeyDown(i, e)}
                            onPaste={handleCodePaste}
                            aria-label={`Digit ${i + 1}`}
                            className="w-10 h-12 rounded border border-brand-blue text-center font-nexa-bold text-xl font-bold text-[#424A4E] outline-none transition-colors focus:border-brand-blue"
                          />
                        ))}
                      </div>

                      <p className="font-nexa text-sm text-[#9AA5AC]">
                        Enter the verification code sent to your email
                      </p>

                      <button
                        type="submit"
                        className="h-12 w-full rounded bg-[#0071BB] font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Verify email
                      </button>

                      <p className="font-nexa text-sm text-[#424A4E]">
                        Didn&apos;t receive a code?{" "}
                        <button
                          type="button"
                          onClick={() => setCode(Array(6).fill(""))}
                          className="font-nexa-bold font-bold text-brand-blue hover:underline"
                        >
                          Resend
                        </button>
                      </p>
                    </form>
                  )}
                </>
              )}
            </>
          </div>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.push("/en");
        }}
      />

      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}
