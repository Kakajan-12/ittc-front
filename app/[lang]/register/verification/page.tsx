"use client";
import VerificationStep from "@/views/Auth/steps/VerificationStep/components/VerificationStep";
import { useRouter } from "@/i18n/navigation";
import { unlockStep } from "@/views/Auth/progress";

export default function VerificationPage() {
  const router = useRouter();

  return (
    <div>
      {/* replace — чтобы «назад» с экрана успеха не возвращал к вводу кода */}
      <VerificationStep
        onCompleted={() => {
          unlockStep("success");
          router.replace("/register/success");
        }}
      />
    </div>
  );
}
