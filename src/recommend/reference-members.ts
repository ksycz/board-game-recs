import type { BuyRequest, Verdict } from "./recommend";

/**
 * The 7 reference Members from docs/testing/reference-members.md, as test data.
 *
 * - Verdicts and Reasons come from that document. Each Reason's free text is mapped to Tags
 *   by hand here; in the app that is the AI tagger's job (ADR 0002).
 * - Each Member owns the Games they love, so Buy mode suggests something new rather than
 *   re-suggesting their favourites.
 * - Usual Group Size becomes the number of Players: solo → 1, 2 → 2, 3–4 → 4, 5+ → 5.
 * - The expected outcomes were written by the Admin; they are the test oracle, not tuned to the code.
 */
export interface ReferenceMember {
  name: string;
  request: Omit<BuyRequest, "catalogue">;
  /** None of these may appear in the top 10. */
  mustNotAppear: string[];
  /** At least one of these must appear in the top 5. */
  topFiveIncludesOneOf: string[];
  /** Must not appear in the top 10: every Game with one of these Tags. */
  mustNotAppearWithTag?: string[];
  /** The Recommendations from topFiveIncludesOneOf must give at least one of these reasons. */
  explanationMentionsOneOf: Array<{ kind: "shared-tag"; tag: string } | { kind: "best-player-count"; players: number }>;
}

const love = (game: string, reasonTags: string[] = []): Verdict => ({ game, verdict: "love", reasonTags });
const fine = (game: string): Verdict => ({ game, verdict: "fine" });
const dislike = (game: string, reasonTags: string[] = []): Verdict => ({ game, verdict: "dislike", reasonTags });
const owning = (verdicts: Verdict[]) => verdicts.filter((v) => v.verdict === "love").map((v) => v.game);
const tag = (t: string) => ({ kind: "shared-tag" as const, tag: t });

const alexVerdicts = [
  love("cascadia", ["relaxing", "multiplayer-solitaire", "puzzly"]),
  love("azul", ["puzzly"]),
  love("patchwork", ["puzzly", "relaxing"]),
  dislike("exploding-kittens", ["chaotic"]),
  dislike("root", ["confrontational"]),
];
const beaVerdicts = [
  love("codenames", ["party", "funny"]),
  love("dixit", ["funny", "party", "newcomer-friendly"]),
  love("just-one", ["filler", "funny"]),
  dislike("terraforming-mars", ["multiplayer-solitaire", "downtime"]),
];
const cyrilVerdicts = [
  love("brass-birmingham", ["strategic", "crunchy"]),
  love("agricola", ["crunchy", "slow-burn"]),
  dislike("catan", ["luck-heavy"]),
  dislike("ticket-to-ride", ["newcomer-friendly"]),
];
const danaVerdicts = [
  love("uno"),
  love("dobble"),
  fine("codenames"),
  dislike("monopoly", ["player-elimination", "downtime"]),
  dislike("catan", ["analysis-paralysis"]),
];
const eliVerdicts = [
  love("pandemic", ["cooperative"]),
  love("the-crew-the-quest-for-planet-nine", ["tense", "cooperative"]),
  love("hanabi"),
  dislike("skull", ["bluffing"]),
];
const finVerdicts = [
  love("spirit-island", ["puzzly", "strategic"]),
  love("wingspan", ["relaxing", "engine-building"]),
  dislike("codenames", ["party"]),
];
const gusVerdicts = [
  love("king-of-tokyo", ["confrontational"]),
  love("root", ["dramatic", "confrontational"]),
  love("cosmic-encounter", ["negotiation", "bluffing", "dramatic"]),
  dislike("wingspan", ["multiplayer-solitaire"]),
];

export const REFERENCE_MEMBERS: ReferenceMember[] = [
  {
    name: "Alex, the calm puzzler",
    request: { member: { verdicts: alexVerdicts, collection: owning(alexVerdicts) }, occasion: { players: 2 } },
    mustNotAppear: ["blood-rage", "secret-hitler"],
    topFiveIncludesOneOf: ["harmonies", "nova-luna", "nebula"],
    explanationMentionsOneOf: [{ kind: "best-player-count", players: 2 }, tag("relaxing"), tag("puzzly")],
  },
  {
    name: "Bea, the party host",
    request: { member: { verdicts: beaVerdicts, collection: owning(beaVerdicts) }, occasion: { players: 5 } },
    mustNotAppear: ["wingspan", "ark-nova", "forest-shuffle"],
    topFiveIncludesOneOf: ["so-clover", "skull", "trio"],
    explanationMentionsOneOf: [tag("filler"), tag("party"), tag("funny"), tag("revealing")],
  },
  {
    name: "Cyril, the heavy strategist",
    request: { member: { verdicts: cyrilVerdicts, collection: owning(cyrilVerdicts) }, occasion: { players: 4 } },
    mustNotAppear: ["cant-stop", "flip-7", "ra"],
    topFiveIncludesOneOf: ["ark-nova", "scythe", "dune-imperium"],
    explanationMentionsOneOf: [tag("strategic")],
  },
  {
    name: "Dana, the newcomer",
    request: {
      member: {
        verdicts: danaVerdicts,
        collection: owning(danaVerdicts),
        mood: { likes: ["party", "funny", "luck-heavy", "filler"], dislikes: [] },
      },
      occasion: { players: 4, maxComplexity: 2.5 },
    },
    mustNotAppear: ["twilight-struggle"],
    topFiveIncludesOneOf: ["trio", "spicy", "sushi-go"],
    explanationMentionsOneOf: [tag("filler"), tag("newcomer-friendly")],
  },
  {
    name: "Eli, the cooperative couple",
    request: { member: { verdicts: eliVerdicts, collection: owning(eliVerdicts) }, occasion: { players: 2 } },
    mustNotAppear: ["everdell", "earth", "shallow-sea"],
    topFiveIncludesOneOf: ["spirit-island", "paleo", "sky-team", "slay-the-spire-the-board-game"],
    explanationMentionsOneOf: [tag("cooperative")],
  },
  {
    name: "Fin, the solo player",
    request: { member: { verdicts: finVerdicts, collection: owning(finVerdicts) }, occasion: { players: 1 } },
    mustNotAppear: ["exploding-kittens", "cards-against-humanity", "decrypto"],
    mustNotAppearWithTag: ["party"],
    topFiveIncludesOneOf: ["floriferous", "endeavor-deep-sea", "conservas"],
    explanationMentionsOneOf: [{ kind: "best-player-count", players: 1 }],
  },
  {
    name: "Gus, who loves confrontation",
    request: { member: { verdicts: gusVerdicts, collection: owning(gusVerdicts) }, occasion: { players: 4 } },
    mustNotAppear: ["a-feast-for-odin", "hadrians-wall", "daydream"],
    topFiveIncludesOneOf: ["gunsen-the-battle-for-toshi-ranbo", "inis", "ankh-gods-of-egypt"],
    explanationMentionsOneOf: [tag("confrontational")],
  },
];
