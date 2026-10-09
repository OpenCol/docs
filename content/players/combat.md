# How Combat Works

*A player's guide to Sid Meier's Colonization (Windows), based on the game's own code.*

The manual gives you a list of combat bonuses and leaves the rest to luck. This guide sets out what the game actually
computes when one unit attacks another: the strengths, every modifier, the dice roll, and what happens to the loser.
Several rules never appear on screen, and a few of them decide more battles than the visible ones.

Everything below was read out of the reconstructed game code. The source files are listed at the end.

---

## At a glance

| Rule | Effect |
|---|---|
| **Chance to win** | your strength ÷ (your strength + theirs). No minimum, no maximum. |
| Attack bonus | **+50%** for every attacker, always |
| Veteran Soldier / Veteran Dragoon | **+50%**, attacking and defending |
| Fortified (not ships) | **+50%**, but not on top of a bonus above +100% (Fort, Fortress, Mountains) |
| Colony | **+50%**; Stockade **+100%**, Fort **+150%**, Fortress **+200%** |
| Terrain (outside settlements) | Marsh/Swamp **+25%**, forests **+50%**, Rain forest **+75%**, Hills **+100%**, Mountains **+150%** |
| Ambush | Natives (always) and you (during the war) take the defender's terrain bonus for yourselves |
| Artillery in the open | **−75%** |
| Artillery in a colony against natives | **+100%** |
| A weak defender against a real soldier | **−50%**, hidden: defence 1 units are halved when the attacker's attack is 2 or more |
| Tired attacker | 2/3 or 1/3 strength with less than a full move left |
| A beaten soldier | Dragoons → Soldiers → Colonists. Artillery → Damaged Artillery → gone |
| A beaten colonist, wagon train or treasure | Captured by Europeans, killed by natives |
| A beaten ship | Damaged (back to a Drydock or Europe) or sunk; cargo and passengers lost either way |
| A beaten colony | Captured when no fighting unit is left. Natives never capture; they kill a colonist or burn a one-colonist colony |

---

## 1. How a fight is decided

Every attack in the game goes through one routine. It works out the attacker's strength **A** and the defender's
strength **D**, then rolls a number from 1 to A + D. If the roll is A or less, the attacker wins.

> **Chance the attacker wins = A ÷ (A + D)**

So an attack of 6 against a defence of 2 wins 75% of the time, and 2 against 6 still wins 25%. There is no cap at
either end. Only a strength of exactly zero makes the result certain.

A few things to know about the numbers:

- Strengths are kept in eighths of a point. Each bonus is rounded down to the nearest eighth as it is applied, so the
  real figure can be a fraction below the one you would work out by hand.
- Bonuses of different kinds **multiply**. Veteran, attack bonus and ambush each multiply the strength. The defence
  bonuses for terrain, colony buildings, villages and fortifying are first **added together**, then applied as one
  multiplier.
- An attack **ends the unit's turn**, win or lose. A Dragoon cannot attack twice in one turn.
- Ships have one more step before the dice, the evasion roll (see [section 8](#8-ships)).

---

## 2. Unit strengths

These come from the game's unit table. Moves are per turn.

| Unit | Attack | Defence | Moves |
|---|---|---|---|
| Free Colonist, Pioneer, Missionary | – | 1 | 1 (Missionary 2) |
| Scout | 1 | 1 | 4 |
| Soldier | 2 | 2 | 1 |
| Dragoon | 3 | 3 | 4 |
| Artillery | 7 | 5 | 1 |
| Damaged Artillery | 5 | 3 | 1 |
| Continental Army | 4 | 4 | 1 |
| Continental Cavalry | 5 | 5 | 4 |
| Regulars (the King's) | 5 | 5 | 1 |
| Cavalry (the King's) | 6 | 6 | 4 |
| Wagon Train | – | 1 | 2 |
| Treasure | – | 0 | 1 |
| Braves | 1 | 1 | 1 |
| Armed Braves | 2 | 2 | 1 |
| Mounted Braves | 2 | 2 | 4 |
| Mounted Warriors | 3 | 3 | 4 |
| Caravel | – | 2 | 4 |
| Merchantman | – | 6 | 5 |
| Galleon | – | 10 | 6 |
| Privateer | 8 | 8 | 8 |
| Frigate | 16 | 16 | 6 |
| Man-O-War | 24 | 24 | 5 |

Units marked "–" cannot attack at all ("That unit type cannot attack").

**Veterans.** A Soldier or Dragoon whose colonist is a Veteran Soldier gets **+50%** attacking and defending, so a Veteran
Soldier is 3/3 and a Veteran Dragoon 4.5/4.5. The bonus belongs to those two unit types only. Continental Army and
Continental Cavalry get nothing extra, whoever is inside them.

---

## 3. The attacker's modifiers

Applied to the attacker's strength, in this order:

| Modifier | Effect | Shown in Combat Analysis as |
|---|---|---|
| Veteran | +50% | Veteran |
| Francis Drake, privateers only | +50% | Drake |
| Cargo aboard a ship | −1/8 of a point per hold in use | Cargo |
| Ambush (below) | + the terrain bonus of the defender's square | Ambush |
| **Attack bonus** | **+50%**, every attack | Attack Bonus |
| Your difficulty bonus | +0.5 · +0.375 · +0.25 · +0.125 · 0, human players only | *not shown* |
| Tired | ×2/3 with 2/3 of a move left, ×1/3 with 1/3 left | Fatigue −33% / −66% |
| Artillery attacking outside a settlement | −75%, unless the defender is a fortified European | Artillery in the Open |
| Spain attacking a native **settlement** | +50% | Spanish bonus |
| War of Independence | see [section 9](#9-the-war-of-independence) | Bombard, Rebel/Tory sentiment |

**Tired units.** With less than a full move left, a computer unit simply cannot attack. You are asked first ("these
men are tired… they will fight at 2/3 strength") and can call it off.

**Ambush.** Normally the defender gets the terrain bonus of the square it stands on. Two kinds of attacker take it from
the defender instead:

- **Natives attacking any European unit in the open.** The braves get the forest or hill bonus, and your unit gets none.
- **You, during the War of Independence**, attacking any European unit in the open. Neither unit may be in a colony
  square. The in-game hint describes this one; the native version is not mentioned anywhere.

Everyone else (Europeans attacking each other before the war, the Royal army attacking you, anyone attacking natives)
leaves the terrain bonus with the defender.

> **Tip:** Don't park soldiers in the woods next to an angry tribe. In a forest, Mounted Braves attack a plain Soldier
> at 4.5 against 2, a 69% chance for them. Inside a colony, the forest bonus is gone and your colony bonus takes its place.

---

## 4. The defender's modifiers

### Terrain

Terrain counts only **outside** colonies and villages. Inside a settlement, the settlement's own bonus replaces it, so a
colony on a hill defends no better than one on the plains. Rivers and roads give no combat bonus.

| Terrain | Defence bonus |
|---|---|
| Tundra, Desert, Plains, Prairie, Grassland, Savannah, Arctic | none |
| Marsh, Swamp | +25% |
| Boreal, Scrub, Mixed, Broadleaf, Conifer, Tropical and Wetland forest | +50% |
| Rain forest | +75% |
| Hills | +100% |
| Mountains | +150% |

### Colonies

| Colony defences | Bonus | Fortified unit inside |
|---|---|---|
| None | +50% | +100% |
| Stockade | +100% | +150% |
| Fort | +150% | +150% |
| Fortress | +200% | +200% |

Fortifying adds +50% only while the other bonuses come to +100% or less. In a Stockade it lifts your soldiers to Fort
level. Behind a Fort or Fortress it adds nothing, and the same goes for Mountains in the open.

Your largest colony also gets a hidden flat bonus on every level but Viceroy. See
[difficulty](difficulty.md#6-combat).

### Fortifying

- **+50%** for any land unit, anywhere. Ships cannot fortify.
- The bonus counts only once the unit is *fortified*, not on the turn you give the order.

### Native settlements

| Settlement | Bonus |
|---|---|
| Camp or village (Sioux, Apache, Tupi, Arawak, Iroquois, Cherokee) | +50% |
| City (Aztec, Inca) | +100% |
| Capital | doubled: +100%, or +200% for an Aztec or Inca capital |

Braves who are fortified in their village add another +50%, under the same +100% limit.

### Artillery

- **In the open:** −75% unless the Artillery is fortified. When it is in a stack, the game picks it to defend only as
  a last resort.
- **In a colony, against natives:** +100%.
- **Plain Braves can never beat your Artillery.** Against a human player's Artillery the battle is lost automatically,
  whatever the dice say. That applies to unarmed, unmounted Braves only.

### The hidden halving

If the attacker's unit type has an attack of **2 or more** (Soldiers, Dragoons, Artillery, Armed or Mounted Braves and
up) and the defender's type has a defence **below 2**, the defender's whole strength is **halved**. Ships are not
affected. This catches Colonists, Pioneers, Scouts, Missionaries, Wagon Trains, plain Braves, and the colonist who
defends an empty colony. The Combat Analysis window never shows it.

> **Tip:** This is why Paul Revere matters so much. His armed colonist has defence 2 and escapes the halving. See
> [Founding Fathers](founding-fathers.md#military).

---

## 5. Who defends

- **In the open**, the unit with the best defence after all bonuses defends the whole square.
- **In a colony**, only units that can attack are allowed to defend: Soldiers, Dragoons, Scouts, Artillery, Continentals.
  Colonists, Pioneers, Wagon Trains and ships in port never defend.
- **A colony with no such unit** still fights. A random colonist from the colony's workforce defends at strength 1, or
  2 with Paul Revere and 50 muskets in store. The colony bonus applies, and so does the halving above.
- **A native village with no braves on its square** is defended by a stand-in: Braves, Armed Braves if the tribe has
  muskets, Mounted Braves if it has 25 or more horses, Mounted Warriors if it has both.

When a land defender loses, **only that unit** suffers. The rest of the stack is untouched. At sea it is different
(section 8).

A winning land attacker stays where it was. It moves in only when it has captured a colony.

---

## 6. What happens to the loser

The same rules apply whether the loser was attacking or defending.

| Loser | Result |
|---|---|
| Dragoons | demoted to **Soldiers** (horses lost) |
| Soldiers | demoted to **Colonists** (muskets lost) |
| Continental Cavalry | demoted to **Continental Army** |
| Continental Army | demoted straight to **Colonists** |
| Cavalry (King's) | demoted to **Regulars** |
| Regulars | destroyed |
| Artillery | becomes **Damaged Artillery** (5/3). This damage is never repaired. |
| Damaged Artillery | destroyed |
| Colonist, Wagon Train, Treasure | **captured** by a European winner, with any cargo; **killed** by natives |
| Scout, Pioneer, Missionary | destroyed |
| Any native unit | destroyed; half the time the tribe keeps its muskets and horses |
| Ships | damaged or sunk (section 8) |

- A demoted unit **keeps its colonist**, so a beaten Veteran Dragoon becomes a Veteran Soldier, then a veteran colonist
  who can take up muskets again.
- A captured veteran colonist is the exception: he loses his veteran status ("Soldiers lose Veteran status").

---

## 7. Colonies and natives

### Taking a colony

1. Beat every fighting unit in the colony. Each win demotes or damages one defender.
2. Then the colony's own colonist defends, as described in section 5.
3. Beat him and the colony is yours:
   - colonist units, Wagon Trains and Treasure on the square are captured, and Pioneers and Missionaries are destroyed;
   - **ships in port are damaged** and sent off for repair;
   - liberty bells drop to two thirds;
   - the unoccupied land around it passes to you;
   - before the War of Independence you also **plunder gold**: the loser's treasury × this colony's colonists ÷ all their colonists.

Europeans never burn a colony. Capture is the only outcome.

### Natives attacking your colonies

- **If the natives win**, the defending soldier is demoted, or one colonist is killed ("…dies fending off onslaught").
  A colony of one colonist with no defender is **burned to the ground**. The winning braves then leave.
- **If the natives lose**, the brave dies, but the **raid can still get through**: stolen goods, a burned building, a
  damaged ship in port, or stolen gold. The chances depend on your stockade and the difficulty
  ([raid table](difficulty.md#raids-on-your-colonies)).
- **Natives can never win an attack on a nation's only colony**, on any level. They can still raid it.
- After a successful attack, the tribe's alarm towards you goes *down*. They have had their revenge.

### Braves seize horses and muskets

A Brave or Armed Brave that beats a **Dragoon or Scout** in the field becomes mounted, and the tribe gains horses. A Brave
or Mounted Brave that beats a **Soldier** gains muskets. The message reads "Muskets (Horses) seized by … braves!".

### Attacking villages

Attacking natives raises the whole tribe's alarm, more for a village and much more for a capital
([alarm table](difficulty.md#making-them-angry)). You are asked to confirm, unless they are already
at war with you, and asked again whenever the tribe has calmed down a little since.

When braves are standing in the village, you fight them and the village is not harmed. When the village is empty, each
win against its stand-in defender **shrinks it by one**. It is burned once its last point is gone, so the number of
wins needed is:

| Settlement | Wins to burn | Capital |
|---|---|---|
| Camp (Sioux, Apache, Tupi) | 3 | 4 |
| Village (Arawak, Iroquois, Cherokee) | 5 | 7 |
| Aztec city | 7 | 10 |
| Inca city | 9 | 13 |

These are the full sizes. A capital starts at the ordinary size and reaches its capital size in its first 7–9 turns.
A damaged village grows back towards them over time.

**When a village burns:**

- **Treasure** may appear: rarely and small from camps and villages, always and large from cities. With Hernan Cortes
  it is guaranteed and bigger. The full table is under Cortes in [Founding Fathers](founding-fathers.md#military).
- If **your** mission was there, the missionary walks out alive. If the mission was another nation's, it is lost.
- Each burned village costs score points ([difficulty](difficulty.md#9-score-and-the-hall-of-fame)).
- **Burning a capital** makes the tribe submit ("The … tribe bows before the might of …"). Its alarm drops to 15,
  which also caps its villages' grudges against you. (The game means to clear them outright, but a bug clears another
  tribe's instead; see [How the Native Americans Work](natives.md#destroying-the-capital).)

**Converts:** beating a village's stand-in defender can produce a convert, but only if your own mission is in that
village. Juan de Sepulveda, Bartolome de las Casas, an expert mission and playing Spain all change the chance. See
[Founding Fathers](founding-fathers.md#religious).

> **Tip:** Spain's +50% against natives counts **only when attacking a settlement**. Against braves in the open,
> Spanish conquistadors fight like anyone else.

---

## 8. Ships

### Who can fight at sea

- Only **Privateers, Frigates and Men-O-War** can attack, and only ships at sea. Ships cannot attack land units or
  colonies, and land units cannot attack ships.
- A ship in port can be harmed only when the colony falls, or by a native raid.
- **Cargo slows and weakens a ship.** Each hold in use costs 1/8 of a combat point (small) and 4 points of evasion speed
  (large).

### Evasion

When the attacking ship's type has a **higher attack rating** than the defender's, the defender first tries to slip
away. Each ship gets a speed figure:

> speed = 3 × moves + 3, **doubled for a Privateer**, +3 for a Galleon, −4 for each hold in use (minimum 1).
> Ferdinand Magellan adds 3.

The defender escapes with chance *its speed ÷ (both speeds added)*. If it escapes, nothing happens to either ship.

| Escape chance (both empty) | vs Privateer | vs Frigate | vs Man-O-War |
|---|---|---|---|
| Caravel | 22% | 42% | 45% |
| Merchantman | 25% | 46% | 50% |
| Galleon | 31% | 53% | 57% |
| Privateer | – | 72% | 75% |
| Frigate | – | – | 54% |

A fully loaded Merchantman (4 holds) has speed 2 and almost never escapes: 4% against a Privateer.

### Damaged or sunk

The winner first takes the loser's cargo, as much as it has room for. You choose which goods if you are the winner.
Then the losing ship is either damaged or sunk. The basic roll compares the winner's guns with the loser's hull:

> **Chance of sinking = winner's guns ÷ (winner's guns + loser's hull)**

| Loser \ Winner | Privateer or Galleon (guns 4) | Frigate (12) | Man-O-War (32) |
|---|---|---|---|
| Caravel (hull 4) | 50% | 75% | 89% |
| Merchantman (8) | 33% | 60% | 80% |
| Galleon (20) | 17% | 38% | 62% |
| Privateer (12) | 25% | 50% | 73% |
| Frigate (32) | 11% | 27% | 50% |
| Man-O-War (64) | 6% | 16% | 33% |

A Merchantman that wins while defending has 1 gun. A land winner (a fortress, or a captured colony) has none, so its
victims are always only damaged.

**Then the game overrides the roll**, for every nation alike:

- **Warships**, before the War of Independence:
  - **always damaged** if it is your *only* ship of that type and you have a colony;
  - otherwise **always sunk** if you have more ships of that type than colonies, or more than eight warships;
  - a Frigate beaten by a Frigate also **always sinks** if the winner's nation has fewer Frigates than yours.
- **Caravels, Merchantmen and Galleons:**
  - **always sunk** if you have more than eight unarmed ships, and a Caravel from about 1572 on;
  - but **always damaged** if losing it would leave you too little cargo space. "Too little" is a quarter of your
    colonist count, at least 3 holds and at most 6.
- The King's **last** Man-O-War is always only damaged.

> **Tip:** A small navy is protected. Your first Frigate or Privateer cannot be sunk outside the war. Build a second
> and either one can go down.

### Repairs

A damaged ship **loses all its cargo and every unit aboard**. It is moved straight to your nearest colony with a
**Drydock**, not counting the colony it was in, or to Europe if you have none.

- During the War of Independence Europe is closed to you. A damaged ship with no Drydock to go to is **lost**.
- Repair work equals the smaller of the ship's own defence and the winner's defence. A land winner counts double, and
  the work never exceeds 12 for a Frigate or 16 for a Man-O-War.
- A Drydock repairs 2 points a turn and Europe 1.

| Repair at a Drydock (Europe takes twice as long) | Beaten by a Privateer | by a Frigate | by a Man-O-War |
|---|---|---|---|
| Caravel | 1 turn | 1 | 1 |
| Merchantman | 3 turns | 3 | 3 |
| Galleon | 4 turns | 5 | 5 |
| Privateer | 4 turns | 4 | 4 |
| Frigate | 4 turns | 6 | 6 |
| Man-O-War | 4 turns | 8 | 8 |

### A whole square shares the loss

When the defending ship loses, **every ship in that sea square** is dealt with in turn. The winner takes cargo from each,
and each one is damaged or sunk by its own roll. When an attacking ship loses, only it and its passengers suffer. A
winning warship sails into the square it attacked.

### Privateers

- Attacking with a Privateer does not break a peace treaty. The victim usually does not learn who did it; the chance
  that they work it out is about 1% to 5%, rising with difficulty.
- Attacking a Privateer changes no relations at all.
- Forts fire on Privateers even from nations you are at peace with.

### Forts fire on ships

At the start of each turn, a colony with a **Fort** or **Fortress** fires at the first foreign ship in each neighbouring
sea square. Ships of nations you have a peace treaty with are spared, except Privateers.

| | Fort | Fortress |
|---|---|---|
| Gun strength | 4 | 8 |
| Each Artillery in the colony adds | +4 | +8 |

The fort attacks like a unit with that strength, attack bonus included, and the target cannot evade. If the fort wins,
the ship is damaged or sunk, with the gun strength as the "guns" in the table above. If the fort loses, nothing happens.

---

## 9. The War of Independence

| Who | When | Bonus |
|---|---|---|
| Royal army | attacking a colony | **+50%** ("Bombard") |
| Royal army | attacking a colony | **+ the colony's Tory percentage** |
| Royal army | attacking on land outside colonies | +0% · +5% · +10% · +15% · +20% by difficulty |
| You | attacking a colony (retaking one) | **+ that colony's rebel percentage** |
| You | attacking any European unit in the open, neither unit in a colony | **ambush**: the terrain bonus is yours |
| Everyone European | attacking a colony, once the foreign intervention has arrived | **+50% Bombard**, you included |

- The Royal army gets **no** ambush bonus. Your units in the field keep their terrain bonus against it.
- A colony at 100% Sons of Liberty gives the King's troops no sentiment bonus. One at 0% gives them +100%. Simon Bolivar's
  +20% counts here.
- Capturing a colony during the war plunders no gold. The first time you retake one, the game reminds you what you need
  for victory.
- Veteran Soldiers and Dragoons that win can now become **Continental Army** and **Continental Cavalry**
  (section 10).
- Royal Cavalry beaten in battle becomes Regulars, and beaten Regulars are destroyed.

> **Tip:** Fight the Royal army in the open from hills or mountains, and attack it rather than waiting for it. Your
> Continental Army attacking Regulars on hills gets the hills' +100% as well as the +50% attack bonus.

---

## 10. Promotions

Only **Soldiers and Dragoons** can be promoted, after any win, attacking or defending. The chance is roughly **the
chance you had of losing that fight**. A narrow win promotes far more often than an easy one.

- Each promotion is one step: Petty Criminal → Indentured Servant → Free Colonist → **Veteran Soldier**.
- Petty Criminals are promoted a little more readily than the others, and Indentured Servants slightly more.
- Experts (an armed Expert Farmer, say) are never promoted.
- Difficulty barely matters. On harder levels your own chance is fractionally lower, the AI's fractionally higher.
- A Veteran is promoted again only during the War of Independence, once your Continental Army has formed. He becomes
  Continental Army or Continental Cavalry. This happens only for you, never for the AI.
- **George Washington** makes every eligible promotion certain. See [Founding Fathers](founding-fathers.md#military).

---

## 11. The Combat Analysis window

Switch on **Combat Analysis** under Game Options. Whenever you are involved in a fight, a window then lists each side's
strength and the modifiers that went into it. It shows **no odds**. You have to work them out yourself, as
A ÷ (A + D).

It does **not** list:

- the hidden halving of weak defenders;
- the difficulty bonus, the main-colony bonus and the easy-level reductions;
- the Royal army's field bonus.

Its cargo line is also wrong (see Curiosities). With the cheat menu enabled, the window also shows the raw attack and
defence totals and the die roll.

---

## 12. Worked examples

All figures are in the game's units. Difficulty bonuses are left out unless mentioned; they shift the odds by a point
or two.

**Veteran Dragoon attacks a fortified Soldier in a Stockade colony on hills.**
Attack: 3, ×1.5 veteran = 4.5, ×1.5 attack bonus = **6.75**.
Defence: 2, with +50% colony, +50% stockade and +50% fortified = +150%, gives **5**. The hills count for nothing inside a colony.
Chance: 6.75 ÷ 11.75 = **57%**. If the Soldier were a veteran: 7.5 against 6.75, and the attacker drops to 47%.

**Soldier attacks Braves standing on hills.**
Attack: 2 × 1.5 = **3**. Defence: 1, +100% for the hills = 2, **halved** because a soldier is attacking = **1**.
Chance: **75%** (82% for a Veteran Soldier).

**Mounted Braves ambush your Soldier in a conifer forest.**
Attack: 2, +50% forest ambush = 3, ×1.5 attack bonus = **4.5**. Defence: **2**, with no forest bonus.
Chance for the braves: **69%**. Fortified, your Soldier defends at 3 and their chance falls to 60%.

**Dragoon attacks a colony with nobody to defend it.**
Attack: 3 × 1.5 = **4.5**. Defence: a colonist at 1, +50% colony = 1.5, halved = **0.75**. The colony falls **86%** of
the time. With a Stockade it is 82%. With Paul Revere and 50 muskets (defence 2, not halved), it is 60% with no
stockade, 53% with one and 43% behind a Fortress.

**Veteran Dragoon attacks an empty Inca capital whose tribe has muskets and horses.**
Defence: Mounted Warriors 3, +200% capital city = **9**. Attack: **6.75**. Chance: **43%**, or 53% for Spain.
It takes 13 such wins to burn the city.

**Continental Army ambushes Regulars on hills, during the war.**
Attack: 4, +100% hills ambush = 8, ×1.5 = **12**. Defence: Regulars **5** (not fortified). Chance: **71%**.
The other way round, Regulars attacking your Continentals on the same hills on Conquistador: 5 × 1.5 × 1.1 = 8.25
against 4 × 2 = 8, an even fight.

**Frigate attacks a fully loaded Merchantman.**
Escape: 2 ÷ (21 + 2) = 9%. Fight: 16 × 1.5 = 24 against 6 − 0.5 for cargo = 5.5, so the Frigate wins **81%** of fights.
Overall the Frigate succeeds about 74% of the time. It takes the cargo, then sinks the Merchantman 60% of the time
before the overrides in section 8.

---

## Curiosities and bugs found in the code

- **The hidden halving.** Weak defenders lose half their strength against real troops, and nothing on screen says so.
- **Native ambushes are undocumented.** The in-game hint explains the ambush bonus for your war against the King. It
  never mentions that natives get the same bonus in every fight against you in the open.
- **Raids happen when the natives lose.** A won native attack kills or demotes a defender. A lost one can still loot
  the colony.
- **Plain Braves against your Artillery** always lose the fight. At a colony, that lost fight then **forces** the raid
  through, skipping the stockade roll that normally stops it.
- **Artillery's open-field penalty depends on the wrong unit.** Attacking Artillery escapes the −75% when the
  *defender* is a fortified European. A fortified enemy in the open is therefore a better artillery target than an
  unfortified one. This looks like a slip.
- **Europeans can't burn colonies.** The game has three "burned to the ground" messages for European attacks, and they
  appear to be unreachable.
- **Bombard for everyone.** Once the foreign intervention arrives, the King's +50% against colonies is also given to
  every other European attacker, including you.
- **The Combat Analysis cargo line is wrong.** It shows −12.5% per hold. The real penalty is 1/8 of one strength point
  per hold, about −3% for a Frigate with four holds full.
- **Spain's better treasure odds for agrarian villages** are calculated and then ignored. Spain has the same 1-in-3
  chance as everyone else.
- **The defender is chosen against the wrong attacker.** When the game picks which unit in a stack defends, it passes
  the attacker's *nation number* where a unit number belongs. The pick can occasionally be wrong in edge cases, such as
  ambushes or Artillery in a colony against natives. The fight itself uses the right units.
- **The AI misjudges the easy levels.** The computer's own odds estimate is taken before the easy-level reductions,
  the Discoverer doubling and the main-colony bonus are applied. On Discoverer and Explorer it thinks its attacks
  are better than they are.
- **Damaged Artillery stays damaged for ever.** Only ships are repaired.
- **Continental Army skips a step** when beaten. It drops straight to colonist, not to Soldier.

---

## Sources

All of this comes from the reconstructed C source in `matched/game/`. Unit strengths are the UNITS
text resource; terrain bonuses are the UNFORESTED, FORESTED and OTHER resources (the Colonopedia shows each point as 25%).
Unit type ids are in `include/units.h`. Random rolls use `rand_range(lo, hi)`, which includes both
ends.

| Topic | Files |
|---|---|
| The fight, odds, aftermath | `combat_fight.c`, `rand_range.c` |
| Strength and bonuses | `get_combat.c`, `get_defense.c`, `get_colony_defense.c`, `load_data.c`, `load_terrain.c` |
| Choosing the defender | `best_defender.c`, `make_fake_unit.c`, `make_fake_type.c` |
| Losers, capture, demotion, ships | `special_kill.c`, `special_kill_stack.c`, `capture_cargo.c`, `kill_stack.c`, `new_turn_bookkeeping.c`, `collect_stats.c` |
| Evasion | `blockade_speed.c`, `move_rate.c` |
| Who may attack, alarm, privateers | `move_unit.c` |
| Native raids and villages | `resolve_raid.c`, `base_defenders.c`, `indian_village.c` |
| Fort bombardment | `colony_fortress.c` |
| War of Independence | `combat_fight.c`, `colony_rebel.c`, `allied_invasion.c`, `revolution_check.c` |
| Promotions | `try_to_improve.c`, `next_improve.c`, `any_spec.c` |
| Combat Analysis window | `combat_analysis.c` |

These findings are for the Windows release. The DOS version is believed to behave the same but has not been checked
line by line.
