import fs from "node:fs/promises";

const BASE = "https://wowforever.wclbox.com";
const OUT = "src/data/wcl-patch-notes.json";

const page = await fetch(`${BASE}/en/buding`, { headers: { "User-Agent": "Mozilla/5.0" } });
if (!page.ok) throw new Error(`page ${page.status}`);
const html = await page.text();
const latestBox = parseLatestBox(html);
const revision = html.match(/r-\d{10,}/)?.[0];
if (!revision) throw new Error("data revision not found");
const response = await fetch(`${BASE}/_shuju/${revision}/en/buding.json`, { headers: { "User-Agent": "Mozilla/5.0" } });
if (!response.ok) throw new Error(`json ${response.status}`);
const raw = await response.json();

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function dateLabel(value) {
  const d = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return `${month[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
function countText(n, singular, plural = `${singular}s`) {
  return `${n} ${n === 1 ? singular : plural}`;
}
function parseLatestBox(source) {
  const box = source.match(/bd-latest[\s\S]*?<ul>([\s\S]*?)<\/ul>/)?.[1] ?? "";
  const items = [...box.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((match) => match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  const value = (re) => Number(items.join(" ").match(re)?.[1] ?? 0);
  const date = source.match(/bd-latest-date[\s\S]*?<a[^>]*>([^<]+)<\/a>/)?.[1]?.trim() ?? "";
  const build = source.match(/bd-latest-date[\s\S]*?href="#([^"]+)"/)?.[1] ?? "";
  return {
    displayDate: date,
    build,
    buffs: value(/(\d+)\s+buffs?/i),
    nerfs: value(/(\d+)\s+nerfs?/i),
    otherChanges: value(/(\d+)\s+other changes/i),
    talentTreeChanges: value(/(\d+)\s+talent tree changes/i),
    newItems: value(/(\d+)\s+new items/i),
    changedItems: value(/(\d+)\s+changed items/i),
  };
}
function groupFrom(entry) {
  const changes = (entry.specs ?? []).flatMap((spec) => (spec.changes ?? []).map((change) => ({ ...change, spec: spec.name })));
  const entries = changes.map((change) => ({
    name: change.name,
    status: change.kind === "buff" ? "Buff" : change.kind === "nerf" ? "Nerf" : "",
    delta: (change.fields ?? []).map((field) => `${field.from} → ${field.to}`).join(" · "),
    desc: change.now || change.was || "",
  }));
  return {
    name: entry.name,
    line: changes.slice(0, 4).map((change) => change.name).join(", "),
    counts: [
      ...(entry.counts?.buff ? [{ cls: "is-buff", text: `${entry.counts.buff} buff` }] : []),
      ...(entry.counts?.nerf ? [{ cls: "is-nerf", text: `${entry.counts.nerf} nerf` }] : []),
      ...(entry.counts?.change ? [{ cls: "is-change", text: `${entry.counts.change} change${entry.counts.change === 1 ? "" : "s"}` }] : []),
    ],
    entries,
  };
}

const builds = (raw.builds ?? []).map((build) => {
  const groups = [...(build.classes ?? []), ...(build.races ?? [])].map(groupFrom);
  const changes = groups.flatMap((group) => group.entries);
  const allCountSources = [...(build.classes ?? []), ...(build.races ?? [])];
  const buffs = allCountSources.reduce((sum, entry) => sum + (entry.counts?.buff ?? 0), 0);
  const nerfs = allCountSources.reduce((sum, entry) => sum + (entry.counts?.nerf ?? 0), 0);
  const otherChanges = allCountSources.reduce((sum, entry) => sum + (entry.counts?.change ?? 0), 0);
  const talentChanges = (build.classes ?? []).flatMap((c) => c.specs ?? []).flatMap((s) => s.changes ?? []).filter((c) => String(c.href ?? "").includes("/tianfu")).length;
  const newItems = build.items?.new?.length ?? 0;
  if (newItems) {
    groups.push({ name: "Items", line: "New and changed items", counts: [{ cls: "is-items", text: `${newItems} new` }], entries: (build.items.new ?? []).slice(0, 80).map((item) => ({ name: item.n, status: "", delta: "", desc: "" })) });
  }
  const summary = `${countText(build.classes?.length ?? 0, "class", "classes")} and ${countText(build.races?.length ?? 0, "race", "races")} changed spells and talents; ${countText(newItems, "new item", "new items")}.`;
  return {
    date: build.date,
    dateLabel: dateLabel(build.date),
    build: `Build ${build.version}`,
    tag: build.current ? "Current" : "Beta",
    isCurrent: Boolean(build.current),
    summary,
    groups,
    counts: { buffs, nerfs, changes: otherChanges, talentChanges, newItems, changedItems: 0 },
  };
});

const current = builds.find((build) => build.isCurrent) ?? builds[0];
const latest = current ? {
  items: [
    { cls: "is-buff", text: countText(current.counts.buffs, "buff") },
    { cls: "is-nerf", text: countText(current.counts.nerfs, "nerf") },
    { cls: "is-change", text: countText(current.counts.changes, "other change") },
    { cls: "is-items", text: countText(current.counts.talentChanges, "talent tree change") },
    { cls: "is-items", text: countText(current.counts.newItems, "new item") },
    { cls: "is-items", text: countText(current.counts.changedItems, "changed item") },
  ],
} : { items: [] };

const bluePosts = (raw.bluePosts ?? []).map((post) => ({
  id: `blue-post-${post.id}`,
  date: post.date,
  dateLabel: post.date?.slice(0, 10).replaceAll("-", ".") ?? "",
  author: post.role || post.author || "Blizzard",
  title: post.topic || "",
  url: post.url || "",
  paras: String(post.text || "").split(/\n{2,}/).map((part) => part.trim()).filter(Boolean),
}));

const next = { latest, bluePosts, builds };
const balance = {
  date: current?.date ?? "",
  displayDate: latestBox.displayDate,
  displayDateZh: current?.date ? `${current.date.slice(0, 4)}年${current.date.slice(5, 7)}月${current.date.slice(8, 10)}日` : "",
  build: latestBox.build,
  buffs: latestBox.buffs,
  nerfs: latestBox.nerfs,
  otherChanges: latestBox.otherChanges,
  talentTreeChanges: latestBox.talentTreeChanges,
  newItems: latestBox.newItems,
  changedItems: latestBox.changedItems,
};
const text = JSON.stringify(next, null, 2) + "\n";
const balanceText = JSON.stringify(balance, null, 2) + "\n";
let previous = "";
let previousBalance = "";
try { previous = await fs.readFile(OUT, "utf8"); } catch {}
try { previousBalance = await fs.readFile("src/data/balance-latest.json", "utf8"); } catch {}
let changed = false;
if (previous !== text) { await fs.writeFile(OUT, text); changed = true; }
if (previousBalance !== balanceText) { await fs.writeFile("src/data/balance-latest.json", balanceText); changed = true; }
if (!changed) console.log("No changes");
else console.log(`Updated ${builds.length} builds, ${bluePosts.length} blue posts, current ${current?.build}, latest ${balance.displayDate}`);
