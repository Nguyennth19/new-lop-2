# G7.6-B.5-A – REAL-TIME / RESUME / ROLLBACK LOG
**Date:** 2026-11-15 · **Branch:** `test/g7-6-b5a-renderer-curriculum-tangram-20261115` · **Base:** `0263175544bcfd03433a89b8515bdd9f11a00d26`

| Sequence | Commit / evidence | Details |
|---|---|---|
| 0 | User screenshot `image.png` | 3/3 pieces shown but shapes do not align target; user requested audit against original demo, optimization of selecting/moving |
| 1 | Exact frozen HTML | Read original `Original_10Forms_Grade2_20261113.html`: original snapSelectedTangram sets rotation to 0, translates to each piece's target coordinates; no trusted grading |
| 2 | Native G7.4 audit | Confirm G7.4 V1.1 uses `translate(target center) rotate(piece.rotation)` without subtracting local piece bounding center (wall center local `(0,-25)`); offset is deterministic |
| 3 | `e738315feb7dae560e038b995cac42385e543001` | New isolated Tangram precision view with public geometric congruence, center correction, target clicks, auto-fit, drag/unplace; native core frozen |
| 4 | `fa29e9c76931e11619b1f0f1e5a09b890c0e2951`, `df990218f083e20f5c7646b6f587fe3dcdf372db` | Define 12 renderer baseline, auxiliary mental input TEST overlay, E04 curriculum policy rules for SGK/SBT/ref/teacher guide; no SGK activation |
| 5 | `3b52dac2f859ea10366176fcdce6f006da9c40e9` | New E04 public projection: D5 unique visible shapes; D9 correct row counts and MORE/LESS relation; sidecar anchored to real P0.6 source SHA; no native E02/E03 modification |
| 6 | `98816c6ba3ea10366176fcdce6f006da9c40e9` | Note: this SHA refers to contract adjustment from `mapped.nativePlan` to correct `mapped.nativeRenderer.plan`; actual Git commit `98816c6ba3ea53bf6210a287e2d005ce610146a7` |
| 7 | `c35dcd09937a5ffec6f9888b939a71eebd693026` | Added 203 policy, producer and Tangram geometry assertions |
| 8 | `cf9c5c52d60bad4229dae50c0f4e5a1040d74e87`, `f29ddb1bef7c45d1e8b6c2516d9477c2b39bdcb3` | Created offline B5-A TEST HTML builder with responsive CSS |
| 9 | `538c60fe0ecdd524b71d2db7cf1f6d2f796978bf` | Chrome CDP checks 2 Tangram seeded variants after snapping 3/3, exact SVG boundingRect alignment |
| 10 | `7d89622fa5926f145904ef572a2b356ad48f5580` | CI scope pinned P0.6, original demo SHA, 1091 inherited regressions, owner approval fail-closed |
| 11 | CI `43730378997` FAILED (preserved) | Sidecar test mistakenly passed whole `loadProducer` object instead of `{sha,registry}` anchor. Original B3 created correct anchor. Test/harness corrected; no source/production changes |
| 12 | `abc5c53565be2ec870f34b0feaddff07771929e9` | Fixed anchor to `{sha:real.sha, registry:real.generator.policyRegistry}`; next CI PASS |
| 13 | CI `43730444122` SUCCESS | 1091 inherited + 203 new assertions. Tangram 390/360/1440 and 390 all screenshot; 0px bbox delta |
| 14 | Image evidence opened | Viewed actual 390px Chrome screenshots after snap, roof/wall/tree align; no technical IDs visible; board stays within mobile viewport |
| 15 | `8d0ae86d6cfbb3cc1a90a6c2f5852b7a73f59744` | Updated demo text to distinguish native frozen G7.4 from new B5-A precision view |
| 16 | `035b892dee71a0898f395d2a5ff9b21981f1c6ca` | Added Chrome pointer drag/regression after taking correct-layout screenshot; drag ~70px, 3/3 -> 2/3 without phantom placement |
| 17 | CI `43730697006` SUCCESS | Proved 0px snap delta plus pointer drag/unplace PASS at 360/390/1440 |
| 18 | `9273b7ba61c12bc9bee42a685b149a860b65e1a1` | Final report records source bug and gate status |
| 19 | `e7e56bfd5046888e3c86a12d32d21570908f4175` | Owner manual TEST form specialized to B5-A, 15 checklist items, new file/schema, separate from user earlier B4 13/13 |
| 20 | `ffb778ef7ee08bc1897334863cdfc5ce127d576d` | CI validates exactly 15 B5A manual checklist items |
| 21 | CI `43730905542` SUCCESS | All A–B4.1 1091 + B5A 203 assertions PASS; Chrome precision and pointer drag PASS |
| 22 | `7fd2e87073ffe18e0b019b52387042e36385e1ed` | Machine-readable B5A checkpoint with rollback and blocked SGK policies |
| 23 | CURRENT | This journal; CI verification at final HEAD and artifact storage after docs commits |

## Hard boundaries / recovery
- Existing frozen G7.4 core/view and frozen demo untouched; original B4 standalone remains unchanged.
- Original 12-item G7.6-A manifest remains frozen; mental renderer is technical overlay in isolated B5-A only.
- E04 generator remains B3 standalone seeded sidecar; `toan_b999` lab only, `curriculumRef=null`, LV3 unsupported.
- Owner B4.1 confirmed original G76B4 13/13; new Tangram V1.2 manual review needs a **separate 15-item JSON**; never pretend previous acceptance covers this changed renderer.
- No merge to `main` or `test-theo-main`, no GAS, D10 trusted grading, student data, scores, stars or TTS activation.
- Rollback to B4.1 `0263175544bcfd03433a89b8515bdd9f11a00d26`; no impact to deployed applications.

Sources of truth: `qa/g7-6-b5a/checkpoint.g76b5a.v1.json` and GitHub workflow `.github/workflows/g7-6-b5a-renderer-curriculum-qa.yml`.
