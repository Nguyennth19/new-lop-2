# N13 Pedagogy Review Handoff

**Handoff ID:** `N13_PEDAGOGY_REVIEW_HANDOFF_20261125`  
**Date:** 2026-11-25 (GMT+7)  
**Status:** `PREPARED_NOT_ASSIGNED_WAITING_FOR_REVIEWER_IDENTITY`  
**Admission status:** `NO_GO — 0/10 formally admitted; studentPlayable=0`  
**Consolidated review:** [N13_CONSOLIDATED_ADMISSION_REVIEW_20261125.md](N13_CONSOLIDATED_ADMISSION_REVIEW_20261125.md)  
**Review base:** `c9a44da52cfed6b8c1eb5673e2d9f2eb701d6305`  
**Source pack checkpoint:** `73cc8d7c1bf69ba5771424ffbbb08d2187895334`

## 1. Purpose and authority boundary

Request an independent, qualified pedagogy review of the ten N13 review variants, with priority on:
1. `N13B1_SYNTH_3` — number-line step-2 prerequisite and level.
2. `N13B1_SYNTH_4` — step-2 number-line plus prerequisite arithmetic.
3. `N13B1_SYNTH_6` — bounded multi-answer policy for the open interval `35 < n < 40`.

The reviewer is asked to assess pedagogical validity, curriculum/lesson scope, level candidate, prerequisite knowledge, wording, cognitive demand, answerability and scoring policy. This handoff does **not** delegate authority to approve source-exact reproduction, skill registry, renderer, trusted grading, admission, integration or release.

**No reviewer has been assigned.** No qualified reviewer identity or qualification evidence was present in the repository evidence reviewed on 2026-11-25. This file is a prepared handoff package, not a claim that a reviewer has received, accepted or completed the review. Owner must identify and confirm a qualified reviewer before assignment.

## 2. Reviewer qualification and independence gate

Before review begins, record and have the Owner confirm:
- Reviewer name and professional role.
- Relevant qualification/experience in primary mathematics education, curriculum design or assessment for the applicable grade/learning stage.
- Familiarity with the applicable Vietnamese SGK/VBT sequence and teacher guidance where relevant.
- Relevant expertise for the reviewed content: place value/tens and ones, number lines and step sizes, predecessor/successor, open intervals/natural-number sets, and assessment/scoring validity.
- Conflict-of-interest or prior-authoring disclosure.
- Confirmation that the reviewer can inspect the exact source PDFs and cited pages, not only AI-generated summaries or prototypes.

A GitHub username alone is not evidence of qualification. Do not infer reviewer credentials from repository access, commit history, job title text or an AI-generated review.

## 3. Source and checkpoint package

Review the following pinned materials before deciding:
- Consolidated report at this branch's parent checkpoint: `qa/n13-semantic-coverage/N13_CONSOLIDATED_ADMISSION_REVIEW_20261125.md`.
- Candidate DTOs and source anchors: `qa/n13-semantic-coverage/pilot-lessons.review.json`.
- Admission candidates and review focus: `qa/n13-semantic-coverage/b1-admission.review.json`.
- Source/visual crosswalk findings: `qa/n13-semantic-coverage/source-visual-closure.review.json`.
- Candidate/coverage indices: `candidates.review.json`, `coverage.review.json`.
- Governance and workflow constraints: repository `AGENTS.md` and Governance V16 as referenced by the admission record.
- SYNTH_5 isolated prompt and Owner QA boundary: `delta-synth5-prompt-only-20261125/synth5-owner-acceptance-20261125.md`.

### Source PDF references

The visual closure record identifies these source books and hashes:
- SGK: Drive file ID `1lpsU8dsk_ieYzECqpZ6kwTaVgj20rETE`; SHA-256 `f3ccd34900f2047afbcf88fa5f9e89dd8908ac09a44b4f266d4282375aeb7ff5`; 142 PDF pages.
- VBT: Drive file ID `1k_g7n1THQSSCw1YsYWBZ3wIDhSLe4bYm`; SHA-256 `392c43552a4d60480c22496542984ad6add55bab1744898031adc439947aed94`; 137 PDF pages.

The source images are not committed in this review pack. The source-visual closure JSON is explicitly `AI_VISUAL_CURRENT_PDF_ONLY_NO_HUMAN_SIGNOFF`; it is a lead for inspection, not an authoritative pedagogy decision. Obtain authorized read access to the exact PDF versions and verify the page/hash used during review. Historical ACL fields in some JSON files are stale; a later Owner report recorded public edit closure and the above hashes, but this handoff has not re-read Drive ACL/hash live.

## 4. Review inventory — ten variants

All ten are concept-anchored synthetic review variants, not source-exact reproductions. In the pack, `sourceExerciseId=null`, `sourceExactApproved=false`, `skillIdApproved=null`, `rendererGrant=DENY`, `publicVariant=null`, and `studentRelease=false`.

| Variant ID | Lesson | Current level candidate | Source/concept anchor | Specific review question |
|---|---|---:|---|---|
| `N13B1_SYNTH_1` | MATH_B001 | LV1 | SGK_B001_L1_E01 | Does the expanded-form practice and its three parts fit the intended LV1 learning progression and actual taught content? Do not treat the current eight-part/source crosswalk as exact source equivalence. |
| `N13B1_SYNTH_2` | MATH_B001 | LV2 | VBT_B001_T02_E01 | Is the independent expanded-number practice appropriately LV2, and does it assess the intended skill without omitting the source robot-hand work? Owner's earlier LV2 direction was candidate-only, not formal admission. |
| `PV_B001_PLACE_VALUE_S1031` | MATH_B001 | LV1 | SGK_B001_K1_E02 | Is the tens-and-ones single-choice item valid for the intended lesson scope and LV1? Prompt: “Số gồm 4 chục và 5 đơn vị là số nào?” Options: 44, 54, 45, 46. This is concept-only, not exact matching of the SGK task. |
| `N13B_SYNTH_1` | MATH_B001 | LV1 | SGK_B001_L1_E03 | Does the semantic place-value table correctly assess the intended number/tens/ones knowledge at LV1? Keep this ID distinct from `N13B1_SYNTH_1`. |
| `N13B_SYNTH_2` | MATH_B001 | LV2 candidate | VBT_B001_T02_E03 | Is LV2 justified by the VBT learning progression, or should this remain HOLD / be reconsidered at LV1 after source-scope review? Keep this ID distinct from `N13B1_SYNTH_2`. |
| `N13B1_SYNTH_3` | MATH_B002 | LV1, conditional LV2 review | SGK_B002_H1_E01 | Are both step sizes and all number-line demands already taught at the relevant point? Are endpoints and scaffolding sufficient? |
| `N13B1_SYNTH_4` | MATH_B002 | LV1, conditional LV2 review | SGK_B002_H1_E02 | Have step-2 number lines and the prerequisite addition/subtraction facts been taught? Is coordinate matching appropriate at the proposed level? |
| `N13B1_SYNTH_5` | MATH_B002 | LV2 | VBT_B002_T01_E01 | Does the revised prompt, number-line context and multi-select subset task fit the intended learning outcome and LV2? Separate prompt QA acceptance from formal pedagogy/source admission. |
| `N13B1_SYNTH_6` | MATH_B002 | LV2 | VBT_B002_T01_E03 | Is the bounded multi-answer open-interval item pedagogically valid and unambiguous under Governance V16? See the explicit exception question below. |
| `N13B1_SYNTH_7` | MATH_B002 | LV2 | VBT_B002_T02_E04 | Is the predecessor/given/successor table suitable for LV2 and does it preserve the intended source task's cognitive demand? |

## 5. Priority reviews — required decisions and evidence

### 5.1 `N13B1_SYNTH_3` — number-line step-2 prerequisite

Pinned DTO:
- Part A: `NUMBER_LINE`, start 0, step 1, ticks `[0, null, null, null, null, null, 6]`.
- Part B: `NUMBER_LINE`, start 20, step 2, ticks `[20, null, null, null, null, null, 32]`.
- Anchor: SGK B002 H1 E01, printed page 11 / PDF page 12.

Source visual note (AI review, not signoff): source has two number lines, each with 11 ticks and unit step, five missing values per line (10 blanks total). The synthetic model has seven ticks per line and includes a step-2 example.

Reviewer must answer:
1. Does the applicable SGK sequence teach step-2 number lines before this lesson/item is used?
2. Is the second line a legitimate extension, or does it introduce an untaught concept?
3. Are endpoint values and spacing sufficient to infer the missing values without hidden assumptions?
4. Is LV1 defensible? If not, is LV2 defensible only after evidence that step-2 is taught? Otherwise keep HOLD.
5. Does the synthetic task assess the intended concept without being misrepresented as source-exact?

Required evidence: exact SGK page/lesson sequence, relevant teacher guidance if used, prerequisite mapping, and a written rationale for level and disposition.

### 5.2 `N13B1_SYNTH_4` — coordinate matching and arithmetic prerequisite

Pinned DTO:
- `COORD_MATCH`, start 0, step 2, tickCount 4.
- Labels: `2 + 4`, `0`, `6 - 2`, `2`.
- Anchor: SGK B002 H1 E02, printed page 11 / PDF page 12.

Source visual note (AI review, not signoff): source has 19 ticks from 0 through 18 and six balloons including one worked link, leaving five links. The current prototype has four labels/four ticks and does not reproduce the source sparse-target geometry.

Reviewer must answer:
1. Has a step-2 number line been taught at this point?
2. Have the arithmetic facts `2+4` and `6-2` been taught and practiced before this task?
3. Does matching arithmetic expressions to coordinates measure the intended learning outcome or add an unapproved prerequisite?
4. Is LV1 defensible, or is LV2 justified only if both prerequisites are evidenced? Otherwise keep HOLD.
5. Does the task preserve enough support and avoid ambiguity in label-to-coordinate matching?

Required evidence: exact SGK sequence/page, arithmetic prerequisite location, explicit dependency chain and level rationale.

### 5.3 `N13B1_SYNTH_6` — bounded multi-answer exception

Pinned DTO:
- Part A: D4 SINGLE; prompt “Số liền sau của 38 là 39.”; options “Đúng” / “Sai”.
- Part B: `INEQUALITY_INPUT`, lower 35, upper 40.
- Anchor: VBT B002 T01 E03, printed page 10 / PDF page 11.

Owner's in-principle direction for part B is limited to canonical natural-number answers `36`, `37`, `38`, `39` satisfying `35 < n < 40`. This is **not** a qualified reviewer approval and has not authorized a grader change.

Source visual note (AI review, not signoff): source contains four true/false statements including the zero boundary plus one numeric inequality input; the synthetic variant has one statement and one interval input.

Reviewer must answer:
1. Is the open interval intended to admit all natural numbers strictly between 35 and 40?
2. Is the expected set exactly `{36,37,38,39}` under the curriculum's definition of natural number?
3. Is the prompt sufficient to communicate that any one valid number may be entered, rather than a unique answer?
4. Does accepting four answers conflict with Governance V16's unique-answer policy, or is a narrowly documented exception pedagogically and operationally justified?
5. What exact response normalization is acceptable? Confirm treatment of endpoints 35/40, leading-zero strings such as `036`, whitespace, signs, decimals, empty input and non-integers.
6. Does the D4 true/false statement remain correct and appropriately leveled?
7. Does the reduced one-statement/fewer-part version materially alter the assessment objective relative to the source's four statements plus input?

Required decision: either (A) approve a narrowly scoped multi-answer exception with exact accepted domain and rationale, or (B) reject the exception / require HOLD and specify a pedagogically valid alternative. Do not edit the grader or implementation in this review.

### 5.4 `N13B1_SYNTH_5` — accepted prompt delta boundary

The isolated SYNTH_5 QA delta changes only the part-B prompt to:

> Trong các số sau, chọn những số lớn hơn 30 và bé hơn 34.

Options remain `30,31,33,34`; mode remains `MULTIPLE`; QA-only answer IDs remain `y,z`; part A number line and IDs are preserved. Owner confirmed the Vietnamese TTS was acceptable on a real device; automated browser SpeechSynthesis is stubbed.

The original `pilot-lessons.review.json` still contains the earlier prompt and was not modified by the isolated delta. Reviewer must evaluate the accepted prompt as a separate QA delta and record whether it is pedagogically sound; do not infer formal admission from Owner's wording/TTS acceptance.

## 6. Required decision record — complete for every variant

For each of the ten IDs, record:
1. `variantId`, `lessonId`, source track, printed/PDF page, and source PDF SHA-256.
2. Reviewer-observed source task: intended objective, actual parts/blanks, visual structure, examples and response mode.
3. Prior teaching evidence: exact earlier lesson/page/section and the concept already taught.
4. Cognitive demand and level decision: `LV1`, `LV2`, `LV3`, `RECLASSIFY` or `HOLD`, with rationale.
5. Mathematical correctness, language clarity, ambiguity and age/grade suitability.
6. Answerability and assessment validity; if multiple valid responses exist, enumerate the exact set and explain policy compatibility.
7. Source relationship: `CONCEPT_ANCHORED_ONLY`, `SOURCE_EXACT_SUPPORTED` (only if independently demonstrated), or `SOURCE_SCOPE_UNCLEAR`.
8. Final pedagogy disposition: `PEDAGOGY_ACCEPT`, `PEDAGOGY_ACCEPT_WITH_CONDITIONS`, `REVISE_AND_REVIEW`, `HOLD`, or `REJECT`.
9. Evidence citations: exact source page/section and any curriculum/teacher guidance inspected.
10. Reviewer signature/identity, qualification basis, conflict disclosure, date/time (GMT+7), and Owner acknowledgement.

A reviewer may recommend that a variant is pedagogically acceptable while still marking it concept-anchored and not source-exact. Do not collapse these decisions into one.

## 7. Review outcomes that must remain separate

The review report must separate:
- Pedagogical validity and level recommendation.
- Source-exactness / source-routing evidence.
- Skill mapping recommendation.
- Renderer suitability recommendation.
- Grading policy recommendation.

A positive pedagogy recommendation alone does not change:
- `sourceExactApproved=false`
- `skillIdApproved=null`
- `rendererIdApproved=null`
- `rendererGrant=DENY`
- `publicVariant=null`
- `studentRelease=false`
- `gradingAuthority=DENY`
- `studentPlayable=0`

The current bank remains below the V16 per-level threshold recorded in the consolidated report (B001: LV1=3/LV2=2/LV3=0; B002: LV1=2/LV2=3/LV3=0). Do not invent additional questions to fill a quota. LV3 has no approved reference.

## 8. Explicit prohibited actions during handoff

Reviewer and implementer must not, as part of this handoff:
- Edit or replace the pinned source pack, DTO, answer IDs or grader.
- Change SYNTH_6 accepted-answer logic or implement the four-answer exception.
- Register `NUMBER_SENSE` or any other skill.
- Grant or register any renderer or manifest mapping.
- Change Drive ACL, Google Sheets, GAS, TEST/MAIN, READY, Pilot or Release.
- Merge this branch, deploy, activate trusted grading or write learner data.
- Mark any variant admitted or student-playable.

Any later implementation or admission requires its own explicit Owner decision and the appropriate technical/security/source gates.

## 9. Reviewer assignment and completion fields

**Reviewer assignment:** `NOT_ASSIGNED`  
**Reason:** no reviewer identity and qualification evidence supplied/verified in the repository at handoff preparation time.  
**Owner action required:** nominate the reviewer and confirm qualification/independence; only then add the reviewer as assignee or requested reviewer.

| Field | Value |
|---|---|
| Reviewer full name | PENDING |
| GitHub username (if applicable) | PENDING |
| Qualification / relevant experience | PENDING |
| Independence / conflict disclosure | PENDING |
| Owner confirmation of qualification | PENDING |
| Review start / completion timestamp | PENDING |
| Review report link | PENDING |
| Owner acknowledgement | PENDING |

**Completion condition:** the reviewer submits an evidence-cited, item-by-item decision record for all ten variants, with explicit conclusions for SYNTH_3, SYNTH_4 and SYNTH_6. Until then the handoff remains `PENDING_REVIEWER_ASSIGNMENT` and the N13 admission disposition remains NO-GO.

## 10. Rollback and traceability

This handoff is a new Markdown document on a separate QA branch. Rollback is to abandon the branch or delete only this handoff file. The consolidated review branch and inherited SYNTH_5 QA/Owner-acceptance branch remain untouched.
