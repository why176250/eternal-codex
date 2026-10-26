"""Bulk-fetch English names from the Battle.net Game Data API.

Usage:
  https_proxy=http://127.0.0.1:7890 python3 scripts/blizzard-bulk.py sets vendors
  https_proxy=http://127.0.0.1:7890 python3 scripts/blizzard-bulk.py spells

Output: src/data/forever/en/<kind>.json  {id: {name, namespace, ...}}
Resumable: existing entries are skipped.
"""
import base64
import json
import os
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/data/forever/en"
OUT.mkdir(parents=True, exist_ok=True)

NS = {
    "sets": ["static-us", "static-classic-us"],
    "vendors": ["static-classic-us", "static-us"],
    "spells": ["static-us"],
}
ENDPOINT = {"sets": "item-set", "vendors": "spell", "spells": "spell"}

lock = threading.Lock()
last_call = [0.0]


def rate_limit(interval=0.13):
    with lock:
        wait = last_call[0] + interval - time.time()
        if wait > 0:
            time.sleep(wait)
        last_call[0] = time.time()


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
            env[key.strip()] = value.strip().split()[0] if value.strip() else ""
    return env


def get_token(env):
    data = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode()
    req = urllib.request.Request(
        "https://oauth.battle.net/token",
        data=data,
        headers={
            "Authorization": "Basic "
            + base64.b64encode(
                f'{env["BLIZZARD_CLIENT_ID"]}:{env["BLIZZARD_CLIENT_SECRET"]}'.encode()
            ).decode(),
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.load(res)["access_token"]


def api(token, path):
    rate_limit()
    req = urllib.request.Request(
        f'https://{os.environ.get("BLIZZARD_REGION", "us")}.api.blizzard.com{path}',
        headers={"Authorization": f"Bearer {token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            return res.status, json.load(res)
    except urllib.error.HTTPError as err:
        return err.code, None
    except Exception:
        return "ERR", None


def fetch(token, kind, entity_id):
    for ns in NS[kind]:
        status, body = api(
            token,
            f"/data/wow/{ENDPOINT[kind]}/{entity_id}?namespace={ns}&locale=en_US",
        )
        if status == 200 and body:
            return {"name": body.get("name", ""), "namespace": ns}
        if status == 429:
            time.sleep(2)
    return None


def load_ids(kind):
    if kind == "sets":
        return [row["id"] for row in json.load(open(ROOT / "src/data/forever/sets.json", encoding="utf-8"))]
    if kind == "vendors":
        return [row["id"] for row in json.load(open(ROOT / "src/data/forever/vendors.json", encoding="utf-8"))]
    if kind == "spells":
        return [row["id"] for row in json.load(open(ROOT / "public/data/abilities.json", encoding="utf-8"))]
    raise SystemExit("unknown kind")


def main():
    kinds = sys.argv[1:] or ["sets", "vendors"]
    env = load_env()
    token = get_token(env)
    print("token ok")
    for kind in kinds:
        path = OUT / f"{kind}.json"
        results = json.load(open(path, encoding="utf-8")) if path.exists() else {}
        ids = [i for i in load_ids(kind) if str(i) not in results]
        print(f"{kind}: {len(ids)} to fetch, {len(results)} cached")
        done = 0
        workers = 20 if kind == "spells" else 6
        with ThreadPoolExecutor(max_workers=workers) as pool:
            futures = {pool.submit(fetch, token, kind, i): i for i in ids}
            for future in as_completed(futures):
                entity_id = futures[future]
                try:
                    data = future.result()
                except Exception:
                    data = None
                if data:
                    results[str(entity_id)] = data
                done += 1
                if done % 100 == 0:
                    with lock:
                        json.dump(results, open(path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
                    print(f"  {done}/{len(ids)} done, hits {len(results)}")
        json.dump(results, open(path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
        print(f"{kind}: saved {len(results)} hits")


if __name__ == "__main__":
    main()
