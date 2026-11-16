# D2_MANUAL_CARRY_REQUIRED_V1
Date: 2026-11-16. Branch be-hoc. Baseline e8fc06b38fb9df1ae5cf986d684265c702e0b72a.
**Pedagogical decision:** child enters each carry themselves. Empty default; no computed carry displayed. For 2–4 addends, each new addend generates an additional operand row. When no carry is necessary, leave that carry cell empty. Any required carry omitted or entered incorrectly makes the whole question incorrect even if result digits are correct. A full question counts as one correct answer; no extra marks for memory, no partial credit or client-side stars.
**Current scope:** addition, PV100 B20 real verified vertical and matching mental three; PV1000 QA only. Out-of-range result 100/1000 rejected without an approved extra column. Two-digit numeric carry input is future-compatible for multiplication; actual multiplication and borrow semantics remain separate, not activated.
**Runtime:** `52_D2_ManualCarry.html` replaces former `51_D2_AutoCarry.html` include in `GiaoDien.html`. Original frozen 47/48 D2 sources untouched. Learner-entered carry captured by adapter alongside result digits. Main B20 grader in `26_ChamCauHoiToan.html` untouched; current D2 panel is still *practice only* with no grading/star writes.
**Scoring authority:** server MUST derive expected result and column carries from trusted lessonId/questionId and immutable source, not from client supplied operands/correct flags. QA-only private evaluator validates all result digits and required carry values. No runtime grading until approved integration.
**QA:** node contract, trusted-grader fixture suite, desktop + simulated mobile Chromium. Separate GAS TEST deploy authorization and device QA needed.
**Rollback:** e8fc06b38fb9df1ae5cf986d684265c702e0b72a. No main/test-theo-main modification.

## CI evidence and security boundary
- GitHub Actions `43817958668`: SUCCESS on `dae7ea2ddb50b4639b975e49ad21dc73a7b05f32`; **29 contract + 28 private scoring + 27 Chromium desktop/mobile emulation = 84/84 PASS**.
- The private scorer is `qa/be-hoc-d2-manual/private-manual-grader.qa-only.cjs`; it is deliberately **not** imported in `GiaoDien.html`, and **not** a GAS deployable score endpoint.
- Legacy D2 `47/48` frozen sources and existing main B20 `26_ChamCauHoiToan.html` remain unchanged; no student writes, no auto rewards, no client grading.
- Existing legacy auto code `51_D2_AutoCarry.html` remains in Git history/source archive only. **Not loaded in runtime**; `GiaoDien.html` includes `52_D2_ManualCarry.html` instead.
- Must separately approve, implement, and test the trusted server scoring binding before D2 answers update scores/stars. GAS TEST device smoke remains pending.
