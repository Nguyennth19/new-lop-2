# N13B1_SYNTH_5 — isolated prompt-only delta

**State:** TEST/QA only. This directory is a separate, versioned delta; it does not edit the pinned N13 source pack.

- Base commit: `c7f7773c796c7fd853aa3dcb0b47bd1379d7cf41`
- Base source: `qa/n13-semantic-coverage/pilot-lessons.review.json`
- Base source Git blob: `bca781df58ce143a2579e2b6510d27e517606ab9`
- Variant/part: `N13B1_SYNTH_5` / `b`
- Before: “Chọn các số lớn hơn 30 và bé hơn 34.”
- After: “Trong các số sau, chọn những số lớn hơn 30 và bé hơn 34.”

Only `reviewDto.parts[id=b].model.prompt.text` changes in the isolated fixture. The variant ID, lesson ID, LV2 candidate, source anchor, part A number line, part B question/part IDs, MULTIPLE mode, speech flag, options `x=30, y=31, z=33, w=34`, and QA-only key `y,z` are preserved.

## Regression

The no-deploy GitHub Actions workflow runs:
1. Node contract tests comparing the isolated fixture against the pinned baseline and asserting exactly one field changed.
2. Chromium HTTP preview at 360/768/1280 px, including options, responsive overflow, and the `vi-VN` SpeechSynthesis API call contract.

The speech test stubs the browser speech API. It verifies text/locale/rate/pitch passed to the API; it does **not** claim audible output, real-device TTS acceptance, pedagogy approval, or production behavior.

The preview server uses a strict allowlist. The QA grader, private oracle, N12 files and arbitrary repository paths are not served.

## Non-effects / gates

No changes to the pinned source pack, admission file, composite pack, grader, renderer, manifest, GAS, Sheets, ACL, grants, READY, MAIN, Pilot or Release. SYNTH_3/4 remain blocked pending qualified pedagogy review. SYNTH_6's bounded multiple-answer exception remains unimplemented and blocked pending qualified pedagogy review. No renderer or trusted grading authority is granted.

## Local reproduction

```sh
npm install --no-save --no-package-lock playwright@1.56.1
npx playwright install --with-deps chromium
node --test qa/n13-semantic-coverage/delta-synth5-prompt-only-20261125/synth5-prompt-delta.test.cjs
node qa/n13-semantic-coverage/delta-synth5-prompt-only-20261125/synth5-prompt-http.test.cjs
```
