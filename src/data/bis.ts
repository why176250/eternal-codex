export type BisPick = {
  slot: string;
  itemId: string;
  note?: string;
};

export type BisSpec = {
  id: string;
  name: string;
  role: "Tank" | "Healer" | "DPS";
  summary: string;
  picks: BisPick[];
  farmOrder: string[];
};

export type BisClass = {
  classId: string;
  intro: string;
  specs: BisSpec[];
};

/**
 * Phase 1 starter checklists. These are deliberately short lists of high-value
 * upgrades, not exhaustive best-in-slot tables: Forever's itemization is still
 * being verified in-game, and we would rather ship nine solid targets than
 * sixteen guesses.
 */
export const bisClasses: BisClass[] = [
  {
    classId: "warrior",
    intro:
      "Warriors live and die by weapon skill and hit rating. Farm your weapons first; the armor upgrades come from the same dungeons anyway.",
    specs: [
      {
        id: "fury",
        name: "Fury",
        role: "DPS",
        summary:
          "Hit cap first, then crit. Dual-wield Fury wants two good one-handers before any single armor piece.",
        picks: [
          { slot: "Head", itemId: "lionheart-helm" },
          { slot: "Back", itemId: "cape-of-the-black-baron", note: "Cheap and reliable from Baron runs." },
          { slot: "Hands", itemId: "devilsaur-gauntlets" },
          { slot: "Legs", itemId: "devilsaur-leggings" },
          { slot: "Main Hand", itemId: "dalrend-sacred" },
          { slot: "Off Hand", itemId: "dalrend-tribal" },
          { slot: "Trinket", itemId: "hand-of-justice" },
          { slot: "Trinket", itemId: "blackhands-breadth" },
          { slot: "Neck", itemId: "onyxia-tooth-pendant", note: "Raid upgrade once Onyxia is on farm." },
          { slot: "Ring", itemId: "band-of-accaria", note: "Raid upgrade from Molten Core." },
        ],
        farmOrder: [
          "Run Blackrock Depths until Hand of Justice drops.",
          "Farm the Dal'Rend set in Upper Blackrock Spire.",
          "Craft Lionheart Helm and the Devilsaur set.",
          "Move to Onyxia and Molten Core for the pendant and ring.",
        ],
      },
    ],
  },
  {
    classId: "hunter",
    intro:
      "Your ranged weapon is most of your damage. Everything else is hit rating, agility, and not dying to your own pet's pathing.",
    specs: [
      {
        id: "marksmanship",
        name: "Marksmanship",
        role: "DPS",
        summary:
          "Finish the hunter epic quest chain for Rhok'delar, then upgrade to the BWL crossbow. The Devilsaur set carries you through both.",
        picks: [
          { slot: "Ranged", itemId: "rhokdelar", note: "Epic quest reward; the pre-raid goal." },
          { slot: "Ranged (upgrade)", itemId: "ashjrethul", note: "BWL Chromaggus drop." },
          { slot: "Ranged (budget)", itemId: "blackcrow", note: "UBRS stopgap while farming." },
          { slot: "Hands", itemId: "devilsaur-gauntlets" },
          { slot: "Legs", itemId: "devilsaur-leggings" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
          { slot: "Trinket", itemId: "blackhands-breadth" },
          { slot: "Trinket", itemId: "drake-fang-talisman", note: "BWL melee trinket — only if nobody else needs it." },
          { slot: "Neck", itemId: "onyxia-tooth-pendant" },
          { slot: "Ring", itemId: "band-of-accaria" },
        ],
        farmOrder: [
          "Start the hunter epic quest chain and finish Rhok'delar.",
          "Farm UBRS for Blackcrow, the Baron cape, and quest rewards.",
          "Craft the Devilsaur set for hit and crit.",
          "Raid BWL for Ashjre'thul and the trinket upgrades.",
        ],
      },
    ],
  },
  {
    classId: "mage",
    intro:
      "Frost for solo and AoE, Fire for raid damage. Spell hit to cap first, then spell damage — everything else is a distraction.",
    specs: [
      {
        id: "frost",
        name: "Frost",
        role: "DPS",
        summary:
          "The safe launch spec: slows, blocks, and efficient farming. Raid gearing starts with spell hit, then flat spell damage.",
        picks: [
          { slot: "Head", itemId: "whitemane-chapeau", note: "Low-level stopgap that punches above its weight." },
          { slot: "Chest", itemId: "robe-of-the-archmage", note: "Crafted tailoring chest; often the first real epic." },
          { slot: "Main Hand", itemId: "azuresong-mageblade", note: "Molten Core caster sword." },
          { slot: "Neck", itemId: "choker-of-the-fire-lord", note: "Molten Core spell power neck." },
          { slot: "Trinket", itemId: "royal-seal", note: "Dire Maul quest chain." },
          { slot: "Trinket", itemId: "neltharions-tear", note: "BWL Nefarian; top spell hit trinket." },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
        ],
        farmOrder: [
          "Craft Robe of the Archmage as soon as tailoring allows.",
          "Finish the Dire Maul chain for Royal Seal.",
          "Run Molten Core for the mageblade and Choker.",
          "Add BWL for Neltharion's Tear once the raid is stable.",
        ],
      },
    ],
  },
];

export function getBisClass(classId: string): BisClass | undefined {
  return bisClasses.find((entry) => entry.classId === classId);
}

export function getBisRefsForItem(
  itemId: string,
): { classId: string; specName: string }[] {
  const refs: { classId: string; specName: string }[] = [];
  for (const entry of bisClasses) {
    for (const spec of entry.specs) {
      if (spec.picks.some((pick) => pick.itemId === itemId)) {
        refs.push({ classId: entry.classId, specName: spec.name });
      }
    }
  }
  return refs;
}
