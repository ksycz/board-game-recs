# Merge commits only, so the test-first history stays checkable

Pull requests are merged with a merge commit; squash merging and rebase merging are switched off in the repository settings.

This project claims that every rule and journey was specified as a failing test, approved in review, and only then implemented ([ADR 0007](0007-tdd-with-admin-approved-failing-tests.md)). That claim is only worth something if anyone can check it. A merge commit keeps each pull request's `red:`, `green:` and `refactor:` commits on `main` unchanged, with the same IDs that CI ran on and that were approved in review, grouped under one "Merge pull request #N" commit that links back to the review.

## Considered options

- **Squash merge**: popular because `main` gets one tidy commit per feature, but it erases the red → green → refactor steps, which are the evidence.
- **Rebase and merge**: keeps every commit and gives a straight-line history, but rewrites the commits with new IDs, so they are no longer the exact commits CI ran on and the reviewer approved.
- **Merge commit (chosen)**: history is less linear, but nothing is rewritten. To see one feature in isolation, use `git log --first-parent main` for the feature list, or open its merge commit.

## In one sentence (e.g. for an interview)

"I chose merge commits so the test-first history stays checkable: anyone can open a pull request and see the failing tests I approved before any implementation existed."
