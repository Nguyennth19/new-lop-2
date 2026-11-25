# N13B1_SYNTH_5 — Owner acceptance and isolated QA closure

**Record:** `N13_SYNTH5_OWNER_ACCEPTANCE_RECORD_V1`  
**Date:** 2026-11-25 (GMT+7)  
**Scope:** isolated TEST/QA prompt delta only  
**Disposition:** `TECHNICAL_QA_CLOSED_WITH_DEVICE_TTS_ACCEPTANCE_PENDING`

## 1. Owner decision already on record

Owner explicitly approved the exact prompt-only wording in [Issue #15 comment 7151332838](https://github.com/Nguyennth19/new-lop-2/issues/15#issuecomment-7151332838):

- Before: “Chọn các số lớn hơn 30 và bé hơn 34.”
- After: “Trong các số sau, chọn những số lớn hơn 30 và bé hơn 34.”

The Owner direction required preserving IDs, selection mode, options and answer IDs, and running targeted TTS/HTTP regression on an isolated TEST copy before any admission decision.

This record does **not** convert that wording approval into qualified pedagogy-review approval or a student-admission decision.

## 2. Delta under acceptance

- Base checkpoint: `c7f7773c796c7fd853aa3dcb0b47bd1379d7cf41`
- Isolated delta commit before this record: `cf038cd84af6e2fee79a80be768fcb952f843427`
- Changed field: `reviewDto.parts[id=b].model.prompt.text` only.
- Preserved: variant/lesson/part IDs; LV2 candidate; source anchor; part A number line; part B question ID; `MULTIPLE`; `speechEnabled`; options `x=30, y=31, z=33, w=34`; QA-only answer IDs `y,z`.

## 3. Technical QA evidence — PASS

GitHub Actions [run 45537281018](https://github.com/Nguyennth19/new-lop-2/actions/runs/45537281018) completed with conclusion `success`.

- Node contract suite: **5/5 PASS, 0 FAIL**.
- Chromium HTTP/responsive/TTS API regression: PASS at **360, 768 and 1280 px**.
- Verified exact prompt text and all four options.
- Verified MULTIPLE selection behavior: `y,z` selected; `x,w` not selected.
- Verified part A number-line heading remains present.
- Verified no horizontal overflow and no page errors at the tested viewports.
- Verified the Vietnamese SpeechSynthesis API call contract: exact prompt text, locale `vi-VN`, rate `.92`, pitch `1.1`.
- Verified private QA grader/oracle and N12 routes return HTTP 404 from the preview server.
- Workflow is explicitly no-deploy and has `contents: read` permission only.

The base-to-delta compare is one commit ahead and six files added; no existing files were modified or deleted.

## 4. Acceptance boundary and remaining limitation

The browser test stubs `SpeechSynthesisUtterance` and `speechSynthesis`. It proves the text/locale/rate/pitch passed to the browser API, **not** audible speech, voice quality, device compatibility, or physical-device acceptance.

Therefore:

- **Owner wording decision:** CONFIRMED by the prior Owner direction.
- **Isolated technical delta and automated regression:** PASS; closed within this scope.
- **Real-device audible TTS acceptance:** PENDING direct Owner/device confirmation; not claimed here.
- **Qualified pedagogy review:** NOT PROVIDED.
- **Formal admission / renderer grant / trusted grading / student release:** NOT APPROVED.

## 5. Non-effects

No merge, deploy, or change to the pinned source pack, admission file, composite pack, grader, renderer, manifest, GAS, Sheets, ACL, grants, READY, MAIN, Pilot or Release. `SYNTH_3`, `SYNTH_4` and `SYNTH_6` remain HOLD/DENY pending the required qualified pedagogy review. The existing `rendererGrant: DENY`, `publicVariant: null`, and `studentRelease: false` controls remain unchanged.
