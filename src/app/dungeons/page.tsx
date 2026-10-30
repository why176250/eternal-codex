import type { Metadata } from "next";
import Link from "next/link";
import { foreverDungeons } from "@/lib/forever";
import dungeonImages from "@/data/dungeon-images.json";
import { timelineAxis, timelineLanes } from "@/lib/dungeon-timeline";
import { TimelineBars } from "@/components/TimelineBars";
import { DungeonPicker } from "@/components/DungeonPicker";
import { fcSlugById } from "@/lib/dungeon-fc";
import { directoryBossTotal } from "@/lib/dungeon-details";

export const metadata: Metadata = {
  title: "Dungeons — the Forever leveling ladder",
  description:
    "Nine new Forever dungeons and 26 Classic dungeons on a level timeline, with images, level ranges, and links to bosses and loot.",
  alternates: { canonical: "/dungeons" },
};

const BOSSES = directoryBossTotal;
const ACTUAL = foreverDungeons.filter(
  (dungeon) => dungeon.type === "Dungeon" && !dungeon.id.startsWith("route-") && !dungeon.id.startsWith("zone-"),
);
const NEW_COUNT = timelineLanes.find((lane) => lane.name.includes("Forever") || lane.name.includes("新增"))?.count ?? 9;
const CLASSIC_COUNT = timelineLanes.find((lane) => lane.name.includes("经典"))?.count ?? 26;
const heroImage = dungeonImages["hot"] ?? "";
const range = timelineAxis.max - timelineAxis.min;

export default function DungeonsPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-line/60">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/90 to-abyss/50" />
        <div className="container-x relative py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div>
              <div className="flex items-start gap-4">
                <img src={heroImage} alt="" width={64} height={64} className="size-16 shrink-0 rounded-lg border border-line/80 object-cover" />
                <div>
                  <p className="eyebrow">Dungeons</p>
                  <h1 className="display mt-1 text-3xl text-parchment md:text-5xl">Dungeons in Forever</h1>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
                Forever adds nine dungeons between levels 13 and 60, alongside 26
                Classic dungeons. Hover a bar for details, or open a dungeon for its
                bosses and loot.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
                <span className="rounded-full border border-line/80 px-3 py-1"><span className="text-cyan-300">{NEW_COUNT}</span> new dungeons</span>
                <span className="rounded-full border border-line/80 px-3 py-1"><span className="text-gold-soft">{CLASSIC_COUNT}</span> from Classic</span>
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
        <div className="panel overflow-visible p-4 md:p-6">
          <div className="border-b border-line/60 pb-4">
            <p className="eyebrow">By level</p>
            <h2 className="display mt-1 text-2xl text-parchment md:text-3xl">Dungeons by level</h2>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted">
              Click a dungeon bar to open its page. New Forever level bands are shown
              above; Classic dungeons follow the Classic dungeon-finder ranges.
            </p>
          </div>

          <div className="mt-5">
            <div className="relative h-5 border-b border-line/40">
              {timelineAxis.ticks.map((tick) => (
                <span
                  key={tick}
                  className="absolute -translate-x-1/2 text-[10px] text-muted/70"
                  style={{ left: `${((tick - timelineAxis.min) / range) * 100}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>

            <TimelineBars lanes={timelineLanes} />
          </div>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-muted/60">
          Timeline positions use level ranges from the Forever dungeon dataset.
          Classic ranges follow the Classic dungeon finder; verify entry requirements
          in game.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/data/dungeons" className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">Full dungeon data →</Link>
          <Link href="/database" className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">Search loot →</Link>
        </div>
      </section>
    </main>
  );
}
