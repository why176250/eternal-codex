"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Item } from "@/lib/data";
import { qualityColors } from "@/lib/data";

export function ItemSearch({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [slot, setSlot] = useState("All");
  const [quality, setQuality] = useState("All");

  const slots = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.slot))).sort()],
    [items],
  );
  const qualities = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.quality)))],
    [items],
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (slot !== "All" && item.slot !== slot) return false;
      if (quality !== "All" && item.quality !== quality) return false;
      if (!needle) return true;
      return `${item.name} ${item.source} ${item.type} ${item.note}`
        .toLowerCase()
        .includes(needle);
    });
  }, [items, query, slot, quality]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search items</span>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, source, or slot…"
            className="w-full rounded-lg border border-line bg-panel py-2.5 pl-10 pr-3 text-sm text-parchment outline-none transition-colors placeholder:text-muted/70 focus:border-gold/50"
          />
        </label>

        <div className="flex gap-2">
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            aria-label="Filter by quality"
            className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/50"
          >
            {qualities.map((q) => (
              <option key={q} value={q}>
                {q === "All" ? "All qualities" : q}
              </option>
            ))}
          </select>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            aria-label="Filter by slot"
            className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/50"
          >
            {slots.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All slots" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-xs uppercase tracking-wider text-muted">
        {results.length} item{results.length === 1 ? "" : "s"} found
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
              <th className="py-2 pr-4 font-medium">Item</th>
              <th className="py-2 pr-4 font-medium">Slot</th>
              <th className="py-2 pr-4 font-medium">Lvl</th>
              <th className="py-2 pr-4 font-medium">Source</th>
              <th className="py-2 font-medium">Quality</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id} className="border-b border-line/50 last:border-0">
                <td className="py-2.5 pr-4">
                  <Link
                    href={`/database/items/${item.id}`}
                    className="transition-colors hover:underline hover:underline-offset-2"
                    style={{ color: qualityColors[item.quality] ?? "#ede7d7" }}
                  >
                    {item.name}
                  </Link>
                </td>
                <td className="py-2.5 pr-4 text-muted">{item.slot}</td>
                <td className="py-2.5 pr-4 text-muted">{item.level}</td>
                <td className="py-2.5 pr-4 text-muted">
                  <span className="text-gold/80">{item.sourceType}</span> ·{" "}
                  {item.source}
                </td>
                <td
                  className="py-2.5"
                  style={{ color: qualityColors[item.quality] ?? "#93a1b8" }}
                >
                  {item.quality}
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted">
                  No items match those filters. Try a different slot or quality.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
