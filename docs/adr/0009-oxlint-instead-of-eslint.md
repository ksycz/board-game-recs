# Oxlint with type-aware rules instead of ESLint

We lint with Oxlint, including its type-aware rules (via `oxlint-tsgolint`, declared stable in July 2026), instead of ESLint with typescript-eslint, the usual default. Speed is not the reason, since the codebase is small: the Admin chose it to learn current tooling, and it was free to switch before any code existed. Type-aware rules that catch real bugs (`no-floating-promises`, `no-misused-promises`, `await-thenable`, `switch-exhaustiveness-check`) are on as errors, and warnings fail CI.

## Revisit in milestone 2

Next.js, React, Playwright and Cypress lint rules mostly exist as ESLint plugins. If Oxlint does not cover the rules we need, add ESLint only for those plugins, with `eslint-plugin-oxlint` switching off every rule Oxlint already runs, rather than moving back to ESLint entirely.
