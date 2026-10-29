import type { Metadata } from "next";
import Link from "next/link";
import { foreverDungeons } from "@/lib/forever";
import loot from "@/data/dungeon-loot.json";
import dungeonImages from "@/data/dungeon-images.json";
import { groupedTotal, levelBands, levelGroups } from "@/lib/dungeon-groups";
import { DungeonPicker } from "@/components/DungeonPicker";

export const metadata: Metadata = {
  title: "Dungeons — the Forever leveling ladder",
  description:
    "Nine new Forever dungeons and 26 Classic dungeons grouped by level, with images, level ranges, and links to bosses and loot.",
  alternates: { canonical: "/dungeons" },
};

type SearchParams = Promise<{ level?: string }>;
const BOSSES = (loot as { result: { dungeons: { bosses?: unknown[] }[] } }).result.dungeons.reduce(
  (sum, dungeon) => sum + (dungeon.bosses?.length ?? 0),
  0,
);
const ACTUAL = foreverDungeons.filter(
  (dungeon) => dungeon.type === "Dungeon" && !dungeon.id.startsWith("route-") && !dungeon.id.startsWith("zone-"),
);
const NEW = ACTUAL.filter((dungeon) => dungeon.isNew).length;
const CLASSIC = ACTUAL.length - NEW;

export default async function DungeonsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const activeKey = levelBands.some((band) => band.key === params.level) ? params.level : "all";
  const band = levelBands.find((entry) => entry.key === activeKey) ?? levelBands[0];
  const visibleGroups = levelGroups.filter(
    (group) => group.levelMax >= band.min && group.levelMin <= band.max,
  );
  const heroImage = dungeonImages["hot"] ?? "";

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
                Classic dungeons. Browse them by level group, then open any dungeon
                for its bosses and loot.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
                <span className="rounded-full border border-line/80 px-3 py-1"><span className="text-cyan-300">{NEW}</span> new dungeons</span>
                <span className="rounded-full border border-line/80 px-3 py-1"><span className="text-gold-soft">{CLASSIC}</span> from Classic</span>
                <span className="rounded-full border border-line/80 px-3 py-1"><span className="text-parchment">{BOSSES}</span> recorded bosses</span>
              </div>
            </div>
            <div className="panel p-4">
              <p className="eyebrow">Bosses & loot</p>
              <p className="mt-2 text-sm font-medium text-parchment">Open a dungeon</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">Jump straight to its bosses and loot table.</p>
              <DungeonPicker options={ACTUAL.map(({ id, name, band: levelBand, isNew }) => ({ id, name, band: levelBand, isNew }))} />
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-8 md:py-10">
        <div className="panel p-4 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line/60 pb-4">
            <div>
              <p className="eyebrow">By level</p>
              <h2 className="display mt-1 text-2xl text-parchment md:text-3xl">Dungeons by level</h2>
              <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted">
                {groupedTotal} dungeons in {levelGroups.length} level groups. Click a
                group card to open the dungeon.
              </p>
            </div>
            <span className="text-[11px] text-muted">{visibleGroups.length} groups shown</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {levelBands.map((entry) => (
              <Link key={entry.key} href={entry.key === "all" ? "/dungeons" : `/dungeons?level=${entry.key}`} className={`rounded-full border px-3 py-1.5 transition-colors ${activeKey === entry.key ? "border-gold/55 bg-gold/10 text-gold-soft" : "border-line/70 text-muted hover:border-gold/40 hover:text-parchment"}`}>
                {entry.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 space-y-7">
            {visibleGroups.map((group) => (
              <div key={group.group}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="display text-lg text-parchment">Level {group.levelMin}–{group.levelMax}</h3>
                  <span className="text-[10px] text-muted/60">{group.dungeons.length} dungeon{group.dungeons.length === 1 ? "" : "s"}</span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.dungeons.map((dungeon) => {
                    const href = dungeon.id ? `/dungeons/${dungeon.id}` : "/dungeons";
                    return (
                      <Link
                        key={dungeon.slug}
                        href={href}
                        className="group relative overflow-hidden rounded-lg border border-line/70 bg-deep/50 transition-colors hover:border-gold/45"
                      >
                        <div className="relative h-24 bg-cover bg-center" style={{ backgroundImage: dungeon.image ? `url(${dungeon.image})` : undefined, backgroundColor: "#101a2b" }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/30 to-transparent" />
                          {dungeon.isNew ? <span className="absolute right-2 top-2 rounded border border-gold/40 bg-abyss/80 px-1.5 py-0.5 text-[9px] text-gold-soft">New</span> : null}
                          <div className="absolute bottom-2 left-3 right-3">
                            <p className="truncate text-sm text-parchment">{dungeon.name}</p>
                            <p className="mt-0.5 text-[10px] text-muted">Level {dungeon.levelMin}–{dungeon.levelMax}</p>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted">{dungeon.note || dungeon.location || "Open for bosses and loot."}</p>
                          <span className="mt-2 inline-block text-[10px] text-gold/80 group-hover:text-gold-soft">Open dungeon →</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-muted/60">
          Level groups come from the Forever dungeon dataset. Classic ranges follow
          the Classic dungeon finder; verify entry requirements in game.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/data/dungeons" className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">Full dungeon data →</Link>
          <Link href="/database" className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">Search loot →</Link>
        </div>
      </section>
    </main>
  );
}
