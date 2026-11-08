import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";
import { REQUIRED_FIELDS, SETUP_EFFORTS, TABLE_SPACES } from "./catalogue";
import { loadTagVocabulary } from "./tag-vocabulary";

// data/schemas/game.schema.json gives editors autocomplete and warnings for Catalogue files.
// It is a convenience only: the Catalogue checks remain the source of truth.
// These tests keep the two in step, so a new Tag can never be missing from autocomplete.

const loadSchema = async (): Promise<unknown> =>
  JSON.parse(await readFile(new URL("../../data/schemas/game.schema.json", import.meta.url), "utf8"));

/** Matches an array with exactly these items, in any order. */
const exactly = (items: readonly string[]) =>
  expect.toSatisfy(
    (value: unknown) =>
      Array.isArray(value) && value.length === items.length && items.every((item) => value.includes(item)),
  );

describe("Game JSON Schema (data/schemas/game.schema.json)", () => {
  test("offers exactly the Tags in the Tag Vocabulary", async () => {
    const [schema, tags] = await Promise.all([loadSchema(), loadTagVocabulary()]);
    expect(schema).toMatchObject({
      properties: { tags: { items: { enum: exactly(tags.map((t) => t.id)) } } },
    });
  });

  test("offers the same Setup Effort and Table Space values as the Catalogue checks", async () => {
    expect(await loadSchema()).toMatchObject({
      properties: {
        setupEffort: { enum: exactly(SETUP_EFFORTS) },
        tableSpace: { enum: exactly(TABLE_SPACES) },
      },
    });
  });

  test("requires the same fields as the Catalogue checks", async () => {
    expect(await loadSchema()).toMatchObject({ required: exactly(REQUIRED_FIELDS) });
  });
});
