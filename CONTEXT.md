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

**Gateway Game**:
A well-known, easy-to-learn Game used in the Interview to probe a newcomer's Taste ("played it? liked it?").
_Avoid_: starter game, intro game
