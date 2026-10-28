#!/usr/bin/env python3
import json, re
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]
zh_guides = json.load(open(ROOT / "src/data/class-guides.json"))
en_guides = json.load(open(ROOT / "src/data/class-guides.en.json"))
spell = json.load(open(ROOT / "src/data/scarlet/spellbooks.json"))
talents = json.load(open(ROOT / "src/data/forever/talents.json"))
racials = json.load(open(ROOT / "src/data/scarlet/racials.json"))
class_racial = json.load(open(ROOT / "src/data/scarlet/class_racial.json"))
items = json.load(open(ROOT / "data-import/scarlet/items.json"))

refs = {}
en_names = set()

def add(zh, en, icon, desc="", source=""):
    if zh: refs.setdefault(str(zh).strip(), {"icon": icon, "description": desc, "source": source})
    if en: en_names.add(str(en).strip())

def walk(value):
    if isinstance(value, dict):
        zh = value.get("nameCn") or value.get("abilityNameCn")
        en = value.get("name") or value.get("abilityName")
        icon = value.get("icon")
        desc = value.get("descEn") or value.get("abilityDesc") or value.get("descCn") or value.get("abilityDescCn") or ""
        if zh and icon: add(zh, en, icon, desc)
        for v in value.values(): walk(v)
    elif isinstance(value, list):
        for v in value: walk(v)

for f in (spell, racials, class_racial): walk(f)
for c in talents:
    for t in c["trees"]:
        for x in t["talents"]:
            add(x.get("name"), x.get("nameEn"), x.get("icon"), "\n".join(r.get("en") or r.get("zh","") for r in x.get("ranks",[])))

for item in items:
    if item.get("name") and item.get("icon"):
        add(item["name"], None, item["icon"].replace(".jpg",""), "Item entry from the Forever database.", "item")

# profession icons/descriptions
for zh, en, icon, desc in [
    ("锻造", "Blacksmithing", "trade_blacksmithing", "Craft weapons and plate armor."),
    ("制皮", "Leatherworking", "trade_leatherworking", "Craft leather and mail armor."),
    ("炼金", "Alchemy", "trade_alchemy", "Craft potions, elixirs, and transmutes."),
    ("工程", "Engineering", "trade_engineering", "Craft gadgets, bombs, and utility devices."),
]:
    refs.setdefault(zh, {"icon": icon, "description": desc, "source": "profession"})
    en_names.add(en)

aliases = {}
def markers(text): return re.findall(r"【([^】]+)】", text)

for zg, eg in zip(zh_guides, en_guides):
    for zs, es in zip(zg["sections"], eg["sections"]):
        zlines = zs["markdown"].split("\n")
        elines = es["markdown"].split("\n")
        for zline, eline in zip(zlines, elines):
            zms = markers(zline)
            ems = markers(eline)
            for zm, em in zip(zms, ems):
                em = em.strip(); zm = zm.strip()
                if em in en_names or em in aliases: continue
                ref = refs.get(zm)
                if ref:
                    aliases[em] = {
                        "name": em,
                        "icon": ref["icon"],
                        "description": ref.get("description", ""),
                    }
        # line-level leftovers: pair by marker order for lines with mismatch
        if len(zlines) != len(elines):
            # fallback: whole section zip
            for zm, em in zip(markers(zs["markdown"]), markers(es["markdown"])):
                em = em.strip(); zm = zm.strip()
                if em in en_names or em in aliases: continue
                ref = refs.get(zm)
                if ref:
                    aliases[em] = {"name": em, "icon": ref["icon"], "description": ref.get("description", "")}

# Manual high-frequency aliases not found by Chinese lookup.
manual = {
    "Command": {"icon": "ability_hunter_beastcall", "description": "Increases your pet's damage by 5%."},
    "Craftsman Precision": {"icon": "racial_dwarf_findtreasure", "description": "Improves precision with crafted weapons and tools."},
    "Craftsman Accuracy": {"icon": "racial_dwarf_findtreasure", "description": "Improves precision with crafted weapons and tools."},
    "Craftsman's Accuracy": {"icon": "racial_dwarf_findtreasure", "description": "Improves precision with crafted weapons and tools."},
    "Artisan Accuracy": {"icon": "racial_dwarf_findtreasure", "description": "Improves precision with crafted weapons and tools."},
    "Artisan Precision": {"icon": "racial_dwarf_findtreasure", "description": "Improves precision with crafted weapons and tools."},
}
for name, info in manual.items():
    if name not in en_names and name not in aliases:
        aliases[name] = {"name": name, **info}

out = ROOT / "src/data/skill-aliases.json"
out.write_text(json.dumps(sorted(aliases.values(), key=lambda x: x["name"]), ensure_ascii=False, indent=2) + "\n")
print("aliases", len(aliases), "->", out)
for name in sorted(aliases)[:80]: print(name)
