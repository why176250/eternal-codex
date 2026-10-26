import json, os

SRC = "data-import"
OUT = "src/data/forever"
os.makedirs(OUT, exist_ok=True)

def load(name):
    with open(os.path.join(SRC, name), encoding="utf-8") as f:
        return json.load(f)

def dump(name, data):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

dungeons = [
    {"id": d["id"], "name": d["name"], "nameZh": d.get("nameZh", ""), "abbr": d.get("abbr", ""),
     "band": d.get("band", ""), "min": d.get("min", 0), "max": d.get("max", 0),
     "type": d.get("type", "Dungeon"), "location": d.get("location", ""), "side": d.get("side", ""),
     "note": d.get("note", ""), "desc": d.get("desc", ""), "icon": d.get("icon") or "",
     "isNew": bool(d.get("isNew"))}
    for d in load("dungeons.json")
]
dump("dungeons.json", dungeons)

sets = [
    {"id": s["id"], "name": s["name"], "class": s.get("class", ""),
     "itemCount": s.get("itemCount", len(s.get("items", []))),
     "items": [{"id": i["id"], "name": i["name"], "icon": i.get("icon") or ""} for i in s.get("items", [])]}
    for s in load("itemsets.json")
]
sets.sort(key=lambda s: (s["class"], s["name"]))
dump("sets.json", sets)

racials = [
    {"raceId": r["raceId"], "key": r["key"], "raceZh": r["raceZh"], "faction": r["faction"],
     "factionZh": r["factionZh"], "raceIcon": r.get("raceIcon", ""), "classIds": r.get("classIds", []),
     "abilities": [{"type": a.get("type", ""), "name": a.get("name", ""), "sid": a.get("sid"),
                    "icon": a.get("icon", ""), "info": a.get("info", ""), "desc": a.get("desc", "")}
                   for a in r.get("abilities", [])]}
    for r in load("racials.json")
]
dump("racials.json", racials)

vendors = [
    {"id": v["id"], "name": v["n"], "quality": v.get("q"), "profession": v.get("p", ""),
     "icon": v.get("ic", ""),
     "reagents": [{"id": r["id"], "name": r["n"], "count": r.get("ct", 1), "icon": r.get("ic", "")}
                  for r in v.get("r", [])]}
    for v in load("commerce.json")
]
dump("vendors.json", vendors)

pets = load("hunter-pets.json")
families = [
    {"slug": f["slug"], "name": f["name"], "icon": f.get("icon", ""), "dmgMod": f.get("dmg_mod"),
     "armorMod": f.get("armor_mod"), "hpMod": f.get("hp_mod"), "diet": f.get("diet", ""),
     "fastestSpeed": f.get("fastest_speed", ""), "fastestName": f.get("fastest_name", ""),
     "fastestLevel": f.get("fastest_level"), "isNew": bool(f.get("is_new")),
     "abilities": [{"name": a.get("name", ""), "rank": a.get("rank"), "meta": a.get("meta", ""),
                    "text": a.get("text", ""), "source": a.get("source", ""),
                    "spellId": a.get("spell_id"), "icon": a.get("icon", "")}
                   for a in f.get("abilities", [])]}
    for f in pets["families"]
]
beasts = [
    {"id": b["id"], "key": b.get("key", ""), "name": b.get("name", ""), "nameZh": b.get("name_zh", ""),
     "family": b.get("family", ""), "levelMin": b.get("level_min"), "levelMax": b.get("level_max"),
     "speed": b.get("speed"), "zones": b.get("zones", ""), "isNew": bool(b.get("is_new"))}
    for b in pets["beasts"]
]
dump("pets.json", {"families": families, "beasts": beasts, "speeds": pets.get("speeds", [])})

t = load("talents.json")
CLASS_NAMES = {"1": ("Warrior", "战士"), "2": ("Paladin", "圣骑士"), "3": ("Hunter", "猎人"),
               "4": ("Rogue", "盗贼"), "5": ("Priest", "牧师"), "7": ("Shaman", "萨满"),
               "8": ("Mage", "法师"), "9": ("Warlock", "术士"), "11": ("Druid", "德鲁伊")}
classes = []
for cid, data in t.items():
    en, zh = CLASS_NAMES.get(str(cid), (f"Class {cid}", f"职业 {cid}"))
    trees = []
    for tree in data["trees"]:
        talents = [{"id": tal["id"], "name": tal.get("name", ""), "nameEn": tal.get("name_en", ""),
                    "icon": tal.get("icon", ""), "maxRanks": tal.get("maxRanks", 0),
                    "tierId": tal.get("tierId", 0), "colIndex": tal.get("colIndex", 0),
                    "reqText": tal.get("reqText", ""), "note": tal.get("note", ""),
                    "classicStatus": tal.get("classic_status", ""),
                    "ranks": [{"zh": r.get("textZh", ""), "en": r.get("textEn", "")} for r in tal.get("ranks", [])]}
                   for tal in tree["talents"]]
        trees.append({"tabId": tree["tabId"], "name": tree.get("name", ""), "nameEn": tree.get("name_en", ""),
                      "icon": tree.get("icon", ""), "talents": talents})
    classes.append({"classId": int(cid), "className": en, "nameZh": zh, "trees": trees})
classes.sort(key=lambda c: c["classId"])
dump("talents.json", classes)

print("dungeons", len(dungeons), "sets", len(sets), "racials", len(racials),
      "vendors", len(vendors), "families", len(families), "beasts", len(beasts),
      "talent classes", len(classes))
for name in sorted(os.listdir(OUT)):
    print(name, os.path.getsize(os.path.join(OUT, name)) // 1024, "KB")
