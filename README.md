# Board game recommendations

[![CI](https://github.com/ksycz/board-game-recs/actions/workflows/ci.yml/badge.svg)](https://github.com/ksycz/board-game-recs/actions/workflows/ci.yml)

A website for a group of friends that answers two questions:

- **What should I buy next?** (Buy mode): Recommendations from a curated Catalogue, based on what you love and dislike, each with a plain-language Explanation.
- **What should we play tonight?** (Play mode): picks from the Games actually on the table, suited to everyone at the Table, ruling out anything someone there dislikes.

It is also a **testing portfolio project**. The test suite, test documents and test-first git history are deliverables, not afterthoughts.

## Status

🟡 **Design done; building milestone 1** (recommendation logic, test-first, no screens yet).

| Milestone | What | Status |
|---|---|---|
| 1 | Fit on the Admin: Tag Vocabulary, first Games, Fit and Explanation as pure functions | in progress |
| 2 | Buy mode: Interview prototype, sign-in, Interview, Buy results | planned |
| 3 | Play mode: Play-mode prototype, Table, Shelf, Group Fit, Plays | planned |
| 4 | Portfolio polish: full test documents, Cypress vs Playwright comparison, published reports | planned |

## How it's built

- **Test-first, visibly.** Every rule and journey starts as a failing test that is reviewed and approved in a pull request *before* any implementation is written. Commits are labelled `red:`, `green:` and `refactor:`, and pull requests are never squash-merged, so the history shows the order. Pull requests are merged with merge commits only, so the test-first history stays checkable. See [ADR 0007](docs/adr/0007-tdd-with-admin-approved-failing-tests.md) and [ADR 0008](docs/adr/0008-merge-commits-only.md).
- **Tested at every level** ([ADR 0005](docs/adr/0005-testing-strategy-playwright.md)):

  | Level | Tool |
  |---|---|
  | Unit | Vitest |
  | Rules | fast-check property-based tests |
  | Recommendation quality | reference Members with expected outcomes |
  | Components | Cypress |
  | End-to-end journeys | Playwright |
  | Accessibility | axe |

  One journey is mirrored in both Cypress and Playwright, with a measured comparison.
- **Explainable recommendations.** The AI only turns people's own words into Tags. The ranking is plain, tested TypeScript ([ADR 0002](docs/adr/0002-ai-translates-reasons-never-recommends.md)).
- **Stack:** TypeScript, Next.js, Postgres on Supabase (EU region), Vercel ([ADR 0004](docs/adr/0004-typescript-nextjs-postgres-supabase.md)).

## Read more

- [`CONTEXT.md`](CONTEXT.md): the domain glossary. Every term in code, tests and docs comes from here.
- [`docs/spec.md`](docs/spec.md): the v1 specification.
- [`docs/adr/`](docs/adr/): architecture decision records.
- `docs/testing/`: test strategy, plans, traceability and reports (growing with each milestone).

## Running locally

```bash
pnpm install
pnpm check   # type-check, lint, tests
```

Requires Node 22+ and pnpm (the exact version is pinned in `package.json`; `corepack enable` picks it up automatically). pnpm is used for its strict dependency layout: code can only import packages it declares, so a missing dependency fails locally instead of in CI or production.

## Licence

[MIT](LICENSE).
