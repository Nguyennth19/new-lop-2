#!/usr/bin/env python3
"""QA-C read-only Chrome DOM browser result analyzer. Screenshots need manual review."""
import html
import json
import pathlib
import re
import sys
html_path=sys.argv[1] if len(sys.argv)>1 else '/tmp/g74-qac-browser-dom.html'
profile=sys.argv[2] if len(sys.argv)>2 else 'desktop'
assert profile in ('desktop','mobile')
s=pathlib.Path(html_path).read_text()
m=re.search(r'<pre id="qaCResult"[^>]*>(.*?)</pre>',s,re.S)
if not m:
    print(s[-2000:])
    raise RuntimeError('MISSING_BROWSER_AUTOMATION_RESULT')
data=json.loads(html.unescape(m.group(1)))
out=pathlib.Path('qa/g7-4-renderer-batch-qa-v1/artifacts')
out.mkdir(exist_ok=True)
(out/('qa-c-chrome-browser-results-'+profile+'.json')).write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
print('Result',profile,data.get('status'))
for one in data['results']:
    print(one['id'],one['browserUnitStatus'],len(one.get('checks',[])),
          'checks','errors:',one.get('errors'),'overflow:',
          one.get('originalOverflow'),one.get('candidateOverflow'))
    assert one.get('originalOverflow') is False, 'original demo overflow '+one['id']
    assert one.get('candidateOverflow') is False, 'candidate overflow '+one['id']
    assert one.get('referenceStylesheetLoaded') is True, 'original CSS missing '+one['id']
    assert one.get('candidateStylesheetLoaded') is True, 'candidate CSS missing '+one['id']
assert len(data['results'])==12, 'not all 12 renderer forms visited'
assert data['status']=='PASS_BROWSER_STRUCTURAL_ONLY', 'browser interaction regression'
assert data['pixelParity']=='PENDING_MANUAL_REVIEW', 'manual pixel review not completed'
print('PASS: real Chrome 12/12 browser checks; visual parity human review remains PENDING')
