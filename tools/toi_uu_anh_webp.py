#!/usr/bin/env python3
"""G6: Sinh ảnh WebP xuất bản từ PNG gốc; KHÔNG ghi đè master.
Chạy: python tools/toi_uu_anh_webp.py
"""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1] / "hinh-anh"
OUT = ROOT / "webp"
OUT.mkdir(parents=True, exist_ok=True)
SOURCE = [
    ("Toan-2.png", "Toan-2.webp", 900),
    ("Tieng-Viet-2.png", "Tieng-Viet-2.webp", 900),
    ("Tieng-Anh-2.png", "Tieng-Anh-2.webp", 900),
    ("pilot-g3/math_hen.png", "math_hen.webp", 240),
    ("pilot-g3/math_wrapped_candy.png", "math_wrapped_candy.webp", 240),
    ("pilot-g3/math_book.png", "math_book.webp", 240),
    ("pilot-g3/math_apple.png", "math_apple.webp", 240),
    ("pilot-g3/math_ribbon.png", "math_ribbon.webp", 240),
    ("pilot-g3/math_cookie.png", "math_cookie.webp", 240),
]
manifest = {"version": "g6-webp-v1", "images": []}
for original, output, max_width in SOURCE:
    source = ROOT / original
    if not source.is_file():
        raise SystemExit(f"Không tìm thấy ảnh nguồn: {source}")
    with Image.open(source) as im:
        im = ImageOps.exif_transpose(im)
        im.thumbnail((max_width, max_width), Image.Resampling.LANCZOS)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        dest = OUT / output
        im.save(dest, "WEBP", quality=83, method=6)
        width, height = im.size
    size = dest.stat().st_size
    source_size = source.stat().st_size
    manifest["images"].append({
        "asset": output,
        "source": original,
        "width": width, "height": height,
        "source_bytes": source_size, "webp_bytes": size,
        "reduction_pct": round(100 * (1 - size / source_size), 1),
        "sha256": hashlib.sha256(dest.read_bytes()).hexdigest()
    })
    print(f"{original} -> {output}: {source_size} -> {size} bytes")
(OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Đã tạo {len(SOURCE)} ảnh WebP trong {OUT}")
