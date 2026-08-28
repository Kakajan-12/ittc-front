"use client";
import VerificationStep from "@/views/Auth/steps/VerificationStep/components/VerificationStep";
import SuccessModal from "@/views/Auth/SuccessModal";
import { useRouter } from "@/i18n/navigation";
import { useRegistrationContainer } from "../_features/RegistartionConatiner";

export default function VerificationPage() {
  const { showSuccess, setShowSuccess } = useRegistrationContainer();
  const router = useRouter();

  if (showSuccess) {
    return <SuccessModal plainBackdrop open onClose={() => router.push("/")} />;
  }

  return (
    <div>
      <VerificationStep onCompleted={() => setShowSuccess(true)} />
    </div>
  );
}
