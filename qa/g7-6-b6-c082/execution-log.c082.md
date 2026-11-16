# C08.2 append-only log – 2026-11-16
00 | Inherit C08.1 `ef73696db6380997fea6a2d1465e691b9a303739` (CI 43788985242 SUCCESS), no upstream data edits.
01 | Reopened exact C08.1 working overlay; 13 quarantined SGK legacy rows; 13 VBT LV2 evidence slots.
02 | Visually rechecked original SGK printed B027 106–109 and B065 102–105, original VBT printed B027 100–103/B065 93–95.
03 | Technical source review: reject content claims of all 13 stale legacy IDs; retain old IDs immutable with no automatic 1:1 mapping.
04 | Construct independent source-item candidate IDs with page, skill boundary and renderer eligibility.
05 | Evaluate 13 LV2 cases individually, separate conditional D5/D9 from outside renderer contract.
06 | Prepare unsigned E04 per-family owner packets and unregistered lesson/skill runtime name proposals.
07 | CI and checkpoint readback pending. C07 remains independent without manifest TEST mutation.

08 | CI first attempt `43790843960` FAILED at guard: P0.6 FB2 catalog not present in B6 branch, correctly located in independently pinned `c0c5620f...`; content tests not executed.
09 | Workflow fixed: read-only checkout of exact P0.6 SHA, assert catalog is present, then compare proposed IDs against actual existing lessons.
10 | CI run `43790939000` SUCCESS on intermediate workflow adjustment; enhanced ID assertion tests then added.
11 | CI run `43791015473` SUCCESS at `ed3359d3bee4ec44f0b11fb9228cfc1ff41822a9` including protected path checks, pinned P0.6 checkout, source-item and E04 tests. Artifact `14193055070` (public metadata only). No owner signatures. C08/C09 remain blocked.
