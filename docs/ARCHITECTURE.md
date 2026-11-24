# Architecture

```
GitHub repo (single source of truth)
 ├─ src/engine   pure TypeScript rules (no React, no I/O)  ──► unit tested
 ├─ src/app      Expo Router screens ──► src/ui + src/theme (design system)
 ├─ src/state    ProfileProvider: one Profile object ⇄ AsyncStorage (on device)
 ├─ content/     validated JSON question packs (bundled)
 └─ GitHub Actions ► expo prebuild ► Gradle ► APK / AAB
```

## Decisions and why
| Decision | Reason | Alternative rejected |
|---|---|---|
| React Native + Expo + TypeScript | Owner wanted a GitHub-only workflow; the dev sandbox cannot reach Android SDK hosts, so a Kotlin app could not be built or tested there. GitHub runners can build it. | Native Kotlin/Compose |
| No backend, no accounts | Owner asked for no third-party dependence; simplest Data Safety form; works offline. | Supabase / Firebase |
| On-device rules engine | All scoring/XP/streak logic is deterministic and unit tested. Anti-abuse is best-effort (min time per item, daily XP cap, once-per-day Daily XP). | Server-side validation (needs a server) |
| Generated puzzles | Math, number patterns, visual patterns, memory and attention items come from seeded generators, so the answer key is correct by construction and tested. | AI-written puzzles |
| AI only at authoring time | No keys in the app, no runtime cost or failure modes. Anything AI-assisted must pass `validateQuestion` and review before commit. | Runtime LLM calls |
| Network permission blocked | Makes the "no data leaves the device" promise enforceable. | — |

## Data model (on device, `src/engine/profile.ts`)
`Profile`: name, interests, dailyGoal, difficulty, theme, haptics, reminders, xp, streak{current,best,lastDay}, xpByDay, sessionsByDay, dailyDone, categoryStats, history (last 100), achievements, counters. Persisted as one JSON value under key `brainrush.profile.v1`; corrupt data resets safely. Migration strategy: bump `version`, add a migration step in `store.tsx` load.

## Rules (all in `src/engine/progress.ts` and `profile.ts`)
- Level n needs `round(100 * (n-1)^1.5)` XP.
- XP = correct × 10 × (1 + 0.25·(difficulty−1)), ×1.2 perfect, × mode multiplier (daily 1.5, timed 1.2, mixed 1.25, quick 1, practice 0.5), minus 3 per hint, floored at 0, capped at 500 XP/day.
- Sessions faster than 700 ms per item earn nothing and do not count toward streaks.
- Streak: +1 per consecutive local calendar day with ≥1 correct answer.
- Daily challenge: same seed for everyone per date; full XP once per day.

## Error handling and offline
No network use. Storage failures are swallowed so gameplay continues; corrupt storage resets to defaults. Back navigation: hardware back on Play asks for confirmation; Results returns Home.
