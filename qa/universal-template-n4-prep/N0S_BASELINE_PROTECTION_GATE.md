# N0-S — baseline protection and sign-off control (PREPARATION / ADMIN ACTION BLOCKED)

**Status at 2026-11-23 GMT+7: NOT PROTECTED / NO APPROVAL / NO RELEASE.** This is a governance control file, not an active GitHub ruleset. [Admin-action tracker #15](https://github.com/Nguyennth19/new-lop-2/issues/15).

## Frozen baseline: identities verified from GitHub
| Branch | HEAD pinned | protected |
|---|---|---|
| `be-hoc` | `1b69e277f8de6cb156f46a1d85af33bdad70c0ef` | false |
| `lab/ult-r1-r2-hardening-20261123` | `fe15c79b21b9f056694f8127330934d997affd45` | false |
| `lab/universal-learning-template-v13b-sheet-test-20261120` | `af02456fcc2b3be856091edc899c699890d74da0` | false |

GitHub Rulesets GET currently yields `[]`. GitHub branch protection detail API returns 403 (`Resource not accessible by integration`): connector does not expose an administrator write operation for rulesets or branch protection. Thus no technical enforcement can truthfully be claimed from this QA branch or Issue #15.

## Admin setting specification
An authorized GitHub repository admin must open repository Settings > Rules > Rulesets; create a **branch** ruleset `N0-S-FROZEN-BASELINES` (or three individually auditable rulesets), **enforcement ACTIVE**, exact branch names above; disallow deletion; block non-fast-forward and force push; require reviewed PR prior to updating pinned baselines. Record any exceptional bypass and its independent approval. Do not invent nonexistent required CI checks or impose impossible reviewer count on a one-person repo.

Verify via authorized UI/API after application: ruleset ID, matching refs, `active` enforcement, effective restrictions, branch `protected:true`, pin HEAD before/after, and negative test on a **throwaway** test branch under an equivalent rule. Do not attempt force push on actual source baselines.

## Signer authorization matrix (no signatures yet)
| Capacity | Verified account or identity | Bound permission / signing authority | State |
|---|---|---|---|
| GitHub admin | `Nguyennth19` | Repository admin query = `admin`; can configure rules only | VERIFIED_REPO_PERMISSION, ADMIN_ACTION_PENDING |
| Project Owner | Not authenticated or explicitly appointed in this record | LAB UX/pedagogy and production release authorization | UNVERIFIED |
| Independent QA | Not authenticated or explicitly appointed in this record | Independent W1 technical acceptance | UNVERIFIED |

**Never derive an educational approval signature from GitHub repo admin permission.** For each approval require authenticated account ID, scope, independent reviewer decision, timestamp in +07, exact tested commit SHA, evidence URL, and any exception reference. External auditor's acknowledgment of a CSV is not a signature for release.

## RTM CSV transfer
Verified local file `ULT_N0_W1_DB_RTM_20261123_V1.csv`: 10,495 bytes, UTF-8 BOM, 15 columns, 10 canonical W1/DB findings. SHA-256:
`d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b`.
Re-send unchanged bytes. Recipient must independently run `sha256sum`, inspect nonempty rows, and acknowledge with date/time and transfer URI. **Recipient ACK remains PENDING.** Do not convert CSV to native Sheet when byte-for-byte SHA needs preservation.

## N0-S closure checklist
- [ ] Active branch ruleset and actual source branch protection verified
- [x] Source pinned SHA and `protected:false` observations logged
- [x] CSV byte count, SHA, header and ten canonical issues locally verified
- [ ] Third party receives and independently acknowledges CSV SHA
- [ ] Project Owner signer account and actual authority recorded
- [ ] Independent QA reviewer account and role recorded
- [ ] Owner accepts N0-S with exact source pins

**N0-S status: PARTIAL / ADMIN-BLOCKED.** No Sheet/GAS writes, no merge and no release.