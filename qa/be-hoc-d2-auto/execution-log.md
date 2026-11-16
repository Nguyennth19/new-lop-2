# BE-HOC D2 auto carry and multi-row audit trail
00 | Opened exact baseline test-theo-main renderer 41 and grader 26, current D2 V1.2 core/view and host 49.
01 | Baseline test-theo-main has a manual carry input; V1.2 original uses carry toggle; implement explicit user-requested auto-carry in separate module, frozen originals unchanged.
02 | Added 51_D2_AutoCarry.html; extended host B20 2-operand vertical and conditional mental variantType=three; added one row for third operand or two for fourth; carry from public operands only, no answer key.
03 | Auto carry values from 0 to 3 rendered noneditable, not graded; PV100 + PV1000 1000-overflow rejected; no arbitrary B20 mapping.
04 | Added private QA-only full-result scoring policy; zero partial/auto-carry/star credit. No new live grading or server writes.
05 | CI 43811105211 first PASS: contract 39, Chromium 27; CI 43811369732 final SUCCESS: contract 39, private QA scoring 20, Chromium 27.
06 | No GAS TEST deploy, no real device visual QA or official approval. Rollback baseline 72d52c32aa81e37e989629c11c7f892b65d612a2.
