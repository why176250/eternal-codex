import type { Metadata } from "next";
import Link from "next/link";
import { foreverSets } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

const classEn: Record<string, string> = {
  "全部/通用": "All / General",
  "战士": "Warrior",
  "圣骑士": "Paladin",
  "猎人": "Hunter",
  "盗贼": "Rogue",
  "牧师": "Priest",
  "萨满": "Shaman",
  "法师": "Mage",
  "术士": "Warlock",
  "德鲁伊": "Druid",
  "死亡骑士": "Death Knight",
};

export const metadata: Metadata = {
  title: "Set data — Forever item sets",
  description:
    "All 536 Forever item sets, grouped by class, with piece lists. Imported from the Sargeras community dataset.",
  alternates: { canonical: "/data/sets" },
};

export default function SetsPage() {
  const groups = new Map<string, typeof foreverSets>();
  for (const set of foreverSets) {
    const key = set.class || "Other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(set);
  }
  const classNames = [...groups.keys()].sort((a, b) => a.localeCompare(b));

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Data · Sets</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            {foreverSets.length} item sets
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Dungeon sets, PvP sets, and Forever-specific sets, grouped the way
            the source groups them. Open a set to see its pieces.
          </p>
          <p className="mt-3"><span className="badge">Names: EN pending</span></p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {classNames.map((name) => (
              <a
                key={name}
                href={`#set-${encodeURIComponent(name)}`}
                className="rounded-full border border-line px-3 py-1.5 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
              >
                {classEn[name] ?? name}
              </a>
            ))}
          </div>
          <div className="mt-6">
            <ForeverSourceNote />
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          {classNames.map((name) => (
            <div key={name} id={`set-${encodeURIComponent(name)}`} className="mb-12 scroll-mt-24">
              <h2 className="display text-2xl text-parchment">{classEn[name] ?? name}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groups.get(name)!.map((set) => (
                  <Link
                    key={set.id}
                    href={`/data/sets/${set.id}`}
                    className="panel panel-hover flex items-center justify-between gap-3 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-parchment">{set.nameEn ?? set.name}</p>
                      <p className="mt-1 text-xs text-muted">
                        {set.nameEn ? `${set.name} · ` : ""}{set.itemCount} pieces
                      </p>
                    </div>
                    <span className="text-xs text-gold/80">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
