# Google Play submission checklist

Items marked **YOU** can only be done by the account owner. Claude cannot guarantee approval; Google decides.

## Before you start
- [ ] **YOU** Google Play Console developer account. Google charges a one-time registration fee (about US$25 at the time of writing; verify) and may require identity verification and, for new personal accounts, closed testing before production access. Check the current rules in Play Console.
- [ ] **YOU** Decide the permanent package ID (default `com.brainrush.ai`, in `app.json`). It can never change after the first upload.
- [ ] **YOU** Fill `developerName` and `supportEmail` in `src/config.ts`, run `npm run store:build`, commit.
- [ ] **YOU** Enable GitHub Pages (docs/BUILD_AND_RELEASE.md step 0) and confirm the privacy policy URL opens.
- [ ] **YOU** Create the upload key and 4 secrets (docs/BUILD_AND_RELEASE.md step 2) and run the release workflow.

## In Play Console
- [ ] Create app: name "BrainRush AI: Brain Training", default language English (US), App (or Game, see store/listing/METADATA.md), Free.
- [ ] Main store listing: paste text from `store/listing/en-US/`, upload `store/graphics/*` and `store/screenshots/*` (see METADATA.md).
- [ ] App content: privacy policy URL; ads = No; app access = no login needed; content rating questionnaire (`store/CONTENT_RATING.md`); target audience 13+ (`store/TARGET_AUDIENCE_AND_ADS.md`); Data safety (`store/DATA_SAFETY.md`); other declarations = not applicable.
- [ ] Select countries/regions.
- [ ] Testing: upload `BrainRush-AI-release.aab` to **Internal testing**, add testers, install from the Play link, play through every category once. If your account needs closed testing, follow the tester/day requirements shown in Play Console.
- [ ] Production: create release, upload the AAB, paste release notes, submit for review.

## After submission
- [ ] Watch Play Console messages for policy questions. Typical review takes days.
- [ ] Check the pre-launch report in Play Console for crashes on real devices and fix anything critical.

## Legal and policy items only you can approve
- Data safety declaration, content rating answers, target audience, and ads declaration are your legal statements.
- The privacy policy and terms in this repo are plain-language drafts and have **not** been reviewed by a lawyer.
