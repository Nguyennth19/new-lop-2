# F-A — QA EVIDENCE AND SIGNOFF BOUNDARY
## Verified historical evidence
- E03 source HEAD: `b0ae0eab7f4b8bfe5687ae49cdb701da74ba9583` (source documentation commit).
- E03 CI: Run ID `43440199612`; head SHA `4da9e6eedce8e39a912a9dfbedfe255421941a40`; GitHub REST conclusion `success`; https://github.com/Nguyennth19/new-lop-2/actions/runs/43440199612
- Most recent E03 source-HEAD CI: Run ID `43440539685`; SHA `b0ae0eab7f4b8bfe5687ae49cdb701da74ba9583`; conclusion `success`; https://github.com/Nguyennth19/new-lop-2/actions/runs/43440539685
- F-A CI: Run ID `43447904122`; SHA `2b3a3893226725b0e149811e0bea15e1fa3298cf`; conclusion `success`; all job steps success; https://github.com/Nguyennth19/new-lop-2/actions/runs/43447904122
- E03 report: 27/27 offline composer tests. G0/G1/G2/G4/G6 PASS, G3 N/A, G5 BLOCKED, G7/G8 PENDING. Technical success is not release readiness.
- Branch F-A base: source `b0ae0eab7f4b8bfe5687ae49cdb701da74ba9583`; initial recovery checkpoint commit `742784f5a11c93ff314349f94cca2db231ea1056`.
- No CI claim for F-A until a run ID and result have been inspected through GitHub after this commit.

## F-A static audit criteria
JSON parsing, 4/2/2 and total 8, exactly 3 family IDs/4 sessions, no duplicate sessions, allocations match quotas, explicit source-scope INDEX_VERIFIED, all pedagogyStatus PENDING, no owner signoff, allowStudentUse=false, draft policy, carry-required and bounded operands, risk flag when LV3 has LV2 skill/interaction/variant class. The flag is a required PENDING rather than a false claim of FAIL mathematics.

## QA execution / ledger
| Run | SHA | Conclusion | Notes |
|---|---|---|---|
| E03 43440199612 | 4da9e6eedce8e39a912a9dfbedfe255421941a40 | SUCCESS | Prior inherited OFFLINE tests |
| F-A 43447904122 | 2b3a3893226725b0e149811e0bea15e1fa3298cf | SUCCESS | Verified all steps: static safety audit, variant validator, policy generator, multi-family composer. Does not certify pedagogy |

No changes to main, test-theo-main, Web App TEST Version 6, H.1 Bài 20 or student records. `RELEASE_READY=false`.

## F-A.1 independently verified run
- Run ID `43449443133` at SHA `7e8fa5906f8f9988e45ab2ec7b6ff2f22eecb487`: `success`; https://github.com/Nguyennth19/new-lop-2/actions/runs/43449443133. All job steps passed: F-A safety, E0.1 validator, E0.2 generator, E0.3 composer, B21 LV3 bridge-to-ten overlay proof, no-deployment marker.
- **Scope limitation:** LV3 proof only in separate offline reasoning overlay, not in composer-generated student renderer. G5 BLOCKED, G7/G8 PENDING; no owner approval inferred. Policy decision packet created in commit `da082aa39f1d2975128e751c309f52fa466be69a`.
