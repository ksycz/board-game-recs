import { describe, expect, test } from "vitest";
import { loadTagVocabulary, validateTagVocabulary, type Tag } from "./tag-vocabulary";

// The Tag Vocabulary (CONTEXT.md) is the only language the recommender understands.
// These rules keep it well-formed; the Admin owns its content.

const aTag = (overrides: Partial<Tag> = {}): Tag => ({
  id: "puzzly",
  group: "Feel",
  meaning: "Working out the best move is the main joy",
  ...overrides,
});

// data/tags.json is untyped until checked, so the checks accept `unknown`.
const codes = (tags: unknown[]) => validateTagVocabulary(tags).map((p) => p.code);

describe("Tag Vocabulary rules", () => {
  test("a well-formed vocabulary has no problems", () => {
    expect(codes([aTag(), aTag({ id: "auction", group: "Mechanics" })])).toEqual([]);
  });

  test("Tag ids must be unique", () => {
    expect(codes([aTag(), aTag()])).toContain("duplicate-tag");
  });

  test("Tag ids are lower-case kebab-case", () => {
    expect(codes([aTag({ id: "Combo Heavy" })])).toContain("invalid-tag-id");
    expect(codes([aTag({ id: "combo-heavy" })])).toEqual([]);
  });

  test("every Tag belongs to one of the five groups", () => {
    expect(codes([{ ...aTag(), group: "Vibes" }])).toContain("unknown-tag-group");
  });

  test("every Tag has a plain-language meaning Members can read", () => {
    expect(codes([aTag({ meaning: "  " })])).toContain("missing-meaning");
  });
});

describe("the real Tag Vocabulary (data/tags.json)", () => {
  test("loads and has no problems", async () => {
    const tags = await loadTagVocabulary();
    expect(validateTagVocabulary(tags)).toEqual([]);
  });

  test("contains the 63 Tags reviewed by the Admin", async () => {
    const tags = await loadTagVocabulary();
    expect(tags).toHaveLength(63);
  });
});
