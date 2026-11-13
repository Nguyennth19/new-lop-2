# F-B.3 — Nhật ký thực thi, QA và điểm phục hồi (Asia/Ho_Chi_Minh)
All DONE entries have verified GitHub commits/runs. Do not infer interrupted write success; verify ref/CI before continuing.

| Thời gian | Bước | Status | Bằng chứng / phục hồi |
|---|---|---|---|
| 2026-11-13T23:22:00.413+07:00 | FB3-00 | DONE | Verified FB2 HEAD `6287d8ac524ddc434a5bbdd6c522db8786c5be89` and source H1 B20 blob `b14d556c5deeb561106e0c81f275387bef538842`; checkpoint pre-change `3eb0f96c1b3c6187c113a4eb6f3359262aefead2` |
| 2026-11-13T23:22:00.413+07:00 | FB3-01 | DONE | Independent B20 30-question preview from frozen H1, H2 source approval and 41/42/26 renderer/grader; Chromium standalone 30/30 desktop and 30/30 mobile. CI `43460267147` SUCCESS; artifact `14055299028` |
| 2026-11-13T23:22:00.413+07:00 | FB3-02 | FAILED → RECOVERED | Initial new B20 workflow `43460161855` failed YAML parse (colon in step name). Quoted step and verified CI success `43460267147` |
| 2026-11-13T23:22:00.413+07:00 | FB3-03 | DONE | Implemented B20 independent hash/verifier `6b16d4a42ec258f87c990002d69c893c17929b17`; catalog B20 as `INDEPENDENT_ACCEPTED_TEST_ONLY` `ea793e281e7966fb7faada914e541c2d91e10874`; separate trust binding `49c95c2a1197485cfb3a165069853077e89ef3db`; B24/TV remain blocked |
| 2026-11-13T23:22:00.413+07:00 | FB3-04 | FAILED → RECOVERED | Legacy FB2 regression used `altered.lessons[1]` (now B20 instead of pending B24). Corrected to `find(x=>x.lessonId==='toan_b24')` at commit `c65550db9312c22f74fd3cece55b012cce701f7f`. Governance CI `43461166510` SUCCESS |
| 2026-11-13T23:22:00.413+07:00 | FB3-05 | DONE | New independent B20-versus-B21 and per-lesson rollback test PASS; F-B governance CI `43461583845` SUCCESS |
| 2026-11-13T23:22:00.413+07:00 | FB3-06 | FAILED → RECOVERED | Browser workflow `43461382294` blocked by external apt repo network error during Playwright `--with-deps`, not question/test logic. Pinned browser download without apt install at `42f7d47dfb9168e34f10b4da4371e8ca224dd1bc` |
| 2026-11-13T23:22:00.413+07:00 | FB3-07 | DONE | Final independent B20 Chromium CI `43461674746` SUCCESS at `42f7d47dfb9168e34f10b4da4371e8ca224dd1bc`: 30/30 both profiles, screenshots and B20-specific JSON source/QA/rollback receipt artifact `14055893099` |
| 2026-11-13T23:22:00.413+07:00 | FB3-08 | DONE | Independent B20 QA report updated at commit `4eb36fd582fb1c49a6c8168051780276ed740eca`; no Apps Script deployment, student data, stars, MAIN/test-theo-main/V6 modifications |
| 2026-11-13T23:22:00.413+07:00 | FB3-09 | PENDING | Final checkpoint HEAD and CI need re-verification after this journal/state documentation write. `RELEASE_READY=false` |

## Recovery instructions
Start with `final-acceptance/FB_CURRENT_STATE.json` and this journal, verify remote HEAD then Actions runs of F-B governance and F-B.3 B20 independent QA. Original H1 B20 source blob, H2 owner approval, 41/42/26 renderer and B21 F-A acceptance must remain immutable. Artifacts expire after 30 days but source scripts + links + SHA digest remain recoverable. No authorization to deploy V6 or production.
