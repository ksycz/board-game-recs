import { readFile } from "node:fs/promises";
import { isRecord, KEBAB_CASE, type Problem } from "./problems";

export const TAG_GROUPS = ["Feel", "Interaction", "Mechanics", "Theme", "Pace"] as const;
export type TagGroup = (typeof TAG_GROUPS)[number];

/** A named trait from the Tag Vocabulary (see CONTEXT.md). */
export interface Tag {
  id: string;
  group: TagGroup;
  /** Plain-language meaning shown to Members. */
  meaning: string;
  /** Games that illustrate the Tag; documentation only. */
  examples?: string[];
}

const TAGS_FILE = new URL("../../data/tags.json", import.meta.url);

/** Reads data/tags.json. Returns raw data: run validateTagVocabulary before trusting it. */
export async function loadTagVocabulary(): Promise<Tag[]> {
  const raw: unknown = JSON.parse(await readFile(TAGS_FILE, "utf8"));
  if (!Array.isArray(raw)) throw new Error("data/tags.json must contain a list of Tags");
  const malformed = raw.filter((entry) => !isTag(entry));
  if (malformed.length > 0) {
    throw new Error(`data/tags.json has entries that are not Tags: ${JSON.stringify(malformed)}`);
  }
  return raw.filter(isTag);
}

function isTag(value: unknown): value is Tag {
  return (
    isRecord(value) &&
    typeof value["id"] === "string" &&
    typeof value["group"] === "string" &&
    typeof value["meaning"] === "string"
  );
}

const isTagGroup = (value: unknown): value is TagGroup =>
  typeof value === "string" && (TAG_GROUPS as readonly string[]).includes(value);

/** Checks a Tag Vocabulary and lists every problem found. An empty list means it is valid. */
export function validateTagVocabulary(tags: readonly unknown[]): Problem[] {
  const problems: Problem[] = [];
  const seen = new Set<string>();

  for (const tag of tags) {
    if (!isRecord(tag) || typeof tag["id"] !== "string") {
      problems.push({ code: "not-a-tag", message: `Not a Tag: ${JSON.stringify(tag)}` });
      continue;
    }
    const id = tag["id"];

    if (seen.has(id)) {
      problems.push({ code: "duplicate-tag", tag: id, message: `Tag "${id}" appears more than once` });
    }
    seen.add(id);

    if (!KEBAB_CASE.test(id)) {
      problems.push({ code: "invalid-tag-id", tag: id, message: `Tag id "${id}" is not lower-case kebab-case` });
    }
    if (!isTagGroup(tag["group"])) {
      problems.push({
        code: "unknown-tag-group",
        tag: id,
        message: `Tag "${id}" has group ${JSON.stringify(tag["group"])}; expected one of ${TAG_GROUPS.join(", ")}`,
      });
    }
    const meaning = tag["meaning"];
    if (typeof meaning !== "string" || meaning.trim() === "") {
      problems.push({ code: "missing-meaning", tag: id, message: `Tag "${id}" has no meaning` });
    }
  }
  return problems;
}
