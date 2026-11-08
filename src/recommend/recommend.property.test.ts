import * as fc from "fast-check";
import { describe, expect, test } from "vitest";
import type { Game } from "../catalogue/catalogue";
import { recommend, type BuyRequest, type Verdict } from "./recommend";
import { aGame } from "./test-helpers";

// Rule tests (ADR 0005): for thousands of random Catalogues, Members and occasions,
// the rules below must hold every time, whatever the Fit weights turn out to be.

const TAGS = ["puzzly", "relaxing", "party", "confrontational", "cooperative", "luck-heavy", "strategic"];

const gameArb: fc.Arbitrary<Game> = fc
  .record({
    min: fc.integer({ min: 1, max: 4 }),
    span: fc.integer({ min: 0, max: 5 }),
    time: fc.integer({ min: 10, max: 180 }),
    minAge: fc.integer({ min: 3, max: 16 }),
    complexity: fc.double({ min: 1, max: 5, noNaN: true }),
    tags: fc.uniqueArray(fc.constantFrom(...TAGS), { minLength: 1, maxLength: 4 }),
  })
  .map(({ min, span, time, minAge, complexity, tags }) => ({ min, max: min + span, time, minAge, complexity, tags }))
  .chain((g) =>
    fc
      .uniqueArray(fc.integer({ min: g.min, max: g.max }), { minLength: 1, maxLength: 3 })
      .map((best) => ({ min: g.min, max: g.max, time: g.time, minAge: g.minAge, complexity: g.complexity, tags: g.tags, best })),
  )
  .map((g) =>
    aGame("x", {
      playerRange: { min: g.min, max: g.max },
      bestPlayerCounts: g.best,
      playTime: { min: g.time, max: g.time + 30 },
      minAge: g.minAge,
      complexity: g.complexity,
      tags: g.tags,
    }),
  );

const catalogueArb = fc
  .array(gameArb, { minLength: 0, maxLength: 25 })
  .map((games) => games.map((g, i) => ({ ...g, id: `game-${i}`, name: `Game ${i}` })));

const requestArb: fc.Arbitrary<BuyRequest> = catalogueArb.chain((catalogue) => {
  const ids = catalogue.map((g) => g.id);
  const anyId = ids.length > 0 ? fc.constantFrom(...ids) : fc.constant("not-in-catalogue");
  const verdictArb: fc.Arbitrary<Verdict> = fc.record({
    game: anyId,
    verdict: fc.constantFrom("love" as const, "fine" as const, "dislike" as const),
    reasonTags: fc.uniqueArray(fc.constantFrom(...TAGS), { maxLength: 3 }),
  });
  return fc.record({
    catalogue: fc.constant(catalogue),
    member: fc.record({
      verdicts: fc.uniqueArray(verdictArb, { maxLength: 6, selector: (v) => v.game }),
      collection: fc.uniqueArray(anyId, { maxLength: 6 }),
      notInterested: fc.uniqueArray(anyId, { maxLength: 3 }),
    }),
    occasion: fc.record({
      players: fc.integer({ min: 1, max: 8 }),
      youngestAge: fc.integer({ min: 3, max: 18 }),
      maxPlayTime: fc.option(fc.integer({ min: 15, max: 180 }), { nil: undefined }),
      maxComplexity: fc.option(fc.double({ min: 1, max: 5, noNaN: true }), { nil: undefined }),
    }),
    limit: fc.integer({ min: 1, max: 10 }),
  });
});

const runs = { numRuns: 1000 };

describe("Buy-mode rules hold for any input", () => {
  test("no Recommendation ever breaks a Hard Constraint", () => {
    fc.assert(
      fc.property(requestArb, (r) => {
        for (const { game } of recommend(r)) {
          expect(r.occasion.players).toBeGreaterThanOrEqual(game.playerRange.min);
          expect(r.occasion.players).toBeLessThanOrEqual(game.playerRange.max);
          expect(game.minAge).toBeLessThanOrEqual(r.occasion.youngestAge ?? Infinity);
        }
      }),
      runs,
    );
  });

  test("never a Game in the Collection, marked Not Interested, or known without being loved", () => {
    fc.assert(
      fc.property(requestArb, (r) => {
        const known = new Map(r.member.verdicts.map((v) => [v.game, v.verdict]));
        for (const { game } of recommend(r)) {
          expect(r.member.collection).not.toContain(game.id);
          expect(r.member.notInterested ?? []).not.toContain(game.id);
          expect(known.get(game.id) ?? "love").toBe("love");
        }
      }),
      runs,
    );
  });

  test("every Recommendation has a reason, and every broken Soft Constraint is shown as a Relaxation", () => {
    fc.assert(
      fc.property(requestArb, (r) => {
        const { maxPlayTime, maxComplexity } = r.occasion;
        for (const rec of recommend(r)) {
          expect(rec.reasons.length).toBeGreaterThan(0);
          const broken = [
            ...(maxPlayTime !== undefined && rec.game.playTime.min > maxPlayTime ? ["play-time"] : []),
            ...(maxComplexity !== undefined && rec.game.complexity > maxComplexity ? ["complexity"] : []),
          ];
          expect(rec.relaxations.map((x) => x.kind)).toEqual(expect.arrayContaining(broken));
        }
      }),
      runs,
    );
  });

  test("never more than the limit, and never the same Game twice", () => {
    fc.assert(
      fc.property(requestArb, (r) => {
        const result = recommend(r);
        expect(result.length).toBeLessThanOrEqual(r.limit ?? 5);
        expect(new Set(result.map((x) => x.game.id)).size).toBe(result.length);
      }),
      runs,
    );
  });
});
