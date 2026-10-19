"use client";
import SuccessModal from "@/views/Auth/SuccessModal";
import { useRouter } from "@/i18n/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return <SuccessModal inline open onClose={() => router.push("/")} />;
}
