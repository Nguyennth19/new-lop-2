# BE-HOC Lớp A – append-only integration log
00 | Created be-hoc from exact test-theo-main HEAD f51a12cc07b44f0f893c2e0de40e387cc17b5c3b, not from audit/GAS development branch.
01 | Inspected base GAS includes, learning screen, renderer, grading, keyboard and existing asset pipeline.
02 | Inspected G7.4 41 renderer, UI20 CSS 43, B20 adapter 42, G7.4 D2 V1.2/diagram, G7.5 V2 voice source.
03 | Runtime candidate: replace 41 renderer, add 43 CSS + include in GiaoDien only. Preserve header/sidebar/keyboard/server scoring.
04 | Preserve source SHA copies of D2 V1.2 core/view, structured diagram, TTS V2 and B20 adapter under qa/be-hoc-lop-a/refs. No direct GAS activation; B20 answer route requires security review.
05 | CI and final checkpoint pending.

06 | Initial CI 43806254280 failed a false-positive CSS scope assertion (nested selectors after removing #mathFullScreen). The CSS was unchanged; corrected assertion to check no bare class selectors and at least 20 scoped selectors.
07 | CI 43806346380 COMPLETED_SUCCESS at 538cee45a72d965038b382a93aacdd87f3e21c04: 50 assertions, source blob integrity, no-deploy and protected file guards PASS. No browser/device test or GAS deployment performed.
