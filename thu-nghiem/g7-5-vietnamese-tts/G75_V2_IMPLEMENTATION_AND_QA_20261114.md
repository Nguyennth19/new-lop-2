# G7.5 V2 – CONTEXT-AWARE NORMALIZATION & PEDAGOGICAL PROSODY
Date: 2026-11-14. Scope: isolated TEST-only reference; NOT integrated into Web App, NOT release-ready.

## Authoritative baselines and provenance
- V1.2 accepted by the user after standalone listening, no observed errors in the tested sample: `thu-nghiem/g7-5-vietnamese-tts/compat-v1/G75_V12_Test_DocPhepToan_Kg_DauToan_DocLap.html`.
- External report provided by owner: `Tối Ưu Giọng Đọc TTS.pdf` (21 pages). Source-based suggestions: contextual math normalizer, five prosody profiles, chunked sequential speech, SFX/speech coordination.
- Do NOT reuse the report's regex source verbatim. Its claimed 45 samples/100% are not independent QA evidence; its bibliography includes `unknown_url`. We created and asserted our OWN 46 input→expected regression cases instead.
- Prior P0.6 sealed TEST checkpoint `c0c5620f30edd92ab45d4ec87a8a07ffa38948e2`. V1.2 baseline branch `test/g7-5-vi-tts-compat-v1-20261114` commit `59410efa288b5f84e1ae9079f82ccc4d3c4f3311`. V2 branch `test/g7-5-v2-prosody-20261114`.

## V2 implemented artifacts
- `compat-v2/G75_V2_DocToan_Lop2_NguDieu_DocLap.html`: single-file browser test, three comparison modes:
  - A: V1.2 reading (single utterance, rate 0.95, pitch 1.10 for Vietnamese).
  - B: contextual normalization + dynamic 5 prosody profiles + sequential chunk queue.
  - C: same V2 normalized chunks with fixed prosody; isolate value of prosody.
  Preserves number glyphs, math symbols in the displayed question and keeps spoken copy separate. No external CSS/JS, API keys, network calls, student data or grading actions. English sample is not normalized by Vietnamese rules.
- `compat-v2/G75_MathSpeechNormalizer_V2.js`: reusable pure normalization/segmentation helpers; can be Node-tested without the browser. Context override for division/time (`7:15` vs `20 : 5`), variable x vs multiplication x via explicit toggle. Unit formatting including `90cm`, `15l`, `1000đ`. Signs `+ - − × : ÷ = > <`, `=?` and lists of comparison signs. Diacritics and compound-word hyphens preserved. The chosen acoustic spelling defaults to V1.2 `ki lô gam`, with alternate `ky lô gam` in QA UI.
- `compat-v2/G75_MathSpeechNormalizer_V2.test.cjs`: 46 text expected cases + 4 language/context/prosody assertions; this is static regression, **not** 46 verified audio utterances.
- `.github/workflows/g7-5-v2-math-speech.yml`: read-only CI, standalone HTML parser/syntax, unit regression, 14-day QA kit artifact. No GAS deployment.
- Drive copy: HTML `https://drive.google.com/file/d/1M7i9Yk6Gn9W9mj-4Jd4z1hFc6dDwnNKr/view`, source JS `https://drive.google.com/file/d/1b3qJW3RgAwEngVAwCcBE0Gt1gK5Oj_Fm/view`, tests `https://drive.google.com/file/d/19ierj6Hd3rE9wnX_0dgy9v6itzXsMrOQ/view`. All in asset/archive folder ID `16uf-v_CVwm0R9RdY3OLv7WnhqFeBSAe8`.

## Accepted vs pending, architecture caveats
- Standalone's user-triggered audio uses Web Speech API and device voices; onstart/ended is NOT evidence a human heard natural Vietnamese.
- Five prosody values are proposal parameters from report, not yet teacher approved: default(.92,1.10,280ms), question(.90,1.12,400), encouragement(.90,1.06,350), solution_math(.86,1.05,420), praise(.96,1.18,320).
- SFX demo waits for its own generated tone sequence to finish before praise; NOT yet integration with Web App's production success/error SFX.
- HTML demo includes full solution ONLY for QA. Do not expose solution payload or trusted answer key before completion in Dạng 10. This is a P1 integration blocker unrelated to TTS functionality.
- No service worker/offline cache, no persistence of student data, no merging into `main` or `test-theo-main`, no Apps Script Web App TEST V6 changes.
- Need real listening A/B V1.2 vs V2 on Windows/Chrome and Android/Chrome (separate device report), optionally iOS/Safari, and GAS HTMLService in a distinct approved TEST project.
- Future integration should accept a trusted, allowed text/role/context from lesson renderer, not extract hidden DOM, and should make semantic picture descriptions explicit rather than remove all emoji. Keep Vietnamese math normalizer out of English lessons.

## Handoff and recovery
1. Open `G75_V2_DocToan_Lop2_NguDieu_DocLap.html` standalone, run A then B then C on identical text and voice.
2. Compare question, equation, praise, clock vs division, kg spellings, cancel/start, SFX timing, English baseline. Export `G75_V2_KetQua_NgheThu.json` and record human result.
3. Check CI at the exact branch commit and compare Drive/GitHub source bytes. Do not mark AUDIO_PASS from CI.
4. Read `G75_V2_CURRENT_STATE.json` for current evidence gates. P1 integration requires separate owner approval. Maintain `RELEASE_READY=false`.

## Addendum V2-QA (2026-11-14)
- Real headless Chromium DOM smoke test PASS: sample switching Vietnamese/English, normalization preview, dynamic read/stop, no JavaScript page errors. Headless audio returned synthesis-failed; **not device audio certification**.
- Found and fixed colon scope bug: source `20 : 5 = 4. Đồng hồ chỉ 7:15.` must read `20 chia 5 bằng 4. Đồng hồ chỉ 7:15.`. Division/time detection is now per expression, not document-level.
- Regression extended to **46 input-output cases + 4 context/prosody checks**, local Node pass, GitHub CI run `43590646311` SUCCESS at `045e9e5d3394fcecd3c999605afb924906c93223`.
- A prior CI failure run `43590230842` caused by a test filename mismatch was fixed and is retained for traceability; later runs are green.
- Current QA checkpoint: `G75_V2_CURRENT_STATE.json` and V2 branch HEAD. Real Windows/Android audible QA and isolated Apps Script HTMLService QA remain PENDING.
