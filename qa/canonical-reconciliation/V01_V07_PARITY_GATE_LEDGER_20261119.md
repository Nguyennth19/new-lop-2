# V01–V07 · Owner-reference QA / Non-regression evidence ledger
Date: 2026-11-19 · target `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`
Scope: original owner-tested `test-theo-main@f51a12cc07b44f0f893c2e0de40e387cc17b5c3b` UI vs current; independent 10-form original/frozen G7.4 TEST sources; exact GitHub source; verified B20 Sheet metadata. **Audit-only; not GAS LIVE.**

## Source and test contract
- Live B20 Sheet `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8` verified READ ONLY: 51 identifiers across 8 sections. Counts by source group: LV1 6 vertical +9 mental +2 word; LV2 6 word; LV3 10 vertical +18 missing_digit. All detailed answers/private data are NOT copied to GitHub or runner.
- G5 chooser `23_ChonCauHoiToan.html` deliberately limits displayed questions: 4 vertical, up to 2 each mental group, 2 word in LV1; 4 word in LV2; 6 vertical and 6+6+4 missing_digit in LV3. Synthetic QA test fixture will imitate 3 mental groups, producing 12/4/22 visible questions. This is an explicit **synthetic test setup**, NOT claim that 12/4/22 equals current authorized GAS response.
- V01 owner baseline 4 CSS Git blobs `01/02/03/04` equal current. `19_KhongGianHocToan.html` reference blob `269f190bc975dac605772831a71304e6ba233d9b`; current `3cb8683df956a65c14dc68a6304b55fd7c5bdf8f`. Current adds 3 buttons in B20 sidebar `PHÒNG HÌNH – TEST` that are absent from reference; **owner approval for learner placement not found**. Status `V01_OWNER_APPROVAL_PENDING_FOR_LAB_MENU`, potential unapproved UI addition. No automatic deletion of owner TEST lab functionality.
- V02 Browser A/B compiles actual `GiaoDien.html` using exact Git contents at both refs, mocks GAS, exercises LV1/LV2/LV3 on desktop 1366×768 and mobile Chromium emulation 390×844; collects DOM, scrolling, screenshots, keypad, word summary, theory. The browser response is synthetic, not connected to actual B20 Sheet or versioned GAS.
- V03 independent frozen G7.4 D2/D8A–D8B/D10 tests rerun in detached Git worktrees; preserve test authors' source and expectations unchanged. 10 families / 12 registered renderer IDs still require full live producer-to-renderer path.
- V04 legacy D2 manual carry sources byte same but auto mount absent in B20 current; do not restore old unapproved extra accordion.
- V05 preserve V1.1 mass relation (3 kg must show left higher than 5 kg) and V1.2 proportional liters (same 1L step, identical base datum), independently verified by original frozen tests. Classroom owner visual parity still pending.
- V06 registered 288 assets, 332 WebP and 288 PNG source pins remain; verify actual browser WebP load and fallback in isolated harness, never infer exact counts from label.
- V07 owner audio OK recorded for previous isolated profile (B5C), but actual on-device audible evidence from current GAS not established. Current mental rows deliberately have no per-question listen button.
- FAIL/PENDING gate must not be auto-promoted by green technical CI; V01 new lab UI and V04 D2 live host remain explicit owner-dependent regressions.
- Workflow: `.github/workflows/canonical-v01-v07-offline-browser.yml`. Main CI install independent Playwright, original TEST source worktrees and Chromium screenshots; no spreadsheet writes, answers, deploy, property changes.
- Initial workflow `44482619067` failed **before browser** on strict audit file allowlist because new NO-DEPLOY workflow path was not yet recognized; test guard extended by exact extra audit-workflow filename, **not** generalized to app files, commit `f6e4b23c2d1250f84b60bd9c5f37488e38525a08`. Initial FAIL retained.

## Gate statuses before browser proof
| ID | Requirement | Current result |
|---|---|---|
| V01 | Approved UI parity  | `OWNER_LAB_MENU_DELTA_DETECTED`; pixel A/B PENDING |
| V02 | LV1/LV2/LV3 B20 | `B20_LEGACY_SOURCE_PRESENT`; synthetic browser PENDING; LIVE PENDING |
| V03 | D1–D10 full form | `CORE_AND_STANDALONE_QA_IN_PROGRESS`; actual lesson binding UNVERIFIED |
| V04 | D2 no unintended panel | `WIRING_GAP_REVIEW`; standalone source PASS |
| V05 | D8A/D8B/D9 | `LAB_SOURCE_PASS`; device/owner and curriculum PENDING |
| V06 | WebP/Fluent/SVG/fallback | `SOURCE_QA_PASS_IN_SCOPE`; actual runtime asset semantics PENDING |
| V07 | TTS V1.2/V2 | `USER_ATTESTED_IN_OLD_STANDALONE_SCOPE`; new Chromium and GAS device PENDING |

## Change/no-loss and next gate
No `be-hoc` app merge, no main edit, no Google Sheet/GAS data mutation in V01–V07 audit. Prior frozen owner acceptance retained. When Chromium results arrive, append actual CI job IDs, screenshots and any FAIL without erasing these observations. Any proposed surgical UX fix requires owner-accepted target snapshot, before/after parity, independent CI and rollback.
