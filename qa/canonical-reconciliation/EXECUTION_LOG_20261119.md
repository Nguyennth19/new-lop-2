# Global Canonical Reconciliation — nhật ký kiểm toán theo checkpoint
Date: 2026-11-19 (Asia/Ho_Chi_Minh) · Target: `be-hoc` · Initial scope: **READ-ONLY source auditing**.

## Checkpoint R00 — 2026-11-19 · Ground and policy
- HEAD verified through connected GitHub: `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`; branch is not protected; **no new application commits permitted without reference/independent parity**.
- Four project policy sources read in full at HEAD: `AGENTS.md` blob `34c05e3518c6530f6fbb7f656cfd06907e262910`, VI guidelines `1b62a043b0ce653cf724a50b3c378cf2b7c399fe`, EN guidelines `be94a27ce5590ce3fa44d639bbff294dcae9a3e4`, project instructions `2eb71e7a3ae799489cac0998edde2ff23a9bba00`.
- GitHub API `branches?per_page=100&page=1,2`: **147 branch HEADs as discovered**. Branch list is a *metadata inventory*, not an audit of all contents.
- HEAD CI observed: source-lock `44470920056` PASS, Layer A `44470919956` PASS, WebP `44470920131` PASS, visual-lab offline browser `44470920235` PASS. **No approved parity-to-independent-frozen-demo claim**.
- Drive project folder `16uf-v_CVwm0R9RdY3OLv7WnhqFeBSAe8` metadata and reports located; read `LOP2_GLOBAL_HARD_QA_REPORT_20261117.md` (ID `1WuOroOlPqzE5FsGTHOy7vdfy_fAytynU`). Report states split UI, source, renderer, grading; 123 branch HEADs older; 19-domain source selection and PASS scope limits. Older baseline is historical only.
- Read Drive `G7.4_QA-C3_VISUAL_PARITY_ASSET_IDS_D10_VARIANT_BOUNDARY_20261114` (ID `1JHa05h8Fu1hTN4RR04inO6A04Nq5HReH0oHdCxmufoM`): frozen 10-type demo SHA256 `78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced`; QA C3 owner visual signoff pending. D8A/D8B parametric SVG not static stock image. D10 grading still client-exposed in original runtime.
- Read Drive `G7.4_QA-D2_CAPACITY_SVG_PROPORTIONAL_SCALE_V1.2_20261114` (ID `1tzifnsuCPtV6Z_Bj_vGNbl2fzX2si-0kP_LO2Up_6Ss`): standalone proportional liters V1.2 source technical PASS; **owner visual signoff pending, independent TEST view only**, no permission to replace active D8A.
- Read Drive owner `G7.6-B4.1` (ID `1X7Lu_WVpr8zuMC1Akaht7BrRtb72VSUaRogFz_wH9Ao`): 13/13 user-reported interaction evidence for standalone demo; actual independent mobile/device specifics and formal signoff are explicitly pending.
- Read Drive `G7.6-B5B_RESOURCE_TTS_E2E_QA_CHECKPOINT_20261115` (ID `1yLMYK0L9pzj8mhJIyaA24sgZWttz6KoSGNsJ9oMRhBM`): 1602/1602 offline PASS; 14 read buttons in standalone harness, audio hearing and LIVE integration not attested.
- Scope hierarchy: `FOUND` → `SOURCE_READ` → `SOURCE_APPROVED_IN_SCOPE` → `WIRED_TO_APP` → `BEHAVIOR_PARITY_TESTED` → `OWNER_ACCEPTED` → `GAS_LIVE_VERIFIED` → `RELEASE_APPROVED`; no implied promotion.
- Hard guard: do not alter `be-hoc`, `main`, `test-theo-main`, GAS, student Sheet, grader, owner review or historical PASS. Current P1.4-B merges retain rollback at pinned commit; no release.
- Next R01: compare Git trees for independently PASS reference branches and audit current runtime call paths. R02: bounded Sheet/Drive source reconciliation and canonical feature matrix. R03: independent test/parity proofs; only then evaluate surgical integration.

## Real-time evidence contract
Each checkpoint: record source ID/ref+blob or commit SHA, what was actually read/tested, observed vs inferred, corrected/superseded evidence, changed paths, CI run URLs/status, rollback target, remaining gates and new HEAD. Append entries, never edit historical decisions to assert hindsight PASS.
