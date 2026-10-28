export type Module = {
  id: string;
  number: string;
  title: string;
  zh: string;
  href: string;
  question: string;
  body: string;
  accent: string;
};

export const modules: Module[] = [
  {
    id: "start",
    number: "01",
    title: "Start here",
    zh: "开服规划",
    href: "/start",
    question: "Which ruleset, faction, and first route?",
    body: "Decide the choices you cannot undo, then get a 1–20 route that survives launch week.",
    accent: "#e3bd78",
  },
  {
    id: "talents",
    number: "02",
    title: "Build planner",
    zh: "天赋 · 传承模拟",
    href: "/tools/build",
    question: "Talent and legacy points, planned.",
    body: "Nine talent trees, three legacy trees, share links.",
    accent: "#6fd5c5",
  },
  {
    id: "gear",
    number: "03",
    title: "Gear plan",
    zh: "装备计划",
    href: "/bis",
    question: "What should I farm first?",
    body: "Per-spec checklists with sources and farm order, instead of a 16-slot wall of guesses.",
    accent: "#9bb7ff",
  },
  {
    id: "dungeons",
    number: "04",
    title: "Dungeons & loot",
    zh: "副本掉落",
    href: "/dungeons",
    question: "Which instance, and what does it drop?",
    body: "The leveling ladder, level bands, and the loot each stop is actually for.",
    accent: "#f0a868",
  },
  {
    id: "professions",
    number: "05",
    title: "Professions & gold",
    zh: "专业与金币",
    href: "/guides/professions",
    question: "Which professions, and what sells?",
    body: "Pairings, first-week gold, and the recipe data behind the crafts.",
    accent: "#c9a8ff",
  },
  {
    id: "xp",
    number: "06",
    title: "Experience calculator",
    zh: "经验计算器",
    href: "/tools/xp",
    question: "How long until the next level?",
    body: "Exact 1–60 XP table, kills per mob level, rested XP, and time to 60.",
    accent: "#8fe0c0",
  },
];
