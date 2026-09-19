"use client";

import { useEffect } from "react";

import { ensureAnonToken } from "@/shared/auth/anonToken";

/**
 * Warms up the anonymous session token so the first real request does not pay
 * for it. Never gates rendering: the API layer awaits the token on its own, so
 * holding children back only cost us server-rendered markup on every page.
 */
export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    void ensureAnonToken();
  }, []);

  return <>{children}</>;
}
