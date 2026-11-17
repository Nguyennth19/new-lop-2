# P0 B — 25 case SGK/VBT · GAS TEST visual and independent-source acceptance

**Gate:** `25_CASE_TECH_QA_PASS` / `CHROMIUM_PREVIEW_PASS` / `GAS_VISUAL_NOT_RUN` / `INDEPENDENT_REVIEW_0_OF_25` / `STUDENT_RELEASE_NO_GO`. This report is independent of B20 Trusted Grading.

## Evidence already passed

- Original source evidence on [16_G2B_P0_REVIEW_25](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910116), 10 G1 correction cases + 15 difficult visual cases, SHA-pinned source PDF/crop from private reviewer pack. **Not re-extracted.**
- TEST contract [25-case-decisions.v1.json](../p0-g2b-adaptation/25-case-decisions.v1.json): 11 KEEP_VARIANT, 7 KEEP_STRUCTURAL, 7 DROP = 25 case decisions / **24 unique source IDs**. C01=V03; **17 unique retained**; 7 DROP remain excluded.
- One-branch CI: https://github.com/Nguyennth19/new-lop-2/actions/runs/44119669559: **60/60 contract QA**; headless **Chromium 72/72 desktop/mobile** visual/UI assertions. 25 reviewed for renderer preview or DROP *per viewport*, 0 JS errors and 0 document horizontal overflow. Only synthetic, non-textbook fixtures were captured as screenshots.
- Reviewer interface on the same isolated GAS deployment: `<TEST_EXEC_URL>?g2bReview=1`. It uses existing D3/D4/D7/D9/D10 cores + six vector preview families, never writes student data. The source semantic index labels are **INDEX_ONLY**.
- No SOURCE_EXACT/renderer/asset/publicVariant grant: 0. `D9_E04_TOTAL`, `D9_ESTIMATE_TENS` and `COLUMN_MISSING_DIGITS` trusted grading remain separate policy gates.

## One shared GAS TEST deployment – G2B acceptance receipt

| Requirement | Evidence required from same deployment as B20 | State |
|---|---|---|
| Deployment provenance | same tested SHA and deployment ID as P0 A, private ledger | NOT_RUN |
| Review identity | reviewer allowlisted and authenticated; anonymous/unlisted denied | NOT_RUN |
| 25-case inventory | 18 KEEP checks / 17 unique retained, 7 DROP excluded, C01=V03 not duplicated | NOT_RUN |
| Vector review | six SVG families render correct unit, number, digit slots and structural fallback | NOT_RUN |
| Existing renderer review | D3/D4/D7/D9/D10 actual TEST UI; many-to-one D4, NOT D3; D9 sidecars visibly pending | NOT_RUN |
| Exact count and unit | D9 count shows generated quantity and typed countUnit, no WebP single-image count inference | NOT_RUN |
| Safety/fallback | student path denies unsigned candidates and all DROP; no client grading, no writes | NOT_RUN |
| Desktop/mobile + cross-browser | human observation in the shared Web App TEST; record redacted QA fixture observation receipt | NOT_RUN |
| Independent SGK part/slot review | original private reviewer source SHA and each case reviewer signature in tab 16 | **0/25 SIGNED** |
| Owner decision | accept/reject recorded with QA screenshots and private reviewer proof | NOT_SIGNED |

**Biên nhận chờ nhập chứng cứ thực:** 
```json
{
  "record": "P0_B_G2B_25_CASE_GAS_TEST_VISUAL_ACCEPTANCE",
  "deploymentCodeSha": "NOT_DEPLOYED",
  "visualScreenshotReceiptSha": null,
  "visualObservations": "NOT_RUN",
  "caseCount": 25,
  "uniqueSourceOrigins": 24,
  "retainedUnique": 17,
  "dropped": 7,
  "independentReviewerSigned": 0,
  "sourceReviewGrant": "DENY",
  "rendererGrant": "DENY",
  "publicVariantGrant": "DENY",
  "decision": "NO_GO"
}
```

**Hard stop:** fixture preview PASS ≠ the original SGK visual is reproduced and ≠ source reviewer signature. Even after this GAS TEST visual session, grant/production approval remains pending until scope-specific source/renderer policies are independently approved. Review page has no ability to approve source, grading or student access. Rollback: disable reviewer QA route/deployment, do not replace source PDFs, manifest, G2B tab 16 or C1/V8.
