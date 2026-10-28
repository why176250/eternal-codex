#!/usr/bin/env python3
import json, time, urllib.parse, urllib.request
from pathlib import Path
rows = json.load(open('src/data/favor_list.json'))['result']
out = {}
def tr(text):
    if not text: return text
    url = 'https://clients5.google.com/translate_a/t?' + urllib.parse.urlencode({'client':'dict-chrome-ex','sl':'zh-CN','tl':'en','q':text})
    req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
    for i in range(4):
        try:
            r = json.load(urllib.request.urlopen(req, timeout=40))
            if isinstance(r, list) and r: return r[0]
        except Exception: pass
        time.sleep(1.5 + i*2)
    return text
names = []
for row in rows:
    if row.get('nameCn') and row.get('nameCn') not in names: names.append(row['nameCn'])
for i,name in enumerate(names):
    out[name] = tr(name)
    if i % 20 == 0: print(i, name, flush=True)
    time.sleep(0.2)
Path('src/data/favor-names.en.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
print('translated', len(out))
