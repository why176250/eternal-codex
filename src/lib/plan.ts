export type SavedPlan = {
  url: string;
  className: string;
  level: number;
  points: number;
  savedAt: string;
};

export const PLAN_KEY = "ec_plan_v1";

export function loadPlan(): SavedPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PLAN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedPlan;
    if (!parsed?.url) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePlan(plan: SavedPlan) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
}

export function clearPlan() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PLAN_KEY);
}
