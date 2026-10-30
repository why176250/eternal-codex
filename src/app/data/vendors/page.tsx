import type { Metadata } from "next";
import Link from "next/link";
import { foreverVendors, professionLabels } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

export const metadata: Metadata = {
  title: "Vendor recipes — profession crafting costs",
  description:
    "320 profession recipes with reagent lists, grouped by profession. Imported from the Sargeras community dataset.",
  alternates: { canonical: "/data/vendors" },
};

const qualityColors: Record<number, string> = {
  1: "#ffffff",
  2: "#1eff00",
  3: "#0070dd",
  4: "#a335ee",
  5: "#ff8000",
};

export default function VendorsPage() {
  const groups = new Map<string, typeof foreverVendors>();
  for (const recipe of foreverVendors) {
    const key = recipe.profession || "general";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(recipe);
  }
  const professions = [...groups.keys()].sort((a, b) =>
    (professionLabels[a] ?? a).localeCompare(professionLabels[b] ?? b),
  );

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Data · Vendors</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Vendor recipes
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            {foreverVendors.length} recipes with reagents, grouped by
            profession. Useful for planning a profession push or pricing
            crafts on the auction house.
          </p>
          <p className="mt-3"><span className="badge">Names: EN pending</span></p>
          <div className="mt-6">
            <ForeverSourceNote />
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          {professions.map((profession) => (
            <details key={profession} className="mb-6 border-b border-line/60 pb-4" open={professions.indexOf(profession) === 0}>
              <summary className="cursor-pointer select-none py-2 text-lg text-parchment">
                {professionLabels[profession] ?? profession}{" "}
                <span className="text-sm text-muted">({groups.get(profession)!.length})</span>
              </summary>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
                      <th className="py-2 pr-4 font-medium">Recipe</th>
                      <th className="py-2 pr-4 font-medium">Quality</th>
                      <th className="py-2 font-medium">Reagents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.get(profession)!.map((recipe) => (
                      <tr key={recipe.id} className="border-b border-line/40 last:border-0">
                        <td className="py-2.5 pr-4 text-parchment">{recipe.name}</td>
                        <td
                          className="py-2.5 pr-4"
                          style={{ color: qualityColors[recipe.quality ?? 1] }}
                        >
                          {recipe.quality}
                        </td>
                        <td className="py-2.5 text-muted">
                          {recipe.reagents
                            .map((r) => `${r.name} ×${r.count}`)
                            .join(" · ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
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
