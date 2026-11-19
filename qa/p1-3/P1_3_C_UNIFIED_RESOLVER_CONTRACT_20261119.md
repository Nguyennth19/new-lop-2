# P1.3-C — Unified Asset Resolver & Fallback Contract — TEST closure (2026-11-19)

## Scope and safety
New isolated, not production-loaded `89_Asset_Unified_Resolver_TEST.html`. This file is intentionally NOT added to `GiaoDien.html`, main manifest, or deployed GAS. Existing `59` (288 WebP), `85` (46 Fluent SVG), `87` (30 characters), `88` semantic router, and `83` renderer orchestrator remain unmodified. Starting base: P1.3-B.3 commit `13e22242ed4145ba92e7b0e2b773e710ad300c4c`.

## Contract
- `plan({assetId | canonicalObject, visualIntent, countUnit?, exactQuantity?})`: delegates to established semantic router, returns normalized kind/ID/role/url without changing any permission. Rejects unsupported/ambiguous assets; exact quantity only where existing Fluent policy proves unit and integer 1..50.
- `resolve({..., fallback?})`: validates primary first. Unauthorized primary always denies; a fallback never overrides an authorization failure. Fallback may only be an explicitly named, prevalidated **DECORATIVE** asset. No fallback for CHOICE/EXACT_COUNT.
- `mount(target,request)`: uses existing semantic adapter; keeps existing markup and on image-load error attempts at most one explicit semantic-safe fallback. Without fallback preserves existing content and reports that via optional callback.
- `planQuestion(data,question)`: delegates all renderer/lesson/skill/publicVariant authorization to existing orchestrator, then normalizes the approved image plan. It **does not** bypass curriculum policy or introduce a new renderer.
- Never substitutes character illustrations for count-safe images; never guesses from lesson prose; unknown IDs fail closed; no student grading/answers.

## Semantic fallback eligibility
- Character WebP → character WebP only, same actor/context group (e.g. robot to robot or boy-home to boy-home); explicit ID mandatory. Same group is a *technical eligibility rule*, not a blanket owner approval of the replacement.
- 288 WebP → 288 WebP only if exact metadata label **and** category both match; explicit ID mandatory. Does not mean arbitrary assets in one category are interchangeable.
- Fluent SVG → no automatic alternative in V1 (different icons may depict a distinct count unit/object despite overlapping aliases).
- No cross-family substitutions and no fallback for choice/quantity-sensitive tasks.

## Known limitation — fidelity over silent guessing
The current Fluent `85_Fluent_Asset_46.html` mount adapter has no image onError callback. Unified resolver reports `fallbackSupportedOnLoadError=false` for Fluent, and cannot promise automatic load-error recovery until a separately QA-approved adapter extension. Existing content remains, but rendered failed IMG slots are not fully recoverable by this module alone. Direct legacy `83.chooseAsset` remains unchanged and does not route `KL2_*`; consumers must explicitly adopt the new isolated resolver in a later approved integration. Neither defect is masked by passing unit tests.

## CI gates
- Existing P1.3-A 288-PNG source root pin; P1.3-B 35 image source root and B.2/B.3 governance regression.
- Exhaustive metadata coverage: 288 WebP + 30 character + 46 Fluent = 364 catalog references; positive decorative plans for all, fail-closed exact-count/choice policies, approved Fluent unit/count, character fallback callbacks and no-loop behavior, cross-family and wrong-semantic negatives.
- Report TEST technical PASS only when relevant GitHub Action succeeds at HEAD.
- Before app integration: extend Fluent image error contract safely; verify actual browser/mobile fallback/cleanup; approve public placements and fallback pairs; sign separate TEST then MAIN release. No deployment inferred.

## Rollback
Reset only `audit/p1-3-c-unified-resolver-20261119` to `13e22242ed4145ba92e7b0e2b773e710ad300c4c`; preexisting 288 PNG and 332 WebP, QA, renderer, CSS, UI and release manifests untouched.
