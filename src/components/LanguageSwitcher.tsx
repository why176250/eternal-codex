"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LanguageSwitcher({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const isZh = pathname === "/zh" || pathname.startsWith("/zh/");

  const base =
    "rounded-md px-2 py-1 text-xs transition-colors " +
    (compact ? "" : "sm:px-2.5");

  return (
    <div
      className={`flex items-center gap-1 text-xs ${className}`}
      aria-label="Language"
    >
      <Link
        href="/"
        className={
          base +
          (isZh
            ? "text-muted hover:text-parchment"
            : "bg-gold/10 text-gold-soft")
        }
        aria-current={isZh ? undefined : "true"}
      >
        EN
      </Link>
      <span className="text-muted/40" aria-hidden="true">
        /
      </span>
      <Link
        href="/zh"
        className={
          base +
          (isZh
            ? "bg-gold/10 text-gold-soft"
            : "text-muted hover:text-parchment")
        }
        aria-current={isZh ? "true" : undefined}
      >
        中文
      </Link>
    </div>
  );
}
