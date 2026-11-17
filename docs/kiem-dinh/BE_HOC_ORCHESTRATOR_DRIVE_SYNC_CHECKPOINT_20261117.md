# BE-HOC-VISUAL-ORCHESTRATOR-V1 — resumable Drive/source + lesson ingress checkpoint (2026-11-17)

## Authority and boundaries
- Target branch `be-hoc`. Preserve `main` and `test-theo-main`; no GAS TEST deployment, no score/points/stars writes.
- Reuse the inherited 288/288 WebP and 46/46 Fluent visual approvals and earlier CI. Do not reapprove these libraries. Newly imported source files get independent byte verification rather than claiming historical QA.
- This record reports VERIFIED actual repository writes separately from still-unimported Drive data.

## Code actually committed
- `83_Visual_Orchestrator.html`: infer renderer only when one documented, QA-backed curriculum policy matches lesson/type/skill; reject ambiguity, preserve D5/D9 E04 and private answer isolation; mount structured cards via dedicated slot and provide fail-closed fallback.
- `KhoBaiHoc.gs`: accept safe public `public_variant_json` with `skill_id`, optional explicit renderer ID; allow structured question types as DISPLAY_ONLY without legacy scoring. Increment cache schema version.
- `19_KhongGianHocToan.html`: dedicated renderer host for structured types; leave B20 four legacy types and trusted grading unchanged.
- QA added: `structured-source-ingestion.test.cjs`, `drive-png-master-pins.test.cjs`, previously existing `structured-auto-binding.test.cjs`; wired into orchestrator workflow. No CI success assertion recorded yet for these new commits.

## Drive source mirrors — CHECKPOINT ONLY (not 100% complete)
| Material | Verified in GitHub | Scope |
|---|---:|---|
| Historical G7 WebP assets | 288 | Existing PASS, untouched |
| Historical Fluent SVG | 46 | Existing PASS, untouched |
| Approved character pose WebP | 30 | Existing source mirror |
| Character source sheets PNG | 5 | Existing source mirror |
| SH01-SH12 and M01-M12 composite source PNG sheets | 24 | Existing source mirror |
| Individual PNG MASTER sources | 24 / 288 | NEW copied exact bytes, M01 and M02 all 12/12 |
| Style-only Drive reference originals | 2 | NEW, explicitly `style-reference-not-runtime` |

Exact master paths: `hinh-anh/nguon-drive/v1/png-master/M01/KL-M01-01.png` ... `12.png`; same for M02.
- M01 completion commit `06473883ade9e6a1e661ba2e4f982519b790f9a9`.
- M02 completion commit `df21337e8ad5a196e1113791f061e61542c3a0e9`.
- Style originals commit `9420e9003f2f927f8175ee97ffb86ce3be967628`; these two are **not approved as runtime/demo images**.
- Git object SHA pins and PNG signatures are asserted in `qa/be-hoc-orchestrator/drive-png-master-pins.test.cjs`, along with source-only style ref presence. 24/288 is NOT full source migration. Remaining 264 individual PNG masters still live in their original Drive folders; do not mark synchronized.

## Live curriculum source measurement
The configured runtime spreadsheet `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8` was read live:
- `01_Bai_hoc`: 75 rows (curriculum index; not 75 built lessons).
- `02_Cap_do`: 3 rows, all B20.
- `03_Nhom_bai`: 8 rows, all B20.
- `04_Cau_hoi`: 51 rows, all B20; exactly four types `vertical`, `mental`, `word_problem`, `missing_digit`. Current 21-column header **does not contain visual contract fields**.
- Consequently global registration of 12 renderer routes does **not** demonstrate runtime coverage of all ten teaching families; no invented SGK mapping or QA evidence.
- Machine-readable source receipt: `qa/be-hoc-orchestrator/live-sheet-coverage-20261117.json`.

## Remaining to close the single workstream
1. Copy and pin the remaining 264 individual PNG masters from Drive without recompression; keep existing 24 source sheets and 288 WebP unchanged. Record every source ID/hash and dedupe.
2. Extend real verified lesson data with public `visualContract` and per-lesson `rendererPolicies` using curriculum-backed `lessonId`, `skillId`, renderer family and E04 evidence. Never fabricate D3-D9 questions for B20.
3. Prove real lesson data -> public projection -> semantic image resolver -> 10 renderer families -> fallback/browser/GAS TEST. Keep grading on trusted existing path, release separately.
4. Verify new CI and actual Web App TEST deployment/phone E2E before any release claim.

**Current milestone:** SOURCE_CODE_READY_FOR_STRUCTURED_DISPLAY; MASTER_PNG_MIRROR_24_OF_288; REAL_TEN_FAMILY_COVERAGE_UNPROVEN; NO_DEPLOY.

## CI follow-up (verified after original checkpoint)
- GitHub Actions run `44011827493` on commit `dcf9a25edc6abc952b28ae272a05c143dbec727f`: **COMPLETED / SUCCESS**.
- Public-only module/contract tests, new structured source ingestion and exact-byte master PNG pins: PASS.
- Chromium desktop/mobile runtime smoke: PASS.
- This is GitHub CI, **not** proof of GAS TEST deployment, physical handset E2E, or 10 real lesson families.
- Run URL: https://github.com/Nguyennth19/new-lop-2/actions/runs/44011827493
