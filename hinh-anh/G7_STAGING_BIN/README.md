# G7 STAGING BIN — WebP archive mirrors (2026-11-12)

**RELEASE STATUS:** TECH_QA_PASS / CONTENT_SIGNOFF_PENDING / NOT_FOR_APP / DO_NOT_MERGE_TO_MAIN.

These 18 binary blobs are two ZIP archives split into 750,000-byte pieces for GitHub transport. They are **not individual WebP URLs** and must not be referenced by the web application.

## Reassemble and verify (Linux/macOS)
```bash
cat hinh-anh/G7_STAGING_BIN/SHARED/part-*.bin > G7_SHARED_144_WEBP.zip
cat hinh-anh/G7_STAGING_BIN/MATH/part-*.bin > G7_MATH_144_WEBP.zip
sha256sum G7_SHARED_144_WEBP.zip G7_MATH_144_WEBP.zip
unzip -t G7_SHARED_144_WEBP.zip
unzip -t G7_MATH_144_WEBP.zip
```

Expected SHA256:
- SHARED (144 WebP; 6,338,856 bytes): `65219bd7a2a5707f31febf18b28593d1a82c15241927b00420824e9532b49dfc`
- MATH (144 WebP; 6,031,421 bytes): `b7d74696b6e0df6fa9a6da2f334533e0b5a8dee6ac24890043946290c232f3ea`

Windows PowerShell:
```powershell
$parts = Get-ChildItem "hinh-anh/G7_STAGING_BIN/SHARED/part-*.bin" | Sort-Object Name
$destination = [System.IO.File]::Create("G7_SHARED_144_WEBP.zip")
try { foreach ($part in $parts) { $bytes=[System.IO.File]::ReadAllBytes($part.FullName); $destination.Write($bytes,0,$bytes.Length) } } finally { $destination.Dispose() }
Get-FileHash "G7_SHARED_144_WEBP.zip" -Algorithm SHA256
```
Repeat with `MATH` and corresponding output name.

## Verification history
- Source PNG SHA256 matched prior V3.5 records for all 288.
- WebP 512×512 RGBA, 254 quality90 and 34 lossless fallback.
- Verified Drive ZIP readback: 2/2 byte-identical; member SHA256: 288/288.
- GitHub blob hashes were compared to locally calculated Git-object SHA1 for every 750,000-byte part, **18/18 matched**.
- GitHub tree readback confirmed **18/18 binary files** and sizes on branch `g7-asset-registry-20261112`.
- Repo release remains blocked until 100 content mismatches are reviewed and user approves.

See `tai-lieu/G7_BAO_CAO_WEBP_288_QA_THUC_TE_20261112.md` for Drive links, QA and release gates.
