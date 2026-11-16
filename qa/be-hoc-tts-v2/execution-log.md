# BE-HOC G7.5 V2 TTS integration journal — append only
00 | Baseline be-hoc 40bac7e3452492fad74c8b1982206c96a6797f7d; imported pinned V2 Git blob 605a8ed9b335526af82c8870dca4753bd511b913.
01 | Added raw 44 V2 partial, public-only read controller 45, scoped CSS 46, visible prompt buttons in 41 + theory route in 19; includes in GiaoDien.
02 | Unit workflow initially failed due to test checking question marker in 19 instead of renderer 41. Legacy Layer A workflow initially failed because its allowed paths predated TTS.
03 | Fixed tests/path guards without modifying the frozen V2 normalizer. CI 43807969710 SUCCESS.
04 | Chromium browser smoke ran desktop 1366 px and touch/mobile emulation 390 px, 17 checks PASS at CI 43807969730. Synthesis was stubbed; audible device review remains pending.
05 | Legacy Layer A workflow CI 43808156834 SUCCESS; protected MayChu, grading, rewards and GAS config unchanged.
06 | No GAS deploy, no student data writes, no actual Android/iOS sound QA; separate owner authorization required for TEST.
