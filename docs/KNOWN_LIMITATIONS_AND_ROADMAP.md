# Known limitations and roadmap

## Not done in v1.0.0 (be aware)
- **Not run on a real Android device or emulator.** Verified here: unit tests, TypeScript, Android JS bundle export, `expo prebuild`, and web renders of the UI. The Gradle build/APK/AAB is produced by GitHub Actions and is untested until the first workflow run succeeds.
- No automated UI/instrumentation tests, no performance profiling, no TalkBack walkthrough.
- No login, registration, forgot-password, cross-device sync or leaderboard (they need a server; deliberately excluded by the "no third party" rule). Account deletion = "Delete all my data" in Settings.
- No ads. Ad-support was part of the original brief but conflicts with "no third party" (AdMob is a Google service). The privacy policy, Data Safety and "no ads" declarations assume no ads. Adding ads means updating all three.
- No runtime AI and no over-the-air content updates: new questions require an app release. (A GitHub Pages JSON feed is possible but needs the INTERNET permission, which is currently blocked.)
- Content is small (71 authored questions + generated puzzles) and English only; strings are not yet extracted for localisation.
- Questions not independently fact-checked (see CONTENT_SOURCES.md).
- Anti-cheat is on-device only and can be bypassed by someone with a rooted phone; acceptable because there is no competition or leaderboard.
- Notifications: daily reminder is scheduled locally; exact delivery depends on Android battery settings.
- Legal texts are drafts, not lawyer-reviewed.
- Store screenshots are web renders of the real UI with demo progress data, not device captures.

## Roadmap
1. First GitHub Actions build + install test on 2-3 real devices; fix issues.
2. TalkBack audit, contrast audit, tablet layouts.
3. More content (target 500+ questions), community review process, fact-check references.
4. Optional ads (AdMob) behind consent, if the owner decides to allow a Google dependency.
5. Optional account + sync + leaderboard with a backend of the owner's choosing.
6. Localisation (Urdu, Spanish, Hindi, Arabic...).
