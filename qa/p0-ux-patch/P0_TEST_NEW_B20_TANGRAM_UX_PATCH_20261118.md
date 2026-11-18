# P0 TEST NEW — B20 & Tangram UX patch · 2026-11-18

**Branch:** `test-new`. **Starting rollback baseline:** `12f32d381626b6092173635b69f295550831f50a` (last already accepted B20 user-reported working screens).
**Scope:** strictly the requested UI/pedagogical patch. **MAIN/production Google Sheets/answer keys/25-case G2B source decisions untouched.**

## Changes precisely matched to the seven user observations

1. **B20 LV1 & LV3 vertical:** remove *two redundant collapsed panels* below each real exercise:
   - `49_D2V12_BaiHoc` companion practice (the red-marked `Đặt tính: tự điền ô nhớ`);
   - `64_SVG_Math_Public` base-10 expansion (the red-marked `Xem minh họa chục – đơn vị`).
   The modules remain available as isolated references; only their mounting in B20 is removed. Existing vertical inputs remain.
2. **Trusted grading / color:** after one-use GAS TEST submission with all three vertical slots entered, server may return *only* `cellFeedback[questionId]` = fixed enum `correct|wrong` for `ones,tens,carry`. The whole-question grade is still exclusively from `perQuestion.status` (all 3 required). **No immediate local correctness, no private answers/expected digits/carries transmitted, no star/score writes**. Incomplete vertical submissions never receive per-cell hints. Editing an answer clears obsolete marks and score panel state.
3. **LV1 mental:** three semantic mini-modules laid out on one desktop row using section container width, compact spacing, responsive 2/1-column fallback. Removed **only the TTS button from mental items**, not other speech tools.
4. **B20 word problems LV1 + LV2:** add the visible/public question TTS button and emphasize *source-provided* summary numbers while HTML-escaping the original text. No new prompt or answer supplied.
5. **LV3 mixed missing-digit section 4:** reduce from 4 to **3** question cards. Client `23_ChonCauHoiToan`, trusted server `ThanhTichMayChu.achSelect_` and browser smoke `G3B_BrowserSmoke` limits are synchronized. Source Sheet 51 questions and their IDs remain unchanged.
6. **LV3 sections 2/3/4:** add visually clear, keyboard-compatible `Ô nhớ` (scratchpad) for each selected puzzle card. It has `data-ml-scratch`, **not** `data-ml-field` and `data-ml-q`, hence it is *not included in trusted grading or rewarded*. These are optional learning notes, not source answers or scored extra columns.
7. **Tangram D5:** remove the button and shortcut that auto-resolved/rotated/placed the active piece (`Ghép vào mẫu`). Replace with **`↺ Làm lại`**, enabled without an active piece, which clears all piece positions/rotations via the native `session.clear()`. Existing select, rotate, drag, manual target placement, keyboard target and review-only policy unchanged.

## QA: evidence and hard boundaries

- `qa/p0-ux-patch/test_ux_contract.cjs`: semantic/source-gate checks for each change, existing G3-A/G3-B no-reward/read-only security tests still mandatory.
- `qa/p0-ux-patch/test_ux_browser.cjs`: Chromium on synthetic B20 at desktop 1600×900 and mobile 390×844, followed by actual Tangram core/view reset interaction. **Not real GAS nor SGK source-exact visual signoff**.
- Existing integrated tests: `qa/g3a/`, `qa/g3b/`, `qa/p0-g2b-adaptation/`; B20 data still 51 questions in private TEST NEW Sheet, 25-case reviewed source signatures still 0/25.
- Run: GitHub Actions workflow `g3b-b20-trusted-preflight.yml` on exact `test-new` HEAD; **must report two completed SUCCESS jobs before user Pull and update current GAS deployment**.

## GAS TEST update and human acceptance (not executable through current connector)

1. In existing `Lop2-P0-TEST-NEW` GAS editor **Pull existing `test-new` branch**, verify HEAD matches CI PASS commit.
2. **Triển khai → Quản lý các lượt triển khai → Sửa → Phiên bản mới → Triển khai** the already existing deployment, *not* new deployment; keep authenticated TEST identity and private Script Properties.
3. Hard-refresh same `/exec`; test LV1 vertical (neither appendix shows; field feedback only after trusted submit), 3 mental mini-cards in one desktop row/no speech, LV1/LV2 word TTS and summary, LV3 section4 3 cards and sections2–4 carry scratch, D5 manual placement and reset.
4. Keep the **two independent original P0 acceptance reports** pending until live GAS B20 Network/token/no-write and G2B source/visual reviewer evidence. Screenshots/user confirmation are visual tests, not release authorization.

**No production deployment / student release.** Rollback deployment by choosing prior TEST deployment version; GitHub source baseline `12f32d3816...` remains stable. New UI code changes are reversible and do not alter MAIN.
