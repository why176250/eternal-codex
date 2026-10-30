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
    slug: "tier-list",
    label: "Tier List Maker",
    zh: "梯度榜",
    href: "/tools/tier-list",
    status: "live",
    summary: "Rank specs, classes, races, and race + class pairs with drag, tap, or keyboard shortcuts.",
    bullets: [],
  },
  {
    slug: "class-wheel",
    label: "Class Wheel",
    zh: "职业转盘",
    href: "/tools/class-wheel",
    status: "live",
    summary: "Spin a nine-class wheel and let it pick your next class. Local-only fun.",
    bullets: [],
  },
  {
    slug: "builds",
    label: "Talent Hall",
    zh: "天赋大厅",
    href: "/tools/builds",
    status: "live",
    summary:
      "Starter talent builds you can open in the planner and adjust to your group.",
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
    slug: "map",
    label: "Map",
    zh: "地图",
    href: "/map",
    status: "live",
    summary: "901 places and 3,395 points of interest with coordinates.",
    bullets: [],
  },
  {
    slug: "transmog",
    label: "Transmog",
    zh: "幻化",
    href: "/transmog",
    status: "live",
    summary: "536 item sets with every piece linked to the item database.",
    bullets: [],
  },
  {
    slug: "dungeons",
    label: "Dungeon Data",
    zh: "副本资料",
    href: "/dungeons",
    status: "live",
    summary:
      "All 45 Forever dungeons, raids, and travel routes with level bands and locations.",
    bullets: [],
  },
  {
    slug: "items",
    label: "Item Database",
    zh: "物品库",
    href: "/items",
    status: "live",
    summary:
      "7,823 English-named Forever items with quality, item level, type, and slot filters.",
    bullets: [],
  },
  {
    slug: "spells",
    label: "Spellbook",
    zh: "法术书",
    href: "/spells",
    status: "live",
    summary:
      "31,928 spells and abilities, searchable by name and school.",
    bullets: [],
  },
  {
    slug: "races",
    label: "Races",
    zh: "种族",
    href: "/races",
    status: "live",
    summary:
      "Ten races, factions, and active/passive racial abilities.",
    bullets: [],
  },
  {
    slug: "quests",
    label: "Quest Database",
    zh: "任务库",
    href: "/quests",
    status: "live",
    summary:
      "401 quests with level, giver, zone, and side filters.",
    bullets: [],
  },
  {
    slug: "professions",
    label: "Profession Data",
    zh: "专业资料",
    href: "/professions",
    status: "live",
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
    slug: "patch-notes",
    label: "Patch Notes",
    zh: "更新日志",
    href: "/patch-notes",
    status: "live",
    summary: "Every WoW Forever beta build: buffs, nerfs, class changes, and Blizzard posts.",
    bullets: [],
  },
  {
    slug: "server-status",
    label: "Server Status",
    zh: "服务器状态",
    href: "/server-status",
    status: "live",
    summary: "Site and dataset coverage; realm uptime feed is not connected.",
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
