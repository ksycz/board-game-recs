# Catalogue seed list

> **Status: REVIEWED** with the Admin on 2026-10-19. Next step: Claude drafts a Catalogue entry for each Game (Player Range, Best Player Count, play time, minimum age, Complexity, Setup Effort, Table Space, Tags) as data files, reviewed in a separate pull request.

The Catalogue starts with **164 Games**, the full size the spec planned (~150). They come from:

- the Collections of the people who will use the app first,
- the Gateway Games below,
- every Game named by the reference Members (`docs/testing/reference-members.md`) and by the Admin's self-test.

**This list deliberately does not say who owns which Game.** Members' Collections are personal data and are never committed to this public repository (see `docs/spec.md`, Test data). Expansions are not Games and are left out.

The BGG ID column is the optional BGG ID field from ADR 0001, filled where it was already known. It is used only to match Games with BoardGameGeek later; no BGG data is copied into the Catalogue.

Notes on editions (one Game per edition unless rules or player count differ substantially):
- *Ticket to Ride* and *Ticket to Ride: Europe* are separate Games (different map rules).
- *The Crew: The Quest for Planet Nine* and *The Crew: Mission Deep Sea* are separate Games (different mission systems).
- *7 Wonders* and *7 Wonders Duel* are separate Games (different rules and player counts).

## Gateway Games (16)

Well-known Games for the newcomer grid in the Interview. A newcomer is likely to have played several of them, and they cover a range of Tastes. Monopoly and Uno are included on purpose: nearly everyone has a Verdict on them, and "I hated Monopoly" teaches the app a lot.

| Game | Why it's in the grid |
|---|---|
| Monopoly | Universal reference point; `player-elimination`, `luck-heavy` |
| Uno | Universal reference point; `chaotic`, `quick-turns` |
| Catan | The classic modern gateway; `negotiation`, `luck-heavy` |
| Ticket to Ride | `route-building`, `indirect`, easy rules |
| Carcassonne | `tile-laying`, gentle competition |
| Codenames | `word-guessing`, `team-based` party game |
| Dixit | `funny`, creative, social |
| Azul | `puzzly`, `abstract`, short |
| Splendor | `engine-building` in its simplest form |
| Pandemic | the best-known `cooperative` game |
| Sushi Go! | `drafting`, very light |
| King of Tokyo | `confrontational`, dice, `chaotic` |
| Dobble (Spot It!) | `real-time`, family classic |
| Exploding Kittens | `chaotic`, `funny`, `player-elimination` |
| Kingdomino | `tile-laying`, very quick |
| Wingspan | `relaxing`, `engine-building`, `nature`; often someone's first "bigger" game |

## All Games (164)

| Game | BGG ID |
|---|---|
| 7 Wonders |  |
| 7 Wonders Duel |  |
| The A.R.T. Project | 378356 |
| Aerion | 267127 |
| Agricola |  |
| Air, Land, & Sea | 247367 |
| Air, Land, & Sea: Spies, Lies, & Supplies | 358981 |
| Ankh: Gods of Egypt | 285967 |
| Apiary | 400314 |
| Arcs | 359871 |
| Ark Nova | 342942 |
| Azul | 230802 |
| Barbecubes | 393114 |
| Bears vs Babies | 211534 |
| Beast | 281549 |
| Beasty Bar | 165950 |
| Beer & Bread | 369880 |
| Bios: Mesofauna | 318450 |
| Birdwatcher | 342343 |
| Blitzkrieg!: World War Two in 20 Minutes | 258210 |
| Blood Rage |  |
| Brass: Birmingham | 224517 |
| Calico |  |
| Can't Stop |  |
| Caper: Europe | 328565 |
| Carcassonne |  |
| Cards Against Humanity |  |
| Cartographers |  |
| Cartographers Heroes | 315767 |
| Cascadia |  |
| The Castles of Burgundy | 271320 |
| Catan |  |
| Codenames |  |
| Coffee Rush | 377061 |
| Coloretto | 5782 |
| Conservas | 402024 |
| Cosmic Encounter |  |
| The Crew: Mission Deep Sea | 324856 |
| The Crew: The Quest for Planet Nine |  |
| Cthulhu: Death May Die | 253344 |
| Cyberion | 376893 |
| Daydream | 433283 |
| Decrypto |  |
| Dinosaur Island: Rawr 'n Write | 318009 |
| Dixit | 39856 |
| Dobble |  |
| Dominion |  |
| Dorfromantik: Light Luggage | 449931 |
| Dune: Imperium | 316554 |
| Earth |  |
| Endeavor: Deep Sea |  |
| Evacuation | 382843 |
| Everdell | 199792 |
| Exploding Kittens | 172225 |
| A Feast for Odin |  |
| Final Girl | 277659 |
| Fit to Print | 352574 |
| Flip 7 |  |
| Fliptown | 352418 |
| Floriferous | 322622 |
| Food Chain Island | 309110 |
| For Sale | 172 |
| Forest Shuffle | 391163 |
| Fromage | 384213 |
| General Orders: World War II | 381435 |
| Gloomhaven |  |
| Gloomhaven: Jaws of the Lion | 291457 |
| Gunsen: The Battle for Toshi Ranbo |  |
| Hadrian's Wall |  |
| Hanabi |  |
| Hanamikoji | 158600 |
| Harmonies | 414317 |
| Harrow County: The Game of Gothic Conflict | 360899 |
| Heat: Pedal to the Metal | 366013 |
| Hive Pocket | 154597 |
| The Hobbit: There & Back Again | 436215 |
| Honey Buzz | 284742 |
| Hot Streak | 446497 |
| The Hunt | 376223 |
| Inis |  |
| Ironwood | 407343 |
| Jaipur | 54043 |
| Just One | 254640 |
| King of Tokyo |  |
| Kingdomino |  |
| Kites | 348096 |
| Kluster | 277458 |
| Knarr | 379629 |
| Koi | 436161 |
| Kutná Hora: The City of Silver | 385610 |
| Land vs Sea | 336929 |
| Leaf | 368676 |
| Let's Go! To Japan | 368173 |
| Lost Cities |  |
| Meadow | 314491 |
| Mindbug: First Contact | 345584 |
| Mini Rogue | 311715 |
| Monopoly |  |
| Moon Colony Bloodbath | 425549 |
| Mysterium |  |
| Nebula | 374982 |
| Nekojima | 359029 |
| Next Station: London | 353545 |
| Night at the Zoo | 457412 |
| Nova Luna |  |
| Numbsters | 374541 |
| The Old King's Crown | 357873 |
| Orchard: 9 card solitaire game | 245487 |
| Paleo |  |
| Pandemic |  |
| Parks | 266524 |
| Patchwork |  |
| Planet Unknown | 258779 |
| Project L | 260180 |
| The Quacks of Quedlinburg |  |
| Ra |  |
| Radlands | 329082 |
| Rebirth | 417197 |
| The Red Cathedral | 227224 |
| Resist! | 352697 |
| The Resistance |  |
| Root |  |
| ROVE: Results-Oriented Versatile Explorer | 342562 |
| Sagrada | 199561 |
| SCOUT | 291453 |
| Scythe | 169786 |
| Sea Salt & Paper | 367220 |
| Secret Hitler |  |
| Shallow Sea |  |
| Skull | 92415 |
| Skulls of Sedlec | 303553 |
| Sky Team | 373106 |
| Slay the Spire: The Board Game |  |
| So Clover! |  |
| Spicy | 299169 |
| Spirit Island | 162886 |
| Splendor |  |
| Spots | 372559 |
| Sprawlopolis | 251658 |
| Sushi Go! | 133473 |
| Tedoku | 451305 |
| Telestrations |  |
| Terraforming Mars |  |
| Three Sisters | 291845 |
| Throw Throw Burrito | 274533 |
| Ticket to Ride |  |
| Ticket to Ride: Europe | 14996 |
| Trekking Through History | 353288 |
| Trio | 352515 |
| Tussie Mussie | 257614 |
| Twilight Imperium |  |
| Twilight Struggle |  |
| Undaunted: North Africa | 290359 |
| Under Falling Skies | 306735 |
| Uno |  |
| The Vale of Eternity | 385529 |
| Watergate | 274364 |
| Welcome to the Moon | 339789 |
| Welcome To... | 233867 |
| Whirly Derby | 449137 |
| Whispering Woods | 411402 |
| The White Castle Duel | 438936 |
| Windmill Valley | 403441 |
| Wingspan | 266192 |
