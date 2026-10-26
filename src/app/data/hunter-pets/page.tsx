import type { Metadata } from "next";
import Link from "next/link";
import { foreverPets } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

export const metadata: Metadata = {
  title: "Hunter pets — families, diets, and tameable beasts",
  description:
    "19 pet families and 623 tameable beasts with diets, modifiers, attack speeds, and pet abilities. Imported from the Sargeras community dataset.",
  alternates: { canonical: "/data/hunter-pets" },
};

export default function HunterPetsPage() {
  const beastByFamily = new Map<string, typeof foreverPets.beasts>();
  for (const beast of foreverPets.beasts) {
    if (!beastByFamily.has(beast.family)) beastByFamily.set(beast.family, []);
    beastByFamily.get(beast.family)!.push(beast);
  }

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Data · Hunter pets</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Hunter pets
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            {foreverPets.families.length} families and{" "}
            {foreverPets.beasts.length} tameable beasts, with diet, damage and
            armor modifiers, and the fastest attack speed in each family.
          </p>
          <div className="mt-6">
            <ForeverSourceNote />
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <h2 className="display text-2xl text-parchment">Families</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {foreverPets.families.map((family) => (
              <div key={family.slug} className="panel p-4 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-parchment">{family.nameEn}</span>
                  <span className="ml-2 text-[11px] text-muted">{family.name}</span>
                  {family.isNew ? <span className="badge">New</span> : null}
                </div>
                <p className="mt-1 text-xs text-muted">
                  Diet: {family.dietEn || "—"}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Damage {family.dmgMod ?? 0} · Armor {family.armorMod ?? 0} · HP{" "}
                  {family.hpMod ?? 0}
                </p>
                {family.fastestSpeed ? (
                  <p className="mt-1 text-xs text-muted">
                    Fastest: {family.fastestSpeed}
                    {(() => {
                      const fastest = foreverPets.beasts.find(
                        (b) => b.nameZh === family.fastestName,
                      );
                      return fastest ? ` (${fastest.name})` : family.fastestName ? ` (${family.fastestName})` : "";
                    })()}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <h2 className="display mt-12 text-2xl text-parchment">Tameable beasts</h2>
          <p className="mt-2 text-sm text-muted">
            Grouped by family. Open a family to see its beasts.
          </p>
          <div className="mt-4 space-y-3">
            {foreverPets.families.map((family) => {
              const beasts = beastByFamily.get(family.slug) ?? [];
              if (beasts.length === 0) return null;
              return (
                <details key={family.slug} className="panel p-4">
                  <summary className="cursor-pointer select-none text-sm text-parchment">
                    {family.nameEn}{" "}
                    <span className="text-xs text-muted">({beasts.length} beasts)</span>
                  </summary>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead>
                        <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
                          <th className="py-2 pr-4 font-medium">Beast</th>
                          <th className="py-2 pr-4 font-medium">Chinese name</th>
                          <th className="py-2 pr-4 font-medium">Level</th>
                          <th className="py-2 pr-4 font-medium">Speed</th>
                          <th className="py-2 font-medium">Zones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {beasts.map((beast) => (
                          <tr key={beast.id} className="border-b border-line/40 last:border-0">
                            <td className="py-2 pr-4 text-parchment">
                              {beast.name}
                              {beast.isNew ? <span className="badge ml-2">New</span> : null}
                            </td>
                            <td className="py-2 pr-4 text-muted">{beast.nameZh || "—"}</td>
                            <td className="py-2 pr-4 text-muted">
                              {beast.levelMin ?? "?"}
                              {beast.levelMax ? `–${beast.levelMax}` : ""}
                            </td>
                            <td className="py-2 pr-4 text-muted">{beast.speed ?? "—"}</td>
                            <td className="py-2 text-muted">{beast.zones || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container-x pb-12">
        <Link href="/data" className="text-sm text-gold/90 hover:text-gold-soft">
          Back to data →
        </Link>
      </div>
    </main>
  );
}
