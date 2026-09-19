"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_V2 } from "@/shared/api_v2";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["anonToken"],
    queryFn: API_V2.PERSONAL_STEP.GET_ANON_TOKEN,
  });

  useEffect(() => {
    if (data?.token) {
      localStorage.setItem("getAnonymToken", data.token);
    }
  }, [data?.token]);

  if (isLoading || !data?.token) return null;

  if (isError) {
    refetch();
  }

  return <>{children}</>;
}
