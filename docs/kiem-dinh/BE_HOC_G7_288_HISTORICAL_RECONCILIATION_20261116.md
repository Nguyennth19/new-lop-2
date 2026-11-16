# G7.4 288-ASSET HISTORICAL RECONCILIATION — 2026-11-16
Status: **CLOSED_BINARY_AND_LABELS / SCOPED_COUNT_ONLY / APP_TEST_DEPLOY_NOT_DONE**

## Exact source chain
- 2026-10-29 Drive `KidLearn_QA_Report_V3_5_288.md`: 288 PNG master readback + technical 288 WebP conversion PASS; 100 original label mismatches, 6 visually near-similar pairs. This checkpoint is superseded for labels.
- 2026-11-12 G7.1/2: 100 mismatched labels corrected against actual image without changing Asset IDs. 6 similar pairs are *kept as alternate styles*, not deleted; distinct physical quantity/color remains a hard gate.
- 2026-11-12 G7.3: 288/288 binary archive and SHA QA PASS; earlier report says GitHub host not yet synced. This checkpoint is superseded for GitHub binary storage.
- 2026-11-12 G7.4-A.2 **commit `653bfbc73002a188dcea0b714247b84cc28a4fed`**, message explicitly says all 288 original WebP binaries published. Exact tree contains 24 × 12 files under `hinh-anh/webp-g7/v1/WEBP/`, total 12,350,644 bytes. This is the authoritative immutable binary source.
- 2026-11-13 G7.4-B.5.7-PERF-A final owner label receipt `docs/kiem-dinh/G7.4-B.5.7_PERF_A_OWNER_APPROVAL_288_20261113.md` (branch `test/g7-4-b5-7-perf-a-owner-label-approval-20261113`): owner reported real gallery 288/288 in 6017 ms and approved all image labels; 188 pending updated, total 288/288 LABEL_APPROVED. Git registry blob `544377bf3cbc0d7b19a4a6f76efd9ae84845b123`; QA CI run `43371398245`.
- 2026-11-13 G7.4-B.5.8 24/24 semantic/count composition QA; however per-question exact count stays constrained by objects-per-asset metadata. This is not lack of image quality approval.
- 2026-11-16 old be-hoc visual code incorrectly said 'only 13 WebP in GitHub' and '288 binary not available', by reading a later audit branch's tree instead of immutable G7.4-A.2 release. **This was an assistant source-selection error, not a loss of project work.**

## Recovery actually committed to be-hoc
- 288 original Git blobs transplanted **byte-for-byte** via Git tree references, without re-encoding, replacing, deleting or renaming any source.
- `59_Visual_Public_Assets.html`: 288 ID→known versioned immutable raw WebP URLs (SHA commit above) with path checks, generic `mount(id)` only for decorative/choice roles; returns `EXACT_COUNT_NOT_APPROVED` for exact-count requests unless the future explicit per-asset policy grants it.
- `57_Visual_Lab_Host.html`: browse 288 real images lazily 12/page, query by ID/name/group. Prior 13-only preview removed.
- `19_KhongGianHocToan.html`: eight previously curated B20 word-question IDs mapped to exact G7 IDs (hen/candy/book/apple/ribbon/cookie); only **single illustrative** image, no hidden answer or numeric inference; fallback to existing G5/SVG on URL errors.
- CSS image load-state repaired: `kl-image-ready` added on real decode so the displayed WebP is not accidentally transparent due to G3 pilot CSS.
- Real 288 binary integrity `2910/2910` checks, visual core `43/43` and desktop/mobile-emulation Chromium `58/58` from CI run links:
  - https://github.com/Nguyennth19/new-lop-2/actions/runs/43824808895
  - https://github.com/Nguyennth19/new-lop-2/actions/runs/43824808882

## Remaining scope is not 288-image approval
1. **Exact semantic arithmetic counts** cannot assume `books_stack` means a single book or `banana_bunch` means a single banana. Compare by verified object-unit metadata, not metadata label only.
2. Only 8 existing B20 word questions are mapped to G7 in this runtime. All 288 are now loadable through a stable assetId API; remaining real lessons need their own structured visual-intent mapping. This is feature coverage, NOT missing assets or a repeat-approval demand.
3. GAS TEST and physical device execution are separate from GitHub automated visual acceptance; no deployment, student Sheet/points/stars or protected main/test-theo-main changes were done.
4. The 46 Microsoft Fluent SVG icons are separate from 288 WebP; owner visual/semantic QA 46/46 passed earlier, exact count still not blanket-approved.

## Rollback
Restore preceding source commit `0ddb618a7e53b0e93f99c80efe95f61188781a60` to remove binary graft and loader changes (would return to erroneous 13-only visual view), or restore the last verified stable branch for production. No protected branch mutated.
