"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Keeps <html lang> in sync with the locale prefix so screen readers and
 * search engines see the right language for /zh pages.
 */
export function LangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const isZh = pathname === "/zh" || pathname.startsWith("/zh/");
    document.documentElement.lang = isZh ? "zh-CN" : "en";
  }, [pathname]);

  return null;
}
