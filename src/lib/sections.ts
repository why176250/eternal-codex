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
    blurb: "Talent plans, BiS targets, and legacy planning.",
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
    status: "live",
    summary:
      "All nine classes, three trees each. Allocate points and read rank text as you go.",
    bullets: [],
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
    slug: "legacy",
    label: "Legacy Planner",
    zh: "传承模拟",
    href: "/tools/legacy",
    status: "live",
    summary:
      "Three legacy trees, 65 earnable points, point gates and the 15/25/40/55 reward track.",
    bullets: [],
  },
  {
    slug: "class-popularity",
    label: "Class Popularity",
    zh: "职业热度",
    href: "/tools/class-popularity",
    status: "live",
    summary:
      "41,270 votes from the launch class poll, split by faction and ranked by share.",
    bullets: [],
  },
];

export const dataItems: SectionItem[] = [
  {
    slug: "dungeons",
    label: "Dungeon Data",
    zh: "副本资料",
    href: "/data/dungeons",
    status: "live",
    summary:
      "All 45 Forever dungeons, raids, and travel routes with level bands and locations.",
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
    status: "live",
    summary:
      "536 item sets grouped by class, with full piece lists.",
    bullets: [],
  },
  {
    slug: "abilities",
    label: "Class Abilities",
    zh: "职业技能",
    href: "/data/abilities",
    status: "live",
    summary:
      "Search 12,799 ability names by name and school, loaded on demand.",
    bullets: [],
  },
  {
    slug: "racials",
    label: "Racial Abilities",
    zh: "种族技能",
    href: "/data/racials",
    status: "live",
    summary:
      "Ten races, active and passive racials, including the Skyborn options.",
    bullets: [],
  },
  {
    slug: "vendors",
    label: "Vendor Favor",
    zh: "商人青睐",
    href: "/data/vendors",
    status: "live",
    summary:
      "320 profession recipes with reagent lists, grouped by profession.",
    bullets: [],
  },
  {
    slug: "hunter-pets",
    label: "Hunter Pets",
    zh: "猎人宠物",
    href: "/data/hunter-pets",
    status: "live",
    summary:
      "19 pet families and 623 tameable beasts with diets, modifiers, and speeds.",
    bullets: [],
  },
];
