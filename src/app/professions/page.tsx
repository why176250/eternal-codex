import type { Metadata } from "next";
import Link from "next/link";
import {
  fallbackIcon,
  getCampItems,
  getProfession,
  getRecipes,
  professionEnglish,
  professions,
  qualityColor,
  type Recipe,
} from "@/lib/professions";

export const metadata: Metadata = {
  title: "Professions — recipes and crafting",
  description:
    "All 12 professions and 2,213 recipes for World of Warcraft: Forever — search by profession, inspect reagents, skill requirements, and camp items.",
  alternates: { canonical: "/professions" },
};

type SearchParams = Promise<{ p?: string; q?: string; page?: string }>;
const PAGE_SIZE = 24;

export default async function ProfessionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selectedId = Number(params.p) || professions[0]?.skillLineId || 165;
  const profession = getProfession(selectedId) ?? professions[0];
  const query = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page) || 1);

  const allRecipes = getRecipes(profession.skillLineId);
  const filtered = query
    ? allRecipes.filter((recipe) =>
        `${recipe.localesName} ${recipe.reagents.map((r) => r.nameCn).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : allRecipes;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const camps = getCampItems(profession.skillLineId);

  function href(next: { p?: number; q?: string; page?: number }) {
    const search = new URLSearchParams();
    const professionId = next.p ?? profession.skillLineId;
    if (professionId !== (professions[0]?.skillLineId ?? 165)) {
      search.set("p", String(professionId));
    }
    const nextQuery = next.q ?? query;
    if (nextQuery) search.set("q", nextQuery);
    if ((next.page ?? 1) > 1) search.set("page", String(next.page));
    return search.toString() ? `/professions?${search.toString()}` : "/professions";
  }

  return (
    <main>
      <header className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Professions</p>
          <h1 className="display mt-3 max-w-3xl text-3xl text-parchment md:text-5xl">
            Recipes, reagents, and what each craft actually needs
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            12 professions, {allRecipes.length.toLocaleString("en-US")} recipes
            in this view. Pick a profession, search a craft, and check the
            reagent list before you spend materials.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
            <span className="rounded-full border border-line/80 px-3 py-1">
              12 professions
            </span>
            <span className="rounded-full border border-line/80 px-3 py-1">
              2,213 recipes
            </span>
            <span className="rounded-full border border-line/80 px-3 py-1">
              Source: Blue Hermit
            </span>
          </div>
        </div>
      </header>

      <section className="container-x py-8 md:py-10">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {professions.map((entry) => {
            const active = entry.skillLineId === profession.skillLineId;
            return (
              <Link
                key={entry.skillLineId}
                href={href({ p: entry.skillLineId, q: "", page: 1 })}
                className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                  active
                    ? "border-gold/50 bg-gold/[0.08] text-gold-soft"
                    : "border-line/70 text-muted hover:border-line hover:text-parchment"
                }`}
              >
                <img
                  src={fallbackIcon(entry.icon)}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 rounded border border-line/70"
                />
                <span>
                  <span className="block">{professionEnglish[entry.name] ?? entry.name}</span>
                  <span className="block text-[9px] text-muted/60">{entry.recipeCount} recipes</span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="panel mt-4 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={fallbackIcon(profession.icon)}
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-lg border border-line/80"
              />
              <div>
                <h2 className="display text-xl text-parchment">
                  {professionEnglish[profession.name] ?? profession.name}
                </h2>
                <p className="text-[11px] text-muted">
                  {filtered.length.toLocaleString("en-US")} recipes
                  {query ? ` matching “${query}”` : " in the current view"}
                </p>
              </div>
            </div>
            <form action="/professions" className="flex items-center gap-2">
              <input type="hidden" name="p" value={profession.skillLineId} />
              <input
                name="q"
                defaultValue={query}
                placeholder="Search this profession"
                className="w-48 rounded-lg border border-line bg-deep px-3 py-2 text-xs text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((recipe) => (
            <RecipeCard key={recipe.recipeId} recipe={recipe} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="panel mt-4 p-6 text-sm text-muted">No recipes match that search.</p>
        ) : null}

        {pageCount > 1 ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            {currentPage > 1 ? (
              <Link
                href={href({ page: currentPage - 1 })}
                className="rounded-lg border border-line px-3 py-2 text-muted hover:border-gold/40 hover:text-parchment"
              >
                ← Previous
              </Link>
            ) : null}
            <span className="px-2 text-muted">
              Page {currentPage} / {pageCount}
            </span>
            {currentPage < pageCount ? (
              <Link
                href={href({ page: currentPage + 1 })}
                className="rounded-lg border border-line px-3 py-2 text-muted hover:border-gold/40 hover:text-parchment"
              >
                Next →
              </Link>
            ) : null}
          </div>
        ) : null}

        {camps.length > 0 ? (
          <section className="mt-12 border-t border-line/60 pt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Camp items</p>
                <h2 className="display mt-1 text-2xl text-parchment">
                  {professionEnglish[profession.name] ?? profession.name} camp
                </h2>
              </div>
              <p className="text-[11px] text-muted">
                {camps.length} items with effects
              </p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {camps.map((item) => (
                <div key={item.itemId} className="panel p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={fallbackIcon(item.icon)}
                      alt=""
                      width={36}
                      height={36}
                      className="size-9 rounded border border-line/80"
                    />
                    <div>
                      <p className="text-sm text-parchment">{item.nameCn}</p>
                      <p className="text-[10px] text-muted">
                        Skill {item.skillReq} · iLvl {item.itemLevel}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    {item.effectDescCn}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-8 text-[11px] leading-relaxed text-muted/60">
          Recipe data from the Blue Hermit mini-program. Recipe and reagent
          names are shown as imported; icons use the game asset set. Personal,
          non-commercial use.
        </p>
      </section>
    </main>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const color = qualityColor(recipe.quality);
  return (
    <article className="panel p-4">
      <div className="flex items-start gap-3">
        <img
          src={fallbackIcon(recipe.icon)}
          alt=""
          width={44}
          height={44}
          className="size-11 rounded-lg border"
          style={{ borderColor: `${color}66` }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm leading-snug text-parchment" style={{ color }}>
              {recipe.localesName}
            </h3>
            {recipe.itemLevel > 0 ? (
              <span className="shrink-0 text-[10px] text-muted/70">iLvl {recipe.itemLevel}</span>
            ) : null}
          </div>
          <p className="mt-1 text-[10px] text-muted">
            Skill {recipe.minSkillLineRank} · trivial {recipe.trivialHigh}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {recipe.reagents.map((reagent) => (
          <span
            key={`${recipe.recipeId}-${reagent.itemId}`}
            className="flex items-center gap-1 rounded border border-line/60 bg-deep/40 px-1.5 py-1 text-[10px] text-muted"
          >
            <img
              src={fallbackIcon(reagent.icon)}
              alt=""
              width={18}
              height={18}
              className="size-4 rounded border border-line/60"
            />
            {reagent.nameCn} ×{reagent.count}
          </span>
        ))}
      </div>
    </article>
  );
}
