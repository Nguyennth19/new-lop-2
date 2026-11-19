# BE-HOC UI regression reconciliation — 2026-11-19

Status: AUDIT_PARTIAL / LIVE_NOT_VERIFIED / NO_DEPLOY / NO_APP_SOURCE_MODIFICATION.
Baseline: be-hoc@59187c6fe0e1faadaeaf6f9aa5cacb76861b51ff
User-reported candidate /exec: AKfycbxzHiRvKpQLsxAg0wBP6NhkwHeiZ4zMLOaj7_QpmJ6oN3twHjrpFkyrZ1o_MvxfXMIcUQ (deployment source and version NOT independently verified).

## Verified code-path regressions
1. Extra D2 practice accordion in LV1: `19_KhongGianHocToan.html` calls `BE_HOC_D2_V12.mountB20(fullData,root,view)` for every exercise level; `49_D2V12_BaiHoc.html` appends `details.kl-d2-practice` with summary "Đặt tính: tự điền ô nhớ (luyện tập)" for both vertical questions and three-addend mental questions, including LV1. This is TEST-oriented no-star practice, not an intrinsic legacy vertical input.
2. Extra place-value SVG accordion: the same `19_KhongGianHocToan.html` unconditionally calls `BE_HOC_STRUCTURED_PUBLIC_V2.mountB20`; `64_SVG_Math_Public.html` appends `details.kl-svg-b20-support` for each valid two-digit vertical addition in any level. The user screenshot shows both controls.
3. Mental TTS reappeared: `41_HienThiCauHoiToan.html` defines `hear(q)` and appends it in all five branches of `mental(q)`. Introduced in be-hoc history at commit `000bbf9daeea`; `45_DieuKhienGiongDocToan.html` handles speech. `main` and `test-theo-main` at current heads do not include these mental speech controls.
4. Word problem summary: `41_HienThiCauHoiToan.html` in be-hoc still reads `q.summary` and renders a single escaped line under uppercase `TÓM TẮT`. It has stronger structured formula/result rendering than main, but the owner-reported previously optimized summary presentation is not established from verified code alone. `KhoBaiHoc.gs` passes `summary:x.summary` from the active spreadsheet. Must inspect real cell contents, line-break policy, and screenshots of accepted candidate before patching.
5. Runtime source remains uncertain: `CauHinh.gs` chooses Script Property `ID_GOOGLE_SHEET_DU_LIEU` before default B20 sheet `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8`. No authenticated Apps Script deployment version, script properties or source commit verification is available.

## Cross-source context
- `main@1d9bb77420e367d1739d2077f9e8c928a0417185` and `test-theo-main@f51a12cc07b44f0f893c2e0de40e387cc17b5c3b` are stable baseline references rather than canonical superset of be-hoc.
- Google Drive `LOP2_GLOBAL_HARD_QA_REPORT_20261117.md` explicitly warns no one branch contains all approved features and distinguishes technical QA from LIVE and release.
- Drive `LOP2_B20_BienBanChotVaNhatKyLoi_20261112` records that word problems need all six components, and summary/solutionPrompt missing is known regression B20-UI-02. The proposed 45-question lesson was at that time a blueprint, not a shipped implementation.
- Historic commits in be-hoc are not automatically proof of owner UX acceptance.

## Required correction gates
- Build a component-level UX ledger (approved vs TEST-only) for the full B20 page, source SHA and source-of-truth decision per feature; assess all inserted lesson controls, not just the three examples.
- Keep original D2/SVG standalone QA demos, but do not append TEST-only guidance automatically to learner cards unless explicitly approved by owner for the current lesson and level. Preserve original vertical inputs and trusted grading boundaries.
- Exclude mental question speech controls from the lesson if owner approved removal; leave other speech profiles/theory intact.
- Reconcile exact B20 sheet `04_Cau_hoi` summary values and source format with accepted screenshots/commit; do not silently rewrite data or suppress summary.
- Regression matrix: LV1/LV2/LV3, vertical, mental, word, desktop/mobile, loading/fallback, marks/grade, 288 assets; independently validate source, DOM, read-only GAS TEST, and rollback. No client answer key exposures permitted.
- Only after owner UX baseline and test evidence: controlled integration into be-hoc; fresh Apps Script pull/deploy, verify deployment version and OFF/ON/OFF in isolated GAS TEST.
- No MAIN/PROD changes, no student data or Script Properties writes as part of this audit.

## Separate critical permission issue
Drive metadata for default B20 workbook currently reports `anyone` permission with `writer` role. Treat as security finding requiring authorized owner review before production trust.
