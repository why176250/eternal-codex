#!/usr/bin/env python3
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/class-guides.en.json"
data = json.load(open(PATH))

replacements = {
    "Tiger Balm": "Jack of all trades",
    "weapon warfare": "Arms",
    "Tribe·": "Horde · ",
    "Alliance·": "Alliance · ",
    "Dush": "Dash",
    "Infinite Server": "Forever",
    "wild dps": "Feral DPS",
    "Forging": "Blacksmithing",
    "full-time profession": "dedicated class",
    "extraordinary enemies": "non-trivial enemies",
    "maximum life": "maximum health",
    "weapon battles": "Arms warriors",
    "punishment-type": "punishing",
}

for guide in data:
    for section in guide["sections"]:
        text = section["markdown"]
        # Normalize translated [Skill] markers back to 【Skill】 so inline icons work.
        text = re.sub(r"\[([^\]\n]{1,50})\]", r"【\1】", text)
        for old, new in replacements.items():
            text = text.replace(old, new)
        section["markdown"] = text

PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print("polished", PATH)
