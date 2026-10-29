import json,time,urllib.parse,urllib.request
from pathlib import Path
sets=json.load(open('src/data/itemsets.json'))
names=[s['name'] for s in sets]
out={}
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
for i in range(0,len(names),20):
 batch=names[i:i+20]
 joined='\nZXSEP0000\n'.join(batch)
 translated=tr(joined)
 parts=translated.split('ZXSEP0000')
 if len(parts)!=len(batch): parts=[tr(n) for n in batch]
 for n,t in zip(batch,parts): out[n]=t
 print(i,flush=True)
 time.sleep(0.4)
Path('src/data/itemsets-names.en.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('done',len(out))
