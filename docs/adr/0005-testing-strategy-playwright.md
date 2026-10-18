# Testing: Vitest, property-based rules, reference Members, Cypress components, Playwright journeys

The project is also the Admin's portfolio for SDET job interviews, so the test suite is a deliverable in its own right. We test at these levels:

- **Unit**: Vitest for Fit, Group Fit, Constraints and Relaxation.
- **Rules**: property-based tests (fast-check) that generate random Collections and Tables to prove the rules always hold (Hard Constraints never broken, a dislike at the Table excludes unless Relaxed, every Recommendation has an Explanation).
- **Quality**: reference Members, hand-written Tastes with expected outcomes, showing whether a change to Fit makes Recommendations better or worse.
- **Component**: Cypress component tests for single screens in isolation (Interview steps, Tag chips, Recommendation card), where Cypress is mature and the Admin is expert.
- **End to end**: Playwright for full journeys (sign-in → Interview → Buy results; Table → Shelf → Play), which the Admin chose deliberately to learn.

Exactly one journey (Interview → Buy results) is mirrored in both Cypress and Playwright, with a written comparison based on measurements from this project. We rejected duplicating every journey in both tools: it doubles maintenance without adding coverage, and reviewers read it as redundancy rather than judgement. Do not "consolidate" onto one tool or mirror more journeys without revisiting this record.
