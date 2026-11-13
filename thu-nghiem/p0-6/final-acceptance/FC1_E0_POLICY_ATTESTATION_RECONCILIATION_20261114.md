# F-C.1 — ĐỐI CHIẾU CHỨNG THỰC E.0 VÀ HỒ SƠ KÝ DUYỆT
Ngày kiểm toán: 2026-11-14 (Asia/Ho_Chi_Minh)
Phạm vi: documentary attestation only; F-A/F-B/contract/renderer/generator/composer code unchanged.
Status: `SOURCE_TEXT_CROSS_VERIFIED; FORMAL_OWNER_ATTESTATION_PENDING`.
Release: `RELEASE_READY=false`, no deployment, no P0 closure.

## 1. Đường truy xuất và đối chiếu trực tiếp
- Repo `Nguyennth19/new-lop-2`, checkpoint F-C nguồn `2c39eb555de9e2c8fe44ef156ae0fbf12d5c8a6f`.
- File `thu-nghiem/p0-6/PE0_DAC_TA_NGHIEM_THU_BIEN_THE_TOAN_V1_20261113.md`.
- Git object blob SHA `69c07906f621b1ad91eba184a595544fe3b6d87c`, matched `fetch_file.sha`.
- Retrieved `mcp__GitHub__fetch_blob` (exact object SHA), `mcp__GitHub__fetch_file` (exact commit) and `mcp__GitHub__fetch` (raw.githubusercontent.com at exact commit). **Three retrieved text contents are equal**, 24,499 JavaScript UTF-16 code units each. This checks source identity at the connector text layer; it is not independent byte-level cryptographic verification.
- Previously computed SHA-256 of UTF-8 encoding of retrieved text: `33636d43f895bc417e4916dcec8befcb27a489ff08f774ec1897aa4804cc486e` (F-C evidence record). This is a content digest, **not** an owner's attested digest or signature.
- Because a direct `git show ... | sha256sum` of raw Git blob bytes was not successfully run in this execution environment, `RAW_BYTE_SHA256_INDEPENDENT_VERIFICATION=PENDING`. The Git object SHA-1 is **not** a SHA-256 substitute.

## 2. Identity fields and policy-version distinction
| Field | Recorded value | Evidence status |
|---|---|---|
| policyId (F-A G8 reference) | `LOP2-P06-E0-MATH-VARIANT-ACCEPTANCE-V1` | TRACEABLE_REFERENCE |
| sourceDocId (source header) | `LOP2-P06-E0-MATH-VARIANT-ACCEPTANCE-V1.0-CANDIDATE` | SOURCE_VERIFIED |
| policyVersion for FINAL signed registry | NONE | PENDING_OWNER_CONFIRMATION |
| sourceCommit | `2c39eb555de9e2c8fe44ef156ae0fbf12d5c8a6f` | VERIFIED_RETRIEVAL_REFERENCE |
| sourceGitBlob | `69c07906f621b1ad91eba184a595544fe3b6d87c` | VERIFIED_RETRIEVAL_REFERENCE |
| policySha256 (UTF-8 retriev. text) | `33636d43f895bc417e4916dcec8befcb27a489ff08f774ec1897aa4804cc486e` | CALCULATED_NOT_ATTESTED |
| decision F-A G8 | `OWNER_APPROVED_TEST_SCOPE_CONDITIONAL_ON_G5` | DOCUMENTED_CHAT_SCOPE_ONLY |
| reviewerRef | `PROJECT_OWNER_EXPLICIT_CHAT_APPROVAL_2026-11-13_G7_G8` | PROVENANCE_REFERENCE_NOT_SIGNATURE |
| decisionRecordedAt | `2026-11-13T22:19:13.111+07:00` | DOCUMENTED_RECORD_TIMESTAMP |
| independentlyAttestedReviewedAt | NONE | PENDING |
| policy digest explicitly acknowledged by owner | NONE | PENDING |
| P0 closure signed approval | NONE | BLOCKED |
| releaseReady | false | REQUIRED_LOCK |

## 3. Cross-check approval chronology (FC-01)
- Earlier E.0 signoff request `PHIEU_TRINH_KY_CHINH_SACH_E0_TOAN_20261113.md` and `FA_POLICY_SIGNOFF_PACKET.md`: pending at document creation.
- Later `FA_OWNER_APPROVAL_G7_G8_20261113.md`: explicit owner G7/G8 TEST decision recorded; G8 references E.0 P01–P06, with G5 condition.
- `FA_DECISION_REGISTER.md` P01–P06: `OWNER_APPROVED_TEST_SCOPE`.
- F-A TEST preview G5 Chromium run `43453411019`: success 8/8 for B21 desktop and mobile; not Web App V6.
- `FC_OWNER_DECISION_AND_FC01_FC02_20261114.md`: owner now orders completion of FC-01/02 prior to P0 closure.
- FC-01 is `DOCUMENTARY_RECONCILED_FOR_TEST`, with historical requests preserved intact and no elevation to production.
- Distinct per-lesson approvals: H.2 B20 != G7/G8 B21; no cross-lesson inheritance.

## 4. Remaining requirements to finish FC-02
1. Independent byte-level confirmation of exact SHA-256 directly from pinned Git blob, with verifier command/output and reproducibility record; avoid silently changing file normalization.
2. Canonical signed policy identifier/version selection (source remains `CANDIDATE`; existing owner TEST authorization must not be rewritten as production authorization).
3. Confirmation by authorized owner whether the exact source hash/version is covered by the previous G8 TEST approval, or a separate explicit bounded decision; do not assume it.
4. Signoff timestamp provenance/identity: distinguish documented chat approval time from independently authenticated reviewedAt. If independent signature is not required for TEST technical closure, obtain an **explicit owner decision acknowledging this scoped exception** rather than filling fabricated fields.

## 5. Test-only acceptance recommendation
`FC_01=DOCUMENTARY_RECONCILED_FOR_TEST`.
`FC_02=PARTIAL_SOURCE_CROSS_VERIFIED_SIGNOFF_PENDING`.
`P0_6_CLOSURE=BLOCKED_BY_OWNER_UNTIL_COMPLETED`.
`RELEASE_READY=false`.
This dossier is a technical audit artifact, NOT a signature, final policy approval, student-use authorization or release record.

## 6. Recovery
Read `FC_CURRENT_STATE.json`, this dossier, `FC_POLICY_INTEGRITY_EVIDENCE_20261114.md` and `FC_OWNER_DECISION_AND_FC01_FC02_20261114.md` at current F-C HEAD; verify file/blob SHA before resumed edits. Preserve old policy file and all A–F QA. Any new approval requires its own separate owner instruction and GitHub checkpoint, no retroactive edits.
