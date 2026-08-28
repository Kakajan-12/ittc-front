"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { clearPersisted } from "@/shared/lib/usePersistentState";
import { ALL_STORAGE_KEYS } from "./config";

export default function AuthStorageCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.split("/").includes("register")) return;

    localStorage.removeItem("eventDraft");
    clearPersisted(ALL_STORAGE_KEYS);
  }, [pathname]);

  return null;
}
