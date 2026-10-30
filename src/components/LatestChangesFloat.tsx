"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import updates from "@/data/site-updates.json";

type Update = { date: string; title: string; items: string[] };
const latest = (updates as Update[]).slice(0, 2);
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
        <p className="eyebrow">Latest changes</p>
        <div className="mt-3 space-y-3">
          {latest.map((update) => (
            <article key={`${update.date}-${update.title}`}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs text-parchment">{update.title}</p>
                <span className="shrink-0 text-[9px] text-muted/70">{update.date.slice(5)}</span>
              </div>
              {update.items[0] ? <p className="mt-1 text-[10px] leading-relaxed text-muted">{update.items[0]}</p> : null}
            </article>
          ))}
        </div>
        <Link href="/patch-notes" className="mt-4 inline-flex items-center gap-1.5 text-[10px] text-gold/85 transition-colors hover:text-gold-soft">
          All changes <span aria-hidden="true">→</span>
        </Link>
      </div>
    </aside>
  );
}
