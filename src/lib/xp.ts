/**
 * Classic / Forever experience table.
 * Values are XP required to advance FROM the given level (1-59).
 * Sum of levels 1-59 = 4,084,700, matching the Forever/Classic total.
 */
export const LEVEL_XP: number[] = [
  400, 900, 1400, 2100, 2800, 3600, 4500, 5400, 6500, 7600, 8800, 10100,
  11400, 12900, 14400, 16000, 17700, 19400, 21300, 23200, 25200, 27300, 29400,
  31700, 34000, 36400, 38900, 41400, 44300, 47400, 50800, 54500, 58600, 62800,
  67100, 71600, 76100, 80800, 85700, 90700, 95800, 101000, 106300, 111800,
  117500, 123200, 129100, 135100, 141200, 147500, 153900, 160400, 167100,
  173900, 180800, 187900, 195000, 202300, 209800,
];

export const MAX_LEVEL = 60;

export function xpToNext(level: number): number {
  if (level >= MAX_LEVEL) return 0;
  return LEVEL_XP[Math.max(1, Math.min(level, MAX_LEVEL - 1)) - 1];
}

/** Total XP required to reach `level` from level 1. */
export function totalXpTo(level: number): number {
  const target = Math.max(1, Math.min(level, MAX_LEVEL));
  let total = 0;
  for (let l = 1; l < target; l++) total += xpToNext(l);
  return total;
}

/** Grey level: mobs at or below this level give no XP. */
function greyLevel(playerLevel: number): number {
  if (playerLevel < 6) return 0;
  if (playerLevel < 40) return playerLevel - 5 - Math.floor(playerLevel / 10);
  return playerLevel - 1 - Math.floor(playerLevel / 5);
}

/** Zero-difference table used by the Classic mob XP formula. */
function zeroDifference(playerLevel: number): number {
  if (playerLevel < 8) return 5;
  if (playerLevel < 10) return 6;
  if (playerLevel < 12) return 7;
  if (playerLevel < 16) return 8;
  if (playerLevel < 20) return 9;
  if (playerLevel < 40) return 9 + Math.floor(playerLevel / 10);
  return 5 + Math.floor(playerLevel / 5);
}

/**
 * Classic mob XP. For lower-level mobs the base is the PLAYER level
 * (not the mob level), which was the main bug in the old calculator.
 */
export function mobXp(playerLevel: number, mobLevel: number): number {
  const p = Math.max(1, Math.min(playerLevel, MAX_LEVEL));
  const m = Math.max(1, Math.min(mobLevel, MAX_LEVEL));

  if (m >= p) {
    return Math.round((p * 5 + 45) * (1 + 0.05 * (m - p)));
  }

  const grey = greyLevel(p);
  if (m <= grey) return 0;

  const zd = zeroDifference(p);
  return Math.round((p * 5 + 45) * (1 - (p - m) / zd));
}

export function eliteXp(playerLevel: number, mobLevel: number): number {
  return mobXp(playerLevel, mobLevel) * 2;
}

export function killsNeeded(remaining: number, perKill: number): number {
  if (remaining <= 0) return 0;
  if (perKill <= 0) return Infinity;
  return Math.ceil(remaining / perKill);
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

export function formatDuration(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "—";
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}
