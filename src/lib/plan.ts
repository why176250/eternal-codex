export type PlanKind = "talent" | "legacy";

export type SavedPlan = {
  url: string;
  className: string;
  level: number;
  points: number;
  budget?: number;
  savedAt: string;
};

export type PlanState = {
  talent?: SavedPlan;
  legacy?: SavedPlan;
};

export const PLAN_KEY = "ec_plan_v2";

function isPlan(value: unknown): value is SavedPlan {
  return Boolean(value && typeof value === "object" && "url" in value);
}

export function loadPlans(): PlanState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PLAN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PlanState;
      return {
        talent: isPlan(parsed.talent) ? parsed.talent : undefined,
        legacy: isPlan(parsed.legacy) ? parsed.legacy : undefined,
      };
    }
    // migrate the old single-slot plan
    const legacyRaw = window.localStorage.getItem("ec_plan_v1");
    if (!legacyRaw) return {};
    const old = JSON.parse(legacyRaw);
    if (!isPlan(old)) return {};
    const migrated: PlanState = { talent: old };
    window.localStorage.setItem(PLAN_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return {};
  }
}

export function savePlan(kind: PlanKind, plan: SavedPlan) {
  if (typeof window === "undefined") return;
  const current = loadPlans();
  current[kind] = plan;
  window.localStorage.setItem(PLAN_KEY, JSON.stringify(current));
}

export function clearPlan(kind: PlanKind) {
  if (typeof window === "undefined") return;
  const current = loadPlans();
  delete current[kind];
  window.localStorage.setItem(PLAN_KEY, JSON.stringify(current));
}
