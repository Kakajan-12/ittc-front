"use client";
import { Link } from "lucide-react";
import React, { useState } from "react";
import PersonalStepForm from "@/views/Auth/steps/PesonalStep/components/form";
import TermsModal from "@/views/Auth/TermsModal";

export default function PersonalStep() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col text-white">
      {" "}
      <PersonalStepForm onShowTerms={() => setShowTerms(true)} />
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}
