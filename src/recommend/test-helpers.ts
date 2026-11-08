import type { Game } from "../catalogue/catalogue";

/** A valid Game with sensible defaults; override only what a test cares about. */
export const aGame = (id: string, overrides: Partial<Game> = {}): Game => ({
  id,
  name: id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
  playerRange: { min: 1, max: 4 },
  bestPlayerCounts: [2, 3],
  playTime: { min: 30, max: 45 },
  minAge: 8,
  complexity: 2,
  setupEffort: "quick",
  tableSpace: "medium",
  tags: ["puzzly"],
  ...overrides,
});
