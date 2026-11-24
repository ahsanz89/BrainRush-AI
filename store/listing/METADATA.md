# Store listing metadata (copy into Play Console > Grow > Store presence > Main store listing)

| Field | Value |
|---|---|
| App name | BrainRush AI: Brain Training (30 chars max; see `listing/en-US/title.txt`) |
| Short description | `listing/en-US/short-description.txt` (80 chars max) |
| Full description | `listing/en-US/full-description.txt` (4000 chars max) |
| App icon | `graphics/play-icon-512.png` (512x512 PNG) |
| Feature graphic | `graphics/feature-graphic-1024x500.png` (1024x500) |
| Phone screenshots | **Recommended:** `screenshots-marketing/01..08*.png` (1080x1920, 3D-style promo art with headlines; upload in numeric order). Plain captures of the real UI are in `screenshots/*.png` (1080x2160). Play needs at least 2, up to 8. |
| App type | App or Game: **recommended Game > Puzzle** (brain games). Alternative: App > Education |
| Tags (pick up to 5) | Puzzle, Brain Games, Trivia, Educational, Offline |
| Contact email | the support email you set in `src/config.ts` |
| Privacy policy URL | `https://ahsanz89.github.io/BrainRush-AI/privacy-policy.html` (after enabling GitHub Pages, see docs/BUILD_AND_RELEASE.md) |
| Default language | English (United States) |
| Free / Paid | Free |

Note: all images are built from real renders of the app UI with demo progress data (`tools/make_screenshots.py`, then `tools/make_store_art.py`). Play's policy expects screenshots to represent the real app; the promo art only frames and highlights real screens.
Search-keyword ideas for the description (Play has no keyword field): brain training, brain games, puzzles, memory game, mental math, trivia, logic, daily challenge.
