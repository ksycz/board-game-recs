# Reference Members: draft for Admin review

> **Status: DRAFT.** Claude proposed the Members and their Tastes. **The expected outcomes are yours to write:** they define what a "good" Recommendation is, so they must come from your judgement as a board gamer, not from the code's author. Fill in or change every _Expected_ section in review.

Reference Members are invented people with hand-written Tastes. Each one becomes an automated quality test. When Fit changes, the suite shows which Members got better or worse Recommendations. They are deliberately varied, so that tuning Fit for one kind of player can't silently ruin it for another.

All names are invented. No real Member's data goes into this public repository.

## How to write expected outcomes

For each Member, use three kinds of expectations, from strictest to loosest:

- **Must not appear:** Games that would be an obviously bad Recommendation. These are the strongest checks; a single failure means something is broken.
- **Should be in the top 5:** Games a knowledgeable friend would definitely suggest. Name 1–3 per Member, not more. If you list five, you're writing the ranking yourself and the test becomes brittle.
- **Explanation should mention:** a Tag or Similarity the Explanation ought to give as the reason.

Only use Games from the seed list (`docs/catalogue/seed-list.md`).

---

## 1. Alex: calm puzzler

- **Usual Group Size:** 2
- **Loves:**
  - **Cascadia**: "Relaxing, nobody can wreck my plans, and I love making the patterns fit."
  - **Azul**: "A satisfying little puzzle every turn."
  - **Patchwork**: "Perfect for two, quiet and clever."
- **Dislikes:**
  - **Exploding Kittens**: "Pure chaos, I have no control."
  - **Root**: "Too much fighting, and I hate being attacked."

_Expected (Admin, 2026-10-19):_
- Must not appear: Blood Rage, Secret Hitler
- Should be in the top 5: at least one of Harmonies, Nova Luna, Nebula
- Explanation should mention: plays well at 2 (Best Player Count), `relaxing`, `puzzly`

## 2. Bea: party host

- **Usual Group Size:** 5+
- **Loves:**
  - **Codenames**: "Everyone's talking and laughing at once."
  - **Dixit**: "Creative and funny, and anyone can play."
  - **Just One**: "Quick, and we always end up laughing."
- **Dislikes:**
  - **Terraforming Mars**: "Everyone stares at their own board for three hours."

_Expected (Admin, 2026-10-19):_
- Must not appear: Wingspan, Ark Nova, Forest Shuffle (long, multiplayer-solitaire)
- Should be in the top 5: at least one of So Clover!, Skull, Trio
- Explanation should mention: short (`filler`), `party`, `funny`, `revealing` (people learn about each other)

## 3. Cyril: heavy strategist

- **Usual Group Size:** 3–4
- **Loves:**
  - **Brass: Birmingham**: "Deep planning, almost no luck, and every decision matters."
  - **Agricola**: "Tight, and you feel your plan come together over the whole game."
- **Dislikes:**
  - **Catan**: "The dice decide too much."
  - **Ticket to Ride**: "Too simple, I'm bored by turn ten."

_Expected (Admin, 2026-10-19):_
- Must not appear: Can't Stop, Flip 7 (lots of push-your-luck), Ra (`auction`)
- Should be in the top 5: at least one of Ark Nova, Scythe, Dune: Imperium
- Explanation should mention: long, `strategic`

## 4. Dana: newcomer (takes the Gateway grid)

- **Usual Group Size:** 3–4
- **Loves:**
  - **Uno**: no Reason.
- **Dislikes:**
  - **Monopoly**: "It takes forever and you're out early with nothing to do."
- **Gateway grid** (Dana named fewer than 2 loved Games):
  - Dobble: love
  - Codenames: fine
  - Catan: dislike ("too many rules")
- **Mood answers:**
  - talking and laughing
  - luck is fine
  - competitive
  - short
- **Complexity cap:** on (≤ 2.5)

_Expected (Admin, 2026-10-19):_
- Must not appear: Twilight Struggle (long `wargame`)
- Should be in the top 5: at least one of Trio, Spicy, Sushi Go!
- Explanation should mention: short (`filler`), `newcomer-friendly` / easy to learn
- Note: Azul was considered and dropped. Dana's mood answer ("talking and laughing") should outweigh "easy and short" for a quiet puzzle game.

## 5. Eli: cooperative couple

- **Usual Group Size:** 2
- **Loves:**
  - **Pandemic**: "We win or lose together, no arguments."
  - **The Crew**: "Tense teamwork, and it's brilliant with two."
  - **Hanabi**: no Reason.
- **Dislikes:**
  - **Skull**: "Lying to each other isn't fun for us."

_Expected (Admin, 2026-10-19):_
- Must not appear: Everdell, Earth, Shallow Sea (`multiplayer-solitaire`)
- Should be in the top 5: at least one of Spirit Island, Paleo, Sky Team, Slay the Spire: The Board Game
- Explanation should mention: `cooperative`

## 6. Fin: solo player

- **Usual Group Size:** solo
- **Loves:**
  - **Spirit Island**: "A big puzzle with lots to plan, great on my own."
  - **Wingspan**: "Calm engine-building, and the solo mode is great."
- **Dislikes:**
  - **Codenames**: "Needs a crowd."

_Expected:_
- Must not appear: …
- Should be in the top 5: …
- Explanation should mention: …

## 7. Gus: loves confrontation

- **Usual Group Size:** 3–4
- **Loves:**
  - **King of Tokyo**: "Smashing my friends with monsters!"
  - **Root**: "Every game is a war story."
  - **Cosmic Encounter**: "Deals, betrayals, wild powers."
- **Dislikes:**
  - **Wingspan**: "Nobody interacts. Might as well play alone."

_Expected:_
- Must not appear: …
- Should be in the top 5: …
- Explanation should mention: …

---

## Edge cases these Members cover

| Member | What they test |
|---|---|
| Alex | Strong dislike Tags (`chaotic`, `confrontational`) push away Games that otherwise look similar |
| Bea | Usual Group Size of 5+ removes most Games through the Player Range Hard Constraint |
| Cyril | Dislike of `luck-heavy` outweighs a shared mechanic (`set-collection`) |
| Dana | The Gateway grid path, the Complexity cap, and a love with no Reason |
| Eli | Best Player Count at 2; `cooperative` as the dominant Tag |
| Fin | Solo: Player Range must include 1 |
| Gus | The opposite Taste to Alex, so the same Catalogue must rank very differently |

**Possible additions:** a Member with many Verdicts (15+) to check that Fit stays sensible with lots of data, and a Member whose loved Games contradict each other.
