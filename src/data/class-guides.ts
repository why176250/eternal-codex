export type ClassGuide = {
  pros: string[];
  cons: string[];
  races: { name: string; note: string }[];
  professions: { name: string; note: string }[];
};

/**
 * Editorial recommendations for the Forever class pages.
 * Race combos can change before launch; the page tells readers to verify
 * the final list on the character-creation screen.
 */
export const classGuides: Record<string, ClassGuide> = {
  warrior: {
    pros: [
      "Default main tank for dungeons and raids",
      "Rage and threat scale hard with gear",
      "Strong cleave and the widest weapon choice",
      "No mana, so little downtime between pulls",
    ],
    cons: [
      "Slowest first 20 levels",
      "Threat and mitigation are gear-dependent",
      "Limited group utility outside tanking",
      "Rage-starved when undergeared",
    ],
    races: [
      { name: "Human", note: "Weapon skill and a PvP trinket; the safest all-round pick." },
      { name: "Orc", note: "Axe skill, Blood Fury, and stun resistance for melee pressure." },
      { name: "Tauren", note: "War Stomp and extra stamina help every tank pull." },
      { name: "Dwarf", note: "Stoneform is a clean answer to bleeds and poison." },
    ],
    professions: [
      { name: "Blacksmithing", note: "Weapons and plate you would otherwise farm." },
      { name: "Mining", note: "Feeds Blacksmithing and pays for repairs." },
      { name: "Engineering", note: "Utility gadgets and tank-quality trinkets." },
    ],
  },
  paladin: {
    pros: [
      "Tank, heal, or melee DPS on one character",
      "Best defensive cooldowns and group utility",
      "Strong dungeon healer with plate survivability",
      "Free level-40 mount",
    ],
    cons: [
      "Low mobility",
      "Mana-dependent while leveling",
      "Melee DPS needs gear to feel good",
      "Buff management eats bag space",
    ],
    races: [
      { name: "Human", note: "Weapon skill and a PvP trinket; flexible for all three roles." },
      { name: "Dwarf", note: "Stoneform adds a defensive answer for tanking and healing." },
      { name: "Blood Elf", note: "If available, mana tools help the leveling stretch." },
      { name: "Tauren", note: "If available, War Stomp and stamina are never wasted." },
    ],
    professions: [
      { name: "Blacksmithing", note: "Plate and weapons for the tank or retribution set." },
      { name: "Mining", note: "Funds Blacksmithing and keeps repair costs down." },
      { name: "Enchanting", note: "Cheap self-enchants and disenchant income." },
    ],
  },
  hunter: {
    pros: [
      "Easiest solo leveler in the game",
      "Pet tanks, holds threat, and covers mistakes",
      "Strong sustained dungeon damage",
      "Kiting and pull control for awkward packs",
    ],
    cons: [
      "Pet management and the dead zone",
      "Weapon-dependent damage",
      "Raid utility is thin",
      "A bad pull punishes the whole group",
    ],
    races: [
      { name: "Night Elf", note: "Agility and Shadowmeld for safer open-world pulls." },
      { name: "Dwarf", note: "Gun Specialization and Stoneform." },
      { name: "Orc", note: "Axe Specialization and pet damage." },
      { name: "Troll", note: "Bow Specialization and Berserking." },
    ],
    professions: [
      { name: "Leatherworking", note: "Mail gear while leveling and into early dungeons." },
      { name: "Skinning", note: "Funds Leatherworking and sells steadily." },
      { name: "Engineering", note: "Ammo, gadgets, and quality-of-life tools." },
    ],
  },
  rogue: {
    pros: [
      "Top single-target melee damage",
      "Stealth routes and skipped packs",
      "Lockpicking opens shortcuts and chests",
      "Strong PvP control",
    ],
    cons: [
      "No real AoE",
      "Gear-dependent",
      "Squishy when exposed",
      "Group utility is niche",
    ],
    races: [
      { name: "Human", note: "Sword and mace skill plus a PvP trinket." },
      { name: "Orc", note: "Axe skill and stun resistance." },
      { name: "Troll", note: "Berserking for burst windows." },
      { name: "Night Elf", note: "Shadowmeld for stealth openers and escapes." },
    ],
    professions: [
      { name: "Leatherworking", note: "Leather gear and armor kits." },
      { name: "Engineering", note: "Gadgets, bombs, and PvP tools." },
      { name: "Alchemy", note: "Potions that cover the class's thin sustain." },
    ],
  },
  priest: {
    pros: [
      "Deepest healing toolkit",
      "Dispel, fear, and shadow utility",
      "Shadow is a strong solo spec",
      "Always in demand for dungeons",
    ],
    cons: [
      "Fragile when focused",
      "Mana-hungry",
      "Shadow needs ramp-up time",
      "Limited mobility",
    ],
    races: [
      { name: "Dwarf", note: "Fear Ward and Stoneform." },
      { name: "Human", note: "Spirit and a PvP trinket." },
      { name: "Undead", note: "Devouring Plague and Will of the Forsaken." },
      { name: "Troll", note: "Berserking and Shadowguard." },
    ],
    professions: [
      { name: "Tailoring", note: "Cloth gear and bags." },
      { name: "Enchanting", note: "Self-enchants and disenchant income." },
      { name: "Alchemy", note: "Mana potions and consumables." },
    ],
  },
  shaman: {
    pros: [
      "Totems buff the whole group",
      "Burst damage and off-healing",
      "Flexible role coverage",
      "Strong dungeon utility",
    ],
    cons: [
      "Totem micromanagement",
      "Mana limits",
      "No dedicated tank tree",
      "Gear competition",
    ],
    races: [
      { name: "Orc", note: "Axe skill and Blood Fury." },
      { name: "Troll", note: "Berserking for burst and healing." },
      { name: "Tauren", note: "War Stomp and extra stamina." },
      { name: "Draenei", note: "If available, the hit aura is group-wide value." },
    ],
    professions: [
      { name: "Leatherworking", note: "Mail and caster gear while leveling." },
      { name: "Alchemy", note: "Potions and transmutes." },
      { name: "Engineering", note: "Gadgets and utility totem support." },
    ],
  },
  mage: {
    pros: [
      "Best AoE and crowd control",
      "Portals, food, and water",
      "Strong leveling",
      "High skill ceiling",
    ],
    cons: [
      "Very fragile",
      "Mana-dependent",
      "Gear-dependent",
      "Weak in melee",
    ],
    races: [
      { name: "Gnome", note: "Intellect and Escape Artist." },
      { name: "Human", note: "Spirit and a PvP trinket." },
      { name: "Undead", note: "Will of the Forsaken and Cannibalize." },
      { name: "Troll", note: "Berserking for burst windows." },
    ],
    professions: [
      { name: "Tailoring", note: "Cloth gear and bags." },
      { name: "Enchanting", note: "Self-enchants and disenchant income." },
      { name: "Alchemy", note: "Mana potions and utility elixirs." },
    ],
  },
  warlock: {
    pros: [
      "Strong solo sustain",
      "Pets tank and provide utility",
      "Dots and fear control",
      "Summon and soulstone utility",
    ],
    cons: [
      "Soul shard management",
      "Pet micro",
      "Ramp-up damage",
      "Low mobility",
    ],
    races: [
      { name: "Gnome", note: "Intellect and Escape Artist." },
      { name: "Human", note: "Spirit and a PvP trinket." },
      { name: "Orc", note: "Pet damage and stun resistance." },
      { name: "Undead", note: "Will of the Forsaken and Cannibalize." },
    ],
    professions: [
      { name: "Tailoring", note: "Cloth gear and bags." },
      { name: "Enchanting", note: "Self-enchants and disenchant income." },
      { name: "Alchemy", note: "Potions and shadow-power elixirs." },
    ],
  },
  druid: {
    pros: [
      "Tank, heal, or DPS on one character",
      "Stealth and travel forms",
      "Strong solo leveling",
      "Flexible group role",
    ],
    cons: [
      "Jack-of-all-trades",
      "Gear sets are split across forms",
      "Mana and rage juggling",
      "Shapeshift limits",
    ],
    races: [
      { name: "Night Elf", note: "Agility and Shadowmeld." },
      { name: "Tauren", note: "War Stomp and extra stamina." },
      { name: "Troll", note: "If available, Berserking adds a burst button." },
    ],
    professions: [
      { name: "Leatherworking", note: "Leather gear for every form." },
      { name: "Herbalism", note: "Feeds Alchemy and funds leveling." },
      { name: "Alchemy", note: "Potions for healing and solo play." },
    ],
  },
};
