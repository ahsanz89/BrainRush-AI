"""Builds public policy pages (docs/*.html, served by GitHub Pages) and store/policies/*.md from
content/legal.json + src/config.ts. Run after editing either:  python3 tools/build_store.py"""
import json, re, html
L=json.load(open('content/legal.json'))
cfg=open('src/config.ts').read()
get=lambda k: re.search(k+r":\s*'([^']*)'",cfg).group(1)
V={'{{SUPPORT_EMAIL}}':get('supportEmail'),'{{DEVELOPER_NAME}}':get('developerName')}
def fill(s):
    for k,v in V.items(): s=s.replace(k,v)
    return s
CSS="body{font:16px/1.6 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px;color:#17123a;background:#f6f4ff}h1{font-size:28px}h2{font-size:18px;margin-top:28px}p{white-space:pre-line}a{color:#5b3df5}footer{margin-top:40px;font-size:13px;color:#585280}"
pages={'privacy':'privacy-policy','terms':'terms','support':'support','monetization':'funding'}
nav=' · '.join(f'<a href="{f}.html">{L["docs"][k]["title"]}</a>' for k,f in pages.items())
for k,f in pages.items():
    d=L['docs'][k]; body=''.join(f'<h2>{html.escape(h)}</h2><p>{html.escape(fill(b))}</p>' for h,b in d['sections'])
    open(f'docs/{f}.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{d["title"]} - BrainRush AI</title><style>{CSS}</style></head><body><h1>{d["title"]}</h1><p><em>BrainRush AI · Effective {L["effectiveDate"]}</em></p>{body}<footer>{nav}</footer></body></html>')
    open(f'store/policies/{f}.md','w').write(f'# {d["title"]} - BrainRush AI\n\nEffective {L["effectiveDate"]}\n\n'+''.join(f'## {h}\n\n{fill(b)}\n\n' for h,b in d['sections']))
open('docs/index.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BrainRush AI</title><style>{CSS}</style></head><body><h1>BrainRush AI</h1><p>Train your brain. Challenge yourself. Grow every day.</p><p>{nav}</p></body></html>')
import shutil; shutil.copy('store/policies/privacy-policy.md','PRIVACY_POLICY.md')
warn=[k for k,v in V.items() if 'REPLACE_WITH' in v]
print('built; placeholders still to fill in src/config.ts:' , warn or 'none')
