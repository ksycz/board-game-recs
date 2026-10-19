# Admin self-test (exit criterion for milestone 1)

Milestone 1 is done when the reference Members suite is green **and** the app passes this self-test on the Admin's real Taste.

## The idea

You know which Games you love. If you tell the app only *some* of them, a good Fit should find the others.

## Procedure

1. **Before seeing any drafted Catalogue entries**, write down:
   - **About 8 Games you love**, each with a Reason in your own words.
   - **About 3 Games you dislike**, each with a Reason.
2. **Hold back 3 of the loved Games.** Choose them before running anything, and don't change your choice afterwards.
3. Give the app the remaining ~5 loved Games and the dislikes as Verdicts.
4. Run Buy mode with your Collection, *excluding* the held-back Games.
5. **Pass** if at least 2 of the 3 held-back Games appear in the top 10, and none of your disliked Games' closest relatives appears in the top 5.

## Where your answers go

Your real Taste is personal data, and this repository is public, so **your answers are never committed here.** Send them to Claude in the chat. Claude keeps them in the private claude.ai Project for this app, and on disk only in the git-ignored `private/` folder. The self-test runs locally, not in CI.

Only the outcome is recorded publicly, in the milestone 1 test report: "2 of 3 held-back Games found, ranks 3 and 7", without naming your Games, unless you choose to.

## Template

```
LOVED (about 8). Mark 3 to hold back with [H]
- <Game>: <Reason>
- ...

DISLIKED (about 3)
- <Game>: <Reason>
- ...

USUAL GROUP SIZE: solo / 2 / 3–4 / 5+
```
