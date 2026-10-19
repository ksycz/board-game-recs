import { readdir, readFile } from "node:fs/promises";
import { isRecord, isWholeNumber, KEBAB_CASE, type Problem } from "./problems";
import type { Tag } from "./tag-vocabulary";

export const SETUP_EFFORTS = ["quick", "medium", "long"] as const;
export const TABLE_SPACES = ["small", "medium", "large"] as const;

export interface Range {
  min: number;
  max: number;
}

/** One entry in the Catalogue (see CONTEXT.md: Game). */
export interface Game {
  /** Kebab-case id; also the file name, data/catalogue/<id>.json. */
  id: string;
  name: string;
  /** Player counts the box supports. */
  playerRange: Range;
  /** Counts within the Player Range at which the Game plays well; may skip counts. */
  bestPlayerCounts: number[];
  /** Minutes. */
  playTime: Range;
  minAge: number;
  /** Our own 1–5 scale; decimals allowed. */
  complexity: number;
  setupEffort: (typeof SETUP_EFFORTS)[number];
  tableSpace: (typeof TABLE_SPACES)[number];
  tags: string[];
  /** Optional, only for matching with BoardGameGeek later (ADR 0001). */
  bggId?: number;
}

const REQUIRED_FIELDS = [
  "id",
  "name",
  "playerRange",
  "bestPlayerCounts",
  "playTime",
  "minAge",
  "complexity",
  "setupEffort",
  "tableSpace",
  "tags",
] as const;

const isRange = (value: unknown): value is Range =>
  isRecord(value) && typeof value["min"] === "number" && typeof value["max"] === "number";

const isOneOf = <T extends string>(options: readonly T[], value: unknown): value is T =>
  typeof value === "string" && (options as readonly string[]).includes(value);

/** Checks a list of Catalogue entries against the Tag Vocabulary. An empty list means all are valid. */
export function validateCatalogue(games: readonly unknown[], vocabulary: readonly Tag[]): Problem[] {
  const tagIds = new Set(vocabulary.map((t) => t.id));
  const problems: Problem[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const entry of games) {
    if (!isRecord(entry)) {
      problems.push({ code: "not-a-game", message: `Not a Game: ${JSON.stringify(entry)}` });
      continue;
    }
    const game = typeof entry["id"] === "string" ? entry["id"] : "(no id)";
    const report = (code: string, message: string) => problems.push({ code, game, message });

    const missing = REQUIRED_FIELDS.filter((field) => entry[field] === undefined);
    for (const field of missing) report("missing-field", `${game} is missing "${field}"`);
    if (missing.length > 0) continue;

    const id = entry["id"];
    if (typeof id !== "string" || !KEBAB_CASE.test(id)) {
      report("invalid-game-id", `Game id ${JSON.stringify(id)} is not lower-case kebab-case`);
    }
    if (typeof id === "string") {
      if (seenIds.has(id)) report("duplicate-game-id", `Game id "${id}" is used more than once`);
      seenIds.add(id);
    }
    const name = entry["name"];
    if (typeof name === "string") {
      const key = name.trim().toLowerCase();
      if (seenNames.has(key)) report("duplicate-game-name", `Game name "${name}" is used more than once`);
      seenNames.add(key);
    }

    checkTags(entry["tags"], tagIds, report);
    checkPlayers(entry["playerRange"], entry["bestPlayerCounts"], report);
    checkOtherFields(entry, report);
  }
  return problems;
}

type Report = (code: string, message: string) => void;

function checkTags(tags: unknown, tagIds: ReadonlySet<string>, report: Report) {
  if (!Array.isArray(tags) || tags.length === 0) {
    report("no-tags", "A Game needs at least one Tag");
    return;
  }
  const seen = new Set<unknown>();
  for (const tag of tags) {
    if (seen.has(tag)) report("duplicate-tag-on-game", `Tag ${JSON.stringify(tag)} appears twice`);
    seen.add(tag);
    if (typeof tag !== "string" || !tagIds.has(tag)) {
      report("unknown-tag", `Tag ${JSON.stringify(tag)} is not in the Tag Vocabulary`);
    }
  }
}

function checkPlayers(playerRange: unknown, bestCounts: unknown, report: Report) {
  const rangeOk =
    isRange(playerRange) &&
    isWholeNumber(playerRange.min) &&
    isWholeNumber(playerRange.max) &&
    playerRange.min >= 1 &&
    playerRange.max >= playerRange.min;
  if (!rangeOk) report("invalid-player-range", `Invalid Player Range ${JSON.stringify(playerRange)}`);

  if (!Array.isArray(bestCounts) || bestCounts.length === 0) {
    report("no-best-player-count", "A Game needs at least one Best Player Count");
    return;
  }
  if (!rangeOk) return;
  for (const count of bestCounts) {
    if (!isWholeNumber(count) || count < playerRange.min || count > playerRange.max) {
      report(
        "best-count-outside-range",
        `Best Player Count ${JSON.stringify(count)} is outside the Player Range ${playerRange.min}–${playerRange.max}`,
      );
    }
  }
}

function checkOtherFields(entry: Record<string, unknown>, report: Report) {
  const complexity = entry["complexity"];
  if (typeof complexity !== "number" || complexity < 1 || complexity > 5) {
    report("complexity-out-of-range", `Complexity ${JSON.stringify(complexity)} is not on the 1–5 scale`);
  }

  const playTime = entry["playTime"];
  if (!isRange(playTime) || playTime.min <= 0 || playTime.max < playTime.min) {
    report("invalid-play-time", `Invalid play time ${JSON.stringify(playTime)}`);
  }

  const minAge = entry["minAge"];
  if (!isWholeNumber(minAge) || minAge < 3 || minAge > 18) {
    report("invalid-min-age", `Minimum age ${JSON.stringify(minAge)} is not a whole number from 3 to 18`);
  }

  if (!isOneOf(SETUP_EFFORTS, entry["setupEffort"])) {
    report("invalid-setup-effort", `Setup Effort ${JSON.stringify(entry["setupEffort"])} is not ${SETUP_EFFORTS.join(" / ")}`);
  }
  if (!isOneOf(TABLE_SPACES, entry["tableSpace"])) {
    report("invalid-table-space", `Table Space ${JSON.stringify(entry["tableSpace"])} is not ${TABLE_SPACES.join(" / ")}`);
  }

  const bggId = entry["bggId"];
  if (bggId !== undefined && (!isWholeNumber(bggId) || bggId <= 0)) {
    report("invalid-bgg-id", `BGG ID ${JSON.stringify(bggId)} is not a positive whole number`);
  }
}

/** A Catalogue file as read from disk, before it is checked. */
export interface CatalogueFile {
  file: string;
  data: unknown;
}

/** Checks Catalogue files: every Game rule, plus each file being named <id>.json. */
export function validateCatalogueFiles(files: readonly CatalogueFile[], vocabulary: readonly Tag[]): Problem[] {
  const problems = validateCatalogue(
    files.map((f) => f.data),
    vocabulary,
  );
  for (const { file, data } of files) {
    const id = isRecord(data) ? data["id"] : undefined;
    if (file !== `${String(id)}.json`) {
      problems.push({
        code: "file-name-mismatch",
        game: typeof id === "string" ? id : file,
        message: `${file} should be named ${String(id)}.json`,
      });
    }
  }
  return problems;
}

const CATALOGUE_DIR = new URL("../../data/catalogue/", import.meta.url);

/** Reads every data/catalogue/*.json file. Returns raw data: run validateCatalogueFiles before trusting it. */
export async function loadCatalogue(): Promise<CatalogueFile[]> {
  const names = (await readdir(CATALOGUE_DIR)).filter((n) => n.endsWith(".json")).toSorted();
  return Promise.all(
    names.map(async (file) => {
      const data: unknown = JSON.parse(await readFile(new URL(file, CATALOGUE_DIR), "utf8"));
      return { file, data };
    }),
  );
}
