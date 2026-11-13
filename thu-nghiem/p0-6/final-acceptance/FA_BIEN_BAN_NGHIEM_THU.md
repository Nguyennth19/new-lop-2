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
| G5 TEST preview | PASS_FOR_ISOLATED_TEST_PREVIEW | CI 43453411019: Chromium desktop/mobile 8/8; screenshot/HTML/results artifact 14053541276; no Version 6 deployment |
| G7/G8 | OWNER_APPROVED_TEST_SCOPE | Owner explicitly approved both in conversation; documented decision; not a production signature |
| F-A new QA | DONE (TECHNICAL TEST ONLY) | Run 43447904122 SUCCESS at 2b3a3893226725b0e149811e0bea15e1fa3298cf; pedagogical signoff still pending |
| F-B handover readiness | READY_FOR_TEST_HANDOVER | G7/G8 owner TEST approval + isolated G5 browser QA success; no release or Web App Version 6 change |
| RELEASE_READY | false | No deployment permitted |

### Owner signoff section — deliberately blank
`policyId`: PENDING; `policyVersion`: PENDING; `policySha256`: PENDING; `decision`: PENDING; `scope`: PENDING; `conditions`: PENDING; `reviewerRef`: PENDING; `reviewedAt`: PENDING; `evidenceRef`: PENDING.

### Next gate
Owner to approve/revise E.0 P01–P06, confirm B21 skills and LV3 cognitive rule. After decision, revise only authorized TEST candidate artifacts, rerun all applicable G0–G8, capture GitHub Actions Run ID and exact SHA. Do not claim F-A closed or pass to F-B until evidence meets gate.

## F-A.1 outcome
Policy P01–P06 consolidated for owner review in `FA_POLICY_SIGNOFF_PACKET.md`. LV3 reasoning overlay QA success is evidence only for a proposed offline family extension, not approved curriculum or deployed feature. F-A closes only for isolated TEST acceptance after real Chromium QA; F-B handover is authorized for TEST continuation, not production.

## G5 final distinction
The new compatibility bridge renders and grades all 8 composed B21 candidates in an offline harness built from existing renderer/grader source. Its successful CI is **not** a Web App browser integration result. Chromium interactive QA has since been performed for the isolated TEST preview and passed at run 43453411019 (desktop/mobile). **No** real Google Apps Script Web App Version 6 deployment/browser verification has occurred; such evidence is not claimed. F-A TEST-only acceptance is closed and F-B may continue from this branch; production remains blocked. `RELEASE_READY=false`.

## Closure amendment – final F-A TEST signoff boundary
**F-A Acceptance: CLOSED_FOR_ISOLATED_TEST_SCOPE** after 8/8 Chromium desktop and mobile checks in run `43453411019`, source SHA `226bc61be8b7a8de10c9820d3fad38362fa9b4ce`; screenshot artifact ID `14053541276`. G7/G8 owner approval recorded as explicit chat decision, not third-party identity signature. `RELEASE_READY=false` with no merge/deployment. The closure does **not** certify Version 6 live integration. Handover file: `FA_FB_HANDOVER.md`.
