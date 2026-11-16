# B6-C08 Append-only Execution Journal — 16/11/2026
| Seq | Source | Read-only observation/action |
|---|---|---|
| 00 | B6 parent `0a453101ab47567bdf3ff820f9b58a9d7c0c86d3` | Frozen, C07 remains independent unsigned. |
| 01 | Drive SGK T1 `1Zfiw7VMZ_34cW1ZfaY3iuoRJLmaEuvfr` | Downloaded original bytes, SHA256 `cb8cb303294edc0be2f36a9507965b59345c0d53c296d610858e7454dfa8321e`; 141 pages; visually inspected printed 106–109. |
| 02 | Drive SGK T2 `1T8RaavitX03_f0VvxjO1zOiXjnMBhrrs` | Downloaded original bytes, SHA256 `044142f31fa94769a143dd029422ee74c49480ad9304e567cc8d97efa4c42f36`; 142 pages; visually inspected printed 102–105. |
| 03 | Sheets B027 | Direct read 02/03/07 tabs. Session rows 15–16 wrong printed pages; 6 canonical exercise rows 50–55 incompatible with page evidence. |
| 04 | Sheets B065 | Direct read 02/03/07 tabs. Session rows 167–168 wrong pages, 7 canonical rows 592–598 contaminated with clock/calendar; variant rule row 45 contains hour-hand mutation. |
| 05 | P0.6 pin `c0c5620f` | FB2 catalog contains only B20/B21 accepted; B24 and Vietnamese pending; B27/B65 absent. |
| 06 | Separate C08 TEST branch | Create isolated candidate correction pack, no source sheet/manifest modification. |
| 07 | New CI only | Diff guard + P0.6 pin + B6-C08 contract test; no legacy rerun, no deployment. |

## CI readback — appended 2026-11-16
- Source-only workflow `43787725339` completed SUCCESS at HEAD `8f5a1712b15d98039331cee3d3389c776225c281`; separate C07 preserved and no protected diff.
- GitHub artifact `14190524593` size 9224 bytes contains only public audit JSON/report, not SGK scans or student data.
- No source Google Sheet edits; 4 session corrections and 13 quarantine records remain proposed only. C08 remains BLOCKED.
