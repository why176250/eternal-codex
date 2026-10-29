"use client";

import { useEffect, useMemo, useState } from "react";

export type TierMode = "dps" | "tanks" | "healers" | "specs" | "classes" | "races" | "pairs";
export type TierItem = { id: string; name: string; icon: string; accent?: string };
type Tier = "S" | "A" | "B" | "C" | "D" | "F";

const MODES: { key: TierMode; label: string }[] = [
  ["dps", "DPS"],
  ["tanks", "Tanks"],
  ["healers", "Healers"],
  ["specs", "All specs"],
  ["classes", "Classes"],
  ["races", "Races"],
  ["pairs", "Race + class"],
].map(([key, label]) => ({ key: key as TierMode, label }));

const TIERS: Tier[] = ["S", "A", "B", "C", "D", "F"];
const TIER_COLORS: Record<Tier, string> = {
  S: "#ff6b5e", A: "#ff9f43", B: "#f6d365", C: "#6fcf97", D: "#64b5f6", F: "#a0aec0",
};
const EMPTY: Record<TierMode, Record<string, Tier>> = {
  dps: {}, tanks: {}, healers: {}, specs: {}, classes: {}, races: {}, pairs: {},
};
const STORAGE_KEY = "eversixty:tier-list:v1";

type SavedState = { title: string; mode: TierMode; assignments: Record<TierMode, Record<string, Tier>> };

export function TierListMaker({ data }: { data: Record<TierMode, TierItem[]> }) {
  const [mode, setMode] = useState<TierMode>("dps");
  const [title, setTitle] = useState("My Forever tier list");
  const [assignments, setAssignments] = useState<Record<TierMode, Record<string, Tier>>>(EMPTY);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragged, setDragged] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "image" | null>(null);
  const [ready, setReady] = useState(false);

  const items = data[mode];
  const current = assignments[mode] ?? {};
  const placed = useMemo(() => items.filter((item) => current[item.id]), [items, current]);
  const pool = useMemo(() => items.filter((item) => !current[item.id]), [items, current]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let saved: SavedState | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw) as SavedState;
    } catch {}
    const param = new URLSearchParams(window.location.search).get("d");
    if (param) {
      try {
        saved = JSON.parse(decodeURIComponent(escape(atob(param)))) as SavedState;
      } catch {}
    }
    if (saved) {
      setTitle(saved.title ?? "My Forever tier list");
      setMode(saved.mode ?? "dps");
      setAssignments({ ...EMPTY, ...(saved.assignments ?? {}) });
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, mode, assignments }));
    } catch {}
  }, [ready, title, mode, assignments]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!selected) return;
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      const key = event.key.toUpperCase();
      if (TIERS.includes(key as Tier)) {
        event.preventDefault();
        assign(selected, key as Tier);
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        assign(selected, null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, mode]);

  function assign(id: string, tier: Tier | null) {
    setAssignments((prev) => {
      const next = { ...(prev[mode] ?? {}) };
      if (tier) next[id] = tier;
      else delete next[id];
      return { ...prev, [mode]: next };
    });
    setSelected(null);
    setDragged(null);
  }

  function reset() {
    setAssignments((prev) => ({ ...prev, [mode]: {} }));
    setSelected(null);
  }

  function copyLink() {
    const payload: SavedState = { title, mode, assignments };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const url = new URL(window.location.href);
    url.searchParams.set("d", encoded);
    const done = () => {
      setCopied("link");
      setTimeout(() => setCopied(null), 2500);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url.toString()).then(done).catch(() => window.prompt("Copy your tier list:", url.toString()));
    else window.prompt("Copy your tier list:", url.toString());
  }

  function drawImage(): HTMLCanvasElement {
    const width = 1200;
    const rowH = 92;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = 120 + TIERS.length * rowH + 40;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#07101d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ede7d7";
    ctx.font = "bold 34px Georgia, serif";
    ctx.fillText(title || "My Forever tier list", 40, 58);
    ctx.fillStyle = "#93a1b8";
    ctx.font = "16px sans-serif";
    ctx.fillText(`World of Warcraft: Forever · ${new Date().toLocaleDateString("en-US")}`, 40, 86);
    TIERS.forEach((tier, index) => {
      const y = 120 + index * rowH;
      ctx.fillStyle = `${TIER_COLORS[tier]}22`;
      ctx.fillRect(40, y, width - 80, rowH - 8);
      ctx.fillStyle = TIER_COLORS[tier];
      ctx.font = "bold 28px Georgia, serif";
      ctx.fillText(tier, 58, y + 42);
      ctx.fillStyle = "#d8deea";
      ctx.font = "15px sans-serif";
      const list = placed.filter((item) => current[item.id] === tier).map((item) => item.name);
      list.slice(0, 14).forEach((name, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        ctx.fillText(name, 120 + col * 260, y + 28 + row * 20);
      });
    });
    return canvas;
  }

  function downloadImage() {
    const canvas = drawImage();
    const link = document.createElement("a");
    link.download = `${(title || "forever-tier-list").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function copyImage() {
    const canvas = drawImage();
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        if (navigator.clipboard && "write" in navigator.clipboard) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopied("image");
          setTimeout(() => setCopied(null), 2500);
          return;
        }
      } catch {}
      downloadImage();
    }, "image/png");
  }

  function itemButton(item: TierItem) {
    const selectedItem = selected === item.id;
    return (
      <button
        key={item.id}
        type="button"
        draggable
        onDragStart={() => setDragged(item.id)}
        onClick={() => setSelected(selectedItem ? null : item.id)}
        title={`${item.name}${current[item.id] ? ` · ${current[item.id]}` : ""}`}
        className={`flex max-w-full items-center gap-1.5 rounded border px-1.5 py-1 text-left transition-colors ${selectedItem ? "border-gold/70 bg-gold/10" : "border-line/60 bg-abyss/40 hover:border-gold/40"}`}
      >
        <img src={item.icon} alt="" width={32} height={32} className="size-8 shrink-0 rounded border border-line/70 object-cover" />
        <span className="truncate text-[11px] text-parchment" style={item.accent ? { color: item.accent } : undefined}>{item.name}</span>
        {current[item.id] ? <span className="text-[9px] text-muted">{current[item.id]}</span> : null}
      </button>
    );
  }

  return (
    <div className="panel p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Tier list maker</p>
          <h2 className="display mt-1 text-2xl text-parchment">Rank what matters</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={downloadImage} className="rounded-lg border border-gold/40 bg-gold/[0.06] px-3 py-2 text-xs text-gold-soft">Save image</button>
          <button type="button" onClick={copyImage} className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">{copied === "image" ? "Copied" : "Copy image"}</button>
          <button type="button" onClick={copyLink} className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">{copied === "link" ? "Copied" : "Copy link"}</button>
          <button type="button" onClick={reset} className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-red-300/50 hover:text-red-200">Reset</button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {MODES.map((entry) => (
          <button key={entry.key} type="button" onClick={() => { setMode(entry.key); setSelected(null); }} className={`rounded-full border px-3 py-1.5 text-xs ${mode === entry.key ? "border-gold/55 bg-gold/10 text-gold-soft" : "border-line/70 text-muted hover:border-gold/40 hover:text-parchment"}`}>{entry.label}</button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your list a title" className="min-w-56 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none" />
        <span className="text-[11px] text-muted">{placed.length} / {items.length} ranked</span>
      </div>

      <div className="mt-5 space-y-2">
        {TIERS.map((tier) => {
          const entries = items.filter((item) => current[item.id] === tier);
          return (
            <div key={tier} className="flex min-h-[72px] overflow-hidden rounded-lg border border-line/60">
              <div className="flex w-14 shrink-0 items-center justify-center text-2xl font-bold" style={{ color: TIER_COLORS[tier], background: `${TIER_COLORS[tier]}18` }}>{tier}</div>
              <div
                className="flex min-w-0 flex-1 flex-wrap content-start gap-1.5 bg-deep/30 p-2"
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => dragged && assign(dragged, tier)}
                onClick={() => selected && assign(selected, tier)}
              >
                {entries.map(itemButton)}
                {entries.length === 0 ? <span className="px-2 py-2 text-[11px] text-muted/50">Drop here or select an icon</span> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-4 rounded-lg border border-dashed border-line/70 p-2"
        onDragOver={(event) => event.preventDefault()}
        onDrop={() => dragged && assign(dragged, null)}
        onClick={() => selected && assign(selected, null)}
      >
        <p className="px-1 pb-1 text-[10px] uppercase tracking-wider text-muted">Unranked <span className="text-muted/60">{pool.length}</span></p>
        <div className="flex flex-wrap gap-1.5">{pool.map(itemButton)}</div>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-muted/60">
        Drag an icon into a tier, or select it and press S / A / B / C / D / F.
        Backspace unranks it. Lists are saved in this browser.
      </p>
    </div>
  );
}
