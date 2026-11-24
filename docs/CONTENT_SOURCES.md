# Content source and licence register

| Source | Provider | URL | Licence | Commercial use | Attribution | Redistribution | Update freq | API needed | Status |
|---|---|---|---|---|---|---|---|---|---|
| Original question packs (`content/packs/*.json`, authored by `tools/build_content.py`) | BrainRush AI project | this repo | Owned by project | Yes | none | n/a | on release | No | **In use** (71 questions: knowledge 25, word 16, logic 10, critical 10, problem 10) |
| Generated puzzles (math, number/visual patterns, memory, attention) | Code in `src/engine` | this repo | Owned by project | Yes | none | n/a | n/a | No | **In use** (unlimited, deterministic) |
| Open Trivia DB | Pixeltail Games | https://opentdb.com | CC BY-SA 4.0 | Yes, with attribution and ShareAlike | Required | Adapted question set must also be CC BY-SA | continuous | Optional | **Not used.** ShareAlike could force the question set to be shared under the same licence; needs the owner's decision first. |

Every question has `source`, a unique `id`, `difficulty` 1-5 and an `explanation`. `__tests__/content.test.ts` enforces: valid answer index, no duplicate options, no "all/none of the above", no near-duplicate prompts (Jaccard ≥ 0.85), explanation and source present.
Fact-check status: the 25 general-knowledge facts and all word meanings were written from well-established common knowledge and cross-read by the author; **they have not been independently fact-checked against cited references.** Do a human review before relying on them. No references are cited in the app.
