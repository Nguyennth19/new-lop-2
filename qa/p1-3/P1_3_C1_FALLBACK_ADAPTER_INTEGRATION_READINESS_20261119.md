# P1.3-C.1 — Fallback Adapter Hardening & Integration Readiness (2026-11-19)

## Decision
**TECHNICAL TEST PASS / APP INTEGRATION NO-GO.**
Chrome headless and Node tests succeeded. This is not approval to change production adapters or to release the new resolver to students.

## Inherited baseline
- P1.3-C checkpoint: `4be8031682e945cb951c40ccecd0c68ba6ec51e8` (TEST-only).
- Independent 35/35 Drive↔GitHub character source pin maintained.
- 288 original PNG MASTER and 332 WebP unchanged.
- UI, CSS, renderer, lesson policy, current main manifest and public student deployment not modified.

## Changes, all isolated to audit TEST
1. `89_Asset_Unified_Resolver_TEST.html`: harden Fluent image error detection by observing images inserted by the existing 85 adapter. On first error, remove the entire Fluent scene to avoid a mathematically misleading partial exact-count display. Preserve prior card content and emit one optional fallback event. No attempts to swap Fluent semantics automatically.
2. `qa/p1-3/test_p1_3_c1_fluent_hardening.cjs`: simulated DOM regression checks including 3-count with a single failed image, simultaneous errors, removal idempotency, retained old content, denied renderer.
3. `qa/p1-3/p1-3-c1-browser-smoke.html`: actual Chrome headless integration exercising an image source deliberately made invalid for Fluent count and character one-step fallback, rendered DOM survival and renderer denial.
4. `.github/workflows/p1-3-c-unified-qa.yml`: added C.1 Node + Chrome steps, preserving inherited source integrity gates and uploading browser evidence.

## Verified test output
- Node P1.3-C unified: 364 decorative asset plans, 411 denials.
- Node P1.3-C.1 Fluent hardening: partial scene fully removed, preexisting card retained, callback exactly once, invalid fallback denied.
- Actual browser: GitHub Actions run `44460688987`, Chrome headless step **success**, with `data-p13-c1="PASS"` marker and genuine `img` error event checks.
- Browser evidence artifact: `p1-3-c1-headless-chrome-evidence`, artifact ID `14499642698`. This is browser DOM-level evidence, *not* device/manual visual validation.

## Fallback contract / safety
- Explicit, prevalidated, same-group/same-semantics decorative-only replacement, at most one attempt.
- Fluent does not automatically substitute another icon. Failure deletes **entire** Fluent scene, particularly exact-count scenes; original lesson content is preserved.
- No fallback for CHOICE or EXACT_COUNT; no inferred unit or count.
- Unauthorized renderer binding, lesson skill/type, unknown asset ID, and legacy aliases remain fail-closed.
- Semantics: a same-group character replacement is technically eligible but a proposed new public placement/substitution still needs separate owner approval.

## Integration readiness boundaries
| Gate | Result |
|---|---|
| Source provenance and binary regression | PASS |
| Unified TEST semantic selection across 364 references | PASS |
| Fluent image-load error and partial-count removal | PASS in Node and Chrome headless |
| Character one-step fallback | PASS in Chrome headless |
| Orchestrator policy delegation | PASS in automated tests |
| Actual integration into the running app, GAS TEST | NOT PERFORMED |
| Physical phone, browsers, responsive/UI visual regression | NOT PERFORMED |
| Human pedagogical/visual approval for fallback pairs | NOT GRANTED |
| MAIN manifest and public release | NO-GO |

## Next safe step
P1.3-C.2 — opt-in GAS TEST integration behind a disabled-by-default flag, explicit source loading order and rollback, with device visual screenshots, mobile QA, and owner review. Never integrate in MAIN or replace approved adapters automatically.

## Rollback
Revert only audit P1.3-C.1 commits from `audit/p1-3-c1-fallback-hardening-20261119` to base `4be8031682e945cb951c40ccecd0c68ba6ec51e8`. All existing image bytes remain unchanged.
