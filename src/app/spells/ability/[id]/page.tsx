import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findClassAbility } from "@/lib/class-abilities";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const found = findClassAbility(id);
  if (!found) return { title: "Class ability not found" };
  return {
    title: `${found.ability.nameEn || found.ability.name} — ${found.className} ability`,
    description: found.ability.desc || "Forever class ability.",
    alternates: { canonical: `/spells/ability/${id}` },
  };
}

export default async function ClassAbilityPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const found = findClassAbility(id);
  if (!found) notFound();
  const ability = found.ability;
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/spells" className="hover:text-gold-soft">Spells</Link> /{" "}
        <Link href={`/classes/${found.className.toLowerCase()}`} className="hover:text-gold-soft">{found.className}</Link> /{" "}
        <span className="text-parchment/80">{ability.nameEn || ability.name}</span>
      </div>
      <section className="container-x max-w-3xl pb-20 pt-8">
        <div className="flex items-start gap-4">
          <img src={`/talents/icons/${ability.icon}.jpg`} alt="" width={72} height={72} className="size-20 shrink-0 rounded-lg border border-line/80" />
          <div>
            <p className="eyebrow">Class ability · {found.className}</p>
            <h1 className="display mt-2 text-3xl text-parchment md:text-4xl">{ability.nameEn || ability.name}</h1>
          </div>
        </div>
        <div className="panel mt-6 p-5 text-sm leading-relaxed text-muted">
          <p className="font-medium text-parchment">Description</p>
          <p className="mt-2">{ability.desc || "No tooltip is available in the current import."}</p>
          {ability.cost ? <p className="mt-3 text-gold/80">{ability.cost}</p> : null}
          {ability.ranks && ability.ranks.length > 0 ? (
            <div className="mt-4 space-y-2 border-t border-line/70 pt-3">
              {ability.ranks.map((rank) => (
                <p key={`${rank.lv}-${rank.spellId}`} className="text-xs">
                  {rank.lv ? `Level ${rank.lv}` : "Rank"}{rank.desc ? ` — ${rank.desc}` : ""}
                </p>
              ))}
            </div>
          ) : null}
          <p className="mt-4 text-xs text-muted/60">Ability ID {ability.id} · {found.className}</p>
        </div>
      </section>
    </main>
  );
}
