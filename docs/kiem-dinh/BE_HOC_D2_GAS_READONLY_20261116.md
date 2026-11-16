# BE-HOC D2 trusted GAS TEST – read-only verification adapter
Baseline 16960959f8fff9b2f1a444c69d6e9a0edda179e6; user-authorized technical implementation only.

The GAS function `d2ChamTinCayTest` reads a selected, valid B20 vertical addition question from the existing trusted Sheet via `layBaiToan20` and `achSelect_`, checks source answer consistency, then verifies learner-entered **both result digits and all required carry inputs**. Browser sends IDs and answers entered by learner, not client-computed correctness or expected operands. Response is only `{ok,correct,policy,awarded:false}`.

Only B20 two-addend vertical PV100 questions are enabled for GAS. Existing Sheet parser `khoChuyenCauHoi_` has no n3/n4, so 3/4-addend GAS is **not enabled**. PV1000 is **QA-only**; 100/1000 overflow rejected.

The endpoint does **not** write Sheet attempts, stars, grades, or any student data; existing legacy `ghiNhanKetQuaToan20` untouched. **However:** the existing B20 main button still calls the older score-and-star write path separately. The older `layBaiToan20` also exposes q.answer to the browser. This integration does **not** claim to fix those preexisting architectural issues.

Do not deploy automatically. **Actual GAS TEST acceptance is pending**: restricted isolated GAS project + synthetic cloned spreadsheet + owner signoff; Chrome/Android real test, both-correct/wrong-carry/missing-carry/wrong-digit/overflow cases, verify no writes to fake 90/91 tabs. CI uses mocked GAS source, not live GAS.

Rollback to 16960959f8fff9b2f1a444c69d6e9a0edda179e6. Do not modify main/test-theo-main.

## Automated synthetic lesson acceptance — evidence
- GitHub Actions `43820632513`: **SUCCESS** at commit `5b14a349700b31b6679bed0c0fe85dd4ce41f2fb`; 25 trusted GAS-function assertions plus 25 Chromium desktop/mobile-emulation full-lesson assertions = **50/50 PASS**.
- Simulated learner flow: open B20 selected D2 question, enter 53/carry 1, press button, read trusted success; repeat wrong carry, missing carry, wrong result, verify server returns wrong. No fake stars issued.
- V8 GAS source executed in isolated Node VM using **mocked read-only Sheet questions**, browser calls a bridge to that source. This is NOT actual `script.google.com` GAS TEST, no Apps Script deployment or physical phone QA.
- Final real GAS TEST signoff requires separate restricted deployment, cloned synthetic Sheet, visual/mobile QA, and 90/91 tab before/after state comparison.
