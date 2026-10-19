# Tag Vocabulary: draft for Admin review

> **Status: DRAFT.** Cut, rename, merge or add Tags in review comments. Once approved, this becomes the data file the recommender and tests use, and only the Admin changes it from then on (see `CONTEXT.md` → Tag Vocabulary).

Each Tag has a short id (used in code and tests), a plain-English meaning (what Members see), and examples to make the meaning concrete. Examples are illustrations, not final Catalogue tagging.

**Rules for a good Tag:**
- Members can recognise it in their own words.
- It separates Games that people actually like or dislike for different reasons.
- It does not duplicate another Tag.

## Feel: what it's like to sit at the table (11)

| Id | Meaning | Examples |
|---|---|---|
| `relaxing` | Low stress; nobody minds a slow turn | Cascadia, Wingspan |
| `tense` | Every decision matters and the pressure builds | Pandemic, The Crew |
| `chaotic` | Lots happens that nobody fully controls | Exploding Kittens, King of Tokyo |
| `funny` | Laughter is a big part of the fun | Dixit, Telestrations |
| `dramatic` | Big swings and memorable moments | Cosmic Encounter, Root |
| `puzzly` | Working out the best move is the main joy | Azul, Calico |
| `luck-heavy` | Dice or card draws decide a lot | Catan, King of Tokyo |
| `strategic` | Long-term planning is rewarded; luck matters little | Brass: Birmingham, Terra Mystica |
| `tactical` | The best move depends on the situation right now; you adapt turn by turn | Calico, Hive |
| `beautiful` | Art and components are a big part of the appeal | Wingspan, Cascadia |
| `modern-design` | Clean, contemporary graphic design: clear icons and layout, easy to read at a glance | Cascadia, Azul |

## Interaction: how players affect each other (10)

| Id | Meaning | Examples |
|---|---|---|
| `multiplayer-solitaire` | Everyone mostly builds their own thing, with little effect on each other | Wingspan, Cascadia |
| `indirect` | You compete by taking what others want or blocking them | Ticket to Ride, Splendor |
| `confrontational` | You directly attack or harm other players | Root, Exploding Kittens |
| `cooperative` | Everyone wins or loses together | Pandemic, Spirit Island |
| `team-based` | Two teams play against each other | Codenames |
| `negotiation` | Deals and trades between players drive the game | Catan, Sidereal Confluence |
| `bluffing` | Hiding what you have or intend, and calling others' bluffs | Skull, Coup |
| `social-deduction` | Working out who is secretly on which side | The Resistance, Werewolf |
| `traitor` | One or more players may secretly be working against the group | Dead of Winter, Battlestar Galactica |
| `player-elimination` | Players can be knocked out before the game ends | Monopoly, Love Letter |

## Mechanics: what you actually do (19)

| Id | Meaning | Examples |
|---|---|---|
| `engine-building` | Early choices make later turns more powerful | Wingspan, Terraforming Mars |
| `tableau-building` | You build a personal display of cards in front of you whose effects work together | Wingspan, Everdell |
| `deck-building` | You improve your own deck of cards as you play | Dominion, Clank! |
| `worker-placement` | You place pieces to claim actions others then can't take | Agricola, Lords of Waterdeep |
| `tile-laying` | You place tiles to build a map or pattern | Carcassonne, Cascadia |
| `drafting` | You pick cards or tiles from a shared selection, then pass on the rest | Sushi Go!, 7 Wonders |
| `set-collection` | You score by gathering matching or complete sets | Ticket to Ride, Splendor |
| `area-control` | You fight for majority in regions of a map | El Grande, Inis |
| `roll-and-write` | You roll dice and mark choices on your own sheet | Cartographers, That's Pretty Clever! |
| `push-your-luck` | Keep going for more, or stop before you lose it all | Quacks of Quedlinburg, Can't Stop |
| `trick-taking` | Players each play a card and the best one wins the trick | The Crew, Cat in the Box |
| `hand-management` | Choosing when to play which card from your hand is the key skill | Lost Cities, Res Arcana |
| `route-building` | You connect places on a map | Ticket to Ride, Power Grid |
| `word-guessing` | Clues, words or pictures that others must guess | Codenames, Just One |
| `real-time` | Everyone plays at once, against a clock or each other | Magic Maze, Dobble |
| `dexterity` | Physical skill: flicking, stacking, balancing | Crokinole, Jenga |
| `hidden-movement` | One side moves secretly on the map; the others track them down from clues | Scotland Yard, Letters from Whitechapel |
| `abstract` | Little or no theme; the pieces, shapes and rules *are* the game | Azul, Hive |
| `campaign` | A story or progress carries over across several sessions | Gloomhaven, Pandemic Legacy |

## Theme: what the game is about (7)

| Id | Meaning | Examples |
|---|---|---|
| `nature` | Animals, plants, landscapes | Wingspan, Cascadia |
| `fantasy` | Magic, monsters, mythical worlds | Gloomhaven, Spirit Island |
| `sci-fi` | Space, future technology, aliens | Terraforming Mars, Cosmic Encounter |
| `historical` | Real periods and places | Brass: Birmingham, 7 Wonders |
| `horror` | Dark, creepy or scary settings | Arkham Horror, Mansions of Madness |
| `mystery` | Detective work and solving a case | Sherlock Holmes Consulting Detective, Mysterium |
| `economic` | Money, trade, markets, production | Power Grid, Brass: Birmingham |

## Pace: how the time feels (4)

| Id | Meaning | Examples |
|---|---|---|
| `quick-turns` | Turns are short; there's little waiting for others | Splendor, Sushi Go! |
| `downtime` | You may wait a while between your turns | Twilight Imperium, Terraforming Mars at 5 |
| `simultaneous` | Everyone takes their turn at the same time | 7 Wonders, Cartographers |
| `slow-burn` | The game builds up slowly and the payoff comes late | Brass: Birmingham, Agricola |

**Total: 51 Tags.** That's slightly above the ~40 in the spec. `solitary` was renamed `multiplayer-solitaire`, the term players actually use. Candidates to cut or merge if you want fewer: `dramatic` (overlaps `chaotic`), `traitor` (overlaps `social-deduction`), `dexterity`, `slow-burn` (overlaps `strategic`).

## Questions for review

1. ~~Should "luck-heavy" and "strategic" be two Tags, or one scale?~~ **Decided: two Tags.** A Game can be neither or both, and a Member can love both (e.g. push-your-luck *and* long planning).
2. ~~Where does player elimination belong?~~ **Decided: Interaction.** Grouping only affects how Tags are shown, not Fit.
3. **What's missing?** Think of a Reason you'd give for loving or hating a Game that none of these Tags could express.
