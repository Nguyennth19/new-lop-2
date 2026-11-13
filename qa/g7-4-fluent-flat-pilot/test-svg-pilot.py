#!/usr/bin/env python3
"""G7.4 pinned Microsoft Flat SVG pilot: static security and integrity gate.
No writes, no networking, no SVG execution. Source content is trusted only
after binary SHA-256 + XML whitelist checks. Manual semantic QA is separate.
"""
import hashlib, json, re, sys, xml.etree.ElementTree as ET
from pathlib import Path

root = Path("hinh-anh/svg-fallback/fluent-emoji-flat/v1")
manifest = json.loads((root/"manifest.v1.json").read_text("utf-8"))
errors=[]; passed=0
def require(cond, label):
    global passed
    if cond: passed += 1
    else: errors.append(label)
def normal(tag):
    return tag.rsplit("}", 1)[-1]
safe_tags={"svg","g","path","circle","ellipse","rect","polygon","polyline","line","defs",
           "clipPath","mask","linearGradient","radialGradient","stop","title","desc"}
root_dir=(root/"FLAT").resolve()
require(manifest["schemaVersion"]=="kidlearn-fluent-emoji-flat-pilot-v1","manifest schema")
require(manifest["mode"]=="STAGING_ONLY" and manifest["enabled"] is False and manifest["productionActivation"] is False,"gates OFF")
require(manifest["source"]["ref"]=="1ffb34c752ecf5d402f04cfb4b392c77f57c54bc","source pinned")
require(manifest["source"]["license"]=="MIT" and manifest["total"]==46,"MIT and icon count")
license=(root/"LICENSE").read_text("utf-8")
require("MIT License" in license and "Microsoft Corporation" in license and "Permission is hereby granted" in license,"license preserved")
require(manifest["renderPolicy"]["allowAutoFallback"] is False and manifest["renderPolicy"]["allowCountInference"] is False,"fallback/count gates OFF")
ids=set(); paths=set()
for x in manifest["icons"]:
    item=x["id"]; relative=x["relativePath"]; ids.add(item);paths.add(relative)
    require(bool(re.fullmatch(r"FLAT/[a-z_]+\.svg",relative)),item+" safe path")
    f=(root/relative).resolve()
    require(f.is_relative_to(root_dir) and f.is_file(),item+" file exists")
    if not f.is_file(): continue
    b=f.read_bytes()
    require(len(b)==x["bytes"] and hashlib.sha256(b).hexdigest()==x["sha256"],item+" sha256 and bytes match")
    upstream_blob=hashlib.sha1(f"blob {len(b)}\\0".encode("ascii").replace(b"\\0",b"\\x00")+b).hexdigest()
    require(upstream_blob==x["upstreamBlob"],item+" exact upstream git blob")
    require(b.startswith(b"<svg") and len(b)<=100000,item+" SVG size/root")
    require(b"<!DOCTYPE" not in b.upper() and b"<!ENTITY" not in b.upper(),item+" no DTD/entity")
    require(not re.search(rb"<\s*(script|foreignObject|iframe|object|embed|image|style)\b",b,re.I),item+" no forbidden tags")
    try:
        tree=ET.fromstring(b)
        require(normal(tree.tag)=="svg",item+" parsed SVG root")
        bad_tags=[];bad_attrs=[]
        for el in tree.iter():
            t=normal(el.tag)
            if t not in safe_tags:bad_tags.append(t)
            for k,v in el.attrib.items():
                n=normal(k).lower()
                if n.startswith("on") or n in {"href","src","style","filter"} and (n!="filter" or not re.fullmatch(r"url\(#[-\w]+\)",v)):
                    bad_attrs.append((n,v[:80]))
                if re.search(r"(https?://|data:|javascript:|file:)",v,re.I) and not (n=="xmlns" and v=="http://www.w3.org/2000/svg"):
                    bad_attrs.append((n,"remote reference"))
                for ref in re.findall(r"url\(([^)]*)\)",v):
                    if not re.fullmatch(r"#[\w.-]+",ref.strip("'\" ")):
                        bad_attrs.append((n,"unsafe url()"))
        require(not bad_tags,item+" XML tag allowlist "+str(bad_tags[:3]))
        require(not bad_attrs,item+" no event/external attrs "+str(bad_attrs[:3]))
        require(tree.attrib.get("viewBox")=="0 0 32 32",item+" uniform 32px viewBox")
    except ET.ParseError as e: errors.append(item+" XML parse: "+str(e))
    require(x["semanticStatus"]=="OWNER_VISUAL_PENDING" and x["countQaStatus"]=="NOT_APPROVED" and
            x["visualQaStatus"]=="OWNER_VISUAL_PENDING" and x["objectsPerAsset"] is None and
            x["approvedConceptKey"] is None,item+" no fake semantic/count approval")
    require(x["upstreamPath"].endswith("/Flat/"+item+"_flat.svg"),item+" upstream trace")
require(len(ids)==len(paths)==46,"uniqueness")
semantic=json.loads((root/"qa"/"semantic-review-candidates.v1.json").read_text("utf-8"))
require(semantic["enabled"] is False and semantic["mode"]=="OWNER_REVIEW_ONLY","semantic review gate OFF")
require(len(semantic["items"])==46,"semantic candidate count")
for x in semantic["items"]:
    require(x["id"] in ids and bool(x["draftLabelVi"]) and x["semanticReview"]=="OWNER_PENDING" and x["countSafe"] is False,x["id"]+" source label owner pending")
gallery=(root/"qa"/"G7_Fluent_Flat_Review.html").read_text("utf-8")
require("naturalWidth>0" in gallery and "countSafeApproved:false" in gallery and "FLAT/" in gallery,"gallery never grants count-safe/false loaded")
require(len(list(root_dir.glob("*.svg")))==46,"exactly 46 vendored SVGs")
for n in range(1,5):
    data=json.loads((root/"qa"/f"hash-part-{n:02d}.json").read_text("utf-8"))
    for x in data:
        require(any(y["id"]==x["id"] and y["sha256"]==x["sha256"] for y in manifest["icons"]),
                x["id"]+" part hash matches manifest")
registry=json.loads(Path("du-lieu/asset-selector/asset-registry-288.v1.json").read_text())
rules=json.loads(Path("du-lieu/asset-selector/semantic-rules.v1.json").read_text())
count=json.loads(Path("du-lieu/asset-selector/count-composition-b58-test.v1.json").read_text())
multi=json.loads(Path("du-lieu/bien-the/chuan/visual-intent-multi-lesson-gate.v1.json").read_text())
require(registry["total"]==288 and all(x["label_status"]=="LABEL_APPROVED" for x in registry["assets"]),"WebP baseline 288")
require(len(rules["rules"])==9 and rules["selection_policy"]["allow_quantity_inference"] is False,"9 curated immutable rules")
require(count["enabled"] is False and multi["enabled"] is False,"other gates OFF")
print(json.dumps({"stage":"G7.4-FLUENT-FLAT-PILOT","icons":46,"checksPassed":passed,
                  "checksFailed":len(errors),"semanticVisualQA":"OWNER_PENDING",
                  "countQA":"NOT_APPROVED","runtimeEnabled":False,"errors":errors},
                 ensure_ascii=False,indent=2))
if errors:sys.exit(1)
