"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Fills in hreflang on any route whose page metadata does not already declare it. */
export function HreflangSync() {
  const pathname = usePathname();
  useEffect(() => {
    const isZh = pathname === "/zh" || pathname.startsWith("/zh/");
    const enPath = isZh ? pathname.replace(/^\/zh/, "") || "/" : pathname;
    const zhPath = isZh ? pathname : pathname === "/" ? "/zh" : `/zh${pathname}`;
    const origin = window.location.origin;
    document.querySelectorAll('link[data-eversixty-hreflang="1"]').forEach((node) => node.remove());
    if (document.head.querySelector('link[rel="alternate"][hreflang="en"]')) return;
    const values: [string, string][] = [
      ["en", `${origin}${enPath}`],
      ["zh-Hans", `${origin}${zhPath}`],
      ["x-default", `${origin}${enPath}`],
    ];
    for (const [lang, href] of values) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.href = href;
      link.dataset.eversixtyHreflang = "1";
      document.head.appendChild(link);
    }
  }, [pathname]);
  return null;
}
