import type { Game } from "../catalogue/catalogue";

// Buy mode (docs/spec.md §7, CONTEXT.md: Fit, Similarity, Recommendation, Explanation).
// Pure functions: no framework, no database, no AI (ADR 0002, ADR 0004).

export type VerdictKind = "love" | "fine" | "dislike";

/** A Member's judgement of one Game, with the Tags of its Reason (if any). */
export interface Verdict {
  game: string;
  verdict: VerdictKind;
  reasonTags?: string[] | undefined;
}

/** Tags a newcomer likes or dislikes, from the Interview's mood questions. */
export interface MoodAnswers {
  likes: string[];
  dislikes: string[];
}

export interface Member {
  verdicts: Verdict[];
  /** Game ids the Member owns. */
  collection: string[];
  notInterested?: string[] | undefined;
  mood?: MoodAnswers | undefined;
}

/** The occasion's Constraints. Players and youngestAge are Hard; the rest are Soft. */
export interface Occasion {
  players: number;
  youngestAge?: number | undefined;
  maxPlayTime?: number | undefined;
  maxComplexity?: number | undefined;
}

export interface BuyRequest {
  catalogue: Game[];
  member: Member;
  occasion: Occasion;
  /** How many Recommendations to return; default 5. */
  limit?: number | undefined;
}

export type Reason =
  | { kind: "shared-tag"; tag: string }
  | { kind: "like"; game: string }
  | { kind: "best-player-count"; players: number }
  | { kind: "fits-occasion" };

export type Warning = { kind: "outside-best-player-count"; players: number };

export type Relaxation = { kind: "play-time"; limit: number } | { kind: "complexity"; limit: number };

export interface Recommendation {
  game: Game;
  fit: number;
  reasons: Reason[];
  warnings: Warning[];
  relaxations: Relaxation[];
  /** A Game the Member loves but does not own. */
  lovedNotOwned: boolean;
}

// --- Weights. Tuned against the reference Members (docs/testing/reference-members.md). ---
const LOVED_REASON_TAG = 2;
const DISLIKED_REASON_TAG = -2;
const MOOD_TAG = 1.5;
const SIMILAR_TO_LOVED = 3;
const SIMILAR_TO_DISLIKED = -3;
const IN_BEST_PLAYER_COUNT = 2;
/** Similarity at or above which two Games count as near-identical (Variety) or as "like" a loved Game. */
const NEAR_IDENTICAL = 0.9;
const LIKE_THRESHOLD = 0.5;
const MAX_NEAR_IDENTICAL = 2;
const DEFAULT_LIMIT = 5;

/** How alike two Games are, from 0 to 1: Tags, Complexity and Best Player Count. */
export function similarity(a: Game, b: Game): number {
  const tagsA = new Set(a.tags);
  const shared = b.tags.filter((t) => tagsA.has(t)).length;
  const union = new Set([...a.tags, ...b.tags]).size;
  const tags = union === 0 ? 0 : shared / union;
  const complexity = 1 - Math.min(Math.abs(a.complexity - b.complexity), 4) / 4;
  const bestOverlap = a.bestPlayerCounts.some((n) => b.bestPlayerCounts.includes(n)) ? 1 : 0;
  return 0.7 * tags + 0.2 * complexity + 0.1 * bestOverlap;
}

/** Per-Tag weight from the Member's Reasons and Mood Answers. */
function tagWeights(member: Member): Map<string, number> {
  const weights = new Map<string, number>();
  const add = (tag: string, w: number) => weights.set(tag, (weights.get(tag) ?? 0) + w);
  for (const v of member.verdicts) {
    const w = v.verdict === "love" ? LOVED_REASON_TAG : v.verdict === "dislike" ? DISLIKED_REASON_TAG : 0;
    if (w !== 0) for (const tag of v.reasonTags ?? []) add(tag, w);
  }
  for (const tag of member.mood?.likes ?? []) add(tag, MOOD_TAG);
  for (const tag of member.mood?.dislikes ?? []) add(tag, -MOOD_TAG);
  return weights;
}

interface Scored {
  game: Game;
  fit: number;
  reasons: Reason[];
}

function score(game: Game, request: BuyRequest, weights: Map<string, number>, judged: Map<string, Game[]>): Scored {
  const players = request.occasion.players;
  let fit = 0;

  const sharedTags = game.tags
    .map((tag) => ({ tag, w: weights.get(tag) ?? 0 }))
    .filter(({ w }) => w !== 0);
  // Only Tags the Member has an opinion about count; a Game's other Tags neither help nor hurt.
  fit += sharedTags.reduce((sum, { w }) => sum + w, 0);

  let mostLike: { game: Game; sim: number } | undefined;
  for (const loved of judged.get("love") ?? []) {
    if (loved.id === game.id) continue;
    const sim = similarity(game, loved);
    fit += SIMILAR_TO_LOVED * sim;
    if (sim >= LIKE_THRESHOLD && (!mostLike || sim > mostLike.sim)) mostLike = { game: loved, sim };
  }
  for (const disliked of judged.get("dislike") ?? []) fit += SIMILAR_TO_DISLIKED * similarity(game, disliked);

  const inBest = game.bestPlayerCounts.includes(players);
  if (inBest) fit += IN_BEST_PLAYER_COUNT;

  const reasons: Reason[] = [];
  if (mostLike) reasons.push({ kind: "like", game: mostLike.game.id });
  for (const { tag } of sharedTags.filter(({ w }) => w > 0).toSorted((a, b) => b.w - a.w || a.tag.localeCompare(b.tag))) {
    reasons.push({ kind: "shared-tag", tag });
  }
  if (inBest) reasons.push({ kind: "best-player-count", players });
  if (reasons.length === 0) reasons.push({ kind: "fits-occasion" });

  return { game, fit, reasons };
}

function brokenSoftConstraints(game: Game, occasion: Occasion): Relaxation[] {
  const broken: Relaxation[] = [];
  if (occasion.maxPlayTime !== undefined && game.playTime.min > occasion.maxPlayTime) {
    broken.push({ kind: "play-time", limit: occasion.maxPlayTime });
  }
  if (occasion.maxComplexity !== undefined && game.complexity > occasion.maxComplexity) {
    broken.push({ kind: "complexity", limit: occasion.maxComplexity });
  }
  return broken;
}

/** Ranked Buy-mode Recommendations for one Member and occasion. */
export function recommend(request: BuyRequest): Recommendation[] {
  const { catalogue, member, occasion } = request;
  const limit = request.limit ?? DEFAULT_LIMIT;
  const byId = new Map(catalogue.map((g) => [g.id, g]));
  const verdictOf = new Map(member.verdicts.map((v) => [v.game, v.verdict]));
  const owned = new Set(member.collection);
  const notInterested = new Set(member.notInterested ?? []);

  const judged = new Map<string, Game[]>();
  for (const v of member.verdicts) {
    const game = byId.get(v.game);
    if (game) judged.set(v.verdict, [...(judged.get(v.verdict) ?? []), game]);
  }

  // Candidates and Hard Constraints.
  const candidates = catalogue.filter((g) => {
    if (owned.has(g.id) || notInterested.has(g.id)) return false;
    const verdict = verdictOf.get(g.id);
    if (verdict !== undefined && verdict !== "love") return false;
    const playersOk = occasion.players >= g.playerRange.min && occasion.players <= g.playerRange.max;
    const ageOk = occasion.youngestAge === undefined || g.minAge <= occasion.youngestAge;
    return playersOk && ageOk;
  });

  // Soft Constraints: keep Games that pass; Relax only when none do.
  const passing = candidates.filter((g) => brokenSoftConstraints(g, occasion).length === 0);
  const pool = passing.length > 0 ? passing : candidates;

  const weights = tagWeights(member);
  const ranked = pool
    .map((g) => score(g, request, weights, judged))
    .toSorted((a, b) => b.fit - a.fit || a.game.name.localeCompare(b.game.name));

  return pickWithVariety(ranked, limit).map((s) => ({
    game: s.game,
    fit: s.fit,
    reasons: s.reasons,
    warnings: s.game.bestPlayerCounts.includes(occasion.players)
      ? []
      : [{ kind: "outside-best-player-count" as const, players: occasion.players }],
    relaxations: brokenSoftConstraints(s.game, occasion),
    lovedNotOwned: verdictOf.get(s.game.id) === "love",
  }));
}

/** Takes the best-ranked Games, allowing at most 2 near-identical ones; fills up if too few remain. */
function pickWithVariety(ranked: Scored[], limit: number): Scored[] {
  const picked: Scored[] = [];
  const skipped: Scored[] = [];
  for (const s of ranked) {
    if (picked.length >= limit) break;
    const twins = picked.filter((p) => similarity(p.game, s.game) >= NEAR_IDENTICAL).length;
    if (twins >= MAX_NEAR_IDENTICAL) skipped.push(s);
    else picked.push(s);
  }
  for (const s of skipped) {
    if (picked.length >= limit) break;
    picked.push(s);
  }
  return picked;
}

/** The Explanation: one plain sentence for Members, built from a Recommendation's reasons. */
export function explain(rec: Recommendation, catalogue: readonly Game[]): string {
  const like = rec.reasons.find((r) => r.kind === "like");
  const tags = rec.reasons.flatMap((r) => (r.kind === "shared-tag" ? [r.tag.replaceAll("-", " ")] : []));
  const best = rec.reasons.find((r) => r.kind === "best-player-count");

  const parts: string[] = [];
  if (tags.length > 0) parts.push(tags.join(", "));
  if (best) parts.push(`best at ${best.players}`);
  const detail = parts.length > 0 ? parts.join("; ") : "fits your table";

  const likeName = like ? catalogue.find((g) => g.id === like.game)?.name : undefined;
  if (likeName) return `Like ${likeName}: ${detail}.`;
  return `${detail.charAt(0).toUpperCase()}${detail.slice(1)}.`;
}
