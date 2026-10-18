# Neon instead of Supabase; TypeScript 7

Amends [ADR 0004](0004-typescript-nextjs-postgres-supabase.md).

**Database: Neon, not Supabase.** Supabase's free plan pauses a project after 7 days without activity, and it must then be restored by hand. A friends' game app can easily go a week unused, so the next game night would start with a broken app. Neon's free plan scales the database to zero after 5 minutes idle and wakes it automatically on the next request (a short delay, no manual step), and includes 1 GB per project. The database stays in an EU region for the same personal-data reasons as before.

**What we give up:** Supabase bundled database, sign-in and sign-in emails in one service. With Neon, sign-in comes from Neon's managed Better Auth (on its free plan) or from Better Auth in our own code, plus an email-sending service for the sign-in links. That choice is made at the start of milestone 2.

**TypeScript 7.** We use TypeScript 7 (the native Go compiler), which the type-aware linter is built on as well. 7.0 has no programmatic API yet (expected in 7.1). If a tool that needs it, such as Next.js's built-in type check, does not work in milestone 2, we turn that check off and rely on `tsc --noEmit`, which CI already runs, or use the official `@typescript/typescript6` compatibility package for that tool only.
