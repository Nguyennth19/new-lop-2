# AI-2 – Controlled Multi-AI Lesson Pilot: Bài 20 (read-only)

**16/11/2026.** Baseline `9a981929437285e2bc2a79e809cae422f27f3c03`, P0.6 independently accepted TEST B20 source `c0c5620f30edd92ab45d4ec87a8a07ffa38948e2`.

## Why Bài 20 and which version?
`toan_b20` already has F-B.3 technical independent QA on 30 questions, 6 sessions, 6 types. Source runtime H1 has frozen Git blob `b14d556c5deeb561106e0c81f275387bef538842` and `release_status=STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF`. FB2 catalog is TEST-only and `allowStudentUse=false`. SGK/VBT actual sources differ: 33 numbered large exercises, 13 operation types, zero C1 questions renderable immediately. The later 45-subquestion blueprint has NOT replaced H1. No additions or approvals are implied.

## Hand off between two AI roles
The role plan is represented as a versioned metadata packet `b20-ai-handoff.v1.json`. The draft analyst role is labeled Gemini and the independent validator role ChatGPT, but **neither cross-model API call nor an autonomous conversation occurred in this step**. Pin-based Node validation plays the objective reviewer function. Source answer, private grade rubric, screenshots and student records are **not copied** to the handoff.

## Reproducible QA
The CI checks out `c0c5620f30edd92ab45d4ec87a8a07ffa38948e2` separately to `_external/p06`, checks exact source blob SHA for all 11 referenced files across both commits, validates 30 B20 IDs, 6 sessions, 6 types, P0.6 catalog B20 TEST-only and D5/D9 not enrolled. It injects negative test cases for wrong ID, arbitrary SGK source tag, altered bytes, duplicated IDs, wrong lesson, forged Gemini progress and unauthorized GAS/student/score writes. Checks test **mechanical integrity and orchestration only**, NOT actual curriculum correctness or six new levels.

## No automatic registration or production
C07 independent, C08/C09 still PENDING. No policy approval for PROJECT_RULES, no rewrite of renderer, no GAS deployment, no P0.6 catalog updates, no asset activation, no score/star/student writes. Rollback discards only this branch. For a real external Gemini run, owners must authorize limited source pointers and decide the connector and privacy boundary separately.
