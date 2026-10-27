import json, os, re, subprocess

RAW = "data-import/scarlet/legacy.json"
OUT = "src/data/forever/legacy.json"
ICON_DIR = "public/legacy/icons"
os.makedirs(ICON_DIR, exist_ok=True)

raw = json.load(open(RAW))
trees = []
icons = set()

for tree in raw["tree"]["result"]["trees"]:
    nodes = []
    for n in tree["nodes"]:
        if n.get("nodeKind") == "placeholder":
            continue
        icon = re.sub(r"\.(jpg|png|tga)$", "", n.get("icon", "inv_misc_questionmark"), flags=re.I)
        icons.add(icon)
        nodes.append({
            "id": n.get("whNodeId"),
            "name": n.get("name") or "",
            "nameZh": n.get("nameCn") or "",
            "icon": icon,
            "maxRank": n.get("maxRank", 1),
            "gatePoints": n.get("gatePoints", 0),
            "row": n.get("gridRow", 1),
            "col": n.get("gridCol", 1),
            "descEn": n.get("descEn") or "",
            "descCn": n.get("descCn") or "",
            "descEnList": n.get("descEnList") or [],
            "descCnList": n.get("descCnList") or [],
            "cdMs": n.get("cdMs", 0),
            "castMs": n.get("castMs", 0),
        })
    nodes.sort(key=lambda x: (x["row"], x["col"]))
    tree_icon = re.sub(r"\.(jpg|png|tga)$", "", tree.get("icon", "inv_misc_questionmark"), flags=re.I)
    icons.add(tree_icon)
    trees.append({
        "ord": tree.get("ord"),
        "name": tree.get("treeEn"),
        "nameZh": tree.get("treeCn"),
        "sub": tree.get("subEn"),
        "subZh": tree.get("subCn"),
        "icon": tree_icon,
        "nodes": nodes,
    })

MILESTONE_NAMES = {
    277714: "Spectral Bear Cub",
    277717: "Spectral Bear Tabard",
    277718: "Reins of the Spectral Bear",
}

track = raw["track"]["result"]
milestones = []
for m in track["milestones"]:
    icon = re.sub(r"\.(jpg|png|tga)$", "", m.get("icon", "inv_misc_questionmark"), flags=re.I)
    milestones.append({
        "itemId": m.get("itemId"),
        "threshold": m.get("threshold"),
        "name": m.get("name") or MILESTONE_NAMES.get(m.get("itemId"), ""),
        "nameZh": m.get("nameCn") or "",
        "icon": icon,
        "quality": m.get("quality"),
    })
# track reward icons aren't tree nodes, still download
for m in milestones:
    icons.add(m["icon"])

achievements = raw["catalog"]["result"]["achievements"]
total_points = sum(a.get("points", 0) for a in achievements if a.get("points"))

data = {
    "totalPoints": total_points,
    "achievementCount": len(achievements),
    "pointName": track.get("pointName"),
    "trackName": track.get("name"),
    "trees": trees,
    "milestones": milestones,
}
json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

for icon in sorted(icons):
    dest = f"{ICON_DIR}/{icon}.jpg"
    if os.path.exists(dest) and os.path.getsize(dest) > 500:
        continue
    url = f"http://static.scarlet5.com/images/icons/itemLarge/{icon}.jpg"
    subprocess.run(["curl", "-s", "--max-time", "20", "-o", dest, url], check=False)

print(f"legacy: {len(trees)} trees, {sum(len(t['nodes']) for t in trees)} nodes, {total_points} points, {len(icons)} icons")
