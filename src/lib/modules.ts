export type Module = {
  id: string;
  number: string;
  title: string;
  zh: string;
  href: string;
  question: string;
  body: string;
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
  },
  {
    id: "talents",
    number: "02",
    title: "Build planner",
    zh: "天赋 · 传承模拟",
    href: "/tools",
    question: "Where do these 51 points go — and what comes after?",
    body: "Talent trees with prerequisites and share links, plus the legacy progression stage in the same block.",
  },
  {
    id: "gear",
    number: "03",
    title: "Gear plan",
    zh: "装备计划",
    href: "/bis",
    question: "What should I farm first?",
    body: "Per-spec checklists with sources and farm order, instead of a 16-slot wall of guesses.",
  },
  {
    id: "dungeons",
    number: "04",
    title: "Dungeons & loot",
    zh: "副本掉落",
    href: "/dungeons",
    question: "Which instance, and what does it drop?",
    body: "The leveling ladder, level bands, and the loot each stop is actually for.",
  },
  {
    id: "professions",
    number: "05",
    title: "Professions & gold",
    zh: "专业与金币",
    href: "/guides/professions",
    question: "Which professions, and what sells?",
    body: "Pairings, first-week gold, and the recipe data behind the crafts.",
  },
  {
    id: "addons",
    number: "06",
    title: "Addons & UI",
    zh: "插件与界面",
    href: "/guides/addons-launch-stack",
    question: "What do I install before launch?",
    body: "A minimal addon stack, compatibility checks, and the launch-day fallback.",
  },
];
