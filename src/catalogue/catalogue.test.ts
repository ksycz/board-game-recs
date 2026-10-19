import { describe, expect, test } from "vitest";
import { loadCatalogue, validateCatalogue, validateCatalogueFiles, type Game } from "./catalogue";
import { loadTagVocabulary, type Tag } from "./tag-vocabulary";

// Every Catalogue entry must pass these checks before it can be used for Recommendations.
// Terms (Game, Player Range, Best Player Count, Complexity, Setup Effort, Table Space, Tag)
// are defined in CONTEXT.md.

const vocabulary: Tag[] = [
  { id: "puzzly", group: "Feel", meaning: "Working out the best move is the main joy" },
  { id: "tile-laying", group: "Mechanics", meaning: "You place tiles to build a map or pattern" },
];

const aGame = (overrides: Partial<Game> = {}): Game => ({
  id: "calico",
  name: "Calico",
  playerRange: { min: 1, max: 4 },
  bestPlayerCounts: [2, 3],
  playTime: { min: 30, max: 45 },
  minAge: 10,
  complexity: 2.2,
  setupEffort: "quick",
  tableSpace: "medium",
  tags: ["puzzly", "tile-laying"],
  ...overrides,
});

// Catalogue files are untyped JSON until checked, so the checks accept `unknown`.
const codes = (games: unknown[]) => validateCatalogue(games, vocabulary).map((p) => p.code);

describe("Catalogue rules", () => {
  test("a well-formed Game has no problems", () => {
    expect(codes([aGame()])).toEqual([]);
  });

  test("every problem names the Game it belongs to", () => {
    const [problem] = validateCatalogue([aGame({ tags: ["nonsense"] })], vocabulary);
    expect(problem).toMatchObject({ game: "calico", code: "unknown-tag" });
  });

  describe("Tags", () => {
    test("every Tag must exist in the Tag Vocabulary", () => {
      expect(codes([aGame({ tags: ["puzzly", "nonsense"] })])).toContain("unknown-tag");
    });

    test("a Game needs at least one Tag, or Fit has nothing to work with", () => {
      expect(codes([aGame({ tags: [] })])).toContain("no-tags");
    });

    test("the same Tag may not appear twice on one Game", () => {
      expect(codes([aGame({ tags: ["puzzly", "puzzly"] })])).toContain("duplicate-tag-on-game");
    });
  });

  describe("Player Range and Best Player Count", () => {
    test("Player Range starts at 1 or more", () => {
      expect(codes([aGame({ playerRange: { min: 0, max: 4 } })])).toContain("invalid-player-range");
    });

    test("Player Range max is not below min", () => {
      expect(codes([aGame({ playerRange: { min: 4, max: 2 }, bestPlayerCounts: [3] })])).toContain(
        "invalid-player-range",
      );
    });

    test("a solo-only Game (1–1) is valid", () => {
      expect(codes([aGame({ playerRange: { min: 1, max: 1 }, bestPlayerCounts: [1] })])).toEqual([]);
    });

    test("Best Player Count must lie inside the Player Range", () => {
      expect(codes([aGame({ bestPlayerCounts: [2, 5] })])).toContain("best-count-outside-range");
    });

    test("Best Player Count may skip counts (e.g. best at 2 and 4)", () => {
      expect(codes([aGame({ bestPlayerCounts: [2, 4] })])).toEqual([]);
    });

    test("a Game needs at least one Best Player Count", () => {
      expect(codes([aGame({ bestPlayerCounts: [] })])).toContain("no-best-player-count");
    });
  });

  describe("shape", () => {
    test("a file that is not a Game object is reported, not crashed on", () => {
      expect(codes(["Calico"])).toContain("not-a-game");
      expect(codes([null])).toContain("not-a-game");
    });

    test("a missing required field is reported", () => {
      const { complexity: _omitted, ...withoutComplexity } = aGame();
      expect(codes([withoutComplexity])).toContain("missing-field");
    });
  });

  describe("other fields", () => {
    test("Complexity is on our 1–5 scale", () => {
      expect(codes([aGame({ complexity: 0.5 })])).toContain("complexity-out-of-range");
      expect(codes([aGame({ complexity: 5.5 })])).toContain("complexity-out-of-range");
      expect(codes([aGame({ complexity: 1 })])).toEqual([]);
      expect(codes([aGame({ complexity: 5 })])).toEqual([]);
    });

    test("play time is positive and max is not below min", () => {
      expect(codes([aGame({ playTime: { min: 0, max: 30 } })])).toContain("invalid-play-time");
      expect(codes([aGame({ playTime: { min: 60, max: 30 } })])).toContain("invalid-play-time");
    });

    test("minimum age is a whole number from 3 to 18", () => {
      expect(codes([aGame({ minAge: 2 })])).toContain("invalid-min-age");
      expect(codes([aGame({ minAge: 21 })])).toContain("invalid-min-age");
      expect(codes([aGame({ minAge: 8.5 })])).toContain("invalid-min-age");
    });

    test("Setup Effort is quick, medium or long", () => {
      expect(codes([{ ...aGame(), setupEffort: "instant" }])).toContain(
        "invalid-setup-effort",
      );
    });

    test("Table Space is small, medium or large", () => {
      expect(codes([{ ...aGame(), tableSpace: "huge" }])).toContain(
        "invalid-table-space",
      );
    });

    test("the optional BGG ID, when present, is a positive whole number", () => {
      expect(codes([aGame({ bggId: 283155 })])).toEqual([]);
      expect(codes([aGame({ bggId: -1 })])).toContain("invalid-bgg-id");
    });
  });

  describe("the Catalogue as a whole", () => {
    test("Game ids are unique", () => {
      expect(codes([aGame(), aGame({ name: "Calico (copy)" })])).toContain("duplicate-game-id");
    });

    test("Game names are unique, ignoring letter case", () => {
      expect(codes([aGame(), aGame({ id: "calico-2", name: "CALICO" })])).toContain(
        "duplicate-game-name",
      );
    });

    test("Game ids are lower-case kebab-case", () => {
      expect(codes([aGame({ id: "Calico Game" })])).toContain("invalid-game-id");
    });
  });
});

describe("Catalogue files", () => {
  test("each Game lives in a file named after its id", () => {
    const problems = validateCatalogueFiles([{ file: "calico.json", data: aGame() }], vocabulary);
    expect(problems).toEqual([]);
  });

  test("a file whose name does not match the Game id is reported", () => {
    const problems = validateCatalogueFiles([{ file: "kalico.json", data: aGame() }], vocabulary);
    expect(problems.map((p) => p.code)).toContain("file-name-mismatch");
  });
});

describe("the real Catalogue (data/catalogue/*.json)", () => {
  test("every file passes the Catalogue rules against the real Tag Vocabulary", async () => {
    const [files, tags] = await Promise.all([loadCatalogue(), loadTagVocabulary()]);
    expect(validateCatalogueFiles(files, tags)).toEqual([]);
  });
});
