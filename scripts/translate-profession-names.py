import json,time,urllib.parse,urllib.request
from pathlib import Path
d=json.load(open('src/data/professions.json'))
existing=json.load(open('src/data/item-names.en.json'))
texts=[]
for r in d['recipes']:
    if r.get('localesName') and not r.get('itemId') or str(r.get('itemId')) not in existing:
        if r.get('localesName'): texts.append(r['localesName'])
    for x in r.get('reagents',[]):
        if x.get('nameCn') and str(x.get('itemId')) not in existing: texts.append(x['nameCn'])
texts=list(dict.fromkeys(texts))
print('to translate',len(texts))
def tr(text):
 url='https://clients5.google.com/translate_a/t?'+urllib.parse.urlencode({'client':'dict-chrome-ex','sl':'zh-CN','tl':'en','q':text})
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
 for i in range(4):
  try:
   r=json.load(urllib.request.urlopen(req,timeout=40))
   if isinstance(r,list) and r:return r[0]
  except Exception:pass
  time.sleep(2+i*2)
 return text
out={}
for i in range(0,len(texts),12):
 batch=texts[i:i+12]
 res=tr('\nZXSEP0000\n'.join(batch))
 parts=res.split('ZXSEP0000')
 if len(parts)!=len(batch): parts=[tr(x) for x in batch]
 for a,b in zip(batch,parts): out[a]=b
 if i%120==0: print(i,flush=True)
 time.sleep(0.3)
Path('src/data/profession-names.en.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('done',len(out))
