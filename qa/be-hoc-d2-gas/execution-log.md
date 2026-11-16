# BE-HOC D2 trusted GAS integration – append-only
00 | Baseline 16960959f8fff9b2f1a444c69d6e9a0edda179e6. Inspected exact B20 Sheet parser, server `ghiNhanKetQuaToan20`, display scoring and D2 manual carry, verified no n3/n4 in actual source schema.
01 | Implemented `D2ChamTinCayTest.gs` trusted read-only B20 PV100 two-addend endpoint; uses `layBaiToan20` + `achSelect_`, validates source and learner result/carry; client explicit submit from `49_D2V12_BaiHoc.html`.
02 | CI 43820277728 found missing fallback of V8 ternary in initial source. Fixed in commit 92c7159dd435d7850459ac0a3d5893548cb29762; source contract 25 assertions PASS in CI 43820400529.
03 | Added complete synthetic lesson browser QA desktop/mobile against trusted GAS source VM; CI 43820632513 SUCCESS 25+25=50 assertions.
04 | No real GAS test project deployed; no student Sheet touched; reward ledger and original scorer unchanged; pre-existing q.answer client exposure remains unresolved.
05 | Checkpoint closure and rollback 16960959f8fff9b2f1a444c69d6e9a0edda179e6.
