# BE-HOC D2 Auto Carry / Multiple Addends — 2026-11-16
**Base:** `72d52c32aa81e37e989629c11c7f892b65d612a2`. No release or GAS deployment.

## Important source reconciliation
The exact `test-theo-main` SHA `f51a12cc` contains a **manual carry input** in `41_HienThiCauHoiToan.html`, and the current D2 V1.2 original view contains a **clickable remember button**. Neither frozen source is byte-identical to the new automatic carry behavior. The new request is implemented as a **separate extension** `51_D2_AutoCarry.html` and does not rewrite the two frozen D2 modules.

## Actual behavior
- 2 operands: same original two operand rows, but carry from visible digits is filled automatically in disabled transition slots.
- 3 operands: one additional row; 4 operands: two additional rows. A column carry can be 0, 1, 2 or 3. Example 18+27+39=84 has carry 2, not 1; 9+9+9+9=36 has carry 3.
- Algorithm for column i: `sumDigits[i] = carryIn + Σ digit(operand,i)`; `displayedCarryToNext = floor(sumDigits[i]/10)`. No full answer is placed in the public plan, and no new grading endpoint exists.
- Bài 20: dynamic D2 sidecar for `vertical` or `mental` with `variantType=three` only, if `valid=true`, same verified lesson ID `toan_b20`, valid LV and result within PV100. For three-term items, availability depends on actual Sheet schema and values. No extra questions are invented or mapped to unrelated exercises.
- PV1000 stays QA-only for 2–4 operands with three columns. `998+1+1`, `500+499+1` rejected; **no result=1000**.

## Scoring and ownership policy
**Proposed scoring for later server integration:** one question = one evaluated result; full digit-vector must match to count as correct. Auto-carry is an instructional hint and contributes no separate marks. No star/score for partial columns or automatic carry. A trusted server must independently resolve the question by lessonId+questionId and calculate expected result; never trust a client claim of correct. Until separately approved, D2 remains a non-scored practice companion; unchanged original B20 grading controls its own submit. No change to `26_ChamCauHoiToan.html` or score/star files.

## Test
Contract 2–4 operands, carry 0/1/2/3, renderer extended rows, PV100/1000 overflow rejections, no browser-side grading, no state writes. Desktop Chromium 1366px/mobile emulation 390px. Device QA and GAS deployment remain pending.

## Technical QA closure
- GitHub Actions [43811369732](https://github.com/Nguyennth19/new-lop-2/actions/runs/43811369732): **SUCCESS** on `e6b30fa28edefb60b9641cbc6fe39712e0a80712`; **39 contract assertions + 20 private scoring-policy assertions + 27 Chromium desktop/mobile-emulation checks = 86 PASS**.
- `qa/be-hoc-d2-auto/private-scoring-policy.qa-only.cjs`: deterministic offline evaluation of full result digits, private fixture only, one correct question gets questionCredit=1, any wrong digit gets 0, auto-carry and partial answers get 0 additional marks, starCredit=0 always. This is **not** a GAS endpoint and never imported into student HTML.
- No changes to `26_ChamCauHoiToan.html`, `MayChu.gs`, protected branches, manifest, or official lesson mapping. No student-data write; no actual GAS test, no actual Android/iOS device QA.
- Reproduction: `node qa/be-hoc-d2-auto/d2-auto.test.cjs`; `node qa/be-hoc-d2-auto/private-scoring-policy.test.cjs`; Playwright command in `.github/workflows/be-hoc-d2-auto-no-deploy.yml`.
