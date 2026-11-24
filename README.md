# BrainRush AI

Train your brain. Challenge yourself. Grow every day.

A free, offline, privacy-first brain-training app for Android (React Native + Expo, TypeScript). Ten categories, daily challenge, XP, levels, streaks and achievements. No accounts, no ads, no analytics, no network access.

## Quick facts
| | |
|---|---|
| Package ID | `com.brainrush.ai` (permanent once published; change in `app.json` before the first upload if you want another) |
| Target SDK | Android 16 / API 36 (Google Play requirement from 2026-08-31), min SDK 24 |
| Data | Stored on device only (AsyncStorage). Network permission is blocked in the manifest. |
| Builds | GitHub Actions (`.github/workflows/android.yml`). No third-party services. |

## Repository map
| Path | What |
|---|---|
| `src/engine` | Pure, tested game rules: RNG, scoring, XP, levels, streaks, generators, session builder, profile and achievements |
| `src/app` | Screens (Expo Router) |
| `src/ui`, `src/theme` | Design system: tokens, components, dark/light themes |
| `content/packs`, `tools/build_content.py` | Original question packs and their authoring script |
| `content/legal.json` | Single source for in-app legal screens and public policy pages |
| `store/` | Everything for Google Play: listing text, graphics, screenshots, declarations, checklist |
| `docs/` | Documentation and GitHub Pages site (policy pages) |
| `tools/` | Icon, screenshot, policy and content generators |
| `plugins/` | Expo config plugin for release signing |

## Commands
```bash
npm ci                 # install
npm test               # unit tests (engine + content validation)
npm run typecheck      # TypeScript
npx expo start         # dev server (needs a development build or Expo Go)
npm run store:build    # regenerate policy pages after editing legal.json / src/config.ts
```

## Read next
- `docs/BUILD_AND_RELEASE.md`: how to get a signed AAB/APK from GitHub
- `store/SUBMISSION_CHECKLIST.md`: Google Play steps only you can do
- `docs/KNOWN_LIMITATIONS_AND_ROADMAP.md`: what is and is not done
