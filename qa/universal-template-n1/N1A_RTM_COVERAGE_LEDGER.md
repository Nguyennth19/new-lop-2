# N1-A — RTM coverage bridge and restricted acceptance ledger

Status: **QA IN PROGRESS / NOT OWNER APPROVED / NO MERGE**. Scope: independent offline LAB only. Frozen `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef` (36/36 original JS+CSS source files). Baseline N1 `f7231b0818df2d3a714cf6f05e922deff7fd64b7`.

## Mandatory source-of-truth naming

The original N0 RTM names `W1-T01..T05` and canonical findings `W1-01..03`. The independent roadmap also names N1=W1-01, N2=W1-02, N3=W1-03, N4=W1-04/05. We executed original **N1–N3 scope together** under the single LAB milestone `N1` / PR #14. The next combined checkpoint remains `N4 (W1-04/05)`, NOT a redefined N2/3. Preserve original DB-01..05 identities, do not rename observations OBS-01..07 to DB IDs.

## Audit trace table

| Original RTM test | Required acceptance behavior | Existing N1 test | N1-A addendum test | Residual owner/independent QA |
|---|---|---|---|---|
| W1-T01 | D1/D2 single callback, no intermediate restore event | `W1-01-D1-RESTORE-GUARD`, `W1-01-D2-RESTORE-GUARD-FOCUS` | `W1-T02-D2-PV100-PV1000-BORROW` callback spies | Independent code and artifact review |
| W1-T02 | D1 zero/empty, D2 carry/borrow & focus, PV100/PV1000, desktop/390 | `W1-01-D2-FOCUS-ROUNDTRIP` | `W1-T02-D2-PV100-PV1000-BORROW` | Device real-user review and ensure no unsupported SUBTRACT/PV1000 combo implied |
| W1-T03 | Five-component identity and same question ID across packs/versions | `W1-02-IDENTITY-AND-SCHEMA` | `W1-T03-DRAFT-KEY-FIVE-COMPONENTS` | Independent negative verification; local FNV64 is nonsecurity only |
| W1-T04 | 12-route LabRenderHandle snapshot/restore/clear/destroy behavior | `W1-02-TWELVE-HANDLE-CONTRACTS` | `W1-T04-ALL-12-LIFECYCLE` | Review actual destroy/restore coverage, not just facade functions |
| W1-T05 | D10 one-operation equation, five G6 data fields, accessible controls, no multi-step | `W1-03-D10-EQUATION` | `W1-T05-D10-ONE-OPERATION` | Owner + pedagogy approval on real phone/computer; no multistep claim |

**Limitations:** N1-A browser tests run Chromium desktop 1366x768 and *emulated* mobile 390x844. They do not substitute for physical iOS/Android keyboard or accessibility tests. `clear()` and navigation-mediated `destroy()` are exercised through the public LAB UI; exhaustive event-listener leak instrumentation requires a distinct test before claiming strict lifecycle closure. N1-A does **not** close W1-04 (real binary assets) or W1-05 (24 paired visual comparisons).

## CI evidence and retention

- N1 original RED: https://github.com/Nguyennth19/new-lop-2/actions/runs/45106164049
- N1 original GREEN: https://github.com/Nguyennth19/new-lop-2/actions/runs/45106581568
- Original N1 Artifact: GitHub Actions artifact `14787059044`, named `ULT_N1_STRICT_LAB_W1_01_02_03_EVIDENCE`, currently expiring **2027-02-21 03:32:27 UTC**, thus **not** permanent.
- N1-A CI: obtain **actual** run ID and commit SHA from GitHub upon completion. Check the new `qa/universal-template-n1/dist/ULT_N1A_ADDENDUM_EVIDENCE.json` attached to that exact run.
- A **permanent** evidence archive is still open: acquire actual ZIP bytes, calculate SHA-256, store in restricted QA Drive and verify the readback before marking archival PASS. GitHub artifact metadata alone is insufficient.

## Unalterable boundaries

- Original 36 renderer and CSS blobs must remain byte-identical to `be-hoc`, verified against original Git SHA, not merely asserted by CI.
- PR #14 remains DRAFT and unmerged.
- No GAS integration, no Sheet TEST/source writes, no manifest ACTIVE, no production grading, no release or real student data.
- Owner and independent QA identities/signature references remain pending; do not sign on their behalf.
- N0 RTM CSV `ULT_N0_W1_DB_RTM_20261123_V1.csv`: 10,495 bytes, SHA-256 `d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b`, verified locally. If a reviewer has an empty attachment, retransfer the exact file without rebuilding its content.

### Closure fields

- CI SHA: PENDING NEW N1-A RUN
- Browser tests: PENDING NEW N1-A RUN
- Original source diff: PENDING final comparison
- Independent QA: PENDING
- Project Owner physical-device UX/pedagogical approval: PENDING
- Overall: **N1-A NOT YET ACCEPTED, W1-01..05 not signed closed**
