import { foreverTalents } from "@/data/forever/wow-talents";

/** Returns true when every selected point survives the planner's tier/prereq rules. */
export function isPlannerValid(
  classId: number,
  selections: Record<string, number> | undefined,
): boolean {
  if (!selections) return false;
  const wowClass = foreverTalents.find((entry) => entry.classId === classId);
  if (!wowClass) return false;

  const points: Record<number, number> = {};
  for (const [id, rank] of Object.entries(selections)) {
    points[Number(id)] = rank;
  }
  const original = Object.values(points).reduce((sum, n) => sum + n, 0);

  let changed = true;
  while (changed) {
    changed = false;
    for (const tree of wowClass.trees) {
      let treeTotal = tree.talents.reduce((sum, talent) => sum + (points[talent.id] ?? 0), 0);
      for (const talent of tree.talents) {
        const value = points[talent.id] ?? 0;
        if (!value) continue;
        const tierNeed = 5 * (talent.tierId - 1);
        let valid = treeTotal >= tierNeed;
        if (valid && talent.prereqTalentId) {
          valid = (points[talent.prereqTalentId] ?? 0) >= (talent.prereqRank ?? 0);
        }
        if (!valid) {
          points[talent.id] = 0;
          treeTotal -= value;
          changed = true;
        }
      }
    }
  }

  return Object.values(points).reduce((sum, n) => sum + n, 0) === original;
}
