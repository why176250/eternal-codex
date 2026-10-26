export const site = {
  name: "Eternal Codex",
  title: "Eternal Codex — WoW Forever Guides & Database",
  description:
    "Launch-week guides, class breakdowns, dungeon reference, and a searchable item database for World of Warcraft: Forever. Written for the international realms.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://eternalcodex.example",
  launchWindow: "November 4, 2026",
  lastSeed: "2026-10-26",
};

export const nav = [
  { href: "/guides", label: "Guides" },
  { href: "/classes", label: "Classes" },
  { href: "/database", label: "Database" },
  { href: "/dungeons", label: "Dungeons" },
  { href: "/about", label: "About" },
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
