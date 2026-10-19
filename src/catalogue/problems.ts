/** One thing wrong with Catalogue or Tag Vocabulary data, reported instead of thrown. */
export interface Problem {
  /** Machine-readable reason, e.g. "unknown-tag". Tests and CI output rely on these. */
  code: string;
  /** Human-readable explanation, naming the offending value. */
  message: string;
  /** The Game or Tag the problem belongs to, when known. */
  game?: string;
  tag?: string;
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isWholeNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value);
