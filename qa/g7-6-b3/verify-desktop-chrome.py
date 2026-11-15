#!/usr/bin/env python3
"""Parse G7.6-B.3 Chrome actual DOM receipt; visual owner approval separate."""
from html.parser import HTMLParser
from html import unescape
from pathlib import Path
import json,sys
width=sys.argv[1]
dir=Path('/tmp/g76b3-evidence/chrome')
class Capture(HTMLParser):
 def __init__(self):
  super().__init__();self.active=False;self.attrs={};self.text=''
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='pre' and a.get('id')=='qa-b3-result':
   self.active=True;self.attrs=a
 def handle_endtag(self,tag):
  if tag=='pre':self.active=False
 def handle_data(self,text):
  if self.active:self.text+=text
parser=Capture()
parser.feed((dir/('desktop-'+width+'.html')).read_text(encoding='utf8'))
assert parser.attrs.get('data-done')=='true',(parser.attrs,parser.text[:600])
assert parser.attrs.get('data-pass')=='true',(parser.attrs,parser.text[:600])
data=json.loads(unescape(parser.text))
assert data['status']=='PASS_B3_CHROME_PRODUCER_VISUAL_STRUCTURAL',data
assert data['checkCount']>=40,data
assert data['publicCases']==14,data
assert data['actualP06E03Mapped']==8 and data['actualP06E02Choice']==2,data
assert data['e04Generated']==4,data
assert data['gasDeployed'] is False and data['gradingEnabled'] is False,data
(dir/('desktop-'+width+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('G76B3_DESKTOP_CHROME_PASS',width,data['checkCount'],'checks, viewport:',data['viewport'])
