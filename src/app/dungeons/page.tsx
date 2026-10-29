import type { Metadata } from "next";
import Link from "next/link";
import { foreverDungeons } from "@/lib/forever";
import loot from "@/data/dungeon-loot.json";
import dungeonImages from "@/data/dungeon-images.json";

export const metadata: Metadata = {
  title: "Dungeons — the Forever leveling ladder",
  description:
    "Nine new Forever dungeons and 26 Classic dungeons arranged by level, with boss counts, images, and links to loot.",
  alternates: { canonical: "/dungeons" },
};

const ACTUAL = foreverDungeons.filter(
  (dungeon) => dungeon.type === "Dungeon" && !dungeon.id.startsWith("route-") && !dungeon.id.startsWith("zone-"),
);
const NEW = ACTUAL.filter((dungeon) => dungeon.isNew).sort((a, b) => a.min - b.min);
const CLASSIC = ACTUAL.filter((dungeon) => !dungeon.isNew).sort((a, b) => a.min - b.min);
const BOSSES = (loot as { result: { dungeons: { bosses?: unknown[] }[] } }).result.dungeons.reduce(
  (sum, dungeon) => sum + (dungeon.bosses?.length ?? 0),
  0,
);
const MIN = 13;
const MAX = 60;
const AXIS = [13, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

function layout(list: typeof ACTUAL) {
  const lanes: number[] = [];
  return list.map((dungeon) => {
    const start = Math.max(MIN, dungeon.min || MIN);
    const end = Math.min(MAX, Math.max(start + 5, dungeon.max || start + 5));
    let visualStart = start;
    let visualEnd = Math.min(MAX, Math.max(end, start + 8));
    if (visualEnd - visualStart < 8) {
      visualEnd = MAX;
      visualStart = Math.max(MIN, MAX - 8);
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
      lane,
      left: ((visualStart - MIN) / (MAX - MIN)) * 100,
      width: ((visualEnd - visualStart) / (MAX - MIN)) * 100,
    };
  });
}

const newLayout = layout(NEW);
const classicLayout = layout(CLASSIC);

function TimelineRow({ label, entries }: { label: string; entries: ReturnType<typeof layout> }) {
  const laneCount = Math.max(...entries.map((entry) => entry.lane), 0) + 1;
  return (
    <div className="border-t border-line/50 py-3 first:border-0">
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className="relative" style={{ height: `${laneCount * 48}px` }}>
        {entries.map(({ dungeon, lane, left, width }) => (
          <Link
            key={dungeon.id}
            href={`/dungeons/${dungeon.id}`}
            title={`${dungeon.name} · ${dungeon.band}`}
            className="absolute flex h-10 items-center overflow-hidden rounded border text-[11px] shadow-lg transition-transform hover:z-20 hover:scale-[1.02]"
            style={{
              left: `${left}%`,
              width: `${Math.max(width, 7)}%`,
              top: `${lane * 44}px`,
              borderColor: dungeon.isNew ? "#4ea8d888" : "#a9884c88",
              backgroundColor: "#08111f",
            }}
          >
            <span
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${dungeonImages[dungeon.id as keyof typeof dungeonImages] ?? ""})` }}
            />
            <span className="absolute inset-0" style={{ background: dungeon.isNew ? "linear-gradient(90deg, rgba(4,14,24,.82), rgba(4,14,24,.18))" : "linear-gradient(90deg, rgba(18,13,8,.84), rgba(18,13,8,.18))" }} />
            <span className="relative z-10 flex h-full min-w-0 flex-1 flex-col justify-between px-2 py-1.5 text-parchment">
              <span className="truncate text-[11px] leading-tight">{dungeon.name}</span>
              <span className="text-[9px] leading-none text-muted">{dungeon.band}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DungeonsPage() {
  return (
    <main className="container-x py-10 md:py-14">
      <div className="panel p-4 md:p-6">
        <div className="border-b border-line/60 pb-4">
          <p className="eyebrow">Dungeons</p>
          <h1 className="display mt-1 text-2xl text-parchment md:text-3xl">Dungeons by level</h1>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted">
            Click a dungeon to see its bosses and loot. New Forever level bands are
            shown above; Classic dungeons follow the Classic dungeon-finder ranges.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted">
            <span className="rounded-full border border-line/70 px-2.5 py-1">{NEW.length} new in Forever</span>
            <span className="rounded-full border border-line/70 px-2.5 py-1">{CLASSIC.length} from Classic</span>
            <span className="rounded-full border border-line/70 px-2.5 py-1">{BOSSES} recorded bosses</span>
          </div>
        </div>

        <div className="mt-5 w-full">
          <div className="relative mb-4 h-5 border-b border-line/40">
            {AXIS.map((level) => (
              <span key={level} className="absolute -translate-x-1/2 text-[10px] text-muted/70" style={{ left: `${((level - MIN) / (MAX - MIN)) * 100}%` }}>
                {level}
              </span>
            ))}
          </div>
          <TimelineRow label={`Forever new ${NEW.length}`} entries={newLayout} />
          <TimelineRow label={`From Classic ${CLASSIC.length}`} entries={classicLayout} />
        </div>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-muted/60">
        Dungeon level ranges are approximate; verify entry requirements in game.
        Open a dungeon for its bosses, loot table, and source notes.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/data/dungeons" className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">Full dungeon data →</Link>
        <Link href="/database" className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">Search loot →</Link>
      </div>
    </main>
  );
}
