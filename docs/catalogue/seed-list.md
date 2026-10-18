# Catalogue seed list for milestone 1: draft for Admin review

> **Status: DRAFT.** This lists Games by name only. Once you approve the list, Claude drafts each Catalogue entry (Player Range, Best Player Count, play time, minimum age, Complexity, Setup Effort, Table Space, Tags) as a data file. You then review those entries in a second pull request.

Milestone 1 needs about **50 Games**: enough to test Fit on you and on the reference Members. The rest of the ~150 come before friends start using the app (milestone 2).

## 1. Your Collection (Admin to fill)

List the Games you own, one per line. Names are enough.

```
(add your Games here)
```

The Games in your self-test (`docs/testing/admin-self-test.md`) will be added here too, without being marked as yours, so the held-back Games exist in the Catalogue. Please send your self-test answers in the chat *before* you look at drafted Catalogue entries.

## 2. Gateway Games (16)

Well-known Games for the newcomer grid in the Interview. A newcomer is likely to have played several of them, and they cover a range of Tastes. Monopoly and Uno are included on purpose: nearly everyone has a Verdict on them, and "I hated Monopoly" teaches the app a lot.

| Game | Why it's in the grid |
|---|---|
| Monopoly | Universal reference point; `player-elimination`, `luck-heavy` |
| Uno | Universal reference point; `chaotic`, `quick-turns` |
| Catan | The classic modern gateway; `negotiation`, `luck-heavy` |
| Ticket to Ride | `route-building`, `indirect`, easy rules |
| Carcassonne | `tile-laying`, gentle competition |
| Codenames | `word-guessing`, `team-based` party game |
| Dixit | `funny`, creative, social |
| Azul | `puzzly`, `abstract`, short |
| Splendor | `engine-building` in its simplest form |
| Pandemic | the best-known `cooperative` game |
| Sushi Go! | `drafting`, very light |
| King of Tokyo | `confrontational`, dice, `chaotic` |
| Dobble (Spot It!) | `real-time`, family classic |
| Exploding Kittens | `chaotic`, `funny`, `player-elimination` |
| Kingdomino | `tile-laying`, very quick |
| Wingspan | `relaxing`, `engine-building`, `nature`; often someone's first "bigger" game |

## 3. Games used by the reference Members

These must exist in the Catalogue so the reference Member tests can name them (see `docs/testing/reference-members.md`). Games already listed above are not repeated.

Cascadia, Calico, Brass: Birmingham, Terraforming Mars, Twilight Imperium, Spirit Island, The Crew, Root, Cosmic Encounter, Just One, Telestrations, Skull, The Resistance, Agricola, Quacks of Quedlinburg, Cartographers, 7 Wonders, Lost Cities, Patchwork, Jaipur, Hanabi, Mysterium, Dominion, Gloomhaven.

## 4. Top-up (only if sections 1–3 come to fewer than ~50)

Claude will propose widely loved Games across Complexity levels and player counts to bring the total to about 50, avoiding near-duplicates of what's already listed.
