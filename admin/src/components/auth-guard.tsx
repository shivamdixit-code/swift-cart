"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem("swiftcart-admin-token");

  useEffect(() => {
    if (!token) router.replace("/login");
  }, [router, token]);

  if (!token) return null;

  return <>{children}</>;
}
