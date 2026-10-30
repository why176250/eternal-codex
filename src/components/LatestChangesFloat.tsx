"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import balance from "@/data/balance-latest.json";
const STORAGE_KEY = "eversixty:latest-float-collapsed";

export function LatestChangesFloat({ zh = false }: { zh?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {}
  }, []);

  function toggle() {
    setCollapsed((value) => {
      const next = !value;
      try { localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }

  if (!mounted) return null;

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={toggle}
        className="latest-float fixed left-4 top-28 z-30 hidden rounded-full border border-line bg-panel/95 px-2 py-3 text-[10px] uppercase tracking-[0.2em] text-gold-soft shadow-xl backdrop-blur min-[1800px]:block"
        aria-label="Open latest changes"
      >
        Latest
      </button>
    );
  }

  return (
    <aside className="latest-float fixed top-28 z-30 hidden min-[1800px]:block">
      <div className="panel relative p-4 shadow-2xl">
        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 top-2 grid size-6 place-items-center rounded text-muted transition-colors hover:bg-white/[0.05] hover:text-parchment"
          aria-label="Collapse latest changes"
          title="Collapse"
        >
          ×
        </button>
        <p className="text-base font-semibold text-[#f0c96a]">{zh ? "最近一次平衡调整" : "Latest balance changes"}</p>
        <p className="mt-1 text-sm text-[#6fcf97]">{zh ? "2026年10月28日" : balance.displayDate}</p>
        <p className="mt-1 text-[10px] text-muted/60">{zh ? "版本" : "Build"} {balance.build}</p>
        <div className="mt-3 space-y-1.5 text-xs">
          <p className="flex items-center gap-1.5 text-[#6fcf97]"><span aria-hidden="true">↑</span>{balance.buffs} {zh ? "项增强" : "buffs"}</p>
          <p className="flex items-center gap-1.5 text-[#ff6b6b]"><span aria-hidden="true">↓</span>{balance.nerfs} {zh ? "项削弱" : "nerfs"}</p>
          <p className="text-gold-soft">{balance.otherChanges} {zh ? "项其他改动" : "other changes"}</p>
          <p className="text-parchment/85">{balance.talentTreeChanges} {zh ? "项天赋树改动" : "talent tree changes"}</p>
          <p className="text-parchment/85">{balance.newItems} {zh ? "件新物品" : "new items"}</p>
          <p className="text-parchment/85">{balance.changedItems} {zh ? "件改动物品" : "changed items"}</p>
        </div>
        <Link href="/patch-notes/balance" className="mt-4 block rounded-md border border-gold/40 bg-gold/[0.08] px-3 py-2.5 text-center text-xs text-gold-soft transition-colors hover:border-gold/70 hover:bg-gold/[0.14]">
          {zh ? "查看详情" : "View details"}
        </Link>
      </div>
    </aside>

  );
}
