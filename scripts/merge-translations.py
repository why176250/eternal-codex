#!/usr/bin/env python3
"""Merge subagent translations (/tmp/talent-translate/out-*.json) into builds.json.

Adds `nameEn` and `descriptionEn` to every build that has a translation.
Missing translations fall back to the original fields at render time.
"""
from __future__ import annotations

import glob
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUILDS = ROOT / "src" / "data" / "talent-hall" / "builds.json"
OUT_GLOB = "/tmp/talent-translate/out-*.json"


def main() -> None:
    merged: dict[int, dict[str, str]] = {}
    for path in sorted(glob.glob(OUT_GLOB)):
        try:
            rows = json.load(open(path, encoding="utf-8"))
        except Exception as error:  # noqa: BLE001
            print(f"skip {path}: {error}")
            continue
        for row in rows:
            if not isinstance(row, dict) or "id" not in row:
                continue
            entry = merged.setdefault(int(row["id"]), {})
            name = (row.get("nameEn") or "").strip()
            desc = (row.get("descEn") or "").strip()
            if name:
                entry["nameEn"] = name
            if desc:
                entry["descriptionEn"] = desc
        print(f"read {path}: {len(rows)} rows")

    doc = json.load(BUILDS.open(encoding="utf-8"))
    hits = 0
    for build in doc["builds"]:
        entry = merged.get(int(build["id"]))
        if not entry:
            continue
        build["nameEn"] = entry.get("nameEn", build["name"])
        build["descriptionEn"] = entry.get("descriptionEn", build.get("description", ""))
        hits += 1

    BUILDS.write_text(
        json.dumps(doc, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"merged {hits} builds, wrote {BUILDS} ({BUILDS.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
