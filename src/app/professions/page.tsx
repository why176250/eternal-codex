import type { Metadata } from "next";
import Link from "next/link";
import campItemsEn from "@/data/camp-items.en.json";
import {
  favorCountBySkillLine,
  favorName,
  favorOffers,
  getFavorOffers,
} from "@/lib/favor";
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
const CAMP_TIERS = [20, 140, 300];
const updated = "2026-10-28";

function reagentCount(recipe: Recipe) {
  return recipe.reagents.reduce((sum, reagent) => sum + reagent.count, 0);
}

function buildSkillGuide(recipes: Recipe[]) {
  const steps: { start: number; end: number; recipe: Recipe }[] = [];
  for (let start = 1; start <= 300; start += 25) {
    const end = Math.min(300, start + 24);
    const candidates = recipes.filter(
      (recipe) =>
        recipe.minSkillLineRank <= start &&
        recipe.trivialHigh > start &&
        recipe.reagents.length > 0,
    );
    const recipe =
      candidates.sort((a, b) => reagentCount(a) - reagentCount(b))[0] ??
      recipes
        .filter((entry) => entry.minSkillLineRank > start)
        .sort((a, b) => a.minSkillLineRank - b.minSkillLineRank)[0];
    if (recipe) steps.push({ start, end, recipe });
  }
  return steps;
}

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
  const guideSteps = buildSkillGuide(allRecipes);
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
  const favor = getFavorOffers(profession.skillLineId);
  const favorCounts = favorCountBySkillLine();
  const campRows = professions.map((entry) => {
    const items = getCampItems(entry.skillLineId);
    return {
      profession: entry,
      tiers: CAMP_TIERS.map(
        (tier) => items.find((item) => item.skillReq === tier) ?? null,
      ),
    };
  });

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
            <span className="rounded-full border border-line/80 px-3 py-1">
              Updated 2026-10-28
            </span>
          </div>
        </div>
      </header>

      <section className="container-x py-8 md:py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {professions.map((entry) => {
            const active = entry.skillLineId === profession.skillLineId;
            return (
              <Link
                key={entry.skillLineId}
                href={href({ p: entry.skillLineId, q: "", page: 1 })}
                className={`flex min-h-[76px] items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  active
                    ? "border-gold/50 bg-gold/[0.08] text-gold-soft"
                    : "border-line/70 text-muted hover:border-line hover:text-parchment"
                }`}
              >
                <img
                  src={fallbackIcon(entry.icon)}
                  alt=""
                  width={48}
                  height={48}
                  className="size-11 shrink-0 rounded-md border border-line/70 2xl:size-12"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm leading-tight md:text-[15px]">
                    {professionEnglish[entry.name] ?? entry.name}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted/60">
                    {entry.recipeCount} recipes
                  </span>
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

        {camps.length > 0 ? (
          <section id="camp-items" className="mt-4 scroll-mt-24">
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
              {camps.map((item) => {
                const en = campItemsEn[String(item.itemId) as keyof typeof campItemsEn];
                return (
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
                      <p className="text-sm capitalize text-parchment">{en?.name ?? item.nameCn}</p>
                      <p className="text-[10px] text-muted">
                        Skill {item.skillReq} · iLvl {item.itemLevel}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    {en?.effect ?? item.effectDescCn}
                  </p>
                </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <section id="camp-overview" className="panel mt-4 scroll-mt-24 p-4 md:p-5">
          <details open>
            <summary className="flex cursor-pointer list-none flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Camp items at a glance</p>
                <h2 className="display mt-1 text-2xl text-parchment">
                  Every profession, three tiers
                </h2>
              </div>
              <p className="text-[11px] text-muted">
                Skill 20 / 140 / 300 · buffs for everyone at the fire
              </p>
            </summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-xs">
                <thead className="border-b border-line text-[10px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="py-2 pr-4 font-normal">Profession</th>
                    {CAMP_TIERS.map((tier) => (
                      <th key={tier} className="px-3 py-2 font-normal">
                        Skill {tier}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campRows.map(({ profession: entry, tiers }) => (
                    <tr key={entry.skillLineId} className="border-b border-line/40 align-top last:border-0">
                      <td className="py-3 pr-4 text-parchment">
                        {professionEnglish[entry.name] ?? entry.name}
                      </td>
                      {tiers.map((item, index) => {
                        const en = item ? campItemsEn[String(item.itemId) as keyof typeof campItemsEn] : null;
                        return (
                          <td key={`${entry.skillLineId}-${index}`} className="px-3 py-3">
                            {item ? (
                              <div className="flex gap-2">
                                <img
                                  src={fallbackIcon(item.icon)}
                                  alt=""
                                  width={28}
                                  height={28}
                                  className="size-7 shrink-0 rounded border border-line/70"
                                />
                                <div>
                                  <p className="capitalize text-parchment">{en?.name ?? item.nameCn}</p>
                                  <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
                                    {en?.effect ?? item.effectDescCn}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted/50">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        <section id="merchants-favor" className="panel mt-4 scroll-mt-24 p-4 md:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Merchant&apos;s Favor</p>
              <h2 className="display mt-1 text-2xl text-parchment">
                Trade camp recipes
              </h2>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">
                Bring supply crates to the trade camps and spend favor on these
                recipes and goods. Counts below are for the current import.
              </p>
            </div>
            <span className="rounded-full border border-line/80 px-3 py-1 text-[11px] text-muted">
              {favorOffers.length} offers · 7 professions
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            {professions
              .filter((entry) => favorCounts[entry.skillLineId])
              .map((entry) => (
                <span
                  key={entry.skillLineId}
                  className="rounded-full border border-line/70 px-2.5 py-1 text-muted"
                >
                  {professionEnglish[entry.name] ?? entry.name}{" "}
                  <span className="text-parchment/80">
                    {favorCounts[entry.skillLineId]}
                  </span>
                </span>
              ))}
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted">
              {professionEnglish[profession.name] ?? profession.name} offers:{" "}
              <span className="text-parchment">{favor.length}</span>
            </p>
            {favor.length > 0 ? (
              <details className="mt-2">
                <summary className="cursor-pointer select-none text-xs text-gold/85">
                  Show current profession offers
                </summary>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-xs">
                    <thead className="border-b border-line text-[10px] uppercase tracking-wider text-muted">
                      <tr>
                        <th className="py-2 pr-4 font-normal">Item</th>
                        <th className="px-3 py-2 font-normal">Favor</th>
                        <th className="px-3 py-2 font-normal">Gold</th>
                        <th className="px-3 py-2 font-normal">Requirement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {favor.map((offer) => (
                        <tr key={`${offer.itemId}-${offer.entryType}`} className="border-b border-line/40 last:border-0">
                          <td className="py-2 pr-4">
                            <span className="flex items-center gap-2 text-parchment">
                              <img
                                src={fallbackIcon(offer.icon)}
                                alt=""
                                width={24}
                                height={24}
                                className="size-6 rounded border border-line/70"
                              />
                              {favorName(offer)}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-muted">{offer.favorCost}</td>
                          <td className="px-3 py-2 text-muted">{offer.goldCost}g</td>
                          <td className="px-3 py-2 text-muted">
                            {offer.requireRep ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ) : (
              <p className="mt-2 text-xs text-muted/60">
                No favor offers for this profession in the current import.
              </p>
            )}
          </div>
        </section>

        {guideSteps.length > 0 ? (
          <details
            id="profession-guide"
            className="group panel mt-4 scroll-mt-24"
          >
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-4 marker:hidden md:p-5 [&::-webkit-details-marker]:hidden">
              <div>
                <p className="eyebrow">Skill-up guide</p>
                <h2 className="display mt-1 text-xl text-parchment">
                  {professionEnglish[profession.name] ?? profession.name} 1–300
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <p className="hidden max-w-md text-[11px] leading-relaxed text-muted md:block">
                  One craftable recipe per 25-skill band, preferring the cheapest
                  reagent list.
                </p>
                <span className="text-[11px] text-gold/80 group-open:hidden">
                  Open guide +
                </span>
                <span className="hidden text-[11px] text-muted group-open:inline">
                  Close −
                </span>
              </div>
            </summary>

            <div className="px-4 pb-4 md:px-5 md:pb-5">
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {guideSteps.map((step) => (
                  <div
                    key={`${step.start}-${step.recipe.recipeId}`}
                    className="flex items-start gap-3 rounded-lg border border-line/60 bg-deep/40 p-3"
                  >
                    <img
                      src={fallbackIcon(step.recipe.icon)}
                      alt=""
                      width={34}
                      height={34}
                      className="size-8 shrink-0 rounded border border-line/70"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        Skill {step.start}–{step.end}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-parchment">
                        {step.recipe.localesName}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted">
                        {step.recipe.reagents
                          .map((reagent) => `${reagent.nameCn} ×${reagent.count}`)
                          .join(" · ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] leading-relaxed text-muted/60">
                Generated from recipe skill requirements. The cheapest recipe is a
                starting suggestion, not a mandatory route; use cheaper alternatives
                from the list below when they are available.
              </p>
            </div>
          </details>
        ) : null}

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
