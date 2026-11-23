# N4-C.3-B – Controlled Real-Device LAB Handoff

**TEST ONLY, no students, no GAS/Sheets, no merge.**

## Identity
Package built by GitHub Actions from exact commit displayed in `SOURCE_SHA.txt`. Validate it against GitHub run before use. This package contains synthetic MATH_LAB_A and MATH_LAB_B only. The bundle is a **self-contained static HTML**; it cannot submit trusted server grades, does not connect to GAS or save pupil progress. The test must not be interpreted as a production release.

## Two safe ways to open it

**Preferred:** on a trusted laptop connected to a *private Wi-Fi/hotspot*, unzip artifact into an otherwise empty directory, and run a temporary static HTTP server there:

- Windows: `py -m http.server 8765 --bind 0.0.0.0`
- macOS/Linux: `python3 -m http.server 8765 --bind 0.0.0.0`

On the laptop find its Wi-Fi/LAN IPv4 address (`ipconfig` on Windows, Wi-Fi settings on macOS). On a phone using the *same private network*, open **http://<LAPTOP_PRIVATE_IPV4>:8765/index.html** in Android Chrome or iOS Safari. Do not use localhost/127.0.0.1 as a phone address; that points at the phone, not the laptop. The port is open to other machines on this Wi-Fi until server exit; do NOT port-forward, do not expose to public Internet, do not run on a public Wi-Fi. Stop server using Ctrl+C. The test HTML only loads synthetic fixtures and user actions never submit grades.

**Alternative:** copy the self-contained `index.html` to a phone and open from local Files using a browser that supports local JavaScript. iOS Files preview may block scripts. A failed local preview is **NOT** a failed renderer; use the private LAN method if this occurs.

There is **no verified hosted public LAB URL**. Do not invent one, do not use production GAS, GitHub RAW/Docs preview, or a third-party HTML preview site. Contact project administrator if LAN/server access cannot be arranged.

## Acceptance checkpoints (physical phones only)
1. **D1:** choose each split and units slot; use 0, 3, delete/backspace; count scrolling needed to see selected slot while using keypad. Is selected-slot text comprehensible to a grade-two child?
2. **D10:** select solution sentence. Enter `12`, `+`, `6`, `18`, answer `18`; also test `-` and `−` and a 3-digit number. Observe whether keyboard covers input, iOS zooms, or operator is hard to type. Change route then return: verify draft state.
3. **Student-facing technical labels:** D1 strings like `t1_split1` or `TEST:...`; state whether they are visible and confusing. Do NOT silently change frozen be-hoc sources.
4. **D2/D5/D8B/D9:** sample carry/borrow, Tangram drag/rotation, heavier pan going down, and 1 pictograph symbol=1 unit. Also quick-check D3/D4/D6/D7/D8/D8A.
5. Record model, OS, browser/version, 390px-equivalent vs larger screen, portrait/landscape, date/time GMT+7, tester account, URL used, commit SHA. Attach screenshots/video (with no pupil data) and outcome per route: PASS/FAIL/NOT_TESTED.

## Fail-safe and rollback
The standalone bundle is disposable. Stop server (Ctrl+C) and delete unpacked folder to roll back. No production feature flag or datastore is touched. Never copy the device bundle into `main`, `be-hoc`, or Google Apps Script. Any detected problem requires separate LAB branch and CI plus Owner/Independent QA approval.
