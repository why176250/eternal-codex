import json,time,urllib.parse,urllib.request
from pathlib import Path
d=json.load(open('src/data/professions.json'))
labels=[]
for cats in d['categories'].values():
 for c in cats:
  if c['label'] not in labels: labels.append(c['label'])
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
for i in range(0,len(labels),15):
 batch=labels[i:i+15]
 joined='\nZXSEP0000\n'.join(batch)
 res=tr(joined); parts=res.split('ZXSEP0000')
 if len(parts)!=len(batch): parts=[tr(x) for x in batch]
 for a,b in zip(batch,parts): out[a]=b
 print(i,flush=True); time.sleep(0.4)
Path('src/data/profession-categories.en.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('done',len(out))
