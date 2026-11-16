# BE-HOC D2 V1.2 – append-only execution log
00 | Baseline a69cb2153590645b1f9ee7119011cfbd7a324eae. Identified pinned core SHA 16ae440618bcb3cf90706cdad2ccd11cbadc222a, view SHA 214b615d0c595dfd76695c75e5443cefc36a921d.
01 | Reopened original V1.2 core/view, live lesson renderer 19 and legacy grader 26; old grading requires assessed carry, while D2 permits OPTIONAL_HINT. To prevent conflicting marks, D2 is a separate ungraded practice panel in B20.
02 | Created GAS HTML partials 47/48 byte-identical; wrote public-only host adapter 49 and scoped CSS 50; connected real B20 Sheet question instances after render and existing numeric keypad hook.
03 | Validated PV100 with actual lesson operands, PV1000 only in test fixture; 999+1 and 500+500 blocked. No result 1000 or arbitrary SGK attach.
04 | CI early checks caught test fixture expectation defects: comment false-positive for answer privacy; invalid 99+1 two-digit operand; wrong checkpoint field path; Chromium selector ambiguous after adding PV1000 fixture. Fixed tests and comment, kept original core/view untouched.
05 | CI contract 43810064542 PASS 41 assertions; Chromium 43810064390 PASS 35 assertions; base 19 grader 26, MayChu, stars untouched. No GAS deploy.
06 | Final checkpoint next; safe rollback to a69cb2153590645b1f9ee7119011cfbd7a324eae.
