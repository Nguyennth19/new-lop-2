#!/usr/bin/env python3
"""Read real Chrome DOM probe. Screenshots need human review; Chrome is not a real touch device."""
from html.parser import HTMLParser
from html import unescape
from pathlib import Path
import json
import sys

width=sys.argv[1]
target=Path('/tmp/g76b2-evidence/chrome')
class Probe(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active=False
        self.attrs={}
        self.text=''
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='pre' and a.get('id')=='qa-b2-results':
            self.active=True
            self.attrs=a
    def handle_endtag(self,tag):
        if tag=='pre':
            self.active=False
    def handle_data(self,data):
        if self.active:
            self.text+=data
p=Probe()
p.feed((target/('dom-'+width+'.html')).read_text(encoding='utf8'))
assert p.attrs.get('data-done')=='true',(p.attrs,p.text[-700:])
assert p.attrs.get('data-pass')=='true',(p.attrs,p.text[-700:])
data=json.loads(unescape(p.text))
assert data['status']=='PASS_CHROME_NATIVE_RENDERER_INTERACTION',data
assert data['checked']>=25,data
assert data['caseCount']==6,data
assert data['clientGrading'] is False and data['gasDeployed'] is False,data
(target/('qa-'+width+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('B2_REAL_CHROME_PASS',width,data['checked'],'checks','actual viewport:',data['viewport'])
