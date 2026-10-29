import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBisBuild } from "@/lib/bis-db";

type Params = { key: string };
const slotNames: Record<number, string> = { 1: "Head", 2: "Neck", 3: "Shoulder", 5: "Chest", 6: "Waist", 7: "Legs", 8: "Feet", 9: "Wrist", 10: "Hands", 11: "Ring", 12: "Trinket", 13: "Main hand", 14: "Off hand", 15: "Ranged", 16: "Back", 17: "Two-hand", 20: "Chest" };
const qualityColor: Record<number, string> = { 1: "#ffffff", 2: "#1eff00", 3: "#0070dd", 4: "#a335ee", 5: "#ff8000" };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { key } = await params;
  const build = getBisBuild(key);
  if (!build) return { title: "BiS build not found" };
  return { title: `${build.className} ${build.specName} BiS — ${build.mode}`, description: `Imported BiS build for ${build.className} ${build.specName} in World of Warcraft: Forever.`, alternates: { canonical: `/bis/builds/${build.key}` } };
}

export default async function BisBuildPage({ params }: { params: Promise<Params> }) {
  const { key } = await params;
  const build = getBisBuild(key);
  if (!build) notFound();
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted"><Link href="/bis" className="hover:text-gold-soft">BiS</Link> / <Link href="/bis/builds" className="hover:text-gold-soft">Full tables</Link> / <span className="text-parchment/80">{build.className} {build.specName}</span></div>
      <section className="container-x max-w-4xl pb-20 pt-8">
        <p className="eyebrow">BiS · {build.mode} · Phase {build.stage}</p>
        <h1 className="display mt-2 text-3xl text-parchment md:text-4xl">{build.className} {build.specName}</h1>
        <p className="mt-2 text-sm text-muted">{build.side === "1" ? "Alliance" : build.side === "2" ? "Horde" : "Both sides"}</p>
        <div className="mt-6 space-y-3">
          {build.slots.map((slot) => {
            const best = slot.best[0];
            return (
              <div key={slot.invPos} className="panel p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted">{slotNames[slot.invPos] ?? `Slot ${slot.invPos}`}</p>
                    {best ? (
                      <Link href={`/items/${best.id}`} className="mt-1 flex items-center gap-2 text-sm" style={{ color: qualityColor[best.quality] ?? "#ede7d7" }}>
                        <img src={`https://wow.zamimg.com/images/wow/icons/large/${best.icon.replace(/\.jpg$/i, "")}.jpg`} alt="" width={28} height={28} className="size-7 rounded border border-line/70" />
                        {best.name}
                      </Link>
                    ) : <p className="mt-1 text-sm text-muted">No best item recorded</p>}
                  </div>
                  {best?.itemLevel ? <span className="text-[11px] text-muted">iLvl {best.itemLevel}</span> : null}
                </div>
                {best?.sourceStr ? <p className="mt-2 text-xs text-gold/80">{best.sourceStr}{best.sourceNote ? ` · ${best.sourceNote}` : ""}</p> : null}
                {slot.options.flat().length > 0 ? (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-[11px] text-muted">Alternatives ({slot.options.flat().length})</summary>
                    <ul className="mt-2 space-y-1 text-xs text-muted">{slot.options.flat().slice(0, 8).map((option) => <li key={`${option.id}-${option.name}`}>{option.name} · iLvl {option.itemLevel}</li>)}</ul>
                  </details>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
