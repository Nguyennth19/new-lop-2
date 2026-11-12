#!/usr/bin/env python3
"""G7.4-A.3: independent read-only HTTP SHA256/MIME/size QA for 288 pinned WebP."""
import concurrent.futures
import hashlib
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request

REPO="Nguyennth19/new-lop-2"
BIN_COMMIT="653bfbc73002a188dcea0b714247b84cc28a4fed"
MANIFEST_COMMIT="5cbae75c4b33be1bfbaa8b9702d7868aef34cadf"
BASE=f"https://raw.githubusercontent.com/{REPO}/{BIN_COMMIT}/hinh-anh/webp-g7/v1/"
MANIFEST_URL=f"https://raw.githubusercontent.com/{REPO}/{MANIFEST_COMMIT}/ASSET_288_RELEASE_CANDIDATE_MANIFEST.json"
OUT=pathlib.Path("qa/g7-4-a3/url-qa-result.json")
HEADERS={"User-Agent":"KidLearn-G7-4-A3-Readonly-Verification/1.0","Accept":"application/json,image/webp,*/*"}
def download(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers=HEADERS),timeout=35) as response:
        return response.status,response.headers, response.read()
def check(asset):
    aid=asset["asset_id"]; rel=asset["relative_path"]; url=BASE+rel
    last=None
    for attempt in range(3):
        try:
            code,headers,data=download(url)
            mime=headers.get("Content-Type","").split(";")[0].lower().strip()
            sha=hashlib.sha256(data).hexdigest()
            valid=(code==200 and mime=="image/webp" and sha==asset["webp_sha256"]
                   and len(data)==asset["webp_bytes"] and data[:4]==b"RIFF" and data[8:12]==b"WEBP")
            return {"asset_id":aid,"pass":valid,"status":code,"mime":mime,"bytes":len(data),
                    "sha256":sha,"url":url,"cors":headers.get("Access-Control-Allow-Origin",""),
                    "error":None if valid else "content/header/checksum mismatch"}
        except (urllib.error.URLError,TimeoutError,OSError) as e:
            last=f"{type(e).__name__}: {e}"
            time.sleep(0.5*(attempt+1))
    return {"asset_id":aid,"pass":False,"url":url,"error":last}
def main():
    status,_,raw=download(MANIFEST_URL)
    if status!=200:raise RuntimeError(f"Manifest HTTP {status}")
    manifest=json.loads(raw)
    assets=manifest["assets"]
    if len(assets)!=288 or manifest["asset_count"]!=288 or len({a["asset_id"] for a in assets})!=288:
        raise RuntimeError("Manifest must contain 288 unique assets")
    if len({a["relative_path"] for a in assets})!=288:raise RuntimeError("Duplicate paths")
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        results=list(pool.map(check,assets))
    passes=sum(x["pass"] for x in results)
    summary={"stage":"G7.4-A.3","immutable_binary_commit":BIN_COMMIT,
             "manifest_commit":MANIFEST_COMMIT,"total":288,"passed":passes,"failed":288-passes,
             "results":results}
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(summary,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    print(f"G7.4-A.3 288 RAW URL QA: PASS={passes} FAIL={288-passes}")
    for item in results:
        if not item["pass"]:print("FAIL",item["asset_id"],item["error"])
    return 0 if passes==288 else 1
if __name__=="__main__":
    try:sys.exit(main())
    except Exception as e:
        print("BLOCKED:",repr(e),file=sys.stderr)
        sys.exit(2)
