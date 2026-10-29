import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDbSpell } from "@/lib/spells-db";

type Params = { id: string };
const schoolEnglish: Record<string, string> = { 自然: "Nature", 火焰: "Fire", 冰霜: "Frost", 暗影: "Shadow", 神圣: "Holy", 奥术: "Arcane", 物理: "Physical" };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const spell = getDbSpell(id);
  if (!spell) return { title: "Spell not found" };
  return { title: `${spell.name} — Forever spell`, description: `${spell.name}, a ${schoolEnglish[spell.school] ?? spell.school} spell in World of Warcraft: Forever.`, alternates: { canonical: `/spells/${spell.id}` } };
}

export default async function SpellPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const spell = getDbSpell(id);
  if (!spell) notFound();
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted"><Link href="/spells" className="hover:text-gold-soft">Spells</Link> / <span className="text-parchment/80">{spell.name}</span></div>
      <section className="container-x max-w-3xl pb-20 pt-8">
        <div className="flex items-start gap-4">
          <img src={spell.icon} alt="" width={72} height={72} className="size-20 shrink-0 rounded-lg border border-line/80" />
          <div><p className="eyebrow">Spell · {schoolEnglish[spell.school] ?? spell.school}</p><h1 className="display mt-2 text-3xl text-parchment md:text-4xl">{spell.name}</h1></div>
        </div>
        <div className="panel mt-6 p-5 text-sm leading-relaxed text-muted">
          <p className="font-medium text-parchment">Description</p>
          <p className="mt-2">{spell.desc || "No tooltip is available in the current import."}</p>
          <p className="mt-4 text-xs text-muted/60">Spell ID {spell.id}</p>
        </div>
      </section>
    </main>
  );
}
