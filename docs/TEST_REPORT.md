# Test report (v1.0.0, run on 2026-11-24 in the build sandbox)

Only checks that were actually executed are marked PASS. Anything else is listed as NOT RUN.

| # | Test | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | `npm test`: engine (levels, XP, caps, anti-fast, streaks incl. month boundary, math/pattern/visual/memory/attention generators, session builder, profile, achievements) | all pass | 40/40 pass across 4 suites | PASS |
| 2 | Content validation of 71 questions | no validator errors | initially failed on 2 near-duplicate prompts ("Which spelling is correct?"); prompts reworded; now 0 errors | PASS (defect fixed) |
| 3 | `npm run typecheck` (strict TS) | 0 errors | 0 errors | PASS |
| 4 | `expo export --platform android` | Hermes bundle builds | 3.3 MB bundle produced | PASS |
| 5 | `expo prebuild --platform android` | project generated, targetSdk 36, release signing patched | yes; manifest permissions reduced to VIBRATE/POST_NOTIFICATIONS/RECEIVE_BOOT_COMPLETED | PASS |
| 6 | Web render + scripted play-through in headless Chrome (onboarding, home, train, category, play 5 maths questions by solving them, feedback, results, progress, achievements, memory game, light theme) | flow completes | completes; found and fixed tab-bar label clipping | PASS (defect fixed) |
| 7 | Anti-abuse in a real flow: instant taps | XP 0 + notice | "too fast to count" shown, 0 XP | PASS |
| 7b | `eslint` (expo config) on src, tests, plugins | 0 errors | initially 17 errors (React-hooks purity/ref/effect rules, unused imports, one syntax slip); play screen, store and button refactored; now 0 errors | PASS (defects fixed) |
| 8 | GitHub Actions: `test` job (typecheck + 40 tests) on GitHub runner | pass | pass (run 45374028296) | PASS |
| 8b | GitHub Actions: `test-apk` job, Gradle `assembleRelease` with compileSdk 37 / targetSdk 36 | APK built | first run FAILED (Expo SDK 58 libraries need compileSdk 37; fixed); second run BUILD SUCCESSFUL in 19m39s, 38 MB APK artifact | PASS (defect fixed) |
| 8c | Final APK permissions (`aapt2 dump permissions`) | only needed permissions, no INTERNET | no INTERNET; but 18 unwanted library permissions found (badges, c2dm, install referrer); blocked in app.json; re-verified on CI run 2026-11-24 (commit f13299b): VIBRATE, RECEIVE_BOOT_COMPLETED, POST_NOTIFICATIONS, ACCESS_NETWORK_STATE, WAKE_LOCK + internal DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION; INTERNET absent | PASS |
| 8d | Signed release APK + AAB (`release` job) | signed with upload key | not run: needs your 4 signing secrets | NOT RUN |
| 9 | Install and play on a real device/emulator | works | not run | NOT RUN |
| 10 | UI/instrumentation, network-failure, ad tests | n/a | no ads/network in app; no UI test suite | NOT RUN |
| 11 | Accessibility audit with TalkBack / contrast tool | n/a | labels added; not audited | NOT RUN |
| 12 | Performance profiling | n/a | not run | NOT RUN |
