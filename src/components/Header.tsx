"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/lib/site";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isZh = pathname === "/zh" || pathname.startsWith("/zh/");
  const zhLabels: Record<string, string> = {
    "/classes": "职业",
    "/tools": "工具",
    "/data": "数据",
    "/guides": "攻略",
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-abyss/90 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/brand/eversixty-mark.svg"
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-lg"
          />
          <span className="min-w-0 leading-tight">
            <span className="display block whitespace-nowrap text-[15px] tracking-wide text-parchment">
              {site.name}
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-muted sm:block">
              Forever · Classic+
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 text-sm md:flex"
        >
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "whitespace-nowrap rounded-md bg-gold/10 px-3 py-1.5 text-gold-soft"
                    : "whitespace-nowrap rounded-md px-3 py-1.5 text-muted transition-colors hover:text-parchment"
                }
              >
                {isZh ? zhLabels[item.href] ?? item.label : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:flex" />
          <Link
            href="/database"
            className="hidden items-center gap-2 rounded-md border border-line bg-panel px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/40 hover:text-parchment sm:flex"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {isZh ? "搜索" : "Search"}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-md border border-line bg-panel text-muted transition-colors hover:text-parchment md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line/80 bg-deep/95 md:hidden">
          <nav aria-label="Mobile" className="container-x flex flex-col py-2">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={
                    active
                      ? "rounded-md bg-gold/10 px-3 py-2.5 text-sm text-gold-soft"
                      : "rounded-md px-3 py-2.5 text-sm text-muted hover:text-parchment"
                  }
                >
                  {isZh ? zhLabels[item.href] ?? item.label : item.label}
                </Link>
              );
            })}
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-sm text-muted">
                {isZh ? "语言" : "Language"}
              </span>
              <LanguageSwitcher />
            </div>
            <Link
              href="/database"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-md px-3 py-2.5 text-sm text-gold/90 hover:text-gold-soft"
            >
              {isZh ? "搜索数据库 →" : "Search the database →"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
