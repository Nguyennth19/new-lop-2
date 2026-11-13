# F-C — BIÊN BẢN KIỂM TOÁN TỔNG HỢP P0.6 (DỰ THẢO TRÌNH CHỦ DỰ ÁN)
Date: 2026-11-14 (Asia/Ho_Chi_Minh)
Audit scope: isolated TEST foundation only. Status: TECHNICAL_EVIDENCE_REVIEWED / OWNER_P0_CLOSURE_PENDING.
Base branch: test/p0-6-fb-from-fa-20261113
Base HEAD and checkpoint: f60eb781df402df3373c4c0f5987087ab01a5764
Audit branch: test/p0-6-fc-audit-20261114
RELEASE_READY=false. No deployment, MAIN/test-theo-main/V6 changes, learner data, scores or stars.

## Rules
PASS means only the specifically tested scope passed. PENDING is unapproved/unverified evidence. BLOCKED denies use or release. NOT_APPLICABLE means deliberately outside isolated TEST scope, not a pass. The audit reuses previously passed tests, does not reconstruct modules or pretend prior SHA's runs certify new changes. No owner signature is fabricated.

## Traceability matrix
| Gate | Technical evidence | F-C status and limit |
|---|---|---|
| A data contract/validator | BAO_CAO_P06_A_KIEM_KE_VA_HOP_DONG_V1.md; Actions 43418492205 at 43b659208b41ae41d86ea6756f229186ecee3760 | PASS OFFLINE; full formal JSON schema library validation not certified |
| B adapter, registry, fallback | BAO_CAO_P06_B_ADAPTER_REGISTRY_QA_ROLLBACK_20261113.md; Actions 43420505949 at 793970c77cf3609749451a7db6e377627c12b56e | PASS OFFLINE; not GAS runtime rollback |
| C QA/grading | BAO_CAO_P06_C_QA_GRADING_CONTRACT_20261113.md; Actions 43428400824 at 75ef6cdf0f7b457be67f9c286fafd9bbdbfad9e7 | PASS OFFLINE; free-form written answers require manual review |
| D renderer | BAO_CAO_P06_D_RENDERER_REGISTRY_QA_ROLLBACK_20261113.md; Actions 43429236553 at ebe1dbf396cc1e9f1f4ae2b051079f3b563878cc | PASS offline 30/30 parity; interactive Version 6 integration not certified |
| E, E01-03 generator/composer | BAO_CAO_P06_E03_MULTI_FAMILY_COMPOSITION_20261113.md; Actions 43440199612 at 4da9e6eedce8e39a912a9dfbedfe255421941a40 | PASS TECHNICAL 27/27 E03, B21 8 composed; source INDEX_VERIFIED, not primary-page verified |
| F-A policy/pedagogy/B21 browser | FA_CURRENT_STATE.json, FA_OWNER_APPROVAL_G7_G8_20261113.md, FA_BIEN_BAN_NGHIEM_THU.md; Actions 43453411019 at 226bc61be8b7a8de10c9820d3fad38362fa9b4ce | PASS ISOLATED TEST G5 8/8 both desktop/mobile, G7/G8 owner-approved TEST scope only; no production signoff |
| F-B.1 versioned gating | FB_QA_AND_GOVERNANCE_20261113.md; Actions 43455957462 at 900edeebb5c88518312596aa3e7d784415d9c4b4 | PASS TEST, 10 groups, blocked by default |
| F-B.2 multi lesson governance | FB2_MULTI_LESSON_GOVERNANCE_20261113.md; Actions 43459000348 at 70c4eedd27b8e41bcccb71cf355cbe686480d26e | PASS TEST, 12 groups, per-lesson rollback |
| F-B.3 B20 independent onboarding | FB3_SECOND_LESSON_B20_20261113.md, FB3_B20_BROWSER_QA_20261113.md; Actions 43461674746 at 42f7d47dfb9168e34f10b4da4371e8ca224dd1bc and governance 43461583845 | PASS ISOLATED TEST, B20 30/30 per profile, B20 separate trust adapter |
| F-B.3 checkpoint governance | FB_CURRENT_STATE.json; Actions 43462067810 at f60eb781df402df3373c4c0f5987087ab01a5764 | PASS checkpoint governance; not evidence of V6 runtime deployment |
| F-C formal P0 closure | This record | PENDING OWNER DECISION; not closed, not release-ready |

## B20 integrity (exact Git tree at base checkpoint)
- runtime.json Git blob b14d556c5deeb561106e0c81f275387bef538842; 30 questions, six sessions, six kinds from independent B20 QA and H1 reports.
- H2 owner decision file Git blob 7faaf36b5b74f0ae233e8e3060b47b3b3123e74c; distinct from B21 G7/G8.
- 41_HienThiCauHoiToan.html blob 50501ccc3cb5e7801fd563807e21b76d2a51c8f9; 42_AdapterBienTheB20.html blob e14a0c831837a91125a59dd5ce2d65288d056038; 26_ChamCauHoiToan.html blob d2c9e0dbf745366eabeadfefe0686b60cf5d9a47.
- B20 browser source run 43461674746 SUCCESS, desktop/mobile 30/30, artifact 14055893099. Browser artifact retention is limited; source, reports, SHA and scripts remain in Git.
- B21 G5 independent browser run 43453411019 SUCCESS 8/8 desktop/mobile, artifact 14053541276. B20 approval, B21 G7/G8 and QA receipts MUST NEVER be substituted across lessonId.
- Registry admits B20 and B21 TEST-only; B24 and tieng_viet_doc_hieu placeholders remain pending independent QA and blocked.

## CI failures and recovery
- F-B.3 initial YAML parse 43460161855 -> corrected, 43460267147 SUCCESS.
- Registry test index assumption -> corrected by lessonId lookup, 43461166510 SUCCESS.
- Browser runner external apt dependency failed 43461382294 -> switched to Chromium-only installation; 43461674746 SUCCESS.
- These failures remain visible as audit history and are not silently converted into PASS.
- Checkpoint HEAD f60eb781df402df3373c4c0f5987087ab01a5764 has governance Actions run 43462067810 completed SUCCESS. This run only certifies its actual workflow, not every predecessor's visual artifact or a new F-C suite.

## Open issue register
| ID | Classification | Treatment |
|---|---|---|
| FC-01 | PENDING documentary reconciliation | Historical PHIEU_TRINH_KY_CHINH_SACH_E0_TOAN still says OWNER_SIGNOFF_PENDING; newer FA_OWNER_APPROVAL_G7_G8 documents explicit G8 TEST decision. Retain both as time-stamped history; link newer controlling TEST decision; do not alter old evidence or claim production signature |
| FC-02 | PENDING formal immutable signoff | policySha256/reviewedAt and independent release-identity fields were not finalized in F-A formal signature section. Required if immutable release-signature record is in scope |
| FC-03 | NOT_APPLICABLE to isolated TEST / BLOCKED for deployment | No Apps Script Web App Version 6 integration QA or deployment-version to Git SHA attestation |
| FC-04 | BLOCKED for student use | B24 and Vietnamese unapproved placeholders, no separate lesson renderer/pedagogy/QA/trust adapter |
| FC-05 | NOT_APPLICABLE to isolated TEST | Logical per-lesson rollback PASS; actual deployment rollback not exercised |
| FC-06 | PENDING owner authorization | No owner decision to close P0.6; do not auto-sign or set RELEASE_READY true |
| FC-07 | PENDING artifact retention assurance | Browser zip artifacts have ~30-day retention. For archival reproduction use pinned scripts/workflow plus recorded SHA; do not claim indefinite zip availability |

## Proposed closure decision for owner
Option A: APPROVE_P0_6_ISOLATED_TEST_TECHNICAL_CLOSURE_WITH_EXCLUSIONS, only after owner explicitly accepts FC-01/02 documentary conditions; explicitly exclude Apps Script V6 deployment, real student use, B24/TV qualification, production release and deployment rollback. Keep RELEASE_READY=false.
Option B: REQUEST_CORRECTION if formal immutable fields must be completed before even TEST technical closure.
Option C: REJECT.
**Current decision: PENDING_OWNER_SIGNOFF. Nothing has been signed on behalf of owner.**

## Recovery
1. Read this file, FA_CURRENT_STATE.json, FB_CURRENT_STATE.json, FA_EXECUTION_LOG.md, FB3_EXECUTION_LOG.md.
2. Verify branch HEAD, audit commit, exact file Git blobs and Actions status; do not assume a pending GitHub write succeeded.
3. Check latest F-C audit commit for documentation-only changes. If an Actions run did not trigger on documentation-only branch, mark F-C CI PENDING/NOT_APPLICABLE rather than infer SUCCESS.
4. Resume issue register from the earliest PENDING; do not rerun known-PASS functional suites unless SHA/source/toolchain drifts or evidence is missing.
5. Never merge, deploy, persist learner/grades/stars, or set RELEASE_READY=true without a separate explicit authorization.
