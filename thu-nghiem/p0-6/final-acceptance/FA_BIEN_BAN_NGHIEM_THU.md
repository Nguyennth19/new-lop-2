# BIÊN BẢN F-A — CHÍNH SÁCH & SƯ PHẠM (DỰ THẢO)
**Scope:** combine F1 + F2; technical source P0.6 A–E.0.3; B21 candidate. **Status:** `PENDING_APPROVAL`. Not signed.

## Acceptance matrix
| Gate | Status | Reason |
|---|---|---|
| Source branch and historical technical CI | DONE | GitHub head and E03 success verified |
| E.0 P01–P06 policy drafting | DONE | Review and decision register prepared |
| E.0 owner decision | OWNER_APPROVED_TEST_SCOPE | Explicit G8 approval recorded in FA_OWNER_APPROVAL_G7_G8_20261113.md; standalone cryptographic release signature not asserted |
| B21 LV1 / LV2 acceptance | OWNER_APPROVED_TEST_SCOPE | G7 approval recorded; source remains INDEX_VERIFIED |
| B21 LV3 differentiation | OWNER_APPROVED_TEST_SCOPE | G7 approval recorded; offline two-field bridging proof and interactive harness PASS; live deployment not certified |
| G0–G4/G6 inherited technical | DONE (E03 scope only) | Offline receipts; not an F-A pedagogy approval |
| G5 offline / live | OFFLINE_BRIDGE_PASS / LIVE_BLOCKED | CI 43451418264 SUCCESS; no live Web App browser/mobile QA |
| G7/G8 | OWNER_APPROVED_TEST_SCOPE | Owner explicitly approved both in conversation; documented decision; not a production signature |
| F-A new QA | DONE (TECHNICAL TEST ONLY) | Run 43447904122 SUCCESS at 2b3a3893226725b0e149811e0bea15e1fa3298cf; pedagogical signoff still pending |
| F-B handover readiness | BLOCKED | Still awaits E.0 owner decision, B21 scope approval and G5 interactive verification |
| RELEASE_READY | false | No deployment permitted |

### Owner signoff section — deliberately blank
`policyId`: PENDING; `policyVersion`: PENDING; `policySha256`: PENDING; `decision`: PENDING; `scope`: PENDING; `conditions`: PENDING; `reviewerRef`: PENDING; `reviewedAt`: PENDING; `evidenceRef`: PENDING.

### Next gate
Owner to approve/revise E.0 P01–P06, confirm B21 skills and LV3 cognitive rule. After decision, revise only authorized TEST candidate artifacts, rerun all applicable G0–G8, capture GitHub Actions Run ID and exact SHA. Do not claim F-A closed or pass to F-B until evidence meets gate.

## F-A.1 outcome
Policy P01–P06 consolidated for owner review in `FA_POLICY_SIGNOFF_PACKET.md`. LV3 reasoning overlay QA success is evidence only for a proposed offline family extension, not approved curriculum or deployed feature. F-A remains conditionally prepared but **not signed/closed**; F-B handover is not authorized.

## G5 final distinction
The new compatibility bridge renders and grades all 8 composed B21 candidates in an offline harness built from existing renderer/grader source. Its successful CI is **not** a Web App browser integration result. Consequently F-A cannot truthfully be marked fully DONE for the original interactive-test acceptance requirement, and F-B handover remains `BLOCKED` for this last evidence item. `RELEASE_READY=false`.
