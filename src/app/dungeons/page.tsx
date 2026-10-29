import type { Metadata } from "next";
import Link from "next/link";
import { foreverDungeons } from "@/lib/forever";
import loot from "@/data/dungeon-loot.json";
import { DungeonPicker } from "@/components/DungeonPicker";
import dungeonImages from "@/data/dungeon-images.json";

export const metadata: Metadata = {
  title: "Dungeons — the Forever leveling ladder",
  description:
    "Nine new Forever dungeons and 26 Classic dungeons arranged by level, with boss counts and links to loot.",
  alternates: { canonical: "/dungeons" },
};

const ACTUAL = foreverDungeons.filter(
  (dungeon) => dungeon.type === "Dungeon" && !dungeon.id.startsWith("route-") && !dungeon.id.startsWith("zone-"),
);
const NEW = ACTUAL.filter((dungeon) => dungeon.isNew).sort((a, b) => a.min - b.min);
const CLASSIC = ACTUAL.filter((dungeon) => !dungeon.isNew).sort((a, b) => a.min - b.min);
const lootDungeons = (loot as { result: { dungeons: { bosses?: unknown[] }[] } }).result.dungeons;
const BOSSES = lootDungeons.reduce((sum, dungeon) => sum + (dungeon.bosses?.length ?? 0), 0);
const MIN = 10;
const MAX = 60;

function layout(list: typeof ACTUAL) {
  const lanes: number[] = [];
  return list.map((dungeon) => {
    const start = Math.max(MIN, dungeon.min || MIN);
    const end = Math.min(MAX, Math.max(start + 5, dungeon.max || start + 5));
    let visualStart = start;
    let visualEnd = Math.min(MAX, Math.max(end, start + 7));
    if (visualEnd - visualStart < 7) {
      visualEnd = MAX;
      visualStart = Math.max(MIN, MAX - 7);
    }
    let lane = lanes.findIndex((lastEnd) => visualStart > lastEnd + 1);
    if (lane < 0) {
      lane = lanes.length;
      lanes.push(visualEnd);
    } else {
      lanes[lane] = visualEnd;
    }
    return {
      dungeon,
      start,
      end: visualEnd,
      lane,
      left: ((visualStart - MIN) / (MAX - MIN)) * 100,
      width: ((visualEnd - visualStart) / (MAX - MIN)) * 100,
    };
  });
}

const newLayout = layout(NEW);
const classicLayout = layout(CLASSIC);
const AXIS = Array.from({ length: 11 }, (_, index) => MIN + index * 5);

function TimelineRow({
  title,
  count,
  accent,
  entries,
}: {
  title: string;
  count: number;
  accent: string;
  entries: ReturnType<typeof layout>;
}) {
  const laneCount = Math.max(...entries.map((entry) => entry.lane), 0) + 1;
  return (
    <div className="border-t border-line/60 py-4 first:border-0">
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted">{title}</span>
        <span className="text-[10px] text-muted/60">{count}</span>
      </div>
      <div className="relative min-h-0" style={{ height: `${laneCount * 52}px` }}>
        {entries.map(({ dungeon, left, width, lane }) => (
          <Link
            key={dungeon.id}
            href={`/dungeons/${dungeon.id}`}
            title={`${dungeon.name} · ${dungeon.band}`}
            className="absolute flex h-11 items-center justify-between gap-2 overflow-hidden rounded border px-2.5 text-[11px] transition-colors hover:brightness-125"
            style={{
              left: `${left}%`,
              width: `${Math.max(width, 7)}%`,
              top: `${lane * 48}px`,
              borderColor: `${accent}88`,
              backgroundImage: `linear-gradient(90deg, rgba(8,13,22,.45), rgba(8,13,22,.82)), url(${dungeonImages[dungeon.id as keyof typeof dungeonImages] ?? ""})`,
              backgroundColor: `${accent}20`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#ede7d7",
            }}
          >
            <span className="truncate">{dungeon.name}</span>
            <span className="shrink-0 text-[9px] text-muted">{dungeon.band}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DungeonsPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div>
              <p className="eyebrow">Dungeons</p>
              <h1 className="display mt-2 text-3xl text-parchment md:text-5xl">Dungeons in Forever</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                Nine new Forever dungeons and 26 Classic dungeons, arranged by
                level. Open any entry for bosses, loot, and location notes.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
                <span className="rounded-full border border-line/80 px-3 py-1"><span className="text-cyan-300">{NEW.length}</span> new dungeons</span>
                <span className="rounded-full border border-line/80 px-3 py-1"><span className="text-gold-soft">{CLASSIC.length}</span> from Classic</span>
                <span className="rounded-full border border-line/80 px-3 py-1"><span className="text-parchment">{BOSSES}</span> recorded bosses</span>
              </div>
            </div>
            <div className="panel p-4">
              <p className="eyebrow">Bosses & loot</p>
              <p className="mt-2 text-sm font-medium text-parchment">Open a dungeon</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">Jump straight to its bosses and loot table.</p>
              <DungeonPicker options={ACTUAL.map(({ id, name, band, isNew }) => ({ id, name, band, isNew }))} />
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-8">
        <div className="panel overflow-hidden p-4 md:p-6">
          <div className="w-full">
            <div className="relative mb-3 ml-0 h-5 border-b border-line/40">
              {AXIS.map((level) => (
                <span key={level} className="absolute -translate-x-1/2 text-[10px] text-muted/70" style={{ left: `${((level - MIN) / (MAX - MIN)) * 100}%` }}>
                  {level}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="w-24 shrink-0 pt-1 text-[10px] uppercase tracking-wider text-muted">Forever</div>
              <div className="min-w-0 flex-1"><TimelineRow title="New in Forever" count={NEW.length} accent="#63c7d8" entries={newLayout} /></div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 shrink-0 pt-1 text-[10px] uppercase tracking-wider text-muted">Classic</div>
              <div className="min-w-0 flex-1"><TimelineRow title="Classic baseline" count={CLASSIC.length} accent="#e3bd78" entries={classicLayout} /></div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted/60">
          Bands are positioned by their minimum level. New Forever level bands come
          from the current dataset; Classic bands follow the Classic dungeon finder.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/data/dungeons" className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">Full dungeon data →</Link>
          <Link href="/database" className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">Search loot →</Link>
        </div>
      </section>
    </main>
  );
}
