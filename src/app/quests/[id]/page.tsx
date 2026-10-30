import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findDungeonQuest } from "@/lib/dungeon-details";
import { quests } from "@/lib/quests-db";
import { LootItemLink } from "@/components/LootItemLink";

type Params = { id: string };
const qualityColors: Record<string, string> = { "0": "#9d9d9d", "1": "#ffffff", "2": "#1eff00", "3": "#4aa3ff", "4": "#a335ee" };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const found = findDungeonQuest(id);
  const db = quests.find((quest) => String(quest.id) === id.replace(/^quest-/, ""));
  const name = found?.quest.name ?? db?.title;
  return name ? { title: `${name} — quest`, description: `Quest details for ${name} in World of Warcraft: Forever.`, alternates: { canonical: `/quests/${id}` } } : { title: "Quest not found" };
}

export default async function QuestPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const found = findDungeonQuest(id);
  const db = quests.find((quest) => String(quest.id) === id.replace(/^quest-/, ""));
  if (!found && !db) notFound();
  const quest = found?.quest;
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted"><Link href="/quests" className="hover:text-gold-soft">Quests</Link> / <span className="text-parchment/80">{quest?.name ?? db?.title}</span></div>
      <section className="container-x max-w-3xl pb-20 pt-8">
        <p className="eyebrow">Quest{found ? ` · ${found.detail.h1}` : ""}</p>
        <h1 className="display mt-2 text-3xl text-parchment md:text-4xl">{quest?.name ?? db?.title}</h1>
        {quest ? <p className="mt-1 text-xs text-muted">{quest.levelLine} · {found?.faction}</p> : null}
        {quest ? (
          <>
            <p className="mt-4 text-sm leading-relaxed text-muted">{quest.text}</p>
            <div className="panel mt-5 divide-y divide-line/50 p-4">
              {quest.objectives.map((objective) => <div key={objective.key} className="grid gap-1 py-2 text-sm sm:grid-cols-[8rem_minmax(0,1fr)]"><span className="text-muted">{objective.key}</span><span className="text-parchment/80">{objective.value}</span></div>)}
            </div>
            {quest.rewards?.items?.length ? <div className="mt-5"><h2 className="display text-lg text-parchment">{quest.rewards.label}</h2><div className="mt-2 grid gap-2 sm:grid-cols-2">{quest.rewards.items.map((item) => <div key={item.name} className="rounded-lg border border-line/60 bg-deep/30 p-2"><LootItemLink item={item} size={32} /></div>)}</div></div> : null}
            {found?.detail ? <Link href={`/dungeons/${found.slug}`} className="mt-5 inline-block text-xs text-gold/80">Back to dungeon →</Link> : null}
          </>
        ) : (
          <div className="panel mt-5 p-5 text-sm leading-relaxed text-muted"><p>{db?.title_zh}</p><p className="mt-1 text-xs">Level {db?.level} · {db?.giver_name || "Giver unknown"} · {db?.giver_zone_zh || "Zone unknown"}</p></div>
        )}
      </section>
    </main>
  );
}
