import talentsJson from "@/data/forever/talents.json";

export type ClassChange = {
  name: string;
  tree: string;
  status: "new" | "changed";
  description: string;
  maxRanks: number;
};

export function getClassChanges(className: string): ClassChange[] {
  const entry = talentsJson.find((c) => c.className === className);
  if (!entry) return [];

  const changes: ClassChange[] = [];
  for (const tree of entry.trees) {
    for (const talent of tree.talents) {
      if (talent.classicStatus !== "new" && talent.classicStatus !== "changed") {
        continue;
      }
      const rank = talent.ranks?.[talent.ranks.length - 1];
      changes.push({
        name: talent.nameEn || talent.name,
        tree: tree.nameEn || tree.name,
        status: talent.classicStatus,
        description: rank?.en || rank?.zh || "",
        maxRanks: talent.maxRanks,
      });
    }
  }

  const newTalents = changes.filter((change) => change.status === "new");
  const changedTalents = changes.filter((change) => change.status === "changed");
  const picked = [
    ...newTalents.slice(0, 4),
    ...changedTalents.slice(0, 4),
  ];
  if (picked.length < 8) {
    const rest = [...newTalents, ...changedTalents].filter(
      (change) => !picked.includes(change),
    );
    picked.push(...rest.slice(0, 8 - picked.length));
  }
  return picked;
}
