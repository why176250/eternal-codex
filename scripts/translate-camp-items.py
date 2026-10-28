#!/usr/bin/env python3
import json, time, urllib.parse, urllib.request
from pathlib import Path

d = json.load(open('src/data/professions.json'))['campItems']
out = {}
def tr(text):
    if not text.strip(): return text
    url = 'https://clients5.google.com/translate_a/t?' + urllib.parse.urlencode({'client':'dict-chrome-ex','sl':'zh-CN','tl':'en','q':text})
    req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
    for i in range(4):
        try:
            r = json.load(urllib.request.urlopen(req, timeout=40))
            if isinstance(r, list) and r: return r[0]
        except Exception: pass
        time.sleep(2 + i*2)
    return text

for item in d:
    print(item['nameCn'], flush=True)
    out[str(item['itemId'])] = {
        'name': tr(item['nameCn']),
        'effect': tr(item['effectDescCn']),
    }
    time.sleep(0.25)
Path('src/data/camp-items.en.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
print('done', len(out))
