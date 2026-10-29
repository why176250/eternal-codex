import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDbItem } from "@/lib/items-db";
import { getGuideItem } from "@/lib/guide-items";
import { getProfessionItem } from "@/lib/profession-items";

type Params = { id: string };
const qualityColor: Record<string, string> = {
  Poor: "#9d9d9d", Common: "#ffffff", Uncommon: "#1eff00", Rare: "#0070dd", Epic: "#a335ee", Legendary: "#ff8000",
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const item = getDbItem(id);
  if (!item) {
    const guideItem = getGuideItem(id);
    if (guideItem) return { title: `${guideItem.name_en || guideItem.name} — guide item`, description: "An item referenced in a Forever guide." };
    const professionItem = getProfessionItem(id);
    if (professionItem) return { title: `${professionItem.name} — profession item`, description: "A crafted item or reagent from a Forever profession." };
    return { title: "Item not found" };
  }
  return {
    title: `${item.name} — ${item.qualityLabel} item`,
    description: `${item.name}: item level ${item.ilvl}, ${item.qualityLabel} ${item.slotName} ${item.className}.`,
    alternates: { canonical: `/items/${item.id}` },
  };
}

export default async function ItemPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const item = getDbItem(id);
  if (!item) {
    const guideItem = getGuideItem(id);
    if (!guideItem) {
      const professionItem = getProfessionItem(id);
      if (!professionItem) notFound();
      return (
        <main>
          <div className="container-x pt-8 text-xs text-muted"><Link href="/items" className="hover:text-gold-soft">Items</Link> / <span className="text-parchment/80">{professionItem.name}</span></div>
          <section className="container-x max-w-3xl pb-20 pt-8">
            <div className="flex items-start gap-4">
              <img src={professionItem.icon} alt="" width={72} height={72} className="size-20 shrink-0 rounded-lg border border-line/80" />
              <div><p className="eyebrow">{professionItem.kind === "crafted" ? "Crafted item" : "Profession reagent"}</p><h1 className="display mt-2 text-3xl text-parchment md:text-4xl">{professionItem.name}</h1><p className="mt-1 text-sm text-muted">{professionItem.itemLevel ? `Item level ${professionItem.itemLevel}` : "Material"}</p></div>
            </div>
            <div className="panel mt-6 p-5 text-sm leading-relaxed text-muted"><p>This item is part of the profession database but has no full item record yet.</p><p className="mt-2 text-xs text-muted/60">Item ID {professionItem.id}</p></div>
          </section>
        </main>
      );
    }
    return (
      <main>
        <div className="container-x pt-8 text-xs text-muted"><Link href="/items" className="hover:text-gold-soft">Items</Link> / <span className="text-parchment/80">{guideItem.name_en || guideItem.name}</span></div>
        <section className="container-x max-w-3xl pb-20 pt-8">
          <div className="flex items-start gap-4">
            {guideItem.icon ? <img src={guideItem.icon} alt="" width={72} height={72} className="size-20 shrink-0 rounded-lg border border-line/80" /> : null}
            <div><p className="eyebrow">Guide item</p><h1 className="display mt-2 text-3xl text-parchment md:text-4xl">{guideItem.name_en || guideItem.name}</h1><p className="mt-1 text-sm text-muted">Item level {guideItem.item_level} · Quality {guideItem.quality}</p></div>
          </div>
          <div className="panel mt-6 p-5 text-sm leading-relaxed text-muted"><p>This item is referenced by an imported guide but has no full database record yet.</p><p className="mt-2 text-xs text-muted/60">Item ID {guideItem.id}</p></div>
        </section>
      </main>
    );
  }
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/items" className="hover:text-gold-soft">Items</Link> / <span className="text-parchment/80">{item.name}</span>
      </div>
      <section className="container-x max-w-3xl pb-20 pt-8">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="badge">{item.className}</span>
          <span className="text-muted">{item.slotName}</span>
          <span className="text-muted">iLvl {item.ilvl}</span>
        </div>
        <div className="mt-5 flex items-start gap-4">
          <img src={item.icon} alt="" width={72} height={72} className="size-20 shrink-0 rounded-lg border border-line/80" />
          <div>
            <h1 className="display text-3xl md:text-4xl" style={{ color: qualityColor[item.qualityLabel] ?? "#ede7d7" }}>{item.name}</h1>
            <p className="mt-1 text-sm text-muted">{item.qualityLabel} · {item.slotName} · Item level {item.ilvl}</p>
          </div>
        </div>
        <div className="panel mt-6 p-5 text-sm leading-relaxed text-muted">
          <p className="font-medium text-parchment">Item details</p>
          {item.stats && item.stats.length > 0 ? (
            <ul className="mt-3 space-y-1">{item.stats.map((stat) => <li key={stat.name}>{stat.name}: {stat.value}</li>)}</ul>
          ) : <p className="mt-2">Detailed stats are still being verified for this item.</p>}
          {item.effect ? <p className="mt-3 text-gold-soft">{item.effect}</p> : null}
          {item.price ? <p className="mt-3 text-xs text-muted/70">{item.price}</p> : null}
          {item.reqLevel ? <p className="mt-1 text-xs text-muted/70">Requires level {item.reqLevel}</p> : null}
        </div>
      </section>
    </main>
  );
}
