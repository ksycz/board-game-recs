# Board game recommendations

An app that recommends board games to a person, either to buy next or to play from what they already own.

## Language

**Buy mode**:
Recommending games the person does not own yet, driven mainly by their taste.
_Avoid_: discover, shopping, "what to buy next"

**Play mode**:
Recommending a game from the person's own collection for a specific session, driven mainly by that session's situation (players, time, energy).
_Avoid_: "play tonight", session picker

**Collection**:
The set of games a person owns; the candidate pool for Play mode and the exclusion list for Buy mode.
_Avoid_: shelf, library, owned games

**Catalogue**:
The set of games the app knows about, curated and owned by us; every recommendation and every Collection entry refers to a Game in it.
_Avoid_: database, game list

**Game**:
One entry in the Catalogue: a published base game with its facts (players, play time, minimum age) and our own descriptions (Complexity, tags). Any genre counts (card, party, children's, abstract, wargame); expansions are not Games; editions share one Game unless rules or player count differ substantially.
_Avoid_: title, item, product

**Player Range**:
The player counts a Game supports according to its box, e.g. 1–4. Solo means a Player Range that includes 1.
_Avoid_: player count (ambiguous)

**Best Player Count**:
The counts within the Player Range at which a Game actually plays well, e.g. 2–3. Recommendations prefer it; other counts in the range come with a warning.
_Avoid_: recommended players, sweet spot

**Setup Effort**:
How much work it takes to get a Game ready to play: quick (open and play, under ~5 min), medium, or long (sorting, many decks, board building). Our own rough judgement.
_Avoid_: setup time

**Table Space**:
How much table a Game needs when laid out: small, medium or large.
_Avoid_: footprint, size

**Complexity**:
How hard a Game is to learn and play, on our own 1–5 scale.
_Avoid_: weight, difficulty

## People

**Member**:
A person who can sign in to the app (by an emailed sign-in link) and has their own Collection and taste. While the app is personal, only Invited emails can become Members.
_Avoid_: user, account, customer

**Invite**:
An email address the Admin has allowed to sign in. Invites exist only while the app is personal.
_Avoid_: whitelist, allow-list

**Admin**:
The Member who manages Invites and reviews Games that Members add to the Catalogue.
_Avoid_: owner, moderator, superuser

**Player**:
Anyone sitting at the table for a game, whether or not they are a Member.
_Avoid_: participant, guest

## Taste

**Interview**:
The questions a new Member answers so the app can learn their Taste. It adapts: Members who can name enough Games they love and dislike skip the Gateway grid and mood questions.
_Avoid_: onboarding, quiz, survey

**Taste**:
What a Member likes and dislikes in games, as learned from the Interview and later ratings. Belongs to one Member.
_Avoid_: profile, preferences

**Constraint**:
A limit on which Games may be recommended for this occasion (player count, play time, Complexity, Setup Effort, youngest Player's age). Unlike Taste, Constraints describe the occasion, not the person. Each is either a Hard Constraint or a Soft Constraint.
_Avoid_: filter (that's the UI control), preference

**Hard Constraint**:
A Constraint that is never relaxed: the Player Range must include the number of Players, and the Game's minimum age must not exceed the youngest Player's.
_Avoid_: strict filter

**Soft Constraint**:
A Constraint that may be Relaxed when nothing else passes: play time, Best Player Count, Complexity, Setup Effort, and dislikes at the Table.
_Avoid_: preference, weak filter

**Relaxation**:
Letting a Game through despite breaking a Soft Constraint, always shown on the Recommendation ("runs ~10 min over", "Petra isn't a fan").
_Avoid_: fallback, fuzzy match

**Usual Group Size**:
The group size a Member says they usually play with, asked once in the Interview and used as the default player-count Constraint.
_Avoid_: default players

**Gateway Game**:
A well-known, easy-to-learn Game used in the Interview to probe a newcomer's Taste ("played it? liked it?").
_Avoid_: starter game, intro game

**Tag**:
A named trait from our fixed vocabulary (feel, interaction, mechanic, theme…) that describes a Game or a Reason. The only language the recommender understands.
_Avoid_: label, keyword, feature

**Reason**:
A Member's own explanation of why they love or dislike a particular Game: optional free text plus the Tags derived from it, which the Member can edit.
_Avoid_: comment, review, note

## Recommending

**Fit**:
How well a Game matches one Member's Taste: agreement with the Tags of their loved Reasons, disagreement with their disliked ones, and similarity to the Games they love.
_Avoid_: score, match, relevance

**Similarity**:
How alike two Games are, judged by their Tags, Complexity and Best Player Count.
_Avoid_: distance, closeness

**Recommendation**:
A Game the app suggests to a Member, together with the Explanation of why. A Game must satisfy every Hard Constraint; it may break a Soft Constraint only through a visible Relaxation.
_Avoid_: suggestion, result, pick

**Explanation**:
The human-readable reason shown with a Recommendation, built from the Tags and Similarities that produced its Fit (e.g. "like Cascadia: calm, tile-laying, best at 2").
_Avoid_: rationale, why-text

**Table**:
The Players taking part in one Play-mode request: the Member asking, any other Members they select, and a count of Players who are not Members.
_Avoid_: group, party, session

**Group Fit**:
How well a Game suits a whole Table: any Game that a Member at the Table dislikes is excluded (unless Relaxed); among the rest, the average of the Members' Fits.
_Avoid_: combined score, consensus
