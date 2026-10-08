"use client";
import { Link } from "lucide-react";
import React, { useState } from "react";
import PersonalStepForm from "@/views/Auth/steps/PesonalStep/components/form";
import TermsModal from "@/views/Auth/TermsModal";
import { useMutation } from "@tanstack/react-query";
import { API_V2 } from "@/shared/api_v2";
import { InstitutionBanner } from "@/views/Auth/Institution";

export default function PersonalStep() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col text-white mt-5">
      <InstitutionBanner />
      <PersonalStepForm onShowTerms={() => setShowTerms(true)} />
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}
