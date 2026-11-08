import { beforeAll, describe, expect, test } from "vitest";
import { loadGames, type Game } from "../catalogue/catalogue";
import { recommend } from "./recommend";
import { REFERENCE_MEMBERS } from "./reference-members";

// Recommendation quality (ADR 0005): the Admin's expected outcomes for the 7 reference
// Members, run against the real Catalogue. When Fit changes, these show who got better or worse.

let catalogue: Game[];
beforeAll(async () => {
  catalogue = await loadGames();
});

describe.each(REFERENCE_MEMBERS)("$name", (member) => {
  const topIds = (n: number) => recommend({ catalogue, ...member.request, limit: n }).map((r) => r.game.id);

  test("the Games named in the expected outcomes all exist in the Catalogue", () => {
    const ids = new Set(catalogue.map((g) => g.id));
    expect([...member.mustNotAppear, ...member.topFiveIncludesOneOf].filter((id) => !ids.has(id))).toEqual([]);
  });

  test("no obviously bad Recommendation in the top 10", () => {
    const top10 = recommend({ catalogue, ...member.request, limit: 10 });
    const bad = top10.filter(
      (r) =>
        member.mustNotAppear.includes(r.game.id) ||
        (member.mustNotAppearWithTag ?? []).some((t) => r.game.tags.includes(t)),
    );
    expect(bad.map((r) => r.game.id), `top 10 was: ${top10.map((r) => r.game.id).join(", ")}`).toEqual([]);
  });

  test("at least one of the expected Games is in the top 5", () => {
    const top5 = topIds(5);
    const found = top5.filter((id) => member.topFiveIncludesOneOf.includes(id));
    expect(found.length, `top 5 was: ${top5.join(", ")}`).toBeGreaterThan(0);
  });

  test("the expected Games found in the top 5 give the expected kind of reason", () => {
    const found = recommend({ catalogue, ...member.request, limit: 5 }).filter((r) =>
      member.topFiveIncludesOneOf.includes(r.game.id),
    );
    for (const rec of found) {
      const matches = rec.reasons.filter((reason) =>
        member.explanationMentionsOneOf.some((expected) => JSON.stringify(expected) === JSON.stringify(reason)),
      );
      expect(matches.length, `${rec.game.id} reasons: ${JSON.stringify(rec.reasons)}`).toBeGreaterThan(0);
    }
  });
});
