# Data safety form answers (Play Console > Policy and programs > App content > Data safety)

Answers are accurate for version 1.0.0 as built. **You must review and submit the declaration yourself; it is your legal statement.** Re-check it any time you add a feature that touches data (ads, analytics, cloud sync, crash reporting).

| Question | Answer | Why |
|---|---|---|
| Does your app collect or share any of the required user data types? | **No** | Progress, settings and name stay in on-device storage. Nothing is transmitted. |
| Is all of the user data collected by your app encrypted in transit? | Not applicable (no data collected) | The app makes no network requests for user data. |
| Do you provide a way for users to request that their data is deleted? | Not applicable; the app offers in-app erase anyway (Profile > Settings > Delete all my data) | Nothing leaves the device. |
| Third-party SDKs that collect data | None | No ad, analytics or crash SDKs are included. |
| Optional permission: POST_NOTIFICATIONS | Used for the optional local daily reminder only | Notification is scheduled on-device. |

Permissions: `app.json` blocks INTERNET, SYSTEM_ALERT_WINDOW and external-storage permissions, so the app **cannot** use the network. Expected final permissions: VIBRATE (haptics), POST_NOTIFICATIONS and RECEIVE_BOOT_COMPLETED (daily reminder, from expo-notifications). The CI build prints the real list ("Print final permissions" step); compare it with this file before each release.
