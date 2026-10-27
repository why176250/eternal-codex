export const site = {
  name: "Eternal Codex",
  title: "Eternal Codex — Forever launch companion",
  description:
    "Six task-first modules for World of Warcraft: Forever: start plan, talent builds, gear checklists, dungeons, professions, and addons. Written for the international realms.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://eternalcodex.example"),
  launchWindow: "November 4, 2026",
  lastSeed: "2026-10-26",
};

export const nav = [
  { href: "/start", label: "Play" },
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
