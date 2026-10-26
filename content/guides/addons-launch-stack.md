---
title: "Addons That Matter at Launch (and What to Skip)"
description: "A minimal addon stack for launch week: quest tracking, bags, unit frames, meters, and the one rule that keeps you from breaking your UI."
category: "Systems"
date: "2026-10-27"
updated: "2026-10-27"
tags: ["addons", "ui", "launch"]
featured: false
confidence: "community"
---

> **Confidence: community-tracked.** Addon compatibility for Forever is still being confirmed. The categories below are stable; specific addon ports may lag the launch build.

## The one rule

**Install and test before launch day.** An addon that breaks at character select is a launch-hour disaster. Update everything, log in once during the stress test if you can, and keep a "no addons" fallback profile.

## The minimal stack

| Category | What it does | Example |
| --- | --- | --- |
| Quest helper | Shows quest objectives on the map and minimap | Questie |
| Bag management | One window for all bags, sorting, search | Bagnon |
| Unit frames | Cleaner player/target/party frames | ElvUI, or the default UI |
| Damage meter | Group performance and threat awareness | Details! |
| Auras | Custom alerts for buffs, cooldowns, procs | WeakAuras |
| Loot reference | Dungeon and raid loot tables in-game | AtlasLoot |
| Auction | Price history and posting tools | Auctionator |

You do not need all seven. Quest helper, bags, and a damage meter cover 90% of launch week.

## What to skip (for now)

- **Full UI overhauls.** A new UI resets your muscle memory at the worst possible time.
- **Automation addons.** Anything that plays the game for you violates Blizzard's addon policy and risks the account.
- **Paid addon tiers.** Blizzard's addon rules require addons to be free; if a "premium" version exists, that is a red flag.
- **A dozen WeakAuras you copied without reading.** Import strings can carry baggage; only import auras you understand.

## Raid set (after 60)

Once you are raiding, add:

- **Threat meter.** Tanks and burst DPS need to see threat, not guess it.
- **Raid frames.** A healer without proper raid frames is healing blind.
- **Consumable tracker.** Flask, potion, and food buffs are part of your damage.

## Compatibility checklist

1. Check the addon's last update date and comments for Forever support.
2. Test one addon at a time; if the UI breaks, you know which one caused it.
3. Keep a clean `Interface/AddOns` folder with only what you use.
4. After every patch, update before you raid — not during.

## The launch-day fallback

If your quest addon breaks and you cannot fix it quickly, the default map still shows quest areas. Do not spend the first hour debugging; level, and fix the UI at the first flight point.

## Sources

- [Icy Veins: addons in Forever](https://www.icy-veins.com/wow-forever/news/addons-in-wow-forever-blizzard-devs-just-addressed-the-big-question/) — Blizzard's stated position on addons.
- [Blizzard addon policy](https://www.blizzard.com/en-us/legal) — the rules on automation and paid addons.
