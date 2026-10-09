# How the Native Americans Work

*A player's guide to Sid Meier's Colonization (Windows), based on the game's own code.*

The natives are the most complicated part of Colonization. Eight tribes share the New World with you. They trade, teach,
give gifts, beg, demand, raid and, if you push them far enough, burn your colonies to the ground. The Colonopedia
explains very little of it. Most of what decides how a tribe treats you is a set of hidden numbers that the game never
shows.

This guide explains those numbers: how a tribe's mood is measured, what raises and lowers it, what every option in a
native settlement actually does, how missions and converts work, and what makes a tribe go to war. It also covers
several surprises in the code. A few of them are outright bugs that change how you should play.

How difficulty changes the native numbers is summarised in
[How Difficulty Affects the Game](difficulty.md#5-the-native-americans). Fighting natives is covered in
[How Combat Works](combat.md#7-colonies-and-natives).

---

## At a glance

| Topic | The rule |
|---|---|
| Mood | Each tribe has an **alarm** of 0–100 towards each European nation. Each settlement also keeps its own **grudge** against you. |
| War | There is no declaration. A tribe treats you as an enemy once its alarm reaches **75**. A single settlement does so once its grudge reaches **128**. |
| First contact | Accept the peace treaty. If you refuse it, you **can never get it again**, and several options vanish for good. |
| Calming down | Alarm falls on its own, **fastest when the tribe is angriest**. Missions, gifts and good trades speed it up. |
| What angers them | Colonies and soldiers near their settlements, using their land, attacks, missions in the wrong place, tribute demands. |
| Land | A tribe claims the squares around its settlements: 1 square away for most tribes, 2 for the Aztecs, 3 for the Incas. Each land deal makes the next one dearer. |
| Learning | Only free colonists and indentured servants can learn. Each settlement teaches once; **capitals teach without limit**. |
| Never taught | No settlement ever teaches a distiller, tobacconist, lumberjack, carpenter, blacksmith or gunsmith. |
| Trade | One sale and one purchase per visit. **You can only buy after you sell or give.** |
| Converts | Missions never produce converts by themselves. Converts come as **gifts from braves visiting your colonies**, or when you defeat a mission settlement. |
| Mission in a capital | Almost always provokes the tribe. See [Missions](#9-missions-and-converts). |
| Braves | Each settlement has one. A lost brave is replaced; the tribe never builds extra ones. |
| Muskets and horses | Tribes start with none. Every musket and horse they ever use came from Europeans. |

---

## 1. The eight tribes

| Tribe | Level | Settlements are | Normal size | Capital size | Land claimed around each settlement |
|---|---|---|---|---|---|
| Inca | Civilized | Cities | 9 | 13 | 3 squares |
| Aztec | Advanced | Cities | 7 | 10 | 2 squares |
| Arawak | Agrarian | Villages | 5 | 7 | 1 square |
| Iroquois | Agrarian | Villages | 5 | 7 | 1 square |
| Cherokee | Agrarian | Villages | 5 | 7 | 1 square |
| Apache | Semi-Nomadic | Camps | 3 | 4 | 1 square |
| Sioux | Semi-Nomadic | Camps | 3 | 4 | 1 square |
| Tupi | Semi-Nomadic | Camps | 3 | 4 | 1 square |

A tribe's level never changes. It decides almost everything about the tribe:

| What the level changes | Semi-Nomadic | Agrarian | Advanced | Civilized |
|---|---|---|---|---|
| Settlement size (normal / capital) | 3 / 4 | 5 / 7 | 7 / 10 | 9 / 13 |
| Settlement defence bonus | +50% | +50% | +100% | +100% |
| Chief's gold gift multiplier | ×1 | ×2 | ×3 | ×4 |
| Sells ore | no | yes | yes | yes |
| Sells silver | no | no | yes | yes, double from mountains |
| Wants tools | never | yes | yes | yes |
| Can teach ore miners and fur traders | no | yes | yes | yes |
| Can teach silver miners and weavers | no | no | yes | yes |
| How fast they forget your trades | slowest | | | fastest |
| Chance a gift is a convert (mission settlement) | 12.5% | 18.75% | 25% | 31.25% |

The defence bonus doubles at a capital. See [How Combat Works](combat.md#native-settlements).

Some tribes have their own special cases:

- **Inca and Aztec** have their own first-contact pictures and music, and their cities are drawn in their own art. They
  are placed in the west of the map; see [How the New World Is Generated](map-generation.md).
- **The Arawaks** greet you happily with a collection of scalps on display. They can also kill a scout for
  "breaking sacred taboos" even when they like you (see [Speaking with the chief](#speaking-with-the-chief)).

---

## 2. Settlements

### Size and growth

Every settlement has a size (its population). It starts at its tribe's normal maximum, 3, 5, 7 or 9. A settlement
below its maximum regrows slowly: each turn it adds its current size to a hidden counter, and when the counter reaches
20 it gains 1 size.

| Growing from size | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 and up |
|---|---|---|---|---|---|---|---|---|---|
| Turns to grow by 1 | 20 | 10 | 7 | 5 | 4 | 4 | 3 | 3 | 3 or fewer |

A camp knocked down to 1 needs about 30 turns to get back to 3. An Inca city knocked down to 1 needs about 75
turns to get back to 9.

**Size only ever goes down in combat.** Each time you defeat the defender of an empty settlement it loses 1
size, and at size 1 it is destroyed. Trade, converts, teaching and lost braves never shrink it.

**Capitals** start at the *ordinary* size and grow to the capital size over the first 7–9 turns. A tribe has
exactly one capital. If it is destroyed, no new one is ever chosen.

### Braves

Every settlement places **one brave** at the start of the game. A tribe never builds extra braves: a settlement only
makes a new brave to **replace** one that was lost. It uses the same growth counter, and a replacement comes before
regrowth. If a settlement loses several braves before it replaces one, it gets only one back. So a tribe's army is
about one brave per settlement, and heavy losses shrink it for good.

| Unit | Moves | Attack | Defence |
|---|---|---|---|
| Braves | 1 | 1 | 1 |
| Armed Braves | 1 | 2 | 2 |
| Mounted Braves | 4 | 2 | 2 |
| Mounted Warriors | 4 | 3 | 3 |

Braves stay near home. Each square more than 2 from their settlement counts against a move. The pull of home is halved
when the tribe is at war with someone, halved again for an armed brave and quartered for a mounted one. So armed and
mounted war parties roam much further than peaceful braves. Braves never enter water, Arctic squares or Lost City
Rumours, and avoid stacking with each other.

### What you can see

The game never shows the numbers, but it gives several clues:

| Where | What it tells you |
|---|---|
| The **greeting** when a unit enters a settlement | The tribe's alarm band (see [section 4](#4-alarm-and-grudges)) |
| The **chief's portrait** in every native message | Four portraits per tribe, one for each alarm band |
| The **map label** over a settlement ("!" marks) | Which European nation unsettles it most. One "!" for every 4 points of pressure. For your own nation, the colour shows that settlement's grudge against you |
| The **status bar** when you point at a settlement | Camp, Village, City or Capital; whose mission it holds; "Alarmed by …" names the nation that unsettles it most |
| The **Indian Advisor** | A mood face per tribe, plus its settlements, your missions, its muskets and horse herds (see [section 14](#14-the-indian-advisor)) |

---

## 3. First contact and the peace treaty

The first time one of your units stands next to a tribe's brave or settlement (or one of their braves walks up to
you), the tribe introduces itself:

> "The {tribe} welcomes you. We are a glorious nation of N villages. To celebrate our friendship, we generously offer
> you the land you now occupy as a gift. Will you accept our treaty and live with us in peace as brothers?"

At that moment the tribe's alarm towards you is capped at 20, whatever it was before.

- **Yes:** you get a **peace treaty** and the peace-pipe message. The "land you now occupy" gift is only words: no
  land changes hands.
- **No:** alarm jumps by 100, which takes it to the maximum, and the chief answers: *"Then the mighty {tribe} shall
  mercilessly drive you from our shores. Prepare for WAR!"*

**This is the most important decision you make with any tribe, because it is permanent.** The game makes a peace
treaty only at first contact and never takes one away. If you refuse, then for the rest of the game, with that tribe:

- your colonists cannot **live among the natives** to learn their skill;
- your scouts and soldiers cannot **demand tribute**;
- your missionaries can do **nothing**: no missions, no denouncing, no inciting;
- you are never asked to **buy land**. Your colonists, roads and cleared forests simply take it, and you pay in alarm.

The treaty also has one downside: only a tribe you have a treaty with can **burn your missions** at maximum alarm.

> **Tip:** Always accept. Even if you plan to fight the tribe later, the treaty costs nothing, and refusing makes
> them hostile from the first turn.

Before first contact, a tribe's land is not claimed against you at all. See [section 5](#5-land).

The computer players always accept.

---

## 4. Alarm and grudges

### Two measures

The game measures native feelings in two separate ways:

1. **Alarm** belongs to the whole tribe. There is one value of 0 to 100 for each European nation. It decides the
   greeting, the chief's portrait, whether the tribe is at war with you, and most prices and odds.
2. **Grudge** belongs to one settlement. Each settlement keeps its own value for each nation, with no upper limit.
   It builds up from your colonies nearby and from refused demands. It decides whether **that** settlement's braves
   attack you.

### Alarm bands

| Alarm | Band | The greeting you see on entering |
|---|---|---|
| 0–24 | **Content** | Friendly (the Arawaks show off their scalps) |
| 25–49 | **Uneasy** | "…practice archery and frown at you suspiciously." |
| 50–74 | **Restless** | "A band of warriors eyes you warily." |
| 75–100 | **Angry: at war with you** | "…you hear the ominous sound of war drums." |

**There is no declaration of war.** A tribe is at war with you simply while its alarm is 75 or more. The game contains
a war-declaration message and a later peace-offer message, but this version never uses either. War ends quietly when
the alarm falls back below 75.

A settlement whose grudge against you is 128 or more shows the Uneasy greeting even when the tribe is Content.

### Grudge thresholds

| Grudge | Effect on that settlement |
|---|---|
| 32+ | Its braves attack your units in the open, if the tribe's alarm is above 25 |
| 64+ | Your ships are turned away: *"If you approach our shoreline we shall punish you."* |
| 128+ | It treats you as an enemy, whatever the tribe's alarm. Its braves attack your colonies and units |

When the tribe's alarm falls and crosses a multiple of 5, every one of its settlements has its grudge against you
capped: at 32 if the alarm is now below 50, otherwise at 96. **Any calming act that lowers alarm by 5 or more
therefore wipes out the 128+ grudges across the whole tribe.**

### Alarm falls on its own

Each turn, every settlement of a tribe rolls dice for each nation the tribe has met. Every 8 points rolled take 1 off
the alarm. The number of dice grows with the alarm band, so **angry tribes calm down far faster than content ones**:

| Band | Calm points per settlement per turn |
|---|---|
| Content | 0.08 |
| Uneasy | 0.17 |
| Restless | 0.56 |
| Angry | 2.5 |

For a tribe of 10 settlements, that is about −0.1 alarm a turn when Content, but **about −3 a turn when Angry**. Left
alone, a tribe at 100 falls back below 75 in about 8 turns. Large tribes calm down faster than small ones.

This natural calming **stops completely during the War of Independence**.

### What raises alarm

Every rise is **halved for France**, rounded down, and **halved again with Pocahontas**. A rise of 1 therefore becomes
0 for either.

| Cause | Alarm rise |
|---|---|
| Refusing the peace treaty at first contact | +100 |
| Attacking a brave in the open | +5 to +9, depending on difficulty |
| …attacking a settlement | double, and that settlement's grudge +256 |
| …attacking a capital | six times the first amount |
| Building a road on their land | +3 to +7, ×2 within 2 squares of a settlement, ×3 next to one |
| Clearing forest on their land | +5 to +9, same multipliers |
| Working their land without paying | +5 to +9, same multipliers, ×2 again on a special resource |
| Demanding tribute and being refused | +1 to +5 |
| Demanding tribute and being paid | +2 to +10 |
| A failed haggle | +1 to +4 |
| Being unable to pay for goods you agreed to buy | +1 |
| Asking to learn while the tribe is Restless or Angry | +3 |
| Founding a mission | depends on your other missions; see [section 9](#9-missions-and-converts) |
| Losing a heresy contest | +1 to +16 |
| Digging up burial grounds after a Lost City Rumour | +100 |
| The holy-shrines rumour | +6 to +31, depending on difficulty and scout; see [the difficulty guide](difficulty.md#lost-city-rumours-holy-shrines) |
| Another nation inciting the tribe against you | +100 |
| Agreeing to help a European rival "teach the heathen a lesson" | +100 |
| The tribe joining the Tories in the War of Independence | +100 |
| Colony pressure (see below) | about +1 every few turns, per settlement |

The amounts that depend on difficulty are listed in [the difficulty guide](difficulty.md#making-them-angry).

### What lowers alarm

Falls are never halved.

| Cause | Alarm fall |
|---|---|
| Selling goods they want, at a price you accept | −2 for each point of the tribe's patience (see [Trading](#trading)) |
| Giving a cargo away | about −4 to −24 |
| Buying from them | a random 0 to (price ÷ 25 + 1) |
| Giving food when they beg | −5 (−10 at a capital), more if they were very angry |
| Handing over goods they demand | −4 for every 100 gold the goods are worth in Europe |
| A mission in one of their settlements | −1 every 1–8 turns; see [section 9](#9-missions-and-converts) |
| Their own revenge: a raid, a colonist killed, a colony burned | −4 to −50 (see [section 11](#11-war-raids-and-attacks)) |
| Destroying their capital | alarm drops to 15 |
| Pocahontas joining your Congress | every tribe drops to 0 |

Natives calm down when they take revenge. A successful raid **lowers** their alarm towards you, because their anger
has been spent.

### Colony pressure

Every turn, each settlement looks at the European colonies within 6 squares and picks the one that weighs on it most.
That colony's **pressure** grows with:

- the colony's size, especially above 6 colonists;
- the number of buildings in it, which counts for more on harder levels;
- how close it is;
- soldiers, dragoons and artillery within 2 squares of the settlement;
- a flat amount added on harder levels.

Pressure is halved across water, and halved for France and again for Pocahontas.

The nation with the most pressure on a settlement is named in its status bar ("Alarmed by …") and its "!" marks.
Each turn, that settlement:

- adds the pressure to its **grudge**, plus a fifth of the tribe's current alarm;
- adds the pressure to a counter that **raises the tribe's alarm by 1** for every 8 points.

Pressure is doubled at a capital. A mission changes it: your own mission in the settlement reduces your pressure (×0.75,
or ×0.5 for an expert mission), but **a rival's mission increases it** (×1.5, or ×2 for an expert one).

> **Tip:** France and Pocahontas players get a hidden bonus here. Colony pressure arrives as +1 steps, and a halved +1
> is 0, so **colony pressure can never raise their tribe-wide alarm**. Their settlements' grudges still grow, though.

---

## 5. Land

### Which squares are claimed

A square belongs to a tribe if the **nearest** settlement on the same landmass is within the tribe's claim radius:

| Tribe level | Claim radius | Squares around each settlement |
|---|---|---|
| Semi-Nomadic, Agrarian | 1 | the 8 next to it |
| Advanced (Aztec) | 2 | a 5×5 square without its corners |
| Civilized (Inca) | 3 | a 7×7 square without its outer corners |

The capital claims no more than any other settlement. A square is **not** claimed against you if:

- it is water;
- one of your colonists already works it;
- it has already been bought, or settled, or worked by a pioneer;
- you have not met the tribe yet;
- you have [Peter Minuit](founding-fathers.md#peter-minuit-).

When a settlement is destroyed, its claims disappear. Another settlement may take them over if it is close enough.

### Buying land

With a peace treaty, you are asked to pay when you put a colonist on a claimed square, plow a claimed forest, or build
a road on claimed land. You can back off, pay, or take the land anyway. The price is:

1. Start with the tribe's level + 6 + 2 × difficulty.
2. Subtract the distance to the settlement.
3. Add the number of land deals already made with this tribe.
4. Subtract half of (10 − your total colonists), if you have fewer than 10.
5. Double it if the square has a special resource. The minimum is 1.
6. Multiply by 65.
7. Multiply by 1, 2, 3 or 4 for Content, Uneasy, Restless or Angry.
8. Multiply by 1.5 at a capital.
9. Halve the result.

| Example (square next to a village, Agrarian tribe, Content, first deal) | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Price | 195 | 260 | 325 | 390 | 455 |

**Every deal with a tribe makes the next one dearer**, by about 32 gold for a Content tribe. The count is per tribe and
covers every purchase, whatever it was for.

> **Tip:** Buy while the tribe is Content. The same square costs double when it is Uneasy and four times as much at war.

### Taking land

Taking the land costs alarm instead of gold. If you have no treaty, you are never asked and always take it.

| Action | Alarm rise | When it lands |
|---|---|---|
| Working the square | +5 to +9 | when the colonist starts work |
| Clearing a forest | +5 to +9 | when the clearing **finishes**. Plowing open land never costs alarm |
| Building a road | +3 to +7 | when the road is finished |

Each is doubled within 2 squares of the settlement and tripled next to it. Working a special resource doubles it
again.

For six of the eight tribes the claim reaches only 1 square, so roads and clearing only cost alarm right next to a
settlement, and there they always count triple.

---

## 6. Visiting a settlement

What a unit can do depends on what it is, and on whether you have a peace treaty with the tribe:

| Unit | With a peace treaty | Without one |
|---|---|---|
| Scout | Speak with chief, demand tribute, attack | Speak with chief, attack |
| Soldier, dragoon, artillery, Continental | Attack, demand tribute | Attack |
| Free colonist, servant, criminal, pioneer | Live among the natives | Nothing |
| Missionary | Establish a mission, or denounce a rival's mission; incite | Nothing |
| Wagon train, or a ship at a coastal settlement | Trade | Trade |

- A **ship** is turned away if you have not yet met the tribe on land, if the tribe is at war with you, or if that
  settlement's grudge is 64 or more.
- Every action **ends the unit's turn**.
- A treasure train can only cancel.

### Speaking with the chief

**First, the scout may die:**

1. At alarm 75 or more, the scout is always killed.
2. Otherwise, at alarm 25 or more, the scout dies if a roll of 0–100 (0–140 for a seasoned scout) comes up no more
   than alarm ÷ 4.
3. The **Arawaks** may also kill any scout for breaking "sacred taboos". The chance is 1 in (9 − difficulty), or
   1 in (17 − 2 × difficulty) for a seasoned scout: 11–20%, or 6–11% seasoned.

[Francisco de Coronado](founding-fathers.md#francisco-de-coronado-) cancels every one of these deaths.

**Then the chief speaks.** He names the skill his settlement teaches and the goods it wants: *"We are a peaceful
village known for our expert fur trappers. We would gladly trade with you if you bring us some badly needed tools.
We would also pay well for cloth or rum."* He says this on every visit.

**Each settlement's chief gives something only once in the whole game**, to the first scout of any nation that gets
there. The chief also gives nothing if the same 0–100 roll is no more than the alarm. When he does give, it is one of
three outcomes, a third each:

| Result | What happens |
|---|---|
| **Guides** | The scout becomes a **Seasoned Scout**. This replaces any other specialty, so an expert colonist riding as a scout loses it. A scout who is already seasoned gets the tales instead. |
| **Tales of nearby lands** | Reveals the land around the settlement up to 6 squares away. Only land on the same landmass is revealed, not sea or other islands. |
| **A gift of beads** | Gold: three rolls of 1–(10 − difficulty) added together, × 4, × a roll of 1–6, × (tribe level + 1) |

| Chief's gold | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Average, Semi-Nomadic | 231 | 210 | 189 | 168 | 147 |
| Average, Inca (×4) | 924 | 840 | 756 | 672 | 588 |
| Most possible, Inca | 2880 | 2592 | 2304 | 2016 | 1728 |

Chances on a first visit to a non-Arawak settlement:

| Alarm | Scout killed | Chief has nothing | Chief gives something |
|---|---|---|---|
| 0 | 0% | 1% | 99% |
| 20 | 0% | 21% (seasoned 15%) | 79% (seasoned 85%) |
| 25 | 7% (seasoned 5%) | 19% | 74% (seasoned 82%) |
| 50 | 13% (seasoned 9%) | 38% | 50% (seasoned 64%) |
| 74 | 19% (seasoned 14%) | 55% | 26% (seasoned 47%) |
| 75+ | 100% | – | – |

> **Tip:** Scout every settlement early, before the tribes grow uneasy and before rival scouts get there. Each chief's
> gift goes to whoever comes first.

### Living among the natives

A colonist entering a settlement can ask to learn its skill. The game checks these in order:

1. The tribe is **Restless or Angry** (alarm 50+): *"Your ill manners infuriate us"*, and alarm **+3**.
2. A **petty criminal** is refused: he will never be more than a common criminal.
3. A **convert** is refused: converts already know the native ways.
4. **Any specialist**, including a hardy pioneer or seasoned scout, is refused.
5. A settlement that **has already taught anyone**, of any nation, refuses, **unless it is the capital**. Capitals
   teach any number of colonists.
6. An **Uneasy** tribe (alarm 25–49) may say you are too slow to learn. The chance is 10% on Discoverer rising to
   90% on Viceroy. This is a fresh roll each time and costs nothing, so you can simply try again next turn.
7. Otherwise you are asked to confirm, and the colonist becomes an expert **at once**, in the same turn.

Only **free colonists and indentured servants** can learn. A servant becomes an expert in one step. A pioneer
carrying tools can learn too, because what matters is the colonist, not the unit.

**What a settlement teaches** is a weighted draw from what the settlement produces, seeded by its position on the map:

| Skill | Who can teach it |
|---|---|
| Expert Farmer | every tribe (most common, because food usually outweighs everything else) |
| Expert Fisherman | instead of a farmer, often, at settlements with plenty of water nearby |
| Master Sugar, Tobacco or Cotton Planter | every tribe, from the land around the settlement |
| Expert Fur Trapper | every tribe, from forests |
| Seasoned Scout | instead of a fur trapper at settlements where the map x + y is divisible by 3 |
| Expert Ore Miner, Master Fur Trader | Agrarian and up |
| Expert Silver Miner, Master Weaver | Aztec and Inca |
| Master Distiller, Master Tobacconist, Expert Lumberjack, Master Carpenter, Master Blacksmith, Master Gunsmith | **nobody, ever** |

Because the draw uses the settlement's *current* production, the skill can change if the land around it changes, for
example when your colonies start working its squares.

### Trading

A wagon train, or a ship at a coastal settlement, can trade. A visit allows **one sale (or gift), followed by one
purchase**, and then the unit's turn ends. **You cannot buy anything unless you first sell or give something on the
same visit.** An empty wagon is told: *"Since you have brought no trade goods, we will not trade with you."*

#### What they want and what they have

Settlements have no warehouse. Every time you trade, the game works out from the land around the settlement, its size
and its tribe what it can offer and what it wants:

| Goods | Natives buy it? | Natives sell it? |
|---|---|---|
| Food | effectively never | never offered |
| Sugar, furs | **never** | yes, from suitable land |
| Tobacco, cotton | yes | yes, from suitable land |
| Lumber | never | never |
| Ore | never | Agrarian and up |
| Silver | never | Aztec and Inca |
| Horses | yes, less as their herds grow | if they have horses |
| Rum, cigars, trade goods | yes | never |
| Cloth, coats | yes | yes, from cotton and fur land |
| Tools | yes, except Semi-Nomadic tribes | never |
| Muskets | yes, less as their stock grows | never |

- A settlement **never buys what it produces most of**. Its top three products are struck from its wants.
- **A settlement will not take the same goods twice in a row.** It remembers the last goods it bought from you and the
  last goods you bought from it, for every nation, until the next trade there replaces them.
- **Selling to a tribe lowers what the whole tribe will pay** for that goods: about 2 points of demand for every 100
  sold. This fades again over 13–51 turns, faster for higher-level tribes.
- Capitals want twice as much of the raw goods, and offer twice as much of the finished ones.

#### Selling

The offer depends on how much the settlement wants the goods, the difficulty, the tribe's alarm band and a random
element:

- Content tribes pay the most. Each alarm band takes a discount off the price, except for **muskets and horses**,
  which pay full price whatever the tribe's mood.
- Harder levels pay less: about 69% of the Discoverer price on Viceroy.
- **Muskets and horses pay best of all** while the tribe has few of them.

Examples, for 100 units:

| Goods | Situation | Offer |
|---|---|---|
| Cloth | Cherokee village that wants it badly, Content, Conquistador | 302–432 |
| Cloth | same, Viceroy | 247–367 |
| Muskets | Semi-Nomadic tribe with none, Discoverer | about 735 |
| Horses | Semi-Nomadic tribe with none, Discoverer | about 835 |

You then have three choices:

1. **Accept.** You get the gold. If the tribe had any patience left, its alarm falls by 2 for each point of it, and
   the settlement's grudge falls by the amount sold. Selling exactly 100 clears it.
2. **Haggle for more.** Each try succeeds if the tribe still has patience. Goods they want badly give 3–5 points of
   patience; goods they barely want give none, and then haggling always fails. On harder levels each try is a little
   riskier. A success raises the price and costs one point of patience. **A failure ends the visit**: you keep the
   goods, buy nothing, alarm rises by 1–4, and the settlement refuses those goods until you next complete a trade
   there.
3. **Give the cargo as a gift.** This lowers alarm by about twice as much as a sale, and the purchase still follows.

#### Buying

After the sale you are offered the settlement's three most plentiful goods. Food, muskets, tools and trade goods are
never offered. **The amount equals what you just sold**, but **a ship gets only a quarter of it**. The price:

1. Start at 200.
2. Add (4 − tribe level) × 50 for horses and the finished goods.
3. Add (your European price) × (15 + 2 × difficulty) for silver and the finished goods.
4. Multiply by a random 1–2.
5. Subtract 4 × the settlement's supply.
6. Add 4 × the tribe's alarm.
7. Scale it to the amount being bought.
8. Add 10–60, depending on difficulty and a random roll. The minimum price is 50.

Paying lowers alarm a little. If you can't pay, alarm rises by 1. **Haggling down** succeeds about 78% of the time on
Discoverer and 33% on Viceroy, and cuts the price by a quarter. A failure costs +2 alarm and the settlement refuses to
sell, but only until your next sale there.

#### Trading with a hostile tribe

If the tribe is at war with you (alarm 75+), a wagon train can still try:

| Result | At alarm 75 | At alarm 100 |
|---|---|---|
| **The wagon train disappears without trace** | 15% | 20% |
| Turned away | 15% | 20% |
| A grudging trade | 70% | 60% |

### Demanding tribute

A scout or any soldier can demand tribute from a tribe you have a treaty with. Your **threat** is half your total
land military strength plus your forces in that part of the map, ×1.5 for Spain and ×1.5 again with
[Hernan Cortes](founding-fathers.md#hernan-cortes-). The tribe's **resistance** is twice its own strength in that part
of the map (plus half its overall strength), plus half its alarm. The game rolls a random part of each.

| Answer | When | Alarm |
|---|---|---|
| *"We laugh at your puny threats"* | they are stronger, or already at war with you | +1 to +5 |
| *"You must think us very foolish"* | not cowed, and Restless | +1 to +5 |
| *"We have no gifts worthy of your magnificence"* | not cowed but weaker than you, or **this settlement has already paid anyone** | 0 |
| They pay | cowed | +2 to +10 |

- **Tribute is always goods, never gold.** It is the settlement's most plentiful product, 10–100 units, delivered to
  your nearest colony in that part of the map.
- **Each settlement pays only once in the whole game.**
- You cannot cow a tribe in a part of the map where you have no colony.

---

## 7. When the natives come to you

Braves visit colonies within reach of their home settlement from time to time; a colony closer to a settlement is
visited more often. They also visit wagon trains. Each tribe makes at most one such visit to each nation per turn. A tribe at war never visits.

Whether the visit is friendly depends on a roll: the visitors are **generous** if 4 × (alarm above 25) + the
settlement's grudge is no more than a roll of 1–328. **A Content tribe with no grudge is always generous.** At alarm 40
with no grudge, it is generous 82% of the time.

### Gifts

A generous visit from a tribe that is not yet Restless brings a gift. The settlement's grudge then resets to 0. The
gift is the first of these that applies:

1. **A convert**, if your mission is in the visiting brave's settlement: chance (tribe level + 2) in 16, doubled for an
   expert mission (see [section 9](#9-missions-and-converts)).
2. **Food**, if the colony is down to 25 food or less and the settlement has spare: the colony is topped up to 75.
3. **Goods**: one of the settlement's top three products, usually 5–30 units. Never food, and never silver from tribes
   below Advanced.

If the tribe has already visited you this turn, the braves just comment instead: *"…your colonies are beginning to
overuse the lands near our settlements."*

### Begging for food

A settlement that is short of food may ask a colony with 75 or more food for **half of it**.

- **Give:** the settlement's grudge resets to 0, alarm falls by 5 (10 at a capital), and a gift follows: always if the
  visitors were generous, otherwise with a chance of 100% on Discoverer down to 20% on Viceroy.
- **Refuse:** the settlement's grudge grows by half. The alarm rise this was meant to cause never happens, because of a
  bug (see [Curiosities](#curiosities-and-bugs-found-in-the-code)).

### Demands

Visitors who are not generous **demand** the goods they value most from the colony: up to 100 units, sometimes only
half. The more valuable the goods in Europe, and the more you hold, the likelier they are to be chosen. Muskets are
rated higher on harder levels.

- **Hand them over:** the settlement's grudge resets to 0, and the alarm falls by 4 for every 100 gold the goods are
  worth. Muskets or horses go straight to the visiting brave, who becomes armed or mounted.
- **Refuse:** that settlement's grudge **+128**. Its braves now treat you as an enemy.

A brave who meets a **wagon train** in the open demands its whole first cargo, with the same choice. An empty wagon
train hands over nothing and the braves accept that.

---

## 8. Muskets and horses

**Every tribe starts the game with no muskets and no horses.** Everything they ever use comes from Europeans:

| Source | What they gain |
|---|---|
| Selling them muskets | +1 musket stock for 25+, +2 for 50+ (a gift of any amount: +1) |
| Selling them horses | a quarter of the horses, and +1 herd for 25+, +2 for 50+ |
| Handing over demanded muskets or horses | the visiting brave is armed or mounted, or the tribe's stock grows |
| Raiding a colony | stolen muskets and horses |
| Burning a colony that had muskets or horses | +1 musket stock, +1 herd |
| Beating your soldiers, dragoons or scouts in battle | they seize the horses and muskets |
| Defeating one of their armed or mounted braves | they recover half of the time |

Horses breed: every turn a tribe gains one horse per herd, up to twice its population plus 50.

**How they use them:**

- A new brave is armed if the tribe has muskets, and mounted if it has 50 horses.
- A brave who stays in his settlement is armed or mounted on the spot (25 horses to mount).
- **Muskets go further on harder levels.** Each use of the stock only uses it up with a chance of 1 in
  (difficulty + 1), so one lot of muskets arms on average 1 brave on Discoverer and 5 on Viceroy.
- An empty settlement's defender is armed and mounted for free if the stock allows.

Mounted Warriors, with attack and defence 3 and four moves, come from a tribe that has both.

> **Tip:** Selling muskets and horses pays very well, but the tribe will one day point them at someone, possibly you.
> Sell them to tribes far from your colonies, or to tribes next to your rivals.

---

## 9. Missions and converts

### Founding a mission

Any missionary can found a mission. A petty criminal blessed as a missionary founds the same mission as anyone else.
Each settlement can hold **one** mission, of any nation. Different settlements of the same tribe can hold different
nations' missions. To take over a rival's mission you must denounce it (below).

You need a **peace treaty** with the tribe. The founding is not a dice roll. Its effect on alarm is fixed:

1. Count your missions already in this tribe. With Sepulveda, double the count. With las Casas, Pocahontas or as
   France, halve it, once for each that applies.
2. The alarm changes by 8 × that count, minus 25, 15, 10 or 5 for a tribe that is Content, Uneasy, Restless or Angry.

| Missions you already have in the tribe | Content | Uneasy | Restless | Angry |
|---|---|---|---|---|
| 0 | −25 | −15 | −10 | −5 |
| 1 | −17 | −7 | −2 | +3 |
| 2 | −9 | +1 | +6 | +11 |
| 3 | −1 | +9 | +14 | +19 |
| 4 | +7 | +17 | +22 | +27 |

Your first mission in a Content tribe calms it by 25 at once. Every further mission in the same tribe costs 8 more
alarm. France, Pocahontas and las Casas let you found about twice as many before missions start to hurt.

The founding message tells you the result: the tribe approaches the new religion with curiosity, is cautious, is
offended, or reacts with hostility.

> **Warning: never found a mission in a tribe's capital.** In a capital the change is meant to be multiplied by nine,
> but a bug turns every calming change into a large rise as well. A first mission in a Content tribe's capital changes
> the alarm by **+175**, not −25. That takes the tribe straight to 100: at war with you, and rolling to burn all your
> missions at once. Missions in ordinary settlements are safe. The DOS version of the game does not have this bug.

### Expert missions

A mission is an **expert mission** if a **Jesuit Missionary** founds it, or if you have
[Jean de Brebeuf](founding-fathers.md#jean-de-brebeuf-). An expert mission:

| | Plain mission | Expert mission |
|---|---|---|
| Calming per turn | −1 alarm every 8 turns | −1 alarm every 2 turns |
| Calming at a capital | every 4 turns | every turn |
| Settlement grudge per turn | −3 | −12 |
| Chance a gift is a convert | normal | doubled |
| Discount when inciting the tribe | −250 | −1000 |
| Defence against a rival's denunciation | normal | doubled |
| Missionary who survives the settlement's destruction | comes back as a missionary | comes back as a Jesuit |

Las Casas doubles the calming; Sepulveda halves it. With Sepulveda, a plain mission in an ordinary settlement calms
nothing at all. Missions keep calming through the War of Independence.

On the map, expert and plain missions look the same: the cross is drawn in your nation's colour either way.

### Where converts come from

**A mission never produces converts by itself.** There is no per-turn chance at the mission settlement. Converts come
from exactly two places:

1. **Gifts.** When a brave from a settlement holding your mission visits one of your colonies and brings a gift, the
   gift is a convert with a chance of:

   | Tribe level | Plain mission | Expert mission |
   |---|---|---|
   | Semi-Nomadic (Apache, Sioux, Tupi) | 12.5% | 25% |
   | Agrarian (Arawak, Iroquois, Cherokee) | 18.75% | 37.5% |
   | Advanced (Aztec) | 25% | 50% |
   | Civilized (Inca) | 31.25% | 62.5% |

   The convert appears on the colony's square: *"The wisdom of your missionaries has convinced some of us to join your
   colony…"* A mission also helps indirectly, because it lowers the settlement's grudge, and that makes generous visits
   more likely. Missions in settlements close to your colonies therefore produce the most converts.

2. **Defeating a mission settlement.** When you beat the defender of an empty settlement that holds **your** mission,
   a convert may join you: 31% normally, 62% with an expert mission or as Spain or with Sepulveda, and up to 100% with
   all three. [Las Casas](founding-fathers.md#bartolome-de-las-casas-) takes 31% off. See
   [Sepulveda](founding-fathers.md#juan-de-sepulveda-).

### Converts as colonists

A convert works like a free colonist, but:

- outdoors, he makes **+1** on food, sugar, tobacco, cotton, furs and fish; nothing extra on lumber, ore or silver;
- in a building he works like a petty criminal: 1 unit where a free colonist makes 3;
- he **cannot** found a colony, teach, be taught, learn on the job, learn from the natives, or become a soldier,
  dragoon, pioneer, scout or missionary;
- he counts 1 point in the score, like a servant. A free colonist counts 2.

A convert left alone outside a colony **loses faith**. After nine such turns (not necessarily in a row) he returns to
his tribe: *"Indian converts lose faith and return to tribe…"* Turns spent in a colony, a settlement or alongside
other units don't count.

[Bartolome de las Casas](founding-fathers.md#bartolome-de-las-casas-) turns every convert you have into a free colonist
when he joins.

### Denouncing heresy

A missionary entering a settlement with **another nation's** mission can denounce it. The game weighs the two sides,
and the chance of success is your weight ÷ (your weight + theirs). The missionary is always used up: he either becomes
the new mission or is burned at the stake.

**Your side** gets:

- the size of every settlement in the tribe that holds a mission, counted double for expert missions and capitals;
- the tribe's alarm towards the **mission's owner**. This counts 16 times over if the contested settlement is the
  capital;
- the owner's colony pressure on the tribe.

**The owner's side** gets:

- half the tribe's alarm towards **you**, or nothing at a capital;
- your colony pressure on the tribe;
- double if the contested mission is an expert one.

At a capital, both sides also add a random 1–20.

| Example | Your chance |
|---|---|
| A plain English mission of size 4 plus one more English mission of size 3; the tribe's alarm towards England 20, towards you 10 | 84% |
| The same, but an expert mission | 76% |
| The tribe likes the owner (alarm 0) and dislikes you (alarm 80) | about 5% |

- **Success:** the owner's mission burns and yours takes its place. The owner's alarm rises and yours falls, by 1–16
  either way.
- **Failure:** your missionary burns. Your alarm rises and the owner's falls.

Two bugs make denouncing different from what the Colonopedia promises:

- **Jesuits get no bonus.** The code checks for the wrong specialty: a blessed **Master Cotton Planter** counts double,
  and his new mission is an expert one. A Jesuit counts as plain, and the mission he wins is plain, even with Brebeuf.
- **Every mission in the tribe counts for the attacker,** including the defender's own. So the more missions a tribe
  has, the easier denouncing becomes.

The computer players denounce your missions automatically when their missionaries get the chance.

### Inciting the natives

A missionary can pay a tribe to attack another European nation. The price is:

1. Take the tribe's military strength, plus its muskets and horse herds, plus 8 per settlement.
2. Multiply by (the tribe's alarm towards **you** + 75).
3. As France, take two thirds of it.
4. Subtract 250 for each of your plain missions in the tribe and 1000 for each expert one, doubled at a capital.
5. Subtract 1500 if the missionary is a Jesuit, and 500 if you are at the capital.
6. The minimum is 500.

Example: a tribe of 6 camps with 10 braves and 2 herds, Content towards you. The price is 5100; 3100 with a Jesuit;
2600 with a Jesuit at the capital.

- The target's alarm rises by **100**, so the tribe is immediately at war with it and may burn its missions.
- The tribe tells everyone who paid: *"…{your} missionaries incite {tribe} to warfare against the {target}!"*
- **The missionary is not used up.** He can incite again.
- During the War of Independence the only possible target is the Crown.
- If the tribe already hates the target, it says so after you agree to pay, and charges nothing.

**The computer players incite tribes against you** when they are weaker than you and have at least 1500 gold. They do
it on 4 visits in 5 to settlements without a mission, and always at settlements that have one.

---

## 10. Burned missions

If a tribe you have a treaty with reaches alarm 100, every further rise (and every alarm change that leaves it at 100)
rolls to **burn all of your missions in that tribe at once**: 18% on Discoverer up to 55% on Viceroy, and 27% for
the computer players. *"{Tribe} burn {nation} missions! Church authorities are outraged!"* No missionary is returned.

A tribe that joins the Tories in the War of Independence always burns all your missions.

---

## 11. War, raids and attacks

### When braves attack

| Tribe's mood | What its braves attack |
|---|---|
| Content | Nothing, except very occasionally a treasure train |
| Uneasy or worse (alarm above 25) | **Easy prey**: lone treasure trains, artillery, colonists, pioneers and wagon trains |
| Settlement grudge 32+, alarm above 25 | Your units in the open |
| At war (alarm 75+), or settlement grudge 128+ | Anything, colonies first |

**Massing soldiers next to a settlement provokes it.** Two or more of your armed units around a settlement make its
braves treat you as an enemy, even when the tribe is Content.

Braves at war go for your colonies first, then lone treasure trains, artillery and loaded wagon trains. A colony gets
extra attention the angrier the tribe is. Every native attack on you is announced: *"{Tribe} make surprise raid near
{colony}! Colonists frightened. {Tribe} chief denies involvement."*

### Attacks on colonies

| Result | What happens |
|---|---|
| Braves beat the defender | the defender is demoted or killed |
| Braves win and the colony has no defender, more than 1 colonist | a colonist is killed |
| Braves win and the colony has 1 colonist | **the colony is burned to the ground**. Any muskets or horses there go to the tribe |
| Braves lose | a **raid** may follow (below) |

**Natives can never take a nation's last colony.** Their attack strength is zero against it. They always lose the
fight, but the raid still rolls.

### Raids

A raid first has to get past the colony's defences; the odds are in
[the difficulty guide](difficulty.md#raids-on-your-colonies). Then one of four results is drawn, a quarter each:

| Result | What happens | Overridden by |
|---|---|---|
| **Stores** | They steal from about 10 units up to half of one stored goods (one with 10 or more in stock); horses are favoured if the tribe has none | a stockade usually stops it (89% on Discoverer, 44% on Viceroy) |
| **Burn** | The top level of one building is destroyed. Never stockades, the town hall, the carpenter's shop or the basic workshops | turned into theft with a fort, and often on easy levels |
| **Ship** | The first ship in port is damaged | nothing happens with a fortress |
| **Gold** | They take some of your gold, more from a big colony in a rich nation | turned into theft with a stockade |

On Discoverer before about 1572, and on Explorer before about 1532, **burning and ship damage are cancelled**.
Theft and gold raids can still happen.

Every successful raid **lowers** the tribe's alarm: by 4 for a theft, 8 for gold, 12 for a burned building and 16
for a damaged ship. The raiding settlement's grudge resets to 0.

| Other native victories | Alarm fall |
|---|---|
| Colony burned | −50 |
| Colonist killed | −6 to −10 |
| A defender or a unit in the open beaten | −3 to −5 |

The only exception is a tribe that a European has formally gone to war against. Its raids do not calm it down.

> **Tip:** A Restless tribe that has just raided you is usually calmer for it. Don't answer every raid with an
> attack: each attack raises alarm by 5–9 again, and attacks on settlements count double or more.

---

## 12. Fighting the natives

Before your first attack on a tribe that is not at war with you, you are asked: *"Shall we attack the {tribe}, Your
Excellency?"* You are asked again every time the tribe has calmed down a little since.

- Attacking costs **+5 to +9 alarm**, double on a settlement square (and +256 grudge for that settlement), and six
  times on a capital.
- **Fighting a brave doesn't shrink a settlement.** Only beating the defender of an **empty** settlement does: −1
  size each time, and at size 1 it burns.
- How combat with natives works, including the ambush bonus they get in the open, is in
  [How Combat Works](combat.md#7-colonies-and-natives).

### Destroying a settlement

- Every brave from that settlement disappears with it.
- The tribe loses its share of horses and herds. It keeps all its muskets.
- If it held your mission, your missionary walks out; an expert mission's missionary comes back as a Jesuit. Other
  nations' missionaries are lost.
- You get treasure and the "loot and burn" message. The amounts are in [How Combat Works](combat.md#attacking-villages).
- **Every settlement you burn costs score**, 1–5 points depending on difficulty.
- **Burning any settlement marks the tribe.** If the War of Independence comes, a marked tribe sides with the Crown
  with a high chance every turn (below).

### Destroying the capital

The tribe **bows before you**: its alarm towards you drops to 15 if it was higher. *"The {tribe} tribe bows before
the might of the {nation}. In tribute to your greatness, we give you all the land you now occupy."* As with the first
treaty, no land changes hands.

The game is meant to clear every grudge the tribe's settlements hold against you, but a bug makes it clear another
tribe's grudges instead. The large fall in alarm still caps your grudges at 32.

**The tribe never gets a new capital.**

### Wiping out a tribe

When its last settlement burns, the tribe is gone: *"The {tribe} tribe has been wiped out."* None of its braves
survive. It still appears in the Indian Advisor, marked Extinct.

### Paying others to fight

A European rival can be paid to attack a tribe, or a tribe incited against a rival (see
[Inciting](#inciting-the-natives)). A rival you hire loses its treaty with the tribe. The computer players also go to
war with tribes on their own when they feel strong enough. **Spain does this most readily.**

---

## 13. The War of Independence

During the war:

- Natural calming stops for every tribe. Missions still calm.
- Each turn, every tribe that has not yet chosen a side may **join the Tories**:
  - a tribe whose alarm towards you is 25 or more joins with a chance of (alarm ÷ 400) × 1 in (11 − 2 × difficulty);
  - **a tribe whose settlements you have ever burned** joins with a chance of 1 in (11 − 2 × difficulty), whatever its
    alarm.

| Chance per turn of joining the Tories | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Alarm 60 | 1.4% | 1.7% | 2.1% | 3.0% | 5.0% |
| You burned one of its settlements | 9% | 11% | 14% | 20% | 33% |

When a tribe joins the Tories:

- *"…enter the War of Independence on the Tory side! Tories agree to provide Muskets and Horses…"*
- its alarm towards you rises by 100 and towards the Crown falls by 100;
- all your missions in it burn;
- its musket stock is multiplied by 4, up to 4 per settlement, and its horses are reset to 25 per herd.

The Tories don't hand out arms. A tribe with no muskets still has none, and a tribe with horses but no herds **loses**
them. It never changes sides again.

---

## 14. The Indian Advisor

The Indian Advisor lists every tribe you have met, and every tribe that has been wiped out. For each it shows:

| Entry | What it means |
|---|---|
| Face | the alarm band towards you: Content, Uneasy, Restless or Angry. Extinct tribes show the angry face |
| Name | in the tribe's colour, or "Extinct" |
| Level | Semi-Nomadic, Agrarian, Advanced or Civilized |
| Camps, Villages or Cities | how many settlements are left |
| Missions | **your** missions in the tribe only |
| Muskets | the tribe's musket stock plus its Armed Braves and Mounted Warriors, × 50. Mounted Braves are not counted |
| Horse Herds | the number of herds, not of horses |

---

## Curiosities and bugs found in the code

- **A mission in a capital provokes the tribe.** The Windows version turns every calming change into a rise of seven
  times its size. A first mission in a Content capital changes alarm by +175 instead of −25. The DOS version gets this
  right.
- **Refusing the peace treaty is permanent.** The game never offers it again. It contains an unused message in which a
  defeated tribe offers a treaty, and an unused declaration of war.
- **Refusing to share food doesn't anger the tribe.** The alarm rise is written to the wrong place: it lands in the
  *next* tribe's record instead of yours. Depending on which tribe begged, that can change another tribe's horses,
  muskets, silver or even its level. This has not been tested in play.
- **Jesuits are no better at denouncing heresy.** The check looks for a Master Cotton Planter by mistake.
- **Every mission in a tribe helps the attacker** in a heresy contest, including the defender's own.
- **Burning a capital clears the wrong tribe's grudges.** The comparison mixes up two kinds of tribe number.
- **The Tories' muskets and horses are mostly imaginary.** They multiply what the tribe already has, and can take
  horses away.
- **"Don't sell the same goods twice" was meant to exempt muskets and horses.** The check compares the wagon's
  number, not the goods, so in practice it almost never does.
- **The skill a settlement teaches can change,** although it is drawn from a fixed seed. The weights come from the
  land around it at the time you ask.
- **Six skills can never be learned from natives**, although the code is ready to teach them. The settlements simply
  never produce the goods they would be drawn from.
- **Capitals start small.** A capital's size is worked out before it is made the capital, so it starts at the ordinary
  size and grows.
- **The expert-mission cross** was meant to have its own colour on the map. A masking slip draws every mission the same.
- **"Come visit us"** after the peace treaty depends on a value read from the wrong table, so whether it appears is
  effectively random.

---

## Sources

All of this comes from the reconstructed C source in `matched/game/`. Tribe names, levels and colours are the TRIBES
text resource; settlement words are the LEVELS resource; every quoted message is from the game's text resources.
Several findings, among them the capital mission bug and the heresy bugs, were checked against the shipped program
itself and against the DOS version.

| Topic | Files |
|---|---|
| Tribes and settlements | `start_indians.c`, `create_village.c`, `base_defenders.c`, `indian_village.c`, `indian_turn.c`, `indian_turns.c`, `collect_indian_stats.c`, `delete_village.c` |
| Movement and visits | `indian_move.c`, `treaty_encounters.c`, `negotiate_tribe.c` |
| Alarm | `piss_off.c`, `pissed.c`, `piss_factor.c`, `village_anger.c`, `indian_make_peace.c`, `tribe_village.c` |
| Land | `tribe_radius.c`, `colony_indian_table.c`, `village_bribe.c`, `set_field.c`, `perform_orders_road.c`, `perform_orders_clear.c` |
| Visiting settlements | `tribe_village.c`, `tribe_camp.c`, `tribe_live.c`, `tribe_trade.c`, `tribe_hostile.c`, `tribe_extortion.c`, `indian_supply_and_demand.c` |
| Missions and converts | `tribe_mission.c`, `tribe_heresy.c`, `tribe_incite.c`, `tribe_burn_missions.c`, `unit_rules.c`, `compute_yield.c`, `compute_colonist_yield.c` |
| War and raids | `indian_move.c`, `combat_fight.c`, `resolve_raid.c`, `move_unit.c`, `special_kill.c` |
| War of Independence | `indian_turn.c` |
| Indian Advisor | `ReportWin_ReportsIndian.c` |

These findings are for the Windows release. The DOS version is believed to behave the same except where noted above,
but has not been checked line by line.
