# G7.4-A – Asset Loader V1 / QA & Recovery
**Date:** 2026-11-12 Asia/Ho_Chi_Minh
**Branch:** `g7-1-content-audit-20261112` (derived from `test-theo-main`)
**Stage:** `LOADER_IMPLEMENTED_TEST_PASS_BINARY_HOST_PENDING`
**Production and TEST branches:** unchanged.

## Host decision
Use **GitHub raw static assets at immutable commit SHA**. This is consistent with the existing G3/G5 image loader `34_HinhAnhDungChung.html`, which already uses `raw.githubusercontent.com/Nguyennth19/new-lop-2/<sha>/hinh-anh/...`. Do NOT serve browser images via Google Drive file-view URLs or ZIP download URLs: they are not stable direct per-image resources.

Target contract **after 288 binary files have been published**:
`https://raw.githubusercontent.com/Nguyennth19/new-lop-2/{IMMUTABLE_BINARY_RELEASE_COMMIT}/hinh-anh/webp-g7/v1/WEBP/{SHEET}/{FILENAME}.webp`

**Important:** As of this checkpoint there are **no 288 G7 binary files committed under that path**; `IMMUTABLE_BINARY_RELEASE_COMMIT` is unset. Do not invent URLs or claim images are live. Backup/candidate release is on Google Drive:
https://drive.google.com/drive/folders/1wLT1TcvAsLZTzk4Z8-Am2AD5gSwTaykR

Manifest source pinned at commit `a3965bb99c8de43c44cccae1921dd8fd98fab365`:
`asset-review/V5/G7_3/ASSET_288_RELEASE_CANDIDATE_MANIFEST.json` (288 mapping entries). Manifest paths are **relative**, and `release_status=CANDIDATE_NOT_APP_DEPLOYED`.

## Implemented code
- `asset-review/V5/G7_4_A/asset_loader_v1.js`: pure browser-compatible loader.
- `42_TaiAnhTheoAssetID.html`: GAS root partial containing the same loader plus a test-only configuration.
- `GiaoDien.html`: one additional `napThanhPhan('42_TaiAnhTheoAssetID')` include, adjacent to `34_HinhAnhDungChung`.
- `asset-review/V5/G7_4_A/test_asset_loader.cjs`: 30 deterministic positive/negative tests.
- `asset-review/V5/G7_4_A/ASSET_HOST_POLICY.json`: host and rollout gates.

No existing G5 image mapping, CSS, question renderer, GAS server functions, or mathematics logic were altered. The new loader does **not** auto-fetch on construction, change DOM, or mount images on page load. The asset base URL in the GAS partial is intentionally empty. Its mount method only acts when explicitly called in later integration.

### Public interface
```js
// Explicit test usage after binary URL is verified:
const loader=KLAssetLoaderV1.create({
  manifestUrl:"https://raw.githubusercontent.com/Nguyennth19/new-lop-2/a3965bb99c8de43c44cccae1921dd8fd98fab365/asset-review/V5/G7_3/ASSET_288_RELEASE_CANDIDATE_MANIFEST.json",
  assetBaseUrl:"https://raw.githubusercontent.com/Nguyennth19/new-lop-2/{VERIFIED_RELEASE_SHA}/hinh-anh/webp-g7/v1/",
  allowCandidate:true
});
await loader.init();
loader.lookup("KL_SH01_001");   // {ok:true,asset}
loader.resolve("KL_SH01_001");  // URL after binary host configured
loader.mount(container,"KL_SH01_001",{
  onFallback:(reason,target)=>{ /* preserve existing SVG/emoji or display friendly message */ }
});
```

## Safety and error handling
- Manifest must contain exactly 288 entries with unique valid `KL_SHxx_yyy` or `KL_Mxx_yyy` IDs, valid SHA-256 and relative `WEBP/{SHEET}/KL-...webp` path matching each ID.
- Candidate manifest is rejected by default; only explicit `allowCandidate:true` permits test inspection.
- Validate HTTPS host, reject unsafe/missing host and paths. No guessed placeholder URLs.
- Network timeout/failure, HTTP 404, invalid manifest or missing ID results in structured status.
- On image load failure, remove failing IMG and notify `onFallback`. Existing UI SVG/emoji is unaffected.
- Stable source of truth is manifest; no runtime search by labels; ID lookup prevents a label re-map changing image selection silently.
- Construction does not auto-fetch. Runtime is behind integration opt-in; old `34_HinhAnhDungChung` remains unchanged.

## QA results
- **30/30** automated logic tests PASS on loader content read back from committed GitHub, executed in a JS V8 assertion harness. The same Node-native test suite is stored in `test_asset_loader.cjs`; Node CLI execution is still to be verified separately.
- QA includes: 288 asset manifest, candidate approval gate, ID/path/hash validation, duplicate blocking, HTTPS-only, traversal blocking, missing ID, missing host, lazy initialization, mocked concurrent fetch deduplication, HTTP/network error, mount successful and load-error callback.
- Source G7.3 binary 288/288 SHA QA and G7.2-C visual test approved in previous checkpoints. **This loader has not been tested against real remote URL for the 288 G7 binaries, because they are not published.**
- GAS template inclusion checked at source level. No actual Apps Script deployed browser execution.

## Exact next checkpoint (before G7.4-B)
1. Upload **all 288 original WebP binaries** to immutable GitHub release directory, without changing their bytes. Optionally use dedicated assets branch, but pin binary release SHA.
2. Verify 288 SHA-256 by downloading from GitHub; check public GET/MIME/CORS for representative SH and M files.
3. Set `assetBaseUrl` to a tested commit-pinned URL on G7 branch; leave feature flag off until trial.
4. Run browser / GAS test on `test-theo-main` **only after explicit approval**. Verify fallback and performance.
5. Record binary publish SHA, QA logs and rollback in GitHub and Google Drive before enabling G7.4-B.

## Recovery if chat becomes unresponsive
Open `asset-review/V5/G7_4_A/` on `g7-1-content-audit-20261112`, inspect this report and the test suite, check `42_TaiAnhTheoAssetID.html` + `GiaoDien.html`, compare with `test-theo-main`. Do not merge this experimental branch. To revert, remove new script include and file in a new branch commit, or revert the relevant commits; old G5 image loader remains independent. Restore from Git history if necessary. All PNG/WebP master files remain untouched.
