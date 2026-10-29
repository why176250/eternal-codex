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
import { getDbItem } from "@/lib/items-db";
import campItemsEn from "@/data/camp-items.en.json";
import categoryNames from "@/data/profession-categories.en.json";
import { favorCountBySkillLine, favorName, favorOffers, getFavorOffers } from "@/lib/favor";

export const metadata: Metadata = {
  title: "Professions — recipes, skill-up paths, and camp items",
  description:
    "All 12 professions and 2,213 recipes for World of Warcraft: Forever — recipes, 1–300 skill paths, Merchant's Favor, and camp items.",
  alternates: { canonical: "/professions" },
};

type SearchParams = Promise<{ p?: string; q?: string; page?: string; tab?: string; c?: string }>;
const PAGE_SIZE = 24;
const TABS = [
  ["recipes", "Recipes"],
  ["leveling", "1–300"],
  ["favor", "Merchant's Favor"],
  ["camp", "Camp items"],
] as const;
type Tab = (typeof TABS)[number][0];

const categoryLabels: Record<string, string> = {
  药剂: "Elixirs", 药水: "Potions", 合剂: "Flasks", 转化: "Transmutes", 油类与装置: "Oils & devices",
  锁甲·头盔: "Mail · Helm", 锁甲·护肩: "Mail · Shoulders", 锁甲·胸甲: "Mail · Chest", 锁甲·护腕: "Mail · Wrists",
  锁甲·手套: "Mail · Gloves", 锁甲·腰带: "Mail · Belt", 锁甲·腿部: "Mail · Legs", 锁甲·战靴: "Mail · Boots",
  皮甲·头盔: "Leather · Helm", 皮甲·护肩: "Leather · Shoulders", 皮甲·胸甲: "Leather · Chest", 皮甲·护腕: "Leather · Wrists",
  皮甲·手套: "Leather · Gloves", 皮甲·腰带: "Leather · Belt", 皮甲·腿部: "Leather · Legs", 皮甲·战靴: "Leather · Boots",
  布甲·头盔: "Cloth · Helm", 布甲·护肩: "Cloth · Shoulders", 布甲·胸甲: "Cloth · Chest", 布甲·护腕: "Cloth · Wrists",
  布甲·手套: "Cloth · Gloves", 布甲·腰带: "Cloth · Belt", 布甲·腿部: "Cloth · Legs", 布甲·战靴: "Cloth · Boots",
  布甲·其他: "Cloth · Other", 其他护甲: "Other armor", 武器石与护甲片: "Weapon stones & armor kits",
  双手斧: "Two-handed axes", 双手剑: "Two-handed swords", 双手锤: "Two-handed maces",
  单手剑: "One-handed swords", 单手锤: "One-handed maces", 匕首: "Daggers", 长柄武器: "Polearms", 拳套: "Fist weapons",
  背包: "Bags", 材料包: "Material bags", 任务物品: "Quest items", 其他: "Other",
  绷带: "Bandages", 食物与饮料: "Food & drink", 营地物品: "Camp items", 其他材料: "Other materials",
  元素材料: "Elemental materials", 金属与矿石: "Metal & ore", 工程零件: "Engineering parts", 皮革: "Leather",
  饰品: "Trinkets",
};

function categoryMatch(recipe: Recipe, label: string): boolean {
  if (label === "营地物品") return false;
  if (label === "药剂" || label === "药水" || label === "合剂" || label === "转化") return recipe.localesName.includes(label);
  if (label === "油类与装置") return recipe.localesName.includes("油");
  if (label === "绷带") return recipe.localesName.includes("绷带");
  if (label === "食物与饮料") return !recipe.localesName.includes("油");
  return false;
}

const professionDescriptions: Record<string, string> = {
  Alchemy: "Potions, elixirs, flasks, and transmutes.",
  Blacksmithing: "Weapons, mail and plate armor, sharpening stones, and shield spikes.",
  Enchanting: "Enchants, wands, and oils for every gear slot.",
  Engineering: "Bombs, trinkets, goggles, guns, and scopes.",
  Leatherworking: "Leather and mail armor, cloaks, armor kits, and bags.",
  Tailoring: "Cloth armor, cloaks, bags, and shirts.",
  Mining: "Ores, stones, and gems, smelted into bars.",
  Herbalism: "Herbs from plants across every zone.",
  Skinning: "Leather, hides, and scales from beasts.",
  Cooking: "Food and drink, sorted by the buff it provides.",
  Fishing: "Fish for cooking, plus gear for anglers.",
  "First Aid": "Bandages, anti-venom, and potions.",
};

function reagentCount(recipe: Recipe) {
  return recipe.reagents.reduce((sum, reagent) => sum + reagent.count, 0);
}

function buildSkillGuide(recipes: Recipe[]) {
  const steps: { start: number; end: number; recipe: Recipe }[] = [];
  for (let start = 1; start <= 300; start += 25) {
    const end = Math.min(300, start + 24);
    const candidates = recipes.filter(
      (recipe) => recipe.minSkillLineRank <= start && recipe.trivialHigh > start && recipe.reagents.length > 0,
    );
    const recipe =
      candidates.sort((a, b) => reagentCount(a) - reagentCount(b))[0] ??
      recipes.filter((entry) => entry.minSkillLineRank > start).sort((a, b) => a.minSkillLineRank - b.minSkillLineRank)[0];
    if (recipe) steps.push({ start, end, recipe });
  }
  return steps;
}

function RecipeName({ recipe }: { recipe: Recipe }) {
  const item = getDbItem(recipe.itemId);
  return item ? <Link href={`/items/${item.id}`} className="hover:underline hover:underline-offset-2">{item.name}</Link> : <>{recipe.localesName}</>;
}

export default async function ProfessionsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const selectedId = Number(params.p) || professions[0]?.skillLineId || 165;
  const profession = getProfession(selectedId) ?? professions[0];
  const tab = (TABS.some(([key]) => key === params.tab) ? params.tab : "recipes") as Tab;
  const selectedCategory = params.c ?? "";
  const query = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page) || 1);
  const allRecipes = getRecipes(profession.skillLineId);
  const guideSteps = buildSkillGuide(allRecipes);
  const baseFiltered = query
    ? allRecipes.filter((recipe) => `${recipe.localesName} ${recipe.reagents.map((r) => r.nameCn).join(" ")}`.toLowerCase().includes(query.toLowerCase()))
    : allRecipes;
  const categoryOptions = (profession ? ((await import("@/data/professions.json")).categories as Record<string, { label: string; inventoryType: number }[]>)[String(profession.skillLineId)] ?? [] : [])
    .map((category) => ({
      label: category.label,
      labelEn: categoryLabels[category.label] ?? categoryNames[category.label as keyof typeof categoryNames] ?? category.label,
      count: allRecipes.filter((recipe) => category.inventoryType ? recipe.inventoryType === category.inventoryType : categoryMatch(recipe, category.label)).length,
      category,
    }))
    .filter((entry) => entry.count > 0);
  const category = categoryOptions.find((entry) => entry.label === selectedCategory);
  const filtered = category
    ? baseFiltered.filter((recipe) => category.category.inventoryType ? recipe.inventoryType === category.category.inventoryType : categoryMatch(recipe, category.label))
    : baseFiltered;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const camps = getCampItems(profession.skillLineId);
  const favor = getFavorOffers(profession.skillLineId);
  const favorCounts = favorCountBySkillLine();
  const englishName = professionEnglish[profession.name] ?? profession.name;
  const description = professionDescriptions[englishName] ?? "Recipes, materials, and skill requirements.";

  function href(next: { p?: number; q?: string; page?: number; tab?: Tab; c?: string }) {
    const search = new URLSearchParams();
    const professionId = next.p ?? profession.skillLineId;
    if (professionId !== (professions[0]?.skillLineId ?? 165)) search.set("p", String(professionId));
    const nextQuery = next.q ?? query;
    if (nextQuery) search.set("q", nextQuery);
    const nextTab = next.tab ?? tab;
    if (nextTab !== "recipes") search.set("tab", nextTab);
    const nextCategory = next.c ?? selectedCategory;
    if (nextTab === "recipes" && nextCategory) search.set("c", nextCategory);
    if ((next.page ?? 1) > 1) search.set("page", String(next.page));
    return search.toString() ? `/professions?${search.toString()}` : "/professions";
  }

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-10 md:py-14">
          <div className="flex flex-wrap items-start gap-4">
            <img src={fallbackIcon(profession.icon)} alt="" width={56} height={56} className="size-14 rounded-lg border border-line/80" />
            <div className="min-w-0 flex-1">
              <p className="eyebrow">Professions</p>
              <h1 className="display mt-1 text-3xl text-parchment md:text-4xl">{englishName}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
            <span className="rounded-full border border-line/80 px-3 py-1">{allRecipes.length} recipes</span>
            <span className="rounded-full border border-line/80 px-3 py-1">{camps.length} camp items</span>
            <span className="rounded-full border border-line/80 px-3 py-1">{favor.length} favor offers</span>
            <span className="rounded-full border border-line/80 px-3 py-1">Updated 2026-10-28</span>
          </div>
        </div>
      </section>

      <section className="container-x py-6 md:py-8">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {professions.map((entry) => {
            const active = entry.skillLineId === profession.skillLineId;
            return (
              <Link key={entry.skillLineId} href={href({ p: entry.skillLineId, q: "", page: 1, tab, c: "" })} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors ${active ? "border-gold/50 bg-gold/[0.08] text-gold-soft" : "border-line/70 text-muted hover:border-line hover:text-parchment"}`}>
                <img src={fallbackIcon(entry.icon)} alt="" width={36} height={36} className="size-9 shrink-0 rounded border border-line/70" />
                <span className="min-w-0"><span className="block truncate text-xs">{professionEnglish[entry.name] ?? entry.name}</span><span className="block text-[10px] text-muted/60">{entry.recipeCount}</span></span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex overflow-x-auto border-b border-line/70">
          {TABS.map(([key, label]) => (
            <Link key={key} href={href({ tab: key, q: "", page: 1, c: "" })} className={`shrink-0 border-b-2 px-4 py-3 text-sm transition-colors ${tab === key ? "border-gold text-parchment" : "border-transparent text-muted hover:text-gold-soft"}`}>
              {label}{key === "favor" && favor.length ? <span className="ml-1.5 text-[10px] text-muted">{favor.length}</span> : null}
            </Link>
          ))}
        </div>

        {tab === "recipes" ? (
          <div className="mt-5">
            <form method="get" className="panel flex flex-wrap items-center gap-2 p-4">
              <input type="hidden" name="p" value={profession.skillLineId} />
              {selectedCategory ? <input type="hidden" name="c" value={selectedCategory} /> : null}
              <input name="q" defaultValue={query} placeholder="Search recipes or reagents" className="min-w-56 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none" />
              <button className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm text-gold-soft">Search</button>
            </form>
            <div className="mt-4 grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
              <aside className="panel h-fit p-2">
                <Link href={href({ c: "", page: 1 })} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${!category ? "bg-gold/10 text-gold-soft" : "text-muted hover:text-parchment"}`}>
                  <span>All recipes</span><span>{allRecipes.length}</span>
                </Link>
                {categoryOptions.map((entry) => (
                  <Link key={entry.label} href={href({ c: entry.label, page: 1 })} className={`mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-sm ${category?.label === entry.label ? "bg-gold/10 text-gold-soft" : "text-muted hover:text-parchment"}`}>
                    <span className="capitalize">{entry.labelEn}</span><span className="text-[10px] text-muted/60">{entry.count}</span>
                  </Link>
                ))}
              </aside>
              <div>
                <p className="text-xs text-muted">{filtered.length} recipes</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((recipe) => (
              <RecipeCard key={recipe.recipeId} recipe={recipe} />
            ))}
                </div>
              </div>
            </div>
            {filtered.length === 0 ? <p className="panel mt-4 p-6 text-sm text-muted">No recipes match that search.</p> : null}
            {pageCount > 1 ? (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
                {currentPage > 1 ? <Link href={href({ page: currentPage - 1 })} className="rounded-lg border border-line px-3 py-2 text-muted hover:border-gold/40 hover:text-parchment">← Previous</Link> : null}
                <span className="px-2 text-muted">Page {currentPage} / {pageCount}</span>
                {currentPage < pageCount ? <Link href={href({ page: currentPage + 1 })} className="rounded-lg border border-line px-3 py-2 text-muted hover:border-gold/40 hover:text-parchment">Next →</Link> : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === "leveling" ? (
          <div className="mt-5 panel p-4 md:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div><p className="eyebrow">Skill-up guide</p><h2 className="display mt-1 text-2xl text-parchment">{englishName} 1–300</h2></div>
              <p className="text-[11px] text-muted">One craftable recipe per 25-skill band</p>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {guideSteps.map((step) => {
                const item = getDbItem(step.recipe.itemId);
                return (
                  <div key={`${step.start}-${step.recipe.recipeId}`} className="flex items-start gap-3 rounded-lg border border-line/60 bg-deep/40 p-3">
                    <img src={fallbackIcon(step.recipe.icon)} alt="" width={34} height={34} className="size-8 shrink-0 rounded border border-line/70" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted">Skill {step.start}–{step.end}</p>
                      <p className="mt-0.5 truncate text-xs text-parchment">{item ? <Link href={`/items/${item.id}`} className="hover:text-gold-soft">{item.name}</Link> : step.recipe.localesName}</p>
                      <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted">{step.recipe.reagents.map((reagent) => `${reagent.nameCn} ×${reagent.count}`).join(" · ")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-[10px] leading-relaxed text-muted/60">Generated from recipe skill requirements. The cheapest recipe is a starting suggestion, not a mandatory route.</p>
          </div>
        ) : null}

        {tab === "favor" ? (
          <div className="mt-5 panel p-4 md:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div><p className="eyebrow">Merchant&apos;s Favor</p><h2 className="display mt-1 text-2xl text-parchment">Trade camp recipes</h2></div>
              <span className="text-[11px] text-muted">{favorOffers.length} offers · 7 professions</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
              {professions.filter((entry) => favorCounts[entry.skillLineId]).map((entry) => <span key={entry.skillLineId} className="rounded-full border border-line/70 px-2.5 py-1">{professionEnglish[entry.name] ?? entry.name} <span className="text-parchment/80">{favorCounts[entry.skillLineId]}</span></span>)}
            </div>
            <p className="mt-4 text-xs text-muted">{englishName} offers: <span className="text-parchment">{favor.length}</span></p>
            {favor.length ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-xs">
                  <thead className="border-b border-line text-[10px] uppercase tracking-wider text-muted"><tr><th className="py-2 pr-4 font-normal">Item</th><th className="px-3 py-2 font-normal">Favor</th><th className="px-3 py-2 font-normal">Gold</th><th className="px-3 py-2 font-normal">Requirement</th></tr></thead>
                  <tbody>{favor.map((offer) => <tr key={`${offer.itemId}-${offer.entryType}`} className="border-b border-line/40 last:border-0"><td className="py-2 pr-4"><span className="flex items-center gap-2 text-parchment"><img src={fallbackIcon(offer.icon)} alt="" width={24} height={24} className="size-6 rounded border border-line/70" />{favorName(offer)}</span></td><td className="px-3 py-2 text-muted">{offer.favorCost}</td><td className="px-3 py-2 text-muted">{offer.goldCost}g</td><td className="px-3 py-2 text-muted">{offer.requireRep ?? "—"}</td></tr>)}</tbody>
                </table>
              </div>
            ) : <p className="mt-2 text-xs text-muted/60">No favor offers for this profession in the current import.</p>}
          </div>
        ) : null}

        {tab === "camp" ? (
          <div className="mt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2"><div><p className="eyebrow">Camp items</p><h2 className="display mt-1 text-2xl text-parchment">{englishName} camp</h2></div><p className="text-[11px] text-muted">{camps.length} items with effects</p></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {camps.map((item) => { const en = campItemsEn[String(item.itemId) as keyof typeof campItemsEn]; return <div key={item.itemId} className="panel p-4"><div className="flex items-center gap-3"><img src={fallbackIcon(item.icon)} alt="" width={36} height={36} className="size-9 rounded border border-line/80" /><div><p className="text-sm capitalize text-parchment">{en?.name ?? item.nameCn}</p><p className="text-[10px] text-muted">Skill {item.skillReq} · iLvl {item.itemLevel}</p></div></div><p className="mt-3 text-xs leading-relaxed text-muted">{en?.effect ?? item.effectDescCn}</p></div>; })}
            </div>
          </div>
        ) : null}

        <p className="mt-8 text-[11px] leading-relaxed text-muted/60">Recipe data from the Blue Hermit mini-program. Recipe and reagent names are shown as imported; personal, non-commercial use.</p>
      </section>
    </main>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const color = qualityColor(recipe.quality);
  return (
    <article className="panel p-4">
      <div className="flex items-start gap-3">
        <img src={fallbackIcon(recipe.icon)} alt="" width={44} height={44} className="size-11 rounded-lg border" style={{ borderColor: `${color}66` }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2"><h3 className="text-base leading-snug text-parchment" style={{ color }}><RecipeName recipe={recipe} /></h3>{recipe.itemLevel > 0 ? <span className="shrink-0 text-[10px] text-muted/70">iLvl {recipe.itemLevel}</span> : null}</div>
          <p className="mt-1 text-xs text-muted">Skill {recipe.minSkillLineRank} · trivial {recipe.trivialHigh}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {recipe.reagents.map((reagent) => { const db = getDbItem(reagent.itemId); return <span key={`${recipe.recipeId}-${reagent.itemId}`} className="flex items-center gap-1.5 rounded border border-line/60 bg-deep/40 px-2 py-1.5 text-xs text-muted"><img src={fallbackIcon(reagent.icon)} alt="" width={18} height={18} className="size-4 rounded border border-line/60" />{db ? <Link href={`/items/${db.id}`} className="hover:text-gold-soft">{db.name}</Link> : reagent.nameCn} ×{reagent.count}</span>; })}
      </div>
    </article>
  );
}
