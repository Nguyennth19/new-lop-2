# F-A — E.0 policy review (candidate, NOT signed)
## Scope
Reference: `PE0_DAC_TA_NGHIEM_THU_BIEN_THE_TOAN_V1_20261113.md` and `PHIEU_TRINH_KY_CHINH_SACH_E0_TOAN_20261113.md`. These files are inherited unchanged. This review does not expand product scope.

### Findings
- P01: source books define mathematical/educational scope; project variants can change words, numbers, objects or visuals if evidence of skill equivalence remains. Proposed ACCEPT, owner PENDING.
- P02: V1 within constraints auto-auditable only when template authorized; V2 must prove cognitive equivalence (e.g. replacing constructed answer with MCQ may simplify); V3 structure requires reviewer. Proposed ACCEPT_WITH_CONDITIONS, owner PENDING.
- P03: NONE/DECORATIVE do not require exact book image; COUNTABLE/MEASUREMENT/GEOMETRY, when evidence-bearing, must preserve numerical/topological semantics. Source reuse first and count-safe. Proposed ACCEPT, owner PENDING.
- P04: G0–G8 is fail-closed; schema/proof != pedagogy approval. Proposed ACCEPT_FOR_TEST, owner PENDING.
- P05: quotas/sessions/families configurable per lesson, no fixed 30/6 or 4/2/2 global rule. Proposed ACCEPT, owner PENDING.
- P06: 100% deterministic generated-question checks and risk-based expert sampling complement, never replace, template/family approval. Record random seed, policy hash, reviewer, drift threshold. Proposed CONDITIONAL, owner PENDING.

### Required invariants
`PROJECT_ORIGINAL_VARIANT`, `PROJECT_DERIVED`, mathematical proof, explicit level and skill, source-scope status distinct from primary-page verification. Nothing here promotes `INDEX_VERIFIED` to `PRIMARY_VERIFIED`. V1/V2/V3 and visuals cannot waive source/math/gate checks.

### Disposition
`READY_FOR_OWNER_REVIEW`; `OWNER_SIGNOFF_PENDING`. No approval or release effected.
