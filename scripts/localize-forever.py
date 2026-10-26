import json

RACE_EN = {
    "human": ("Human", "Alliance"),
    "dwarf": ("Dwarf", "Alliance"),
    "nightelf": ("Night Elf", "Alliance"),
    "gnome": ("Gnome", "Alliance"),
    "skyborne-high": ("Skyborn (Order)", "Alliance"),
    "orc": ("Orc", "Horde"),
    "undead": ("Undead", "Horde"),
    "tauren": ("Tauren", "Horde"),
    "troll": ("Troll", "Horde"),
    "skyborne-wind": ("Skyborn (Wind)", "Horde"),
}

ABILITY_EN = {
    "生存意志": ("Will to Survive", "Instant · 3 min cooldown", "Removes all stun effects."),
    "感知": ("Perception", "Instant · 3 min cooldown · 20 sec duration", "Increases your stealth detection for 20 sec."),
    "无情": ("Relentless", "Passive", "Increases your critical strike chance with spells and attacks by 2%."),
    "人类精魂": ("The Human Spirit", "Passive", "Increases Spirit by 5%."),
    "石像形态": ("Stoneform", "Instant · 3 min cooldown · 8 sec duration", "Removes bleed, poison, and disease effects and reduces physical damage taken by 10% for 8 sec."),
    "寻找财宝": ("Find Treasure", "Instant", "Lets you sense nearby treasure and see it on the minimap."),
    "大地之怒": ("Wrath of the Earth", "Passive", "Increases critical damage and critical healing by 2%."),
    "王牌猎人": ("Ace Hunter", "Passive", "Increases damage dealt to beasts by 5%."),
    "艾露恩之光": ("Light of Elune", "Instant · 3 min cooldown · 15 sec duration", "Increases critical strike chance with spells and attacks by 10% for 15 sec."),
    "影遁": ("Shadowmeld", "Instant", "Puts you in stealth, reducing the chance enemies detect you. Lasts until cancelled or movement. Using it in combat lowers enemy aggression but extends the cooldown to 2 min."),
    "迅捷": ("Quickness", "Passive", "Increases dodge by 1% and movement speed by 2%. Night elf rogues and druids are harder to detect while stealthed, equal to +1 stealth level."),
    "精灵之魂": ("Wisp Spirit", "Passive", "Become a wisp when dead, increasing movement speed by 75%."),
    "逃命专家": ("Escape Artist", "Instant · 2 min cooldown · 3 sec duration", "Removes movement-impairing effects and makes you immune to them for 3 sec."),
    "我知道了！": ("I Know That!", "Instant · 2 min cooldown · 15 sec duration", "Rogue: non-periodic damage abilities cost 10% less energy and deal 10% more damage. Warlock: non-periodic damage abilities cost 10% less mana and deal 10% more damage. Priest: non-periodic damage abilities cost 10% less mana and deal 10% more damage."),
    "开阔思维": ("Expansive Mind", "Passive", "Priest, Mage, Warlock: maximum mana +5%. Rogue: maximum energy +5%. Warrior: maximum rage +5%."),
    "工程学专精": ("Engineering Specialization", "Passive", "Reduces the chance of malfunction or backlash when using engineering devices by 20%."),
    "踏空而行": ("Skywalk", "2 min cooldown · 10 sec duration", "Glide downward through the air for 10 sec, steering as you fall."),
    "阅读魔网": ("Read the Ley Lines", "2 sec cast · 2 min cooldown", "Draw on nearby ley lines, increasing health and mana regeneration by 100%. Lasts 15 sec without a ley line nearby, or 15 min with one."),
    "风灵护佑": ("Blessing of the Wind", "Passive", "Increases spell, melee, and ranged haste by 3%."),
    "元素洞察": ("Elemental Insight", "Passive", "Increases damage dealt to elemental creatures by 5%."),
    "血性狂暴": ("Blood Fury", "Instant · 2 min cooldown · 15 sec duration", "Increases attack power and spell power by 10% for 15 sec."),
    "粉碎诅咒": ("Shatter Curse", "Instant · 3 min cooldown · 8 sec duration", "Removes all curse and doom effects and reduces magic damage taken by 5% for 8 sec."),
    "残暴": ("Brutality", "Passive", "Increases critical strike chance with spells and abilities by 1%."),
    "坚韧": ("Hardiness", "Passive", "Reduces the duration of stun effects by 20%."),
    "被遗忘者的意志": ("Will of the Forsaken", "Instant · 2 min cooldown", "Removes charm, fear, and sleep effects."),
    "食尸": ("Cannibalize", "Instant · 5 yd · 2 min cooldown", "Restores 7% health and 7% mana every 2 sec for 10 sec. Only usable on humanoid or undead corpses within 5 yd. Moving, acting, or taking damage cancels it."),
    "水下呼吸": ("Underwater Breathing", "Passive", "Increases underwater breath by 300%."),
    "哀伤之触": ("Touch of Sorrow", "Passive", "Warrior, Paladin, Rogue: spells and attacks have a 20% chance to drain life, up to 5% of max health. Priest, Mage, Warlock: 30% chance, up to 5% of max health."),
    "战争践踏": ("War Stomp", "0.5 sec cast · 2 min cooldown · 2 sec duration", "Stuns up to 5 enemies within 8 yd for 2 sec."),
    "栽培": ("Cultivate", "Instant", "Cultivates a nearby herb, growing a copy that can be gathered without Herbalism. Each herb can only be cultivated once."),
    "原野疾驰": ("Plainsrunner", "Passive", "While moving, gain 1% movement speed every 5 sec, up to 30%. Taking damage or standing still reduces the effect."),
    "耐久": ("Endurance", "Passive", "Increases total health by 5% and critical damage and healing by 2%."),
    "狂暴": ("Berserking", "Instant · 3 min cooldown · 10 sec duration", "Increases casting and attack speed by 10% for 10 sec."),
    "极速再生": ("Rapid Regeneration", "Instant · 3 min cooldown · 6 sec duration", "Restores 50% of maximum health over 6 sec. Moving, acting, or taking damage cancels it."),
    "野兽杀手": ("Beast Slayer", "Passive", "Increases damage dealt to beasts by 5%."),
    "再生": ("Regeneration", "Passive", "Increases health regeneration by 20%, and keeps 20% regeneration in combat."),
    "天穹视界": ("Skyward Sight", "0.5 sec cast · 2 min cooldown", "Draw on a nearby elemental confluence for a blessing, increasing movement and mount speed by 10%. Lasts 30 sec without a confluence, or 15 min with one."),
}

FAMILY_EN = {
    "cat": "Cat", "bat": "Bat", "crocolisk": "Crocolisk", "wind-serpent": "Wind Serpent",
    "turtle": "Turtle", "fox": "Fox", "wolf": "Wolf", "tallstrider": "Tallstrider",
    "bird-of-prey": "Bird of Prey", "crab": "Crab", "core-hound": "Core Hound",
    "carrion-bird": "Carrion Bird", "hyena": "Hyena", "scorpid": "Scorpid",
    "gorilla": "Gorilla", "bear": "Bear", "raptor": "Raptor", "boar": "Boar", "spider": "Spider",
}

DIET_EN = {
    "肉和鱼": "Meat and fish",
    "蘑菇和水果": "Mushrooms and fruit",
    "鱼、奶酪和面包": "Fish, cheese, and bread",
    "鱼、蘑菇、水果和生鱼": "Fish, mushrooms, fruit, and raw fish",
    "肉": "Meat",
    "奶酪、蘑菇和水果": "Cheese, mushrooms, and fruit",
    "鱼、面包、蘑菇和水果": "Fish, bread, mushrooms, and fruit",
    "肉和水果": "Meat and fruit",
    "肉、鱼、奶酪、面包、蘑菇和水果": "Meat, fish, cheese, bread, mushrooms, and fruit",
}

racials = json.load(open("src/data/forever/racials.json", encoding="utf-8"))
for race in racials:
    en, faction_en = RACE_EN.get(race["key"], (race["raceZh"], race["faction"]))
    race["raceEn"] = en
    race["factionEn"] = faction_en
    for ability in race["abilities"]:
        name_en, info_en, desc_en = ABILITY_EN.get(
            ability["name"],
            (ability["name"], ability.get("info", ""), ability.get("desc", "")),
        )
        ability["nameEn"] = name_en
        ability["infoEn"] = info_en
        ability["descEn"] = desc_en
json.dump(racials, open("src/data/forever/racials.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

pets = json.load(open("src/data/forever/pets.json", encoding="utf-8"))
for family in pets["families"]:
    family["nameEn"] = FAMILY_EN.get(family["slug"], family["name"])
    family["dietEn"] = DIET_EN.get(family["diet"], family["diet"])
json.dump(pets, open("src/data/forever/pets.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

print("localized", len(racials), "races and", len(pets["families"]), "families")
