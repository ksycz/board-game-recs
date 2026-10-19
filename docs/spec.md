# Board game recommendations: v1 specification

Terms in **bold capitals** (Member, Fit, Shelf…) are defined in [`CONTEXT.md`](../CONTEXT.md). Decisions with a recorded rationale link to [`docs/adr/`](adr/).

## 1. Purpose

A website for a group of friends that recommends board games in two ways:

- **Buy mode**: which Game to buy next, based on a Member's Taste.
- **Play mode**: which Game to play now, from the Games physically present, suited to everyone at the Table.

The project has two goals of equal weight:

1. **A useful app** that the Admin and her friends actually use at game nights.
2. **An SDET portfolio project**, where the test suite, test documents and test-first git history are deliverables in their own right.

## 2. Scope

### In v1

- Invite-only sign-in by emailed link.
- Admin-curated Catalogue of ~150 Games.
- Adaptive Interview.
- Buy mode and Play mode.
- Verdicts, Not Interested and Plays.
- Admin tools for Invites, Unreviewed Games, Unmatched Phrases and the AI Budget.

### Platform

- A website that works well on phones and desktops ([ADR 0004](adr/0004-typescript-nextjs-postgres-supabase.md)).
- English only. All interface text lives in one place so it can be translated later.
- Free: no ads, no shop links, no payments.

### Deliberately later

- BoardGameGeek: import, catalogue breadth ([ADR 0001](adr/0001-own-catalogue-bgg-optional.md)).
- Polish and Czech.
- Quick guest Tastes for Players who aren't Members.
- Gift mode.
- Expansions.
- Recommendations learned from all Members' ratings ("people who liked X also liked Y").
- Opening to the public: sign-up, everything private by default, privacy policy.

## 3. People and access

- **Members** sign in with an emailed link. There are no passwords.
- While the app is personal, only **Invited** emails can sign in. Only the **Admin** creates Invites.
- **What Members can see of each other:**
  - Collections and Plays: visible to all Members.
  - Verdicts: the love / fine / dislike part is visible to all Members.
  - Reasons: private to the Member who wrote them.

### Members' data (EU rules)

- **Where it's stored:** all data lives in a Neon Postgres database in an EU region.
- **What is collected:** only what the app needs (email, Collection, Verdicts, Reasons, Plays). No tracking or analytics cookies.
- **Deleting:** a Member can delete their account, which removes their Collection, Verdicts, Reasons and Invite. Plays they took part in keep the Game and date but drop their name.
- **Exporting:** a Member can download their own data as a file.

## 4. Catalogue

### Fields for each Game

| Field | Values |
|---|---|
| Name, year | |
| Player Range | e.g. 1–4. Solo means the range includes 1. |
| Best Player Count | subset of the Player Range |
| Play time | minutes, min–max |
| Minimum age | |
| Complexity | 1–5, our own scale |
| Setup Effort | quick / medium / long |
| Table Space | small / medium / large |
| Tags | from the Tag Vocabulary |
| BGG ID | optional, for later matching |

### No box images in v1

Box art and publisher photos are copyrighted, so v1 shows no images of Games. Images can come later from a licensed source, with publishers' permission, or from photos Members take of their own copies.

### What counts as a Game

- **Any genre** counts as a Game: card, party, children's, abstract, wargame, roll-and-write.
- **Expansions** are not Games.
- **Editions** share one Game unless their rules or player count differ substantially.

### Seeding

- **About 150 Games:**
  - the Collections of the Admin and her friends,
  - ~15 Gateway Games,
  - ~100 widely loved Games spread across Complexity and player counts.
- **Drafted during development, not by the running app.** Claude drafts each entry; the Admin reviews them in batches.
- **No data is copied from BGG.** Facts come from boxes and publishers' pages.

### Adding a missing Game

- A Member enters the name, and the AI drafts the rest.
- The result is an **Unreviewed Game**. It works straight away in that Member's Collection and on any Shelf they are at.
- It is recommended in Buy mode to other Members only after the Admin approves it.

### Tag Vocabulary

- **Starts with 61 Tags** (see `docs/catalogue/tag-vocabulary.md`) in five groups: Feel, Interaction, Mechanics, Theme, Pace.
- **Only the Admin adds Tags.**
- **Unmatched Phrases** from Reasons are queued and grouped with a count ("3 Members mentioned betrayal").
- **When the Admin adds a Tag**, the Catalogue and all stored Reasons are re-tagged for it.

## 5. Interview

1. **Loved Games:**
   - The Member names 1 to 5, and 3 is suggested.
   - Each comes with an optional Reason: free text, plus Tag chips the AI suggests and the Member can edit.
   - Picking Tags by hand is always possible.
2. **Disliked Games:** optional, up to 3, each with an optional Reason.
3. **If fewer than 2 loved Games are named,** the Member sees a grid of ~15 Gateway Games, each marked played → love / fine / dislike, and 3–4 plain-language mood questions:
   - "Do you prefer games full of talking and laughing, or games where everyone quietly focuses on their own plan?"
   - luck vs planning
   - competitive vs cooperative
   - short vs long

   These newcomers get a soft Complexity cap (≤ 2.5), on by default and easy to remove.
4. **Usual Group Size:** solo / 2 / 3–4 / 5+. It becomes the default player-count Constraint.

Every Interview answer is a **Verdict**. There is no separate "profile" data.

## 6. Learning after the Interview

- **One Verdict per Member per Game:** love / fine / dislike, with an optional Reason. A new Verdict replaces the old one, and there's no fading over time.
- **When Verdicts are asked for:**
  - on any Game page,
  - after a logged Play (each Member at the Table is asked),
  - after "bought it" in Buy mode, which also moves the Game into the Collection.
- **Not Interested** hides a Recommendation for that Member. It changes their Taste only if they give a Reason.
- **"Review my Verdicts"** page: a list of all the Member's Verdicts, to update in bulk.

## 7. Recommending

The code computes Recommendations from Tags. The AI never chooses Games ([ADR 0002](adr/0002-ai-translates-reasons-never-recommends.md)).

### Constraints

| Constraint | Kind | Rule |
|---|---|---|
| Number of Players within Player Range | **Hard** | never relaxed |
| Game's minimum age ≤ youngest Player's age | **Hard** | never relaxed |
| Play time | Soft | |
| Best Player Count | Soft | outside it → warning |
| Complexity | Soft | |
| Setup Effort | Soft | |
| Dislikes at the Table (Play mode) | Soft | |

- **Order of steps:** Hard Constraints remove Games first. Soft Constraints remove Games next. Scoring comes last.
- **If nothing passes,** Soft Constraints are relaxed one at a time, and each **Relaxation** is shown on the Recommendation ("runs ~10 min over", "Petra isn't a fan").

### Fit (one Member)

- **Tag agreement:** Tags shared with the Member's loved Reasons and loved Games.
- **minus Tag disagreement:** Tags shared with disliked ones.
- **plus Similarity:** how alike the Game is to each loved Game, by Tags, Complexity and Best Player Count.

Every Recommendation carries an **Explanation** built from the factors that produced its Fit. Weights are tuned against the reference Members (§10).

### Buy mode

- **Candidates:** Catalogue Games that are:
  - not in the Member's Collection,
  - not marked Not Interested,
  - not already given a Verdict, **except** loved Games the Member doesn't own. Those stay eligible, labelled "you loved this, you don't own it yet".
- **Excluded:** other Members' Unreviewed Games.
- **Shown:** the top 5, each with its Explanation, and "show more" below.
- **Variety:** at most 2 of the top 5 may be very Similar to each other.

### Play mode

- **Table:**
  - the asking Member,
  - any other Members they select,
  - a count of Players who aren't Members (these count only for player count).
- **Shelf:**
  - By default, the Collections of all Members at the Table.
  - The asking Member can narrow it to the Collections present, or pick individual Games someone brought.
- **Group Fit** ([ADR 0003](adr/0003-group-fit-veto-then-average.md)):
  1. A Game disliked by any Member at the Table is excluded, unless it comes back through a Relaxation.
  2. The remaining Games are ranked by the average Fit of the Members at the Table.
- **Recency:**
  - A Play in the last 2–3 weeks pushes a Game down, labelled "played 6 days ago".
  - A loved Game with no Play for months is pushed up.
  - Both are gentle nudges and never remove a Game.
- **Shown:** the top 3. Each has its Explanation and any Relaxations, plus:
  - play time,
  - Setup Effort,
  - whose copy it is,
  - who at the Table loves it.

  "Show all" is below.
- **"We're playing this"** logs a Play, then asks each Member at the Table for a Verdict.

## 8. AI usage and budget

- **One swappable module** makes all AI calls, using the Claude API ([ADR 0006](adr/0006-ai-behind-tagger-hard-budget.md)).
- **Three jobs:**
  - turning Reasons into Tags plus Unmatched Phrases,
  - drafting entries for Games that Members add,
  - re-tagging when the Admin adds a Tag.
- **What is sent:** only Reason text, with no names, emails or Collections.
- **AI Budget:**
  - The Admin sets the budget in the app.
  - The Admin is emailed at 50%, 80% and 100% of it.
  - At 100% the app stops using AI until the Admin raises the budget.
  - Auto-reload stays off on the provider account.
- **When AI is unavailable,** Members pick Tags by hand and Unmatched Phrases wait in the queue.

## 9. Technology

- **Code:** TypeScript and Next.js.
- **Data:** Postgres on Neon, in an EU region ([ADR 0010](adr/0010-neon-instead-of-supabase.md)).
- **Sign-in:** Better Auth (Neon's managed version or our own), with an email-sending service for the sign-in links. Chosen at the start of milestone 2.
- **Hosting:** Vercel.
- **Structure:** Fit, Group Fit, Constraints, Relaxation and Explanation are plain TypeScript functions, with no dependency on the framework or the database.

## 10. Quality and testing

### Way of working ([ADR 0007](adr/0007-tdd-with-admin-approved-failing-tests.md))

- **Test-first:** the domain core and every user journey are built test-first.
- **Approval:** Claude writes a failing test, the Admin approves it as the specification, and then the implementation is written.
- **Commits:** separate `red:` / `green:` / `refactor:` commits.
- **No squash-merging**, so the history shows the tests came first.

### Test levels ([ADR 0005](adr/0005-testing-strategy-playwright.md))

| Level | Tool | Covers |
|---|---|---|
| Unit | Vitest | Fit, Group Fit, Constraints, Relaxation, Explanation |
| Rules | fast-check (property-based) | Hard Constraints never broken; a dislike at the Table excludes unless Relaxed; every Recommendation has an Explanation; Buy mode never recommends an owned Game |
| Quality | Vitest + reference Members | expected outcomes for hand-written Tastes (e.g. "loves Cascadia and Azul → Calico in the top 5, Twilight Imperium absent") |
| Component | Cypress | Interview steps, Tag chips, Recommendation card |
| End to end | Playwright | sign-in → Interview → Buy results; Table → Shelf → Play → logging a Play → Verdict prompt |
| Accessibility | axe-core in Playwright | every journey page has no serious or critical axe violations; keyboard-only use of the Interview and Play mode |
| Comparison | Cypress **and** Playwright | the Interview → Buy results journey only, mirrored in both and measured |
| AI tagger | Vitest with recorded responses | output is always valid Tags; the fallback works when the AI is down or the budget is hit |

### Test documents (in `docs/testing/`)

1. **Test strategy:** levels, risks ranked (wrong Recommendations > broken rules > broken screens), and what is deliberately not tested.
2. **Test plan per milestone:** scope, entry and exit criteria, test cases.
3. **Traceability table:** each rule in `CONTEXT.md` and the ADRs → the tests that prove it.
4. **Cypress vs Playwright comparison:** the mirrored journey, with measured speed, flakiness, code size and debugging experience.
5. **Quality report:** results for the reference Members over time.

### CI

- **GitHub Actions** runs every test level on each push.
- **Playwright and Cypress reports** are published to GitHub Pages.
- **Status badges** appear in the README.

### Prototypes

Prototypes live in `prototypes/`. Each is one page with fake data and no sign-in or database, and is clearly labelled as throwaway. They are exempt from test-first development. Each has a note recording what was learned and what changed in the spec as a result.

### Test data

The repository is public, so all test data is invented. Reference Members have made-up names and Tastes. No real Member's Collection, Verdicts, Reasons or email ever goes into the repo.

## 11. Success criteria

- **Buy mode:** for most Members, at least 1 of the top 5 is a Game they would genuinely consider buying.
- **Play mode:** over a month of game nights, the group picks one of the top 3 most of the time.
- **Measured by:** a one-tap "was this useful?" on each Recommendation.
- **Self-test before friends use it:** the Admin names her favourites, minus some she knows she loves. The app must find the ones she left out.

## 12. Milestones

1. **Fit on the Admin.**
   - Tag Vocabulary, the first ~50 Catalogue Games, Fit and Explanation as pure functions.
   - Built test-first, with no screens.
   - Exit: the reference Members suite is green and the Admin's self-test passes.
2. **Buy mode.**
   - Starts with an **Interview prototype**: a clickable mockup with fake data, tried on 1–2 friends, plus a short "what we learned" note.
   - Sign-in, Invites, Interview, Collection, Buy results, Verdicts, Not Interested, AI tagger with budget.
   - Exit: the Playwright and Cypress journeys are green; two friends use it.
3. **Play mode.**
   - Starts with a **Play-mode prototype** (pick the Table, narrow the Shelf, read the top 3 on a phone), used at one real game night, plus a "what we learned" note.
   - Table, Shelf, Group Fit, Relaxation, Plays, recency.
   - Exit: used at a real game night.
4. **Portfolio polish.**
   - The full test documents, the comparison write-up, published CI reports, the README.
