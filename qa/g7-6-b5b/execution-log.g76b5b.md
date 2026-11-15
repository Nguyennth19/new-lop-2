# G7.6-B.5-B – EXECUTION LOG / RECOVERY / TEST EVIDENCE

**Date** 2026-11-15. **Branch** `test/g7-6-b5b-resource-tts-e2e-20261115`. **Ancestor** B5A `f3653d850864f75c7e3640585364d68f17f1428c`.

| Step | Reference | Outcome |
|---|---|---|
| 0 | Owner chat | User accepted B5A Tangram position/drag; requested B5B Resource, TTS & E2E QA. Owner voice/audio NOT yet evaluated. |
| 1 | Source inspection | Confirmed pinned registry 12; 288 asset metadata not full content; 46 Fluent SVG staging disabled; G7.5 V2 manifest source `c9880bfc...` and blob `605a8ed9...`. |
| 2 | Branch created | New isolated B5B branch exactly from B5A; no main/test-theo-main changes. |
| 3 | `f65905e07b14a7494b821265466e35384c9f630c` | B5B policy: 14 public cases, 288 metadata-only, 46 staged Fluent, visible-only TTS, no releases. |
| 4 | `4b6d23ca3aa4144367664ddbe376746911257d22` | Public E2E pipeline enforces provenance, renderer mapping, image/quantity policy and speech whitelist. |
| 5 | `e8522fa50c86e1787f9ddc2200bd8976bca35915` | 14-case E2E + negative/counterfeit tests, mock Web Speech request. |
| 6 | `e4b987615ef8864e22b752799235238c9d0ff324` | B5A offline HTML wrapper extended with TTS gesture-only buttons. |
| 7 | `017583dcccbf46ab00a66a2474265ef4bfecedf5` | Chrome actual viewport screenshot, Tangram snap/drag unchanged, TTS controls and no autoplay. |
| 8 | `f35f8834745ab48dd4b58c3a5231db6117f824d2` | QA opens TTS details before measuring 44px buttons. |
| 9 | G7.5 V2 source | Read exact `thu-nghiem/g7-5-vietnamese-tts/compat-v2/G75_MathSpeechNormalizer_V2.js` from immutable commit `c9880bfc...`, blob `605a8ed9...`. |
| 10 | `38482911d38c6f829df6c14a912a1db955eea785`, `594f5980f30f3acf20704292bdb194f9485e4656` | Pinned actual V2 source and tests normalization/segments across public cases; no audio verification claim. |
| 11 | `75311d2ce9dd33fd0c26651c285f065167457a73` | V2 source inlined into B5B TEST HTML, Web Speech requested only upon click. |
| 12 | `078083a8d6783833c7a4e8bcc25b1af0d6cdbf63` | CI checkout pins P0.6 and G7.5 source, inherited 1294 and new tests, Chrome 360/390/1440, ZIP artifact. |
| 13 | Run `43733616089` failed (preserved) | First E2E pass discovered `INVALID_VISIBLE_PROMPT` from D2/D4 plan schema mismatch. No source/renderer degraded. |
| 14 | Diagnostic `9699cd77324c1334fec4fc19a60f7c8855d3f668` | D2 public plan has `a[]/b[]` columns + operation with **no** prompt string; D4 prompt is structured `{type:'TEXT',text,...}`. |
| 15 | `b164f81d00d685b175223bc9cf4019dc241496a9`, `180b8359145a5ef18c541437a57df1aeabb16d37` | Added visible-only speech projector, test agreement across D2/D4. |
| 16 | `1254707e58db2914b88582ad6983eafc917b1e85`, `107afb485e2d550b763b9ca2027e1196d17b4f1f` | Updated narrow policy and browser TTS extraction; no answer keys. |
| 17 | Earlier test failure run `43733827742` | Found mock test still reading missing D2 `nativePlan.prompt`; corrected to use projected public visible text. This was test-only, no production code change. |
| 18 | `947a04a5edf6b58ffd95bb619490f91edf5ad8f0` | Mock Web Speech now checks correct D2 visible operand-based speech. |
| 19 | **CI `43733914261` COMPLETED SUCCESS** | **1294 inherited + 308 B5B = 1602 assertions PASS**. Real P0.6 E03 8, E02 2, E04 sidecar 4. |
| 20 | Chrome on `43733914261` | 360, 390, 1440 and 390 all PASS. Tangram 2 × 3 snap 0px bbox difference, drag ~70px → unplace. 14 TTS buttons, no auto speaking, 44px check PASS. |
| 21 | Artifact `14168784088` | Offline standalone HTML 116505 bytes, SHA256 `c4aa0ae8adedbef7e81eac0e897eab215ea233fe3d32a6a614b762134086da73`. 12 ZIP files CRC OK; Chrome screenshots and E2E JSON receipts. |
| 22 | Drive file `1HQ3MvGxFKs5xTCUMZrEKbPo_joX-NKWL` | Uploaded ZIP 1,692,317 bytes to exact project folder `16uf-v_CVwm0R9RdY3OLv7WnhqFeBSAe8`, verified metadata. |
| 23 | `dfaac30997df09d9082c0c037ffc0edc601d8b74` | Full audit report, explicit software voice vs actual heard audio distinction. |
| 24 | `3b9fcc3a5911110395abf827c3b945b927f8b5d5` | Machine-readable B5B checkpoint for reproducible rollback. |
| 25 | CURRENT | Append-only journal. Re-run CI on final docs/record HEAD; no merge or GAS. |

### Strict protection and remaining gates
- **No** edits to original G7.4, B5A, G6, P0.6 or G7.5 sources, pinned 12 renderer official manifest, main, test-theo-main.
- **No** approved 288 WebP runtime; registry is metadata and asset image content QA not global PASS. 46 Fluent SVG remain staged/disabled. D5 parametric SVG and D9 exact public-count emoji remain authorized TEST visual strategies.
- **Audio normalization/prosody source executed**, but native speech sound was not heard by CI. B5B user must listen on device before marking audio PASS.
- E04 lesson/SGK page mapping & approved owner school policy PENDING; official mental renderer manifest registration PENDING, no GAS, D10 trusted grading, points/stars/student IO.

**Rollback:** stop B5B TEST overlay and return to B5A SHA `f3653d850864f75c7e3640585364d68f17f1428c`. No deployed service touched.

**Sources:** `qa/g7-6-b5b/checkpoint.g76b5b.v1.json` and `docs/kiem-dinh/G7.6-B5B_RESOURCE_TTS_E2E_QA_20261115.md`. GitHub Action `43733914261`, artifact `14168784088`.
