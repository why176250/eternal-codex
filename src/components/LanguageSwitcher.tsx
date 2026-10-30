"use client";
import { usePathname } from "next/navigation";
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const isZh = pathname === "/zh" || pathname.startsWith("/zh/");
  const enHref = isZh ? pathname.replace(/^\/zh/, "") || "/" : pathname;
  const zhHref = isZh ? pathname : `/zh${pathname === "/" ? "" : pathname}`;
  const base = "rounded-md px-2 py-1 text-xs transition-colors sm:px-2.5";
  return <div className={`flex items-center gap-1 text-xs ${className}`} aria-label="Language"><a href={enHref} className={base + (isZh ? " text-muted hover:text-parchment" : " bg-gold/10 text-gold-soft")}>EN</a><span className="text-muted/40">/</span><a href={zhHref} className={base + (isZh ? " bg-gold/10 text-gold-soft" : " text-muted hover:text-parchment")}>中文</a></div>;
}
