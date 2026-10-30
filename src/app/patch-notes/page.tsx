import type { Metadata } from "next";
import Link from "next/link";
import data from "@/data/wcl-patch-notes.json";
import { WclBluePosts } from "@/components/WclBluePosts";

export const metadata: Metadata = {
  title: "Patch Notes — WoW Forever beta builds",
  description: "Every WoW Forever beta build, class buffs and nerfs, talent tree changes, item changes, and official Blizzard posts.",
  alternates: { canonical: "/patch-notes", languages: { en: "/patch-notes", "zh-Hans": "/zh/patch-notes", "x-default": "/patch-notes" } },
};

type LatestItem = { cls: string; text: string };
type Group = { name: string; line: string; counts: { cls: string; text: string }[]; entries: { name: string; status: string; delta: string; desc: string }[] };
type Build = { date: string; dateLabel: string; build: string; tag: string; isCurrent: boolean; summary: string; groups: Group[] };
type BluePost = { id: string; dateLabel: string; author: string; title: string; url: string; paras: string[] };
const { latest, builds, bluePosts } = data as unknown as { latest: { items: LatestItem[] }; builds: Build[]; bluePosts: BluePost[] };
const currentBuild = builds.find((build) => build.isCurrent) ?? builds.find((build) => build.build === "Build 1.60.1.70685") ?? builds[1];

const raceIcons: Record<string, string> = {
  Human: "/patch-notes/icons/race_human_male.jpg",
  Dwarf: "/patch-notes/icons/race_dwarf_male.jpg",
  Tauren: "/patch-notes/icons/race_tauren_male.jpg",
  Orc: "/patch-notes/icons/race_orc_male.jpg",
  Troll: "/patch-notes/icons/race_troll_male.jpg",
  Undead: "/patch-notes/icons/race_scourge_male.jpg",
  Gnomes: "/patch-notes/icons/race_gnome_male.jpg",
  "Skyborne (High Order)": "/patch-notes/icons/inv_misc_head_elf_01.jpg",
  Skyborne: "/patch-notes/icons/inv_misc_head_elf_02.jpg",
};

function groupIcon(name: string) {
  return raceIcons[name] ?? `/classes/icons/${name.toLowerCase().replace(/[^a-z]/g, "")}.jpg`;
}

function statusColor(status: string) {
  if (status === "Buff") return "text-[#6fcf97]";
  if (status === "Nerf") return "text-[#ff6b6b]";
  return "text-gold-soft";
}

export default function PatchNotesPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-line/60">
        <img src="/patch-notes/wcl-hero.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101b] via-[#07101b]/85 to-[#07101b]/45" />
        <div className="container-x relative py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div>
              <p className="eyebrow">World of Warcraft: Forever</p>
              <h1 className="display mt-2 text-4xl text-parchment md:text-6xl">Patch Notes <small className="mt-1 block text-lg font-normal text-gold-soft md:text-2xl">What every beta build changed</small></h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">The 24 updates of the WoW Forever beta, build by build, newest first. Open a class to see its spell and talent buffs, nerfs and other changes one by one.</p>
            </div>
            <aside className="border border-gold/25 bg-[#101017]/85 p-4 shadow-2xl backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-gold/80">Latest balance changes</p>
              <a href={`#build-${currentBuild?.build?.replace(/[^a-z0-9.]/gi, "-")}`} className="mt-2 block text-lg text-[#6fcf97] hover:text-gold-soft">{currentBuild?.dateLabel ?? "October 28, 2026"}</a>
              <ul className="mt-3 space-y-1.5 text-xs">{latest.items.map((item) => <li key={item.text} className={item.cls === "is-buff" ? "text-[#6fcf97]" : item.cls === "is-nerf" ? "text-[#ff6b6b]" : item.cls === "is-change" ? "text-gold-soft" : "text-parchment/80"}>{item.text}</li>)}</ul>
              <Link href="/patch-notes/balance" className="mt-4 inline-block text-[10px] text-gold/80 hover:text-gold-soft">Details →</Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="container-x max-w-4xl py-8 md:py-10">
        <div className="border border-[#4d6a80]/50 bg-[#101a22]/70 p-4 md:p-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Official Blizzard Posts</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="display text-2xl text-parchment">Blue posts <span className="text-base font-normal text-muted">{bluePosts.length} entries</span></h2><p className="mt-1 text-xs text-muted">Summaries of Blizzard’s official forum posts; dates are UTC.</p></div>
          </div>
          <div className="mt-4"><WclBluePosts posts={bluePosts} /></div>
        </div>
      </section>

      <section className="container-x max-w-4xl pb-16">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-line/60 pb-3">
          <div><p className="eyebrow">Build history</p><h2 className="display mt-1 text-2xl text-parchment">Every beta update</h2></div>
          <span className="text-[10px] text-muted/60">{builds.length} builds</span>
        </div>
        <div className="space-y-4">
          {builds.map((build) => (
            <article key={`${build.dateLabel}-${build.build}`} id={`build-${build.build.replace(/[^a-z0-9.]/gi, "-")}`} className="panel p-4 md:p-5">
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-2"><h3 className="display text-xl text-parchment">{build.dateLabel}</h3>{build.build ? <span className="text-xs text-muted">{build.build}</span> : null}{build.tag ? <span className="rounded border border-gold/30 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-gold-soft">{build.tag}</span> : null}</div>
                {build.isCurrent ? <span className="text-[10px] text-[#6fcf97]">Current build</span> : null}
              </header>
              {build.summary ? <p className="mt-2 text-sm leading-relaxed text-muted">{build.summary}</p> : null}
              {build.groups.length > 0 ? <div className="mt-3 space-y-2">{build.groups.map((group) => (
                <details key={`${build.build}-${group.name}`} className="rounded-lg border border-line/50 bg-deep/30">
                  <summary className="cursor-pointer px-3 py-2 text-sm text-parchment">
                    <span className="inline-flex items-center gap-2">{group.name !== "Blizzard's posts on it" ? <img src={groupIcon(group.name)} alt="" width={20} height={20} className="size-5 rounded object-cover" /> : null}{group.name}</span>
                    <span className="ml-2 text-[10px] text-muted">{group.counts.map((count) => count.text).join(" · ")}</span>
                    {group.line ? <span className="mt-1 block text-[10px] text-muted/70">{group.line}</span> : null}
                  </summary>
                  <div className="border-t border-line/40 px-3 py-2">
                    {group.entries.map((entry) => <div key={`${group.name}-${entry.name}`} className="py-1.5 text-xs"><span className="text-parchment/90">{entry.name}</span>{entry.status ? <span className={`ml-2 text-[10px] ${statusColor(entry.status)}`}>{entry.status}</span> : null}{entry.delta ? <span className="ml-2 text-[10px] text-muted">{entry.delta}</span> : null}{entry.desc ? <p className="mt-0.5 text-[10px] leading-relaxed text-muted/80">{entry.desc}</p> : null}</div>)}
                    {group.entries.length === 0 ? <p className="py-1 text-[10px] text-muted">No item-level detail in this section.</p> : null}
                  </div>
                </details>
              ))}</div> : null}
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/data" className="text-xs text-gold/80 hover:text-gold-soft">Browse the database →</Link><a href="https://wowforever.wclbox.com/en/buding" target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-parchment">Source: WCLBox patch notes →</a></div>
      </section>
    </main>
  );
}
