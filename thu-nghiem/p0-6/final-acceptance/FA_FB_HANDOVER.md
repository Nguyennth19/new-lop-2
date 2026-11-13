# F-A → F-B – BÀN GIAO CHÍNH THỨC PHẠM VI TEST ĐỘC LẬP
**F-A close status:** `CLOSED_FOR_ISOLATED_TEST_SCOPE` (not production).
**Owner:** explicit G7/G8 TEST approval recorded in `FA_OWNER_APPROVAL_G7_G8_20261113.md`.
**G5 gate:** `PASS_FOR_ISOLATED_TEST_PREVIEW`. Chromium desktop/mobile 8/8 interactive QA.
**Provenance:** Actions Run `43453411019`, head `226bc61be8b7a8de10c9820d3fad38362fa9b4ce`; artifact `14053541276`, 2 PNG screenshots, generated HTML, JSON evidence; summary `FA_G5_BROWSER_QA_20261113.md`.

## Accepted F-A TEST deliverables
1. E.0 P01–P06 acceptance direction, TEST-only policy conditions, G7/G8 owner decision record.
2. B21 (8 questions, LV1 4 / LV2 2 / LV3 2, 3 families, 2 subskills), parent E03 generator/composer and deterministic math proof; separate LV3 reasoning strategy (bridge-to-ten).
3. G5 Compatibility Bridge reusing existing `41_HienThiCauHoiToan.html` and `26_ChamCauHoiToan.html` without modifying these protected modules.
4. Independent responsive HTML preview generated from inherited renderer/grader, tested on desktop Chromium and iPhone 13 emulation. All question fields checked for correct/wrong/blank, with no page errors or horizontal scrolling.
5. F-A journal/state/decision register, CI evidence, owner approval record, recovery guide and acceptance minutes.

## F-B must preserve
- Do not conflate **isolated browser preview** with deployed Apps Script Web App TEST Version 6. No TEST V6 push or Web App upgrade occurred. Any actual Apps Script integration/deployment needs separate approval and QA in F-B.
- Do not mutate MAIN, `test-theo-main`, Version 6, or signed B20 H.1. Keep `RELEASE_READY=false`, no student data, grading persistence, scores or stars.
- SGK/SBT scope status `INDEX_VERIFIED`; avoid false book-page verification claims.
- E03 candidate JSON remains DRAFT/TEST; owner policy signoff cannot be simulated by changing source metadata.
- Source branch `test/p0-6-fa-policy-pedagogy-20261113`; verify latest HEAD and Actions before continuing, and work on F-B TEST branch only.

## F-B entry state
`READY_FOR_F_B_TEST` with reproducible QA. First task in F-B: decide bounded integration into isolated TEST environment or prepare generalized family templates with existing renderer limits; not broaden P0 scope.
**RELEASE_READY=false; PRODUCTION_BLOCKED.**
