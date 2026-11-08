import { describe, expect, test } from "vitest";
import { explain, recommend, type BuyRequest } from "./recommend";
import { aGame } from "./test-helpers";

// Buy mode (docs/spec.md §7): which Games to suggest buying, for one Member.
// Terms (Verdict, Reason, Fit, Similarity, Hard/Soft Constraint, Relaxation, Explanation)
// are defined in CONTEXT.md. These tests pin behaviour, not exact Fit numbers.

const calm = aGame("calm-puzzle", { tags: ["puzzly", "relaxing", "tile-laying"] });
const calmCousin = aGame("calm-cousin", { tags: ["puzzly", "relaxing", "tile-laying"] });
const brawler = aGame("brawler", { tags: ["confrontational", "chaotic"] });
const party = aGame("party-game", { tags: ["party", "funny"], playerRange: { min: 3, max: 8 }, bestPlayerCounts: [6] });

const request = (overrides: Partial<BuyRequest> = {}): BuyRequest => ({
  catalogue: [calm, calmCousin, brawler, party],
  member: { verdicts: [], collection: [] },
  occasion: { players: 2 },
  ...overrides,
});

const ids = (r: BuyRequest) => recommend(r).map((rec) => rec.game.id);

describe("Hard Constraints are never broken", () => {
  test("a Game whose Player Range excludes the number of Players is never recommended", () => {
    expect(ids(request({ occasion: { players: 2 } }))).not.toContain("party-game");
  });

  test("a Game whose minimum age exceeds the youngest Player's is never recommended", () => {
    const grown = aGame("grown-up", { minAge: 14 });
    expect(ids(request({ catalogue: [grown, calm], occasion: { players: 2, youngestAge: 10 } }))).toEqual([
      "calm-puzzle",
    ]);
  });

  test("Hard Constraints are not relaxed even when nothing else is left", () => {
    expect(recommend(request({ catalogue: [party], occasion: { players: 2 } }))).toEqual([]);
  });
});

describe("Buy-mode candidates", () => {
  test("Games in the Member's Collection are not recommended", () => {
    expect(ids(request({ member: { verdicts: [], collection: ["calm-puzzle"] } }))).not.toContain("calm-puzzle");
  });

  test("Games the Member marked Not Interested are not recommended", () => {
    expect(ids(request({ member: { verdicts: [], collection: [], notInterested: ["brawler"] } }))).not.toContain(
      "brawler",
    );
  });

  test("Games the Member already has a Verdict on are not recommended (they know them)", () => {
    const member = { verdicts: [{ game: "brawler", verdict: "dislike" as const }], collection: [] };
    expect(ids(request({ member }))).not.toContain("brawler");
  });

  test("a loved Game the Member does not own stays eligible, labelled as such", () => {
    const member = { verdicts: [{ game: "calm-puzzle", verdict: "love" as const }], collection: [] };
    const rec = recommend(request({ member })).find((r) => r.game.id === "calm-puzzle");
    expect(rec?.lovedNotOwned).toBe(true);
  });

  test("no more than the requested number of Recommendations (default 5)", () => {
    const many = Array.from({ length: 12 }, (_, i) => aGame(`game-${i}`, { tags: ["puzzly"] }));
    expect(recommend(request({ catalogue: many }))).toHaveLength(5);
    expect(recommend(request({ catalogue: many, limit: 3 }))).toHaveLength(3);
  });
});

describe("Fit", () => {
  test("Games sharing Tags with a loved Reason rank above Games that don't", () => {
    const member = {
      verdicts: [{ game: "owned-favourite", verdict: "love" as const, reasonTags: ["puzzly", "relaxing"] }],
      collection: ["owned-favourite"],
    };
    const result = ids(request({ catalogue: [brawler, calm], member }));
    expect(result.indexOf("calm-puzzle")).toBeLessThan(result.indexOf("brawler"));
  });

  test("Tags from a disliked Reason push Games down", () => {
    const member = {
      verdicts: [{ game: "owned-dud", verdict: "dislike" as const, reasonTags: ["puzzly"] }],
      collection: [],
    };
    const result = ids(request({ catalogue: [calm, brawler], member }));
    expect(result.indexOf("brawler")).toBeLessThan(result.indexOf("calm-puzzle"));
  });

  test("a Game Similar to a loved Game ranks above an unrelated one, even with no Reason given", () => {
    const loved = aGame("loved", { tags: ["puzzly", "relaxing", "tile-laying"] });
    const member = { verdicts: [{ game: "loved", verdict: "love" as const }], collection: ["loved"] };
    const result = ids(request({ catalogue: [loved, brawler, calmCousin], member }));
    expect(result.indexOf("calm-cousin")).toBeLessThan(result.indexOf("brawler"));
  });

  test("a Game Similar to a disliked Game ranks below an unrelated one", () => {
    const hated = aGame("hated", { tags: ["confrontational", "chaotic"] });
    const brawlerCousin = aGame("brawler-cousin", { tags: ["confrontational", "chaotic"] });
    const member = { verdicts: [{ game: "hated", verdict: "dislike" as const }], collection: [] };
    const result = ids(request({ catalogue: [hated, brawlerCousin, calm], member }));
    expect(result.indexOf("calm-puzzle")).toBeLessThan(result.indexOf("brawler-cousin"));
  });

  test("a 'fine' Verdict pulls neither way", () => {
    const meh = aGame("meh", { tags: ["puzzly", "relaxing", "tile-laying"] });
    const withFine = { verdicts: [{ game: "meh", verdict: "fine" as const }], collection: ["meh"] };
    const withNothing = { verdicts: [], collection: ["meh"] };
    const fitWith = recommend(request({ catalogue: [meh, calm], member: withFine }))[0]?.fit;
    const fitWithout = recommend(request({ catalogue: [meh, calm], member: withNothing }))[0]?.fit;
    expect(fitWith).toBe(fitWithout);
  });

  test("Mood Answers count like Reasons: liked Tags pull up, disliked Tags push down", () => {
    const member = { verdicts: [], collection: [], mood: { likes: ["party"], dislikes: ["puzzly"] } };
    // 3 Players: both Games are allowed, so only the Mood Answers decide the order.
    const result = ids(request({ catalogue: [calm, party], member, occasion: { players: 3 } }));
    expect(result[0]).toBe("party-game");
  });

  test("the same request always gives the same Recommendations in the same order", () => {
    const r = request();
    expect(ids(r)).toEqual(ids(r));
  });

  test("equal Fit is ordered by Game name, so results never depend on file order", () => {
    const b = aGame("bbb", { tags: ["puzzly"] });
    const a = aGame("aaa", { tags: ["puzzly"] });
    expect(ids(request({ catalogue: [b, a] }))).toEqual(["aaa", "bbb"]);
  });
});

describe("Variety", () => {
  test("at most 2 of the top 5 are near-identical to each other", () => {
    const clones = Array.from({ length: 6 }, (_, i) => aGame(`clone-${i}`, { tags: ["puzzly", "relaxing", "tile-laying"] }));
    // The three others must differ from each other too, or they would be near-identical as well
    // and no valid top 5 could exist (fixed after approval; see PR #11).
    const others = [
      aGame("alpha", { tags: ["relaxing", "beautiful"] }),
      aGame("beta", { tags: ["relaxing", "cosy"] }),
      aGame("gamma", { tags: ["relaxing", "nature"] }),
    ];
    const member = {
      verdicts: [{ game: "owned", verdict: "love" as const, reasonTags: ["puzzly", "relaxing", "tile-laying"] }],
      collection: ["owned"],
    };
    const top = ids(request({ catalogue: [...clones, ...others], member }));
    expect(top.filter((id) => id.startsWith("clone-")).length).toBeLessThanOrEqual(2);
    expect(top).toHaveLength(5);
  });
});

describe("Soft Constraints and Relaxation", () => {
  const long = aGame("long-game", { playTime: { min: 90, max: 120 } });
  const short = aGame("short-game", { playTime: { min: 20, max: 30 } });

  test("Games breaking a Soft Constraint are left out while others pass", () => {
    const result = recommend(request({ catalogue: [long, short], occasion: { players: 2, maxPlayTime: 45 } }));
    expect(result.map((r) => r.game.id)).toEqual(["short-game"]);
    expect(result[0]?.relaxations).toEqual([]);
  });

  test("when nothing passes, play time is Relaxed and the Relaxation is shown", () => {
    const result = recommend(request({ catalogue: [long], occasion: { players: 2, maxPlayTime: 45 } }));
    expect(result.map((r) => r.game.id)).toEqual(["long-game"]);
    expect(result[0]?.relaxations).toContainEqual(expect.objectContaining({ kind: "play-time" }));
  });

  test("the Complexity cap is a Soft Constraint too", () => {
    const heavy = aGame("heavy", { complexity: 4 });
    const result = recommend(request({ catalogue: [heavy], occasion: { players: 2, maxComplexity: 2.5 } }));
    expect(result[0]?.relaxations).toContainEqual(expect.objectContaining({ kind: "complexity" }));
  });

  test("outside the Best Player Count a Game is still allowed, with a warning", () => {
    const bestAtFour = aGame("best-at-four", { bestPlayerCounts: [4] });
    const [rec] = recommend(request({ catalogue: [bestAtFour], occasion: { players: 2 } }));
    expect(rec?.warnings).toContainEqual({ kind: "outside-best-player-count", players: 2 });
  });
});

describe("Explanation", () => {
  const member = {
    verdicts: [{ game: "loved", verdict: "love" as const, reasonTags: ["relaxing"] }],
    collection: ["loved"],
  };
  const loved = aGame("loved", { tags: ["puzzly", "relaxing", "tile-laying"] });

  test("every Recommendation has at least one reason", () => {
    for (const rec of recommend(request({ catalogue: [loved, calm, brawler], member }))) {
      expect(rec.reasons.length).toBeGreaterThan(0);
    }
  });

  test("reasons name the shared Tags and the loved Game it is Similar to", () => {
    const [rec] = recommend(request({ catalogue: [loved, calmCousin], member }));
    expect(rec?.reasons).toContainEqual({ kind: "shared-tag", tag: "relaxing" });
    expect(rec?.reasons).toContainEqual({ kind: "like", game: "loved" });
  });

  test("a Game in its Best Player Count says so", () => {
    const [rec] = recommend(request({ catalogue: [calm], occasion: { players: 2 } }));
    expect(rec?.reasons).toContainEqual({ kind: "best-player-count", players: 2 });
  });

  test("the Explanation reads as one plain sentence for Members", () => {
    const [rec] = recommend(request({ catalogue: [loved, calmCousin], member }));
    expect(rec && explain(rec, [loved, calmCousin])).toMatch(/^Like Loved: .*relaxing.*\.$/);
  });
});
