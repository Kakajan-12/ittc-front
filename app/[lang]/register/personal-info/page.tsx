"use client";
import { Link } from "lucide-react";
import React, { useEffect, useState } from "react";
import PersonalStepForm from "@/views/Auth/steps/PesonalStep/components/form";
import TermsModal from "@/views/Auth/TermsModal";
import { useMutation } from "@tanstack/react-query";
import { API_V2 } from "@/shared/api_v2";
import { InstitutionBanner } from "@/views/Auth/Institution";
import { STORAGE_KEYS } from "@/views/Auth/config";
import { useRouter } from "@/i18n/navigation";

export default function PersonalStep() {
  const [showTerms, setShowTerms] = useState(false);
  const router = useRouter();

  // Учреждение выбирается до личных данных. Хранилище читается напрямую:
  // состояние из него при первой отрисовке ещё пустое.
  useEffect(() => {
    let chosen: string | null = null;
    try {
      chosen = sessionStorage.getItem(STORAGE_KEYS.institution);
    } catch {
      // Хранилище недоступно — не держим человека на экране выбора
      return;
    }
    if (chosen === null || chosen === "null") {
      router.replace("/register/institution");
    }
  }, [router]);

  return (
    <div className="flex min-h-0 flex-1 flex-col text-white mt-5">
      <InstitutionBanner />
      <PersonalStepForm onShowTerms={() => setShowTerms(true)} />
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}
