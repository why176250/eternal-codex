/** XP required to reach the next level, indexed by current level (1-59). */
export const LEVEL_XP: number[] = [
  0, 400, 900, 1400, 2100, 2800, 3600, 4500, 5400, 6500, 7600, 8800, 10100,
  11400, 12900, 14400, 16000, 17700, 19400, 21300, 23200, 25200, 27300, 29400,
  31700, 34000, 36400, 38900, 41400, 44300, 47400, 50800, 54500, 58600, 62800,
  67100, 71600, 76100, 80800, 85600, 90400, 95300, 100200, 105100, 110100,
  115100, 120100, 125100, 130100, 135100, 140200, 145300, 150400, 155500,
  160600, 165700, 170800, 175900, 181000, 186100,
];

export const MAX_LEVEL = 60;

export function xpToNext(level: number): number {
  if (level >= MAX_LEVEL) return 0;
  return LEVEL_XP[Math.max(1, Math.min(level, MAX_LEVEL - 1))];
}

/** Zero-difference approximation used by the Classic curve. */
function zeroDifference(level: number): number {
  return Math.floor(level / 3) + 1;
}

export function mobXp(playerLevel: number, mobLevel: number): number {
  const p = Math.max(1, Math.min(playerLevel, MAX_LEVEL));
  const m = Math.max(1, Math.min(mobLevel, MAX_LEVEL));

  if (m >= p) {
    return Math.round((45 + 5 * p) * (1 + 0.05 * (m - p)));
  }

  const zd = zeroDifference(p);
  const factor = Math.max(0, (zd - (p - m)) / zd);
  return Math.round((45 + 5 * m) * factor);
}

export function eliteXp(playerLevel: number, mobLevel: number): number {
  return mobXp(playerLevel, mobLevel) * 2;
}

/**
 * Typical quest XP by quest level, calibrated to the Classic table
 * (level 30 ≈ 2450, level 35 ≈ 2750, level 39 ≈ 3000).
 */
export function questXp(playerLevel: number, questLevel: number): number {
  const q = Math.max(1, Math.min(questLevel, MAX_LEVEL));
  const p = Math.max(1, Math.min(playerLevel, MAX_LEVEL));

  let base: number;
  if (q >= 29) {
    base = roundTo50((45 + 5 * q) * 12.5);
  } else {
    const factor = 1.6 + ((q - 1) * 10.9) / 27;
    base = roundTo50((45 + 5 * q) * factor);
  }

  // The Classic quest table plateaus at 37-38; keep those values exact.
  if (q === 37 || q === 38) base = 2850;

  if (p > q) {
    const diff = p - q;
    if (diff >= 10) base *= 0.1;
    else if (diff > 5) base *= 1 - 0.2 * (diff - 5);
  }

  return roundTo50(base);
}

function roundTo50(value: number): number {
  return Math.round(value / 50) * 50;
}

/**
 * Kills needed to reach the target. Rested XP doubles kill XP until the
 * rested pool is exhausted, so solve for the smallest kill count that closes
 * the gap instead of dividing once.
 */
export function killsNeeded(
  remaining: number,
  perKill: number,
  rested: number,
): number {
  if (remaining <= 0) return 0;
  if (perKill <= 0) return Infinity;

  const earned = (kills: number) =>
    kills * perKill + Math.min(rested, kills * perKill);

  let low = 0;
  let high = Math.ceil(remaining / perKill) + 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (earned(mid) >= remaining) high = mid;
    else low = mid + 1;
  }
  return low;
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
