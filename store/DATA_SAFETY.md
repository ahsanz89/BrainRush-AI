# Data safety form answers (Play Console > Policy and programs > App content > Data safety)

Answers are accurate for version 1.0.0 as built. **You must review and submit the declaration yourself; it is your legal statement.** Re-check it any time you add a feature that touches data (ads, analytics, cloud sync, crash reporting).

| Question | Answer | Why |
|---|---|---|
| Does your app collect or share any of the required user data types? | **No** | Progress, settings and name stay in on-device storage. Nothing is transmitted. |
| Is all of the user data collected by your app encrypted in transit? | Not applicable (no data collected) | The app makes no network requests for user data. |
| Do you provide a way for users to request that their data is deleted? | Not applicable; the app offers in-app erase anyway (Profile > Settings > Delete all my data) | Nothing leaves the device. |
| Third-party SDKs that collect data | None | No ad, analytics or crash SDKs are included. |
| Optional permission: POST_NOTIFICATIONS | Used for the optional local daily reminder only | Notification is scheduled on-device. |

Permissions (verified from the first real CI build on 2026-11-24 with `aapt2 dump permissions`):
- First build contained, besides the ones we use: ACCESS_NETWORK_STATE, WAKE_LOCK, a push-message receiver permission (c2dm), a Play install-referrer permission and about 15 launcher "badge" permissions, all merged in by the notification/application libraries. INTERNET was correctly absent.
- `app.json` now blocks INTERNET, overlay, external storage, c2dm, install-referrer and all badge permissions. **Verified final list (CI run for commit f13299b):** VIBRATE, RECEIVE_BOOT_COMPLETED, POST_NOTIFICATIONS, ACCESS_NETWORK_STATE, WAKE_LOCK (plus an internal AndroidX receiver permission). Compare the CI-printed list with this file before every release.
- The Expo notifications library bundles Google Firebase Messaging classes for remote push. This app uses local notifications only, has no Firebase configuration and, without the INTERNET permission, cannot transmit data. If Play Console's checks still flag a Firebase/Google SDK, review the "SDKs" notes there and tell Claude.
