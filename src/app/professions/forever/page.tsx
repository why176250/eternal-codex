import type { Metadata } from "next";
import Link from "next/link";
import raw from "@/data/professions-foreverchanges.json";

export const metadata: Metadata = {
  title: "Forever profession index — English recipe names",
  description: "ForeverChanges English profession recipe index: 11 professions, categories, recipe names, and skill levels.",
  alternates: { canonical: "/professions/forever" },
};

type Recipe = { name: string; level: number };
type Profession = { slug: string; name: string; recipeCount: number | null; newCount: number | null; categories: { name: string; count: number }[]; recipes: Recipe[] };
const professions = (raw as { professions: Profession[] }).professions;

type SearchParams = Promise<{ p?: string; q?: string }>;

export default async function ForeverProfessionsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const activeSlug = professions.some((profession) => profession.slug === params.p) ? params.p : professions[0]?.slug;
  const profession = professions.find((entry) => entry.slug === activeSlug) ?? professions[0];
  const query = (params.q ?? "").trim().toLowerCase();
  const recipes = query ? profession.recipes.filter((recipe) => recipe.name.toLowerCase().includes(query)) : profession.recipes;

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-10 md:py-14">
          <p className="eyebrow">Professions · ForeverChanges reference</p>
          <h1 className="display mt-2 text-3xl text-parchment md:text-5xl">English recipe index</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            11 professions with English recipe names, categories, and skill levels.
            The source page lazy-loads recipes, so this index may be shorter than the
            page total.
          </p>
        </div>
      </section>
      <section className="container-x py-8">
        <div className="flex flex-wrap gap-2">
          {professions.map((entry) => <Link key={entry.slug} href={`/professions/forever?p=${entry.slug}`} className={`rounded-lg border px-3 py-2 text-xs ${entry.slug === profession.slug ? "border-gold/55 bg-gold/10 text-gold-soft" : "border-line/70 text-muted hover:border-gold/40 hover:text-parchment"}`}>{entry.name}</Link>)}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="panel h-fit p-4">
            <h2 className="display text-xl text-parchment">{profession.name}</h2>
            <p className="mt-1 text-xs text-muted">{profession.recipeCount ?? "—"} recipes · {profession.newCount ?? "—"} new</p>
            <div className="mt-4 space-y-1">
              {profession.categories.map((category) => <div key={category.name} className="flex items-center justify-between rounded border border-line/50 px-2 py-1.5 text-[11px] text-muted"><span>{category.name}</span><span>{category.count}</span></div>)}
            </div>
            <Link href="/professions" className="mt-4 inline-block text-xs text-gold/80">← Main profession tool</Link>
          </aside>
          <div>
            <form method="get" className="panel flex flex-wrap gap-2 p-3">
              <input type="hidden" name="p" value={profession.slug} />
              <input name="q" defaultValue={query} placeholder={`Search ${profession.name} recipes`} className="min-w-56 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none" />
              <button className="rounded-lg border border-gold/40 px-3 py-2 text-sm text-gold-soft">Search</button>
            </form>
            <p className="mt-3 text-xs text-muted">{recipes.length} recipes shown</p>
            <div className="panel mt-3 divide-y divide-line/50">
              {recipes.map((recipe, index) => <div key={`${recipe.name}-${index}`} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm"><span className="text-parchment">{recipe.name}</span><span className="shrink-0 text-[11px] text-muted">Skill {recipe.level}</span></div>)}
            </div>
            {recipes.length === 0 ? <p className="panel mt-3 p-5 text-sm text-muted">No recipes match that search.</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
