"""Probe the Battle.net Game Data API for English names of imported IDs.

Usage:
  1. Create a client at https://develop.battle.net/access/clients
  2. Copy .env.local.example to .env.local and fill in the credentials
  3. python3 scripts/blizzard-enrich.py

The probe tells us how many of the Sargeras IDs actually exist in Blizzard's
public data before we spend an hour bulk-fetching.
"""
import base64
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_env():
    env = {}
    for name in (".env.local", ".env"):
        path = ROOT / name
        if not path.exists():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def get_token(client_id, client_secret):
    data = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode()
    req = urllib.request.Request(
        "https://oauth.battle.net/token",
        data=data,
        headers={
            "Authorization": "Basic "
            + base64.b64encode(f"{client_id}:{client_secret}".encode()).decode(),
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.load(res)["access_token"]


def api_get(token, host, path):
    req = urllib.request.Request(
        f"https://{host}{path}",
        headers={"Authorization": f"Bearer {token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as res:
            return res.status, json.load(res)
    except urllib.error.HTTPError as err:
        return err.code, None
    except Exception as err:  # noqa: BLE001
        return "ERR", str(err)


def load_ids():
    def ids(path, key="id"):
        data = json.load(open(path, encoding="utf-8"))
        return [row[key] for row in data]

    items = ids(ROOT / "data-import/items.json")
    spells = ids(ROOT / "data-import/spells.json")
    sets = ids(ROOT / "data-import/itemsets.json")
    vendors = ids(ROOT / "data-import/commerce.json")
    return {
        "item": [11729, 277490, 276631, *items[:3]],
        "spell": [1300128, 122, 133, *spells[:2]],
        "item-set": [1, 2, 3, *sets[:2]],
        "spell-vendor": [249885, *vendors[:2]],
    }


def main():
    env = load_env()
    client_id = env.get("BLIZZARD_CLIENT_ID")
    client_secret = env.get("BLIZZARD_CLIENT_SECRET")
    if not client_id or not client_secret or "your_" in client_id:
        print("Missing credentials.")
        print("1. https://develop.battle.net/access/clients -> Create Client")
        print("2. cp .env.local.example .env.local and fill in the values")
        sys.exit(1)

    region = env.get("BLIZZARD_REGION", "us")
    host = f"{region}.api.blizzard.com"
    token = get_token(client_id, client_secret)
    print("OAuth OK, region:", region)

    namespaces = ["static-classic-us", "static-us"]
    sample = load_ids()

    for kind, ids in sample.items():
        endpoint = "spell" if kind in ("spell", "spell-vendor") else kind
        print(f"\n== {kind} ==")
        for item_id in ids:
            result = None
            for ns in namespaces:
                status, body = api_get(
                    token,
                    host,
                    f"/data/wow/{endpoint}/{item_id}?namespace={ns}&locale=en_US",
                )
                if status == 200:
                    result = (ns, body.get("name"))
                    break
            if result:
                print(f"  {item_id:>8}  OK  [{result[0]}]  {result[1]}")
            else:
                print(f"  {item_id:>8}  not found in public data")


if __name__ == "__main__":
    main()
