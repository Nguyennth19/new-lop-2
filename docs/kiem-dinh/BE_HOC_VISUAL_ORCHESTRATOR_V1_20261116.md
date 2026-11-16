# BE-HOC VISUAL ORCHESTRATOR V1 – Single consolidated integration
- Date 2026-11-16; source branch be-hoc.
- 12 renderer routes (D1–D10 plus D8A/D8B) are imported as **byte-pinned original G7.4 reference sources** and loaded globally in GAS templates. They are not independent unconnected demos anymore.
- G7 library has 288/288 WebP, verified image hashes and owner approval, available globally via `BE_HOC_ASSETS_288.resolve(id)`. Reuse 2910 binary checks and 101 browser/contract tests. No duplicate media QA.
- `BE_HOC_VISUAL_ORCHESTRATOR` centralizes renderer registration, question public projection, exact-count semantic gate, and lesson matching. `mountLesson` called on actual B20 lesson render after existing B20 D2 and SVG. No user answers or star writes in orchestrator.
- Only `lessonId + skillId + type + publicVariant` with independently confirmed lesson binding is auto-mounted. B20 D2 remains routed to its existing manual-carry GAS read-only host, no duplicate. D10 inherits existing word card; adding a standalone untrusted graded renderer is forbidden. D5/D9 stay in their separate approved TEST lab until SGK/E04 approval.
- A source module being runnable/QA PASS does not prove a matching question is in the active lesson. **No auto fabrication** of records or inference from arbitrary prompt text. Current B20 Google Sheets does not carry `visualContract` for 10 forms; therefore only existing B20 D2/SVG/8 WebP mappings are immediately visible. Future lessons can plug approved public contracts into same global dispatcher without new renderer coding.
- All forms are available in runtime for any curriculum-backed forms in future (single feature gate), but not blanket enabled for student scoring or unnamed lessons.
- REAL GAS TEST deployment remains an independent approval and execution gate. Do not merge main/test-theo-main or change student scores.
- Rollback to 00747d23ec598d5bb40dd1be30c99e9e1472e816.
