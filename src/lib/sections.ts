export type SectionItem = {
  slug: string;
  label: string;
  zh: string;
  href: string;
  status: "live" | "planned";
  summary: string;
  bullets: string[];
};

export type Section = {
  id: "tools" | "guides" | "data";
  href: string;
  label: string;
  zh: string;
  blurb: string;
};

export const sections: Section[] = [
  {
    id: "tools",
    href: "/tools",
    label: "Tools",
    zh: "工具",
    blurb: "Talent plans, BiS targets, XP math, and legacy planning.",
  },
  {
    id: "guides",
    href: "/guides",
    label: "Guides",
    zh: "攻略",
    blurb: "Game guides, profession guides, and PvP.",
  },
  {
    id: "data",
    href: "/data",
    label: "Data",
    zh: "数据",
    blurb: "Dungeons, items, sets, abilities, racials, vendors, and pets.",
  },
];

export const toolItems: SectionItem[] = [
  {
    slug: "talents",
    label: "Talent Calculator",
    zh: "天赋模拟",
    href: "/tools/talents",
    status: "planned",
    summary:
      "Plan builds for all nine classes, compare dual-spec pairs, and share a build with a link.",
    bullets: [
      "Classic talent trees per class and spec, with Forever changes folded in as they are confirmed.",
      "Dual-spec pairing: one solo spec, one group spec, with a shared gear note.",
      "Shareable build links — no account required.",
    ],
  },
  {
    slug: "bis",
    label: "BiS Planner",
    zh: "BiS 配装",
    href: "/bis",
    status: "live",
    summary:
      "Per-class, per-spec checklists of the upgrades worth farming first, with sources and farm order.",
    bullets: [],
  },
  {
    slug: "xp",
    label: "XP Calculator",
    zh: "经验计算器",
    href: "/tools/xp",
    status: "live",
    summary:
      "Kills, elite kills, and quests needed to reach the next level, with rested XP and well-fed bonuses.",
    bullets: [],
  },
  {
    slug: "legacy",
    label: "Legacy Planner",
    zh: "传承模拟",
    href: "/tools/legacy",
    status: "planned",
    summary:
      "A planner for the legacy progression system, so you can compare upgrade paths before committing.",
    bullets: [
      "We are waiting for confirmed in-game values before publishing a simulator.",
      "Once live: point costs, breakpoints, and a path comparison.",
      "Until then, the guides cover the decisions we can verify.",
    ],
  },
];

export const dataItems: SectionItem[] = [
  {
    slug: "dungeons",
    label: "Dungeon Data",
    zh: "副本资料",
    href: "/dungeons",
    status: "live",
    summary:
      "Level bands, purpose, and verified drops for all 26 dungeons and raids.",
    bullets: [],
  },
  {
    slug: "items",
    label: "Item Database",
    zh: "装备数据",
    href: "/database",
    status: "live",
    summary:
      "35 pre-raid and early-raid items with slot, quality, source, and phase filters.",
    bullets: [],
  },
  {
    slug: "professions",
    label: "Profession Data",
    zh: "专业资料",
    href: "/data/professions",
    status: "planned",
    summary:
      "Recipe database, trainer locations, skill-up paths, and profit per craft.",
    bullets: [
      "Every recipe by profession and phase, with material costs.",
      "Trainer and vendor locations for recipes that are not trainer-taught.",
      "Which crafts actually sell in week one, and which are traps.",
    ],
  },
  {
    slug: "sets",
    label: "Set Data",
    zh: "套装资料",
    href: "/data/sets",
    status: "planned",
    summary:
      "Dungeon sets, tier sets, and set bonuses by class and phase.",
    bullets: [
      "Dungeon set pieces and where each piece drops.",
      "Tier set bonuses, with the breakpoints that matter.",
      "Which sets are worth chasing before raid gear replaces them.",
    ],
  },
  {
    slug: "abilities",
    label: "Class Abilities",
    zh: "职业技能",
    href: "/data/abilities",
    status: "planned",
    summary:
      "Every class ability, rank, and trainer level, filterable by class and spec.",
    bullets: [
      "Ability ranks, trainer levels, and mana costs.",
      "Forever-specific changes flagged against the Classic baseline.",
      "Cross-links to the class overviews and BiS checklists.",
    ],
  },
  {
    slug: "racials",
    label: "Racial Abilities",
    zh: "种族技能",
    href: "/data/racials",
    status: "planned",
    summary:
      "Racial abilities by race and faction, with PvE and PvP notes.",
    bullets: [
      "Every racial, its cooldown, and the situations it wins.",
      "Faction and class-combination availability.",
      "Forever's new race options, added once confirmed in-game.",
    ],
  },
  {
    slug: "vendors",
    label: "Vendor Favor",
    zh: "商人青睐",
    href: "/data/vendors",
    status: "planned",
    summary:
      "Vendor reputation rewards, faction favor, and what each reputation is actually worth.",
    bullets: [
      "Reputation vendors and their reward lists.",
      "The grind length versus the reward quality.",
      "Which reputations are worth starting before 60.",
    ],
  },
  {
    slug: "hunter-pets",
    label: "Hunter Pets",
    zh: "猎人宠物",
    href: "/data/hunter-pets",
    status: "planned",
    summary:
      "Pet families, diets, attack speeds, and where to tame them.",
    bullets: [
      "Family-by-family diet and damage profile.",
      "Rare tame locations and spawn notes.",
      "Which pets are worth the detour while leveling.",
    ],
  },
];
