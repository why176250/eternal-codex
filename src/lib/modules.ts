export type Module = {
  id: string;
  number: string;
  title: string;
  zh: string;
  href: string;
  question: string;
  body: string;
  tagline: string;
  accent: string;
};

export const modules: Module[] = [
  {
    id: "talents",
    number: "01",
    title: "Build planner",
    zh: "天赋 · 传承模拟",
    href: "/tools/build",
    question: "Talent and legacy points, planned.",
    body: "Nine talent trees, three legacy trees, share links.",
    accent: "#6fd5c5",
    tagline: "Talents + legacy",
  },
  {
    id: "gear",
    number: "02",
    title: "Gear plan",
    zh: "装备计划",
    href: "/bis",
    question: "What should I farm first?",
    body: "Level 30 best-in-slot gear for all nine classes, with enchants, stats, and alternatives.",
    accent: "#9bb7ff",
    tagline: "All-class BiS",
  },
  {
    id: "classes",
    number: "03",
    title: "Class guides",
    zh: "职业攻略",
    href: "/classes",
    question: "Which class fits how you actually play?",
    body: "Nine overviews: leveling feel, group demand, and the level-40 second spec.",
    accent: "#e0b477",
    tagline: "28 spec guides",
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
    tagline: "Level bands & drops",
  },
  {
    id: "professions",
    number: "05",
    title: "Professions",
    zh: "专业与金币",
    href: "/professions",
    question: "Which professions should you pair?",
    body: "Pairings, crafting paths, and the recipe data behind the crafts.",
    accent: "#c9a8ff",
    tagline: "Pairings & recipes",
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
    tagline: "1–60 XP math",
  },
];
