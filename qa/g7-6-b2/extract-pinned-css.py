#!/usr/bin/env python3
"""Extract CSS exact byte text from pinned, existing original V1.2 demo; no renderer styling changes."""
from pathlib import Path
import re
src=Path('qa/g7-4-column-calc-reference-v12/G7_Column_Calc_V12_Interactive_TEST.html')
s=src.read_text(encoding='utf8')
m=re.search(r'<style>(.*?)</style>',s,re.S)
assert m and '.kl-col-v12-card' in m.group(1) and '.kl-col-v12-answer' in m.group(1)
target=Path('qa/g7-6-b2/generated/column-v12-pinned.css')
target.parent.mkdir(parents=True,exist_ok=True)
target.write_text(m.group(1),encoding='utf8')
print('B2_PINNED_REFERENCE_STYLES_REUSED',len(m.group(1)),'characters')
