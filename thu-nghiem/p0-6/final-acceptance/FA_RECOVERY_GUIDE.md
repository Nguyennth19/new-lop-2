# F-A — RECOVERY GUIDE
Trigger phrase: **Khôi phục F-A từ checkpoint mới nhất**.

1. Read `FA_CURRENT_STATE.json`, `FA_EXECUTION_LOG.md`, `FA_DECISION_REGISTER.md`, and `FA_QA_EVIDENCE.md` directly from branch `test/p0-6-fa-policy-pedagogy-20261113`.
2. Query GitHub branch HEAD and compare it with `lastConfirmedWrite`, and inspect the newest changed files, commits and Actions run IDs. Never presume a write succeeded solely because it was attempted.
3. Reconcile `currentOperation`, `recoveryPoint` and the latest DONE checkpoint. If a file exists but a status update was interrupted, inspect content/blob SHA; do not blindly recreate or repeat side-effecting writes.
4. Verify each CI run's head SHA, status, conclusion and failed jobs. A workflow on an earlier commit cannot certify newer content. `pending` is not `success`.
5. Continue the earliest outstanding task: F-A audit -> owner decisions -> bounded revisions only if approved -> QA / signed record -> F-B handover.
6. Before performing a multi-step write, commit a state checkpoint indicating operation/recovery point. Append outcome record and state in relevant work commits where practical.
7. Preserve protected surfaces: MAIN, test-theo-main, Web App TEST Version 6, signed H.1 B20, production, learner data, points/stars. Do not merge or deploy; `RELEASE_READY=false`.
8. If approval is unavailable, report `PENDING_APPROVAL` with decisions listed rather than fabricating signature. Never duplicate run or mutate unrelated branches.

Source base: `b0ae0eab7f4b8bfe5687ae49cdb701da74ba9583`; prior CI run: `43440199612`. Start by verifying current remote HEAD, not using these values as assertions of the present.
