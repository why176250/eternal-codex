"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function LangSync() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.lang = pathname === "/zh" || pathname.startsWith("/zh/") ? "zh-Hans" : "en";
  }, [pathname]);
  return null;
}
