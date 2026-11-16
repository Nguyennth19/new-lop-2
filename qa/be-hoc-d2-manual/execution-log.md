# D2_MANUAL_CARRY_REQUIRED_V1 execution log — append-only
00 | 2026-11-16: Verified be-hoc e8fc06b38fb9df1ae5cf986d684265c702e0b72a, original 47/48 source pins, former auto include 51, B20 host 49, and legacy grader 26.
01 | User instructed manual carry with graded requirement (answer and every required carry correct). No automatic carry should be shown.
02 | Created 52_D2_ManualCarry.html with blank editable learner input and 2–4 rows; switched runtime include from 51 to 52, wired keypad and reset.
03 | Compiled contract.v1.json and private trusted-scoring reference; rejected 100/1000 overflow; B20 only eligible vertical and three-addend, PV1000 QA only.
04 | CI 43817958668 SUCCESS: contract 29, private score 28, Chromium desktop and mobile 27 = 84 assertions. No student data or GAS deployment.
05 | Updated older D2 regression workflow triggers to include manual QA namespace for rerun; owner approval to deploy remains pending.
06 | Rollback to e8fc06b38fb9df1ae5cf986d684265c702e0b72a. No modification to main or test-theo-main.
