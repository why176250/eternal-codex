#!/usr/bin/env python3
"""Import the collected Talent Hall data (data-import/talent_hall) into src/data/talent-hall.

Run from the wow-infinite project root:
    python3 scripts/import-talent-hall.py
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data-import" / "talent_hall"
OUT = ROOT / "src" / "data" / "talent-hall"

CLASS_SLUG = {
    "战士": "warrior",
    "圣骑士": "paladin",
    "猎人": "hunter",
    "潜行者": "rogue",
    "牧师": "priest",
    "萨满祭司": "shaman",
    "法师": "mage",
    "术士": "warlock",
    "德鲁伊": "druid",
}


def load(name: str):
    with (SRC / name).open(encoding="utf-8") as handle:
        return json.load(handle)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    builds_doc = load("builds_full.json")
    builds = []
    # Preserve translations written into a previous import (nameEn/descriptionEn).
    previous: dict[int, dict[str, str]] = {}
    previous_path = OUT / "builds.json"
    if previous_path.exists():
        try:
            previous_doc = json.load(previous_path.open(encoding="utf-8"))
            for row in previous_doc.get("builds", []):
                kept = {
                    key: row[key]
                    for key in ("nameEn", "descriptionEn")
                    if key in row and row[key]
                }
                if kept:
                    previous[int(row["id"])] = kept
        except Exception:  # noqa: BLE001 - a broken previous file must not block imports
            previous = {}

    for build in builds_doc.get("builds", []):
        class_name = build.get("className", "")
        builds.append(
            {
                "id": build["id"],
                "classId": build["classId"],
                "className": class_name,
                "classSlug": CLASS_SLUG.get(class_name, "warrior"),
                "specName": build.get("specName", ""),
                "specIcon": build.get("specIcon", ""),
                "name": build.get("name", ""),
                "owner": build.get("owner", ""),
                "mode": build.get("mode", ""),
                "spentPoints": build.get("spentPoints", ""),
                "likes": build.get("likes", 0),
                "favorites": build.get("favorites", 0),
                "comments": build.get("comments", 0),
                "updatedAt": build.get("updatedAt", ""),
                "description": build.get("description", ""),
                **previous.get(int(build["id"]), {}),
            }
        )
    builds.sort(key=lambda item: (-item["likes"], -item["favorites"], item["id"]))

    ranking_doc = load("ranking.json")
    ranking = [
        {
            "rank": row.get("rank"),
            "nickname": row.get("nickname", ""),
            "realm": row.get("realm", ""),
            "talentIndex": row.get("talentIndex", 0),
            "buildCount": row.get("buildCount", 0),
        }
        for row in ranking_doc.get("ranking", [])
    ]

    spec_doc = load("spec_ranking.json")
    spec_ranking = [
        {
            "rank": row.get("rank"),
            "classId": row.get("classId"),
            "className": row.get("className", ""),
            "classSlug": CLASS_SLUG.get(row.get("className", ""), "warrior"),
            "specName": row.get("specName", ""),
            "specIcon": row.get("specIcon", ""),
            "count": row.get("count", 0),
        }
        for row in spec_doc.get("rankedSpecs", [])
    ]

    payloads = {
        "builds.json": {"total": len(builds), "builds": builds},
        "ranking.json": {"ranking": ranking},
        "spec-ranking.json": {"totalBuilds": spec_doc.get("totalBuilds", 0), "specs": spec_ranking},
    }
    for name, payload in payloads.items():
        target = OUT / name
        target.write_text(
            json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
        print(f"wrote {target.relative_to(ROOT)} ({target.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
