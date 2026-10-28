export const site = {
  name: "Eversixty",
  title: "Eversixty — A Forever launch companion",
  description:
    "Tools, guides, and data for the road to 60 in World of Warcraft: Forever. Six task-first modules: class guides, talent builds, gear checklists, dungeons, professions, and an XP calculator.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://eversixty.example"),
  launchWindow: "November 4, 2026",
  lastSeed: "2026-10-26",
};

export const nav = [
  { href: "/tools", label: "Tools" },
  { href: "/data", label: "Data" },
  { href: "/guides", label: "Guides" },
];

export const categories = [
  "Start Here",
  "Systems",
  "Leveling",
  "Classes",
  "Professions",
  "Endgame",
] as const;

export type Category = (typeof categories)[number];
