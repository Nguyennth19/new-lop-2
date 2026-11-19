# P1.3-B.3 — Final Asset Governance & Approval Closure (2026-11-19)

## Formal decision
**TECHNICAL GOVERNANCE PASS / PRODUCTION NO-GO**. P1.3-B can be closed for source integrity, versioned asset inventory, and existing decorative-only routing contract. It is *not* an approval to change the app, main manifest, semantic permissions or production deployment.

## Verified inheritance / evidence
- P1.3-A base PASS: `eb3fef5504f39935d16a0e9d3ad400fd0066fc61`.
- P1.3-B.1 independent Drive ↔ GitHub SHA-256, 35/35 PASS; source root `bb51a57de383331217588693f73e8b8ec059e345fc1ea2eb14b025664086f9d4`.
- P1.3-B.2 checkpoint: `12bab75879c20e7f846f6aabb714d4c6b9cfc176`, B.2 manifest `qa/p1-3/P1_3_B2_CHARACTERS_MANIFEST.v2.json`.
- Runtime components audited: `87_Characters_Drive_30.html`, `88_Visual_Semantic_Router.html`, `83_Visual_Orchestrator.html`, existing visual library and B.2 manifest.

## Approval and rights matrix
| Asset class / interface | Previously established capability | Allowed in present audited reference | New approval necessary |
|---|---|---|---|
| 30 `KL2_*` WebP | `DECORATIVE` via semantic router | YES, only within existing reference/policy constraints | YES for new public placements or changed role |
| 30 `KL2_*` WebP as `CHOICE` | Rejected by router | NO | YES, plus separate pedagogical and technical QA |
| 30 `KL2_*` WebP as `EXACT_COUNT` | Rejected by router | NO | YES, precise count-unit semantic proof + QA |
| 5 PNG source sheets | Archived, provenance-verified source | NO runtime display | YES for any public/runtime use |
| Legacy `KL_* v1.0.0/v1.0.1` | Separate archives/corrections | NO automatic alias/replacement | YES for mapping or replacement |
| Other 288 WebP / Fluent / renderers | Their independent contracts apply | UNCHANGED | No policy extension implied |

**Rights terminology**: this matrix governs *internal permission and approval*, not intellectual-property licensing. Independent license/ownership documentation must be checked separately before any new distribution claim.

## Exact routing and fallback behavior
1. The *supported* route for `KL2_*`: `BE_HOC_VISUAL_ORCHESTRATOR.planQuestion` → `BE_HOC_VISUAL_SEMANTIC.plan` → `BE_HOC_VISUAL_SEMANTIC.mount` → `BE_HOC_CHARACTERS_30.mount`, conditional on the lesson's visual contract. No guessing from illustrations.
2. `BE_HOC_VISUAL_ORCHESTRATOR.semanticPlan` delegates correctly to semantic router. The **direct legacy `chooseAsset` path does NOT support `KL2_*`**. It resolves only Fluent and the 288-asset library; do not advertise universal direct orchestration until a separately approved code change and regression.
3. Missing asset ID: the registry returns `UNKNOWN_CHARACTER` (fail-closed); nondecorative intent is rejected (`CHARACTER_DECORATION_ONLY` / `CHARACTER_ILLUSTRATION_ONLY`).
4. Image network/load error: `87_Characters_Drive_30.html` removes its inserted image, invokes supplied `onError`, and does not clear existing card content. **No automatic equivalent image selection** is implemented; this is a preserve-existing-artwork fallback, not a guaranteed replacement.
5. Orchestrator `mountLesson` denies missing/unauthorized policies and may show a fixed unavailable message in a display-only slot. It must not fabricate an image or a renderer on that path.
6. Character registry URL is pinned to GitHub commit `d780609bd93cf8dbdf20f77aebfea9c89b9d85e7`. Altering publication targets or the registry URL requires explicit deployment QA.

## Closure gates
| Gate | Status | Why |
|---|---|---|
| 288 PNG MASTER / 332 WebP non-regression | PASS | Git tree/blob equality + CI |
| 35/35 character source authenticity | PASS | independent B.1 Drive SHA-256 |
| B.2 versioned manifest / 30 semantic mappings | PASS | QA and in-source registry tests |
| Character role / count safety / disallowed legacy aliases | PASS | semantic fail-closed tests |
| Runtime semantic route + fallback semantics | PASS WITH DOCUMENTED LIMITATIONS | no character direct `chooseAsset`; no auto image replacement |
| Rights/licensing documentary proof for new distribution | NOT VERIFIED | independent human/document evidence needed |
| Owner sign-off on new visual public placements | NOT APPROVED | no new approval asserted |
| Main manifest integration / student release | NO-GO | out of audit scope |

## Required change control for future feature requests
- **Approval A:** owner signs character role/placement (specific asset IDs, page/slot, environment and intended context).
- **Approval B:** implementation/test plan if expanding `chooseAsset`, adding fallback mappings, replacing legacy versions, or changing semantic roles. Tests must cover deterministic selection, error feedback, and no regression across existing 10 question types.
- **Approval C:** release owner approves TEST and then production separately after device QA and license review.
- None of these signatures is inferred from technical CI, previous asset source approval or this report.

## Rollback
B.3 was branched from B.2 `12bab75879c20e7f846f6aabb714d4c6b9cfc176`. Roll back B.3-only commits; preserve P1.3-A, B.1, B.2 binary assets, current UI, renderer, manifest MAIN and production. No binary assets or existing page code were modified.
