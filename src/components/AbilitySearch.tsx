"use client";

import { useMemo, useState } from "react";

type Ability = { id: number; name: string; school: string; icon: string };

export function AbilitySearch() {
  const [items, setItems] = useState<Ability[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [school, setSchool] = useState("All");

  async function load() {
    if (items || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/data/abilities.json");
      const data = (await res.json()) as Ability[];
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  const schools = useMemo(() => {
    if (!items) return ["All"];
    return ["All", ...Array.from(new Set(items.map((i) => i.school).filter(Boolean))).sort()];
  }, [items]);

  const results = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (school !== "All" && item.school !== school) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q);
    });
  }, [items, query, school]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onFocus={load}
          onChange={(e) => {
            setQuery(e.target.value);
            load();
          }}
          placeholder="Search abilities by name…"
          className="flex-1 rounded-lg border border-line bg-deep px-3 py-2.5 text-sm text-parchment outline-none placeholder:text-muted/70 focus:border-gold/50"
          aria-label="Search abilities"
        />
        <select
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          onFocus={load}
          aria-label="Filter by school"
          className="rounded-lg border border-line bg-deep px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/50"
        >
          {schools.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All schools" : s}
            </option>
          ))}
        </select>
      </div>

      {!items ? (
        <button
          type="button"
          onClick={load}
          className="mt-4 rounded-lg border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-gold-soft transition-colors hover:bg-gold/10"
        >
          {loading ? "Loading…" : "Load the ability index (12,799 entries)"}
        </button>
      ) : (
        <>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted">
            {results.length.toLocaleString()} results
            {results.length > 200 ? " · showing first 200" : ""}
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
                  <th className="py-2 pr-4 font-medium">Ability</th>
                  <th className="py-2 pr-4 font-medium">School</th>
                  <th className="py-2 font-medium">Spell ID</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 200).map((item) => (
                  <tr key={item.id} className="border-b border-line/40 last:border-0">
                    <td className="py-2 pr-4 text-parchment">{item.name}</td>
                    <td className="py-2 pr-4 text-muted">{item.school || "—"}</td>
                    <td className="py-2 text-muted">{item.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
