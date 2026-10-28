export type Role = "Tank" | "Healer" | "DPS" | "Flexible";
export type Pace = "Fast solo" | "Dungeon groups" | "Slow and steady";
export type Complexity = "Simple" | "Medium" | "High";
export type Priority = "Survivability" | "Group utility" | "Damage" | "Flexibility";
export type Faction = "Alliance" | "Horde" | "No preference";

export type QuizAnswers = {
  role: Role;
  pace: Pace;
  complexity: Complexity;
  priority: Priority;
  faction: Faction;
};

type ClassProfile = {
  id: string;
  name: string;
  roles: Role[];
  leveling: number; // 1 easy, 3 hard
  complexity: number; // 1 simple, 3 high
  races: Record<Exclude<Faction, "No preference">, string[]>;
};

const profiles: ClassProfile[] = [
  {
    id: "warrior",
    name: "Warrior",
    roles: ["Tank", "DPS"],
    leveling: 3,
    complexity: 2,
    races: { Alliance: ["Human", "Dwarf"], Horde: ["Orc", "Tauren"] },
  },
  {
    id: "paladin",
    name: "Paladin",
    roles: ["Healer", "Tank", "DPS"],
    leveling: 2,
    complexity: 2,
    races: { Alliance: ["Human", "Dwarf"], Horde: ["Blood Elf", "Tauren"] },
  },
  {
    id: "hunter",
    name: "Hunter",
    roles: ["DPS"],
    leveling: 1,
    complexity: 2,
    races: { Alliance: ["Night Elf", "Dwarf"], Horde: ["Orc", "Troll"] },
  },
  {
    id: "rogue",
    name: "Rogue",
    roles: ["DPS"],
    leveling: 2,
    complexity: 2,
    races: { Alliance: ["Human", "Night Elf"], Horde: ["Orc", "Troll"] },
  },
  {
    id: "priest",
    name: "Priest",
    roles: ["Healer", "DPS"],
    leveling: 2,
    complexity: 2,
    races: { Alliance: ["Dwarf", "Human"], Horde: ["Undead", "Troll"] },
  },
  {
    id: "shaman",
    name: "Shaman",
    roles: ["Healer", "DPS"],
    leveling: 2,
    complexity: 2,
    races: { Alliance: ["Draenei"], Horde: ["Orc", "Troll", "Tauren"] },
  },
  {
    id: "mage",
    name: "Mage",
    roles: ["DPS"],
    leveling: 2,
    complexity: 2,
    races: { Alliance: ["Gnome", "Human"], Horde: ["Undead", "Troll"] },
  },
  {
    id: "warlock",
    name: "Warlock",
    roles: ["DPS"],
    leveling: 2,
    complexity: 2,
    races: { Alliance: ["Gnome", "Human"], Horde: ["Orc", "Undead"] },
  },
  {
    id: "druid",
    name: "Druid",
    roles: ["Tank", "Healer", "DPS"],
    leveling: 2,
    complexity: 3,
    races: { Alliance: ["Night Elf"], Horde: ["Tauren", "Troll"] },
  },
];

export type ClassMatch = {
  id: string;
  name: string;
  roles: Role[];
  score: number;
  match: number;
  races: string[];
  reasons: string[];
};

function scoreClass(profile: ClassProfile, answers: QuizAnswers) {
  let score = 0;
  const reasons: string[] = [];

  if (answers.role === "Flexible") {
    if (profile.roles.length > 1) {
      score += 5;
      reasons.push("Can cover more than one role");
    }
  } else if (profile.roles.includes(answers.role)) {
    score += 6;
    reasons.push(`Fits your ${answers.role} preference`);
  }

  if (answers.pace === "Fast solo") {
    score += Math.max(0, 4 - profile.leveling) * 2;
    if (profile.leveling === 1) reasons.push("One of the smoothest solo levelers");
  } else if (answers.pace === "Dungeon groups") {
    if (profile.roles.includes("Tank") || profile.roles.includes("Healer")) {
      score += 5;
      reasons.push("Strong dungeon group demand");
    }
  } else {
    score += profile.leveling === 3 ? 3 : 1;
    if (profile.leveling >= 2) reasons.push("Rewards a slower, steady pace");
  }

  if (answers.complexity === "Simple") {
    score += Math.max(0, 4 - profile.complexity) * 2;
    if (profile.complexity === 1) reasons.push("Easy to pick up");
  } else if (answers.complexity === "High") {
    score += profile.complexity * 2;
    if (profile.complexity === 3) reasons.push("High skill ceiling");
  } else {
    score += 2;
  }

  if (answers.priority === "Survivability") {
    if (profile.roles.includes("Tank")) {
      score += 3;
      reasons.push("Built to survive the front line");
    }
  } else if (answers.priority === "Group utility") {
    if (profile.roles.includes("Healer") || profile.roles.includes("Tank")) {
      score += 3;
      reasons.push("Brings group utility");
    }
  } else if (answers.priority === "Damage") {
    if (profile.roles.includes("DPS")) {
      score += 2;
      reasons.push("Damage is the core job");
    }
  } else if (profile.roles.length > 2) {
    score += 4;
    reasons.push("Can switch between several roles");
  }

  return { score, reasons };
}

export function recommendClasses(answers: QuizAnswers): ClassMatch[] {
  const ranked = profiles
    .map((profile) => {
      const { score, reasons } = scoreClass(profile, answers);
      const faction = answers.faction === "No preference" ? "Alliance" : answers.faction;
      const races =
        answers.faction === "No preference"
          ? [...new Set([...profile.races.Alliance, ...profile.races.Horde])]
          : profile.races[faction];
      return {
        id: profile.id,
        name: profile.name,
        roles: profile.roles,
        score,
        match: Math.min(98, 55 + score * 2),
        races,
        reasons: [...new Set(reasons)].slice(0, 3),
      };
    })
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, 3);
}
