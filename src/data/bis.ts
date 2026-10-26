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
      {
        id: "protection",
        name: "Protection",
        role: "Tank",
        summary:
          "Tanking gear is the least verified corner of our database. These are the threat and stamina pieces we can defend today; treat the list as a starting point, not a full mitigation set.",
        picks: [
          { slot: "Main Hand", itemId: "quel-serar", note: "Tanking sword from the Dire Maul forging quest." },
          { slot: "Off Hand", itemId: "draconian-deflector", note: "UBRS shield; stamina and block value." },
          { slot: "Head", itemId: "lionheart-helm", note: "Threat and crit; mitigation comes later." },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
          { slot: "Trinket", itemId: "hand-of-justice", note: "Extra attacks generate threat." },
          { slot: "Trinket", itemId: "blackhands-breadth" },
          { slot: "Neck", itemId: "onyxia-tooth-pendant" },
          { slot: "Ring", itemId: "band-of-accaria" },
        ],
        farmOrder: [
          "Finish the Quel'Serrar chain in Dire Maul.",
          "Farm UBRS for the Draconian Deflector.",
          "BRD for Hand of Justice, then raid for the pendant and ring.",
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
      {
        id: "fire",
        name: "Fire",
        role: "DPS",
        summary:
          "Fire is the raid spec you level second. The caster gear is the same as Frost; once hit-capped, crit and spell damage are the only upgrades that matter.",
        picks: [
          { slot: "Head", itemId: "whitemane-chapeau" },
          { slot: "Chest", itemId: "robe-of-the-archmage" },
          { slot: "Main Hand", itemId: "azuresong-mageblade" },
          { slot: "Neck", itemId: "choker-of-the-fire-lord" },
          { slot: "Trinket", itemId: "neltharions-tear" },
          { slot: "Trinket", itemId: "royal-seal" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
        ],
        farmOrder: [
          "Craft Robe of the Archmage; it lasts until raid epics.",
          "MC for Azuresong Mageblade and the Choker.",
          "BWL for Neltharion's Tear once the raid is stable.",
        ],
      },
    ],
  },
  {
    classId: "paladin",
    intro:
      "Paladins keep two almost separate gear sets: healing cloth and retribution plate. Decide your main role before you spend gold on either.",
    specs: [
      {
        id: "holy",
        name: "Holy",
        role: "Healer",
        summary:
          "Healing is the reliable group role. Stack spell power and mana regen from cloth and quest rewards, then add the cheap trinkets.",
        picks: [
          { slot: "Head", itemId: "whitemane-chapeau" },
          { slot: "Chest", itemId: "robe-of-the-archmage" },
          { slot: "Neck", itemId: "choker-of-the-fire-lord", note: "Molten Core spell power neck." },
          { slot: "Trinket", itemId: "royal-seal", note: "Dire Maul quest chain; strong for healers." },
          { slot: "Trinket", itemId: "rejuvenating-gem", note: "BWL healer trinket." },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
        ],
        farmOrder: [
          "Craft Robe of the Archmage as soon as tailoring allows.",
          "Finish Dire Maul for Royal Seal.",
          "Run MC for the Choker, then BWL for the gem.",
        ],
      },
      {
        id: "retribution",
        name: "Retribution",
        role: "DPS",
        summary:
          "Retribution is a two-hander spec: your weapon is the build. Plate crit gear comes second, and raid drops carry the rest.",
        picks: [
          { slot: "Head", itemId: "lionheart-helm" },
          { slot: "Two-Hand", itemId: "arcanite-reaper", note: "Affordable crafted two-hander." },
          { slot: "Two-Hand (upgrade)", itemId: "ashkandi", note: "BWL Nefarian two-hander." },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
          { slot: "Trinket", itemId: "hand-of-justice" },
          { slot: "Trinket", itemId: "blackhands-breadth" },
          { slot: "Neck", itemId: "onyxia-tooth-pendant" },
          { slot: "Ring", itemId: "band-of-accaria" },
        ],
        farmOrder: [
          "Craft Arcanite Reaper and Lionheart Helm.",
          "Farm BRD for Hand of Justice and UBRS for the crit trinket.",
          "Move to Onyxia and MC for the pendant and ring.",
        ],
      },
    ],
  },
  {
    classId: "rogue",
    intro:
      "Rogues are a weapon-skill class: pick daggers or swords and commit. Both paths want the same hit and crit accessories.",
    specs: [
      {
        id: "combat-swords",
        name: "Combat Swords",
        role: "DPS",
        summary:
          "Combat swords is the reliable PvE path. The Dal'Rend set is the launch goal; Vis'kag and Brutality Blade are the upgrades.",
        picks: [
          { slot: "Main Hand", itemId: "dalrend-sacred" },
          { slot: "Off Hand", itemId: "dalrend-tribal" },
          { slot: "Main Hand (upgrade)", itemId: "viskag" },
          { slot: "Main Hand (raid)", itemId: "brutality-blade" },
          { slot: "Hands", itemId: "devilsaur-gauntlets" },
          { slot: "Legs", itemId: "devilsaur-leggings" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
          { slot: "Trinket", itemId: "hand-of-justice" },
          { slot: "Trinket", itemId: "blackhands-breadth" },
          { slot: "Neck", itemId: "onyxia-tooth-pendant" },
          { slot: "Ring", itemId: "band-of-accaria" },
        ],
        farmOrder: [
          "Farm the Dal'Rend set in UBRS.",
          "Craft the Devilsaur set; grab the Baron cape on the way.",
          "Raid MC for Brutality Blade and Band of Accuria.",
        ],
      },
      {
        id: "daggers",
        name: "Daggers",
        role: "DPS",
        summary:
          "Dagger rogues live in group content. Perdition's Blade is the pre-raid target; Claw of Chromaggus is the payoff.",
        picks: [
          { slot: "Main Hand", itemId: "perditions-blade" },
          { slot: "Main Hand (raid)", itemId: "claw-of-chromaggus" },
          { slot: "Hands", itemId: "devilsaur-gauntlets" },
          { slot: "Legs", itemId: "devilsaur-leggings" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
          { slot: "Trinket", itemId: "hand-of-justice" },
          { slot: "Trinket", itemId: "drake-fang-talisman" },
          { slot: "Neck", itemId: "onyxia-tooth-pendant" },
        ],
        farmOrder: [
          "Get the Devilsaur set and Baron cape first.",
          "Run MC for Perdition's Blade and HoJ support gear.",
          "BWL for Claw of Chromaggus and Drake Fang Talisman.",
        ],
      },
    ],
  },
  {
    classId: "priest",
    intro:
      "Healing is the stable role and the easiest way into groups. Shadow is the solo spec — it wants hit gear before it feels good.",
    specs: [
      {
        id: "holy",
        name: "Holy",
        role: "Healer",
        summary:
          "Healers are always in demand. Spell power, spirit, and the cheap trinkets carry you through pre-raid and into MC.",
        picks: [
          { slot: "Head", itemId: "whitemane-chapeau" },
          { slot: "Chest", itemId: "robe-of-the-archmage" },
          { slot: "Staff", itemId: "staff-of-the-shadow-flame", note: "BWL caster staff; a long-term healer upgrade." },
          { slot: "Neck", itemId: "choker-of-the-fire-lord" },
          { slot: "Trinket", itemId: "royal-seal" },
          { slot: "Trinket", itemId: "rejuvenating-gem" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
        ],
        farmOrder: [
          "Craft Robe of the Archmage; the rest of the set comes from quests.",
          "Finish Dire Maul for Royal Seal.",
          "MC for the Choker, BWL for the gem and staff.",
        ],
      },
      {
        id: "shadow",
        name: "Shadow",
        role: "DPS",
        summary:
          "Shadow is a solo and PvP spec first. Take the shared caster pieces, but do not outbid real healers in raids until you are committed.",
        picks: [
          { slot: "Head", itemId: "whitemane-chapeau" },
          { slot: "Staff", itemId: "staff-of-the-shadow-flame" },
          { slot: "Neck", itemId: "choker-of-the-fire-lord" },
          { slot: "Trinket", itemId: "neltharions-tear", note: "Spell hit trinket from Nefarian." },
          { slot: "Trinket", itemId: "royal-seal" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
        ],
        farmOrder: [
          "Grab Whitemane's Chapeau while leveling through SM.",
          "Dire Maul for Royal Seal.",
          "BWL for Neltharion's Tear and the staff.",
        ],
      },
    ],
  },
  {
    classId: "shaman",
    intro:
      "Enhancement is the solo spec; Restoration is the group spec. Totem placement wins more fights than any single item slot.",
    specs: [
      {
        id: "restoration",
        name: "Restoration",
        role: "Healer",
        summary:
          "Restoration shamans keep groups alive through messy pulls. Stack spell power and mana regen; the cloth caster list is shared with other healers.",
        picks: [
          { slot: "Head", itemId: "whitemane-chapeau" },
          { slot: "Chest", itemId: "robe-of-the-archmage" },
          { slot: "Staff", itemId: "staff-of-the-shadow-flame" },
          { slot: "Neck", itemId: "choker-of-the-fire-lord" },
          { slot: "Trinket", itemId: "royal-seal" },
          { slot: "Trinket", itemId: "rejuvenating-gem" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
        ],
        farmOrder: [
          "Craft Robe of the Archmage and grab the SM hat.",
          "Dire Maul for Royal Seal.",
          "MC/BWL for the neck, gem, and staff.",
        ],
      },
      {
        id: "enhancement",
        name: "Enhancement",
        role: "DPS",
        summary:
          "Enhancement is a burst and utility spec. Nightfall is a real group contribution — one per raid can be worth more than personal damage.",
        picks: [
          { slot: "Two-Hand", itemId: "nightfall", note: "Group-support two-hander; its proc boosts spell damage taken." },
          { slot: "Two-Hand (alt)", itemId: "arcanite-reaper" },
          { slot: "Hands", itemId: "devilsaur-gauntlets" },
          { slot: "Legs", itemId: "devilsaur-leggings" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
          { slot: "Trinket", itemId: "hand-of-justice" },
          { slot: "Trinket", itemId: "blackhands-breadth" },
          { slot: "Neck", itemId: "onyxia-tooth-pendant" },
        ],
        farmOrder: [
          "Craft Nightfall if your raid wants the debuff.",
          "Farm the Devilsaur set and Baron cape.",
          "BRD for Hand of Justice, then Onyxia for the pendant.",
        ],
      },
    ],
  },
  {
    classId: "warlock",
    intro:
      "Affliction levels and farms; Destruction raids. Shadow damage and spell hit are the only two stats that matter early.",
    specs: [
      {
        id: "affliction",
        name: "Affliction",
        role: "DPS",
        summary:
          "Affliction is the safest solo spec and a strong sustained-damage raid spec. Robe of the Void is the signature crafted piece.",
        picks: [
          { slot: "Chest", itemId: "robe-of-the-void" },
          { slot: "Staff", itemId: "staff-of-the-shadow-flame" },
          { slot: "Neck", itemId: "choker-of-the-fire-lord" },
          { slot: "Trinket", itemId: "neltharions-tear" },
          { slot: "Trinket", itemId: "royal-seal" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
        ],
        farmOrder: [
          "Craft Robe of the Void.",
          "Dire Maul for Royal Seal.",
          "MC for the Choker, BWL for tear and staff.",
        ],
      },
      {
        id: "destruction",
        name: "Destruction",
        role: "DPS",
        summary:
          "Destruction wants the same caster pieces as every other spell DPS. Take Azuresong Mageblade and the fire-friendly neck first.",
        picks: [
          { slot: "Main Hand", itemId: "azuresong-mageblade" },
          { slot: "Staff (alt)", itemId: "staff-of-the-shadow-flame" },
          { slot: "Neck", itemId: "choker-of-the-fire-lord" },
          { slot: "Trinket", itemId: "neltharions-tear" },
          { slot: "Trinket", itemId: "royal-seal" },
          { slot: "Chest", itemId: "robe-of-the-archmage" },
        ],
        farmOrder: [
          "Craft Robe of the Archmage for a quick spell damage boost.",
          "MC for Azuresong Mageblade and the Choker.",
          "BWL for Neltharion's Tear.",
        ],
      },
    ],
  },
  {
    classId: "druid",
    intro:
      "Feral and Restoration share almost no gear. Pick the role you will actually play at 60 before you vendor anything.",
    specs: [
      {
        id: "feral",
        name: "Feral",
        role: "DPS",
        summary:
          "Feral covers bear tanking and cat DPS in one spec. The Devilsaur set is the launch goal; trinkets and rings follow.",
        picks: [
          { slot: "Hands", itemId: "devilsaur-gauntlets" },
          { slot: "Legs", itemId: "devilsaur-leggings" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
          { slot: "Trinket", itemId: "blackhands-breadth" },
          { slot: "Trinket", itemId: "hand-of-justice" },
          { slot: "Neck", itemId: "onyxia-tooth-pendant" },
          { slot: "Ring", itemId: "band-of-accaria" },
        ],
        farmOrder: [
          "Craft the Devilsaur set first — it carries feral through 60.",
          "Farm UBRS and BRD for the crit trinket and HoJ.",
          "Onyxia and MC for the pendant and ring.",
        ],
      },
      {
        id: "restoration",
        name: "Restoration",
        role: "Healer",
        summary:
          "Restoration shares the cloth caster list with other healers. Innervate the healer who is actually drinking, and keep the cheap trinkets.",
        picks: [
          { slot: "Head", itemId: "whitemane-chapeau" },
          { slot: "Chest", itemId: "robe-of-the-archmage" },
          { slot: "Staff", itemId: "staff-of-the-shadow-flame" },
          { slot: "Neck", itemId: "choker-of-the-fire-lord" },
          { slot: "Trinket", itemId: "royal-seal" },
          { slot: "Trinket", itemId: "rejuvenating-gem" },
          { slot: "Back", itemId: "cape-of-the-black-baron" },
        ],
        farmOrder: [
          "Craft Robe of the Archmage and grab the SM hat.",
          "Dire Maul for Royal Seal.",
          "MC/BWL for the neck, gem, and staff.",
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
