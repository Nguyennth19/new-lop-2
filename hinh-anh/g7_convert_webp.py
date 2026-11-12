#!/usr/bin/env python3
# G7 - batch converter. PNG masters NEVER modified.
# Install: pip install Pillow google-api-python-client google-auth
# Auth: gcloud auth application-default login
# Run: python g7_convert_webp.py --registry G7_Asset_Registry_288.json --output G7_WEBP_STAGING
import argparse, csv, hashlib, io, json, pathlib, sys
from PIL import Image, ImageChops
from google.auth import default
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

SCOPES=['https://www.googleapis.com/auth/drive.readonly']
def digest(data): return hashlib.sha256(data).hexdigest()
def fetch(service,file_id):
    request=service.files().get_media(fileId=file_id)
    stream=io.BytesIO(); downloader=MediaIoBaseDownload(stream,request,chunksize=2*1024*1024)
    finished=False
    while not finished: _,finished=downloader.next_chunk()
    return stream.getvalue()
def convert(png,quality=90):
    with Image.open(io.BytesIO(png)) as im:
        im.load()
        if im.format!='PNG': raise ValueError('Source is not PNG')
        if 'A' not in im.getbands(): raise ValueError('Source lacks true alpha channel')
        rgba=im.convert('RGBA')
        if rgba.width<512 or rgba.height<512: raise ValueError('Source below 512 px')
        alpha=rgba.getchannel('A')
        if alpha.getextrema()!=(0,255): raise ValueError('Alpha min/max is not 0/255')
        # Resize the full transparent artboard, never crop its bounding box.
        preview=rgba.resize((512,512),Image.Resampling.LANCZOS)
        a=preview.getchannel('A')
        bbox=a.getbbox()
        if not bbox: raise ValueError('Empty transparent illustration')
        margin=min(bbox[0],bbox[1],512-bbox[2],512-bbox[3])
        if margin<24: raise ValueError('Object too close to canvas edge')
        dst=io.BytesIO()
        preview.save(dst,format='WEBP',quality=quality,method=6,exact=True)
        data=dst.getvalue()
        with Image.open(io.BytesIO(data)) as check:
            check.load()
            if check.size!=(512,512) or check.mode!='RGBA':
                raise ValueError('WebP decode/size/alpha failed')
            if check.getchannel('A').getextrema()[0]!=0:
                raise ValueError('WebP transparent pixels missing')
        return data,margin,bbox
def main():
    p=argparse.ArgumentParser()
    p.add_argument('--registry',required=True)
    p.add_argument('--output',default='G7_WEBP_STAGING')
    p.add_argument('--quality',type=int,default=90)
    p.add_argument('--limit',type=int,default=0,help='pilot count; 0=all')
    args=p.parse_args()
    registry=json.loads(pathlib.Path(args.registry).read_text(encoding='utf-8'))
    if len(registry['assets'])!=288: raise SystemExit('Expected 288 assets')
    credentials,_=default(scopes=SCOPES)
    service=build('drive','v3',credentials=credentials,cache_discovery=False)
    out=pathlib.Path(args.output);out.mkdir(parents=True,exist_ok=True)
    rows=[]
    items=registry['assets'][:args.limit or None]
    for index,item in enumerate(items,1):
        rec={k:item.get(k,'') for k in ('asset_id','group','scope','catalog_label_vi','observed_label_vi','png_file_id','png_filename','webp_filename','content_status_v35')}
        rec['release_status']='BLOCKED_PENDING_CONTENT_SIGNOFF'
        try:
            if not item.get('png_file_id'): raise ValueError('Missing Drive PNG file ID')
            source=fetch(service,item['png_file_id'])
            webp,margin,bbox=convert(source,args.quality)
            target=out/item['group']/item['webp_filename']
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(webp)
            rec.update(png_sha256=digest(source),png_bytes=len(source),
              webp_sha256=digest(webp),webp_bytes=len(webp),alpha_margin_px=margin,
              webp_relative_path=str(target.relative_to(out)),
              conversion_status='TECH_PASS_LOCAL_STAGING',error='')
        except Exception as error:
            rec.update(conversion_status='TECH_FAIL',error=str(error))
        rows.append(rec)
        print('%03d/%03d %s %s' %(index,len(items),rec['asset_id'],rec['conversion_status']),flush=True)
    fields=list(rows[0]) if rows else []
    with (out/'G7_WEBP_CONVERSION_AUDIT.csv').open('w',encoding='utf-8-sig',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore')
        writer.writeheader();writer.writerows(rows)
    report={'source_registry':args.registry,'total':len(items),
      'tech_pass':sum(x['conversion_status']=='TECH_PASS_LOCAL_STAGING' for x in rows),
      'tech_fail':sum(x['conversion_status']=='TECH_FAIL' for x in rows),
      'content_release_approved':0,
      'note':'NO UPLOAD OR RELEASE performed; QA review and Drive/GitHub SHA readback required'}
    (out/'G7_CONVERSION_SUMMARY.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__': main()
