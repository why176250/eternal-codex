"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import balance from "@/data/balance-latest.json";
const STORAGE_KEY = "eversixty:latest-float-collapsed";

export function LatestChangesFloat() {
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
        className="latest-float fixed left-4 top-32 z-30 hidden rounded-full border border-line bg-panel/95 px-2 py-3 text-[10px] uppercase tracking-[0.2em] text-gold-soft shadow-xl backdrop-blur min-[1800px]:block"
        aria-label="Open latest changes"
      >
        Latest
      </button>
    );
  }

  return (
    <aside className="latest-float fixed top-32 z-30 hidden min-[1800px]:block">
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
        <p className="text-sm font-semibold text-[#f0c96a]">Latest balance changes</p>
        <p className="mt-1 text-xs text-[#6fcf97]">{balance.displayDate}</p>
        <p className="mt-1 text-[9px] text-muted/60">Build {balance.build}</p>
        <div className="mt-3 space-y-1.5 text-[11px]">
          <p className="flex items-center gap-1.5 text-[#6fcf97]"><span aria-hidden="true">↑</span>{balance.buffs} buffs</p>
          <p className="flex items-center gap-1.5 text-[#ff6b6b]"><span aria-hidden="true">↓</span>{balance.nerfs} nerfs</p>
          <p className="text-parchment/85">{balance.talentTreeChanges} talent tree changes</p>
          <p className="text-parchment/85">{balance.newItems} new items</p>
          <p className="text-parchment/85">{balance.changedItems} changed items</p>
        </div>
        <Link href="/patch-notes/balance" className="mt-4 block rounded-md border border-gold/40 bg-gold/[0.08] px-2.5 py-2 text-center text-[10px] text-gold-soft transition-colors hover:border-gold/70 hover:bg-gold/[0.14]">
          View details
        </Link>
      </div>
    </aside>

  );
}
