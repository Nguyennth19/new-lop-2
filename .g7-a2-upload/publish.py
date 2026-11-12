from __future__ import annotations
import hashlib, io, json, shutil, zipfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PARTS=ROOT/'.g7-a2-upload'
MANIFEST=ROOT/'ASSET_288_RELEASE_CANDIDATE_MANIFEST.json'
OUTPUT=ROOT/'hinh-anh/webp-g7/v1'
EXPECTED_ZIPS={
 'SHARED': ('65219bd7a2a5707f31febf18b28593d1a82c15241927b00420824e9532b49dfc',9),
 'MATH': ('b7d74696b6e0df6fa9a6da2f334533e0b5a8dee6ac24890043946290c232f3ea',8),
}

def main():
 if not (PARTS/'READY').is_file():
  print('READY marker missing: no-op');return
 info=json.loads(MANIFEST.read_text(encoding='utf8'))
 if info['asset_count']!=288 or len(info['assets'])!=288:raise RuntimeError('Manifest asset count incorrect')
 bypath={a['relative_path']:a for a in info['assets']}
 if len(bypath)!=288:raise RuntimeError('Duplicate manifest path')
 found={}
 for scope,(expected_sha,nparts) in EXPECTED_ZIPS.items():
  parts=sorted((PARTS/scope).glob('*.part'))
  if len(parts)!=nparts or [p.name for p in parts]!=[f'{i:03}.part' for i in range(nparts)]:raise RuntimeError('Missing ZIP chunks: '+scope)
  data=b''.join(p.read_bytes() for p in parts)
  sha=hashlib.sha256(data).hexdigest()
  if sha!=expected_sha:raise RuntimeError('ZIP checksum mismatch for '+scope+': '+sha)
  with zipfile.ZipFile(io.BytesIO(data)) as archive:
   if len(archive.infolist())!=144 or archive.testzip() is not None:raise RuntimeError('Damaged ZIP '+scope)
   for entry in archive.infolist():
    path=entry.filename
    if path not in bypath or path in found:raise RuntimeError('Unexpected/duplicate WebP '+path)
    asset=bypath[path]
    if asset['scope']!=scope:raise RuntimeError('Wrong scope '+path)
    raw=archive.read(entry)
    if len(raw)!=asset['webp_bytes'] or hashlib.sha256(raw).hexdigest()!=asset['webp_sha256']:raise RuntimeError('Individual WebP hash mismatch '+path)
    if raw[:4]!=b'RIFF' or raw[8:12]!=b'WEBP':raise RuntimeError('Invalid WebP '+path)
    found[path]=raw
 if len(found)!=288 or set(found)!=set(bypath):raise RuntimeError('Missing files after extraction')
 for path,raw in found.items():
  target=OUTPUT/path
  target.parent.mkdir(parents=True,exist_ok=True)
  target.write_bytes(raw)
 shutil.rmtree(PARTS/'SHARED')
 shutil.rmtree(PARTS/'MATH')
 (PARTS/'PUBLISH_RESULT.json').write_text(json.dumps({'status':'PASS','verified':288,'shared':144,'math':144,'checks':'zip+crc32+sha256+WebP'},indent=2)+'\n')
 print('G7.4-A.2 SUCCESS: 288 original WebP assets sha256 verified and published')

if __name__=='__main__':main()
