# The European Nations and How They Differ

*A player's guide to Sid Meier's Colonization (Windows), based on the game's own code.*

You choose between four nations: England, France, Spain and the Netherlands. The selection screen gives each one a
single sentence. In the code each nation actually has a handful of advantages, a different start, and a computer
personality that decides how it behaves when you play against it.

This guide covers what each nation gets, what the computer players do differently, how the European powers deal with
you and with each other, and how a nation can leave the game. How difficulty helps the computer players is in
[How Difficulty Affects the Game](difficulty.md#8-rival-nations).

---

## At a glance

| | England | France | Spain | Netherlands |
|---|---|---|---|---|
| Advertised advantage | Immigration | Cooperation with the natives | Conquest | Trade |
| What it really is | Needs **⅔ of the crosses** per immigrant | Native alarm rises **at half the rate**, plus cheaper missions and incitement | **+50%** attacking native settlements, plus tribute, converts and treasure bonuses | Sales move **Amsterdam's** prices by ⅔, and prices drift back **50% faster** |
| Starting ship | Caravel | Caravel | Caravel | **Merchantman** |
| Starting pioneer | Free colonist | **Hardy Pioneer** | Free colonist | Free colonist |
| Starting soldier | Free colonist¹ | Free colonist¹ | **Veteran** | Free colonist¹ |
| First colonist on the docks | Servant or criminal | Servant or criminal | **Jesuit Missionary** | Servant or criminal |
| Home port | London | La Rochelle | Seville | Amsterdam |
| Leader | Walter Raleigh | Jacques Cartier | Christopher Columbus | Michiel De Ruyter |
| As a computer player | Aggressive; few large colonies | Many small colonies, close to the natives | Aggressive; the largest garrisons; makes war on natives | Peaceful; the smallest garrisons |

¹ A Veteran Soldier for a human player on Discoverer or Explorer.

---

## 1. Choosing a nation

England is selected by default. After choosing, you can type your own leader name (up to 23 characters); the computer
players keep the historical names above. The difficulty title goes in front of it in the game's messages, for example
"Viceroy Walter Raleigh".

The nation you pick changes nothing about the map or where you start. The four nations are dealt into the four
starting rows at random (see [How the New World Is Generated](map-generation.md)).

---

## 2. England: immigration

> *"…requires only 2/3 the normal number of Crosses to attract new colonists from Europe."*

The crosses needed for each new immigrant are 2 × (your colonists in colonies + all your units) + 8, up to 4000.
England needs **two thirds** of that, rounded down.

| Your colonists and units | Crosses needed | England |
|---|---|---|
| 10 | 28 | 18 |
| 30 | 68 | 45 |
| 60 | 128 | 85 |
| 100 | 208 | 138 |

The bonus works for a computer England too, on top of the immigration discount the computer gets on harder levels.

**Nothing else about England is special.** One curiosity: the shared European market slowly forgets old sales, and
the game does this on England's turn, so the code looks as if England "ages" the market. It affects every nation the
same way.

> **Tip:** England's bonus grows with you. Every immigrant raises the cost of the next one, so a third off matters
> more the larger your empire becomes. [William Brewster](founding-fathers.md#william-brewster-) (choose your
> immigrants) and [William Penn](founding-fathers.md#william-penn-) stack with it.

---

## 3. France: cooperation with the natives

> *"…create alarm among the Indians at only half the rate of other Europeans."*

France's advantage is larger than the description suggests, because it works in several places:

| Effect | France | With Pocahontas as well |
|---|---|---|
| Every rise in a tribe's alarm towards you | halved, rounded down | quartered |
| Colony pressure on each native settlement | halved | quartered |
| Missions already in a tribe, when founding a new one | counted as half | counted as a quarter |
| Price of inciting a tribe against a rival | ⅔ | ⅔ |
| Inciting a tribe against France | +50 alarm instead of +100 | +25 |
| Refusing the peace treaty at first contact | +50 alarm instead of +100 | +25 |

**Rounding down matters most.** Many sources of native alarm come in steps of +1, above all the steady pressure from
colonies near native land. Half of 1 rounds down to 0, so **French colonies never raise a tribe's alarm just by being
close to it**. The settlements' own grudges still grow, but the tribe as a whole stays calm.

What France does *not* get: the tribes' starting alarm is the same as for everyone else.

A computer France also founds its colonies closer to native settlements than the other nations, and spreads into
many small colonies.

> **Tip:** France can settle right next to native land and found more missions per tribe before they start to
> provoke it. With [Pocahontas](founding-fathers.md#pocahontas-), almost nothing short of an attack raises alarm.
> See [How the Native Americans Work](natives.md#4-alarm-and-grudges).

---

## 4. Spain: conquest

> *"…+50% combat bonus when attacking Indian villages."*

| Effect | Spain |
|---|---|
| Attacking a native **settlement** | **+50%** attack. Braves in the open give no bonus |
| Demanding tribute from natives | your threat ×1.5 (×2.25 with Hernan Cortes) |
| Converts when you defeat a settlement holding your mission | 62% instead of 31% |
| Treasure from burning a camp | a 1 in 4 chance instead of 1 in 7 |
| Treasure from burning an Aztec city | +3000 gold |
| Treasure from burning an Inca city | +20–30% |
| Starting soldier | always a **Veteran** |
| First colonist on the docks | always a **Jesuit Missionary**, even on Discoverer |

Spain's better odds for treasure from Agrarian villages are worked out in the code but never used: everyone has the
same 1 in 3 chance there.

The bonuses stack with the conquest fathers:

- **Cortes:** Aztec cities give +9000 over the base, and Inca cities give nearly twice the base. Camps and villages always pay.
- **Sepulveda:** converts from defeated mission settlements become 92%, and certain with an expert mission.
- **Las Casas:** takes Spain's convert chance back to 31%.

See [Founding Fathers](founding-fathers.md#hernan-cortes-) and [How Combat Works](combat.md#attacking-villages).

A computer Spain is the most aggressive towards the natives. It goes to war with tribes that have done nothing to it,
takes on stronger tribes than the others would, settles right next to their settlements, and **always refuses** when
they beg for food.

> **Tip:** Spain is built for the Aztecs and Incas. A veteran soldier, +50% against cities and a Jesuit for converts
> afterwards: Spain gets more out of a city than anyone.

---

## 5. The Netherlands: trade

> *"…prices in Amsterdam do not collapse as quickly… and recover more quickly."*

Each nation has its own market in Europe (see [How Europe Works](europe.md)). All four start with the same prices, and
every sale by **any** nation pushes **all four** markets. The Dutch market is different in two ways:

- **Sales move Amsterdam's prices by only two thirds** as much as the other markets. Purchases move all four equally.
- **Amsterdam's prices drift back towards normal faster.** The drift is doubled on every other turn, 50% faster on
  average. This works both ways: a good whose price is drifting down also falls faster in Amsterdam.

The Netherlands also starts with a **Merchantman** (5 moves, 4 cargo holds) instead of a Caravel (4 moves, 2 holds).

Nothing in combat, native relations or taxes is Dutch-specific.

> **Tip:** The Merchantman is worth as much as the market bonus early on. Twice the cargo from the first turn means
> twice as many colonists or tools per trip.

---

## 6. Starting conditions

Every nation, human or computer, starts with three units on a ship sailing to its starting position:

| | England | France | Spain | Netherlands |
|---|---|---|---|---|
| Ship | Caravel | Caravel | Caravel | Merchantman |
| Pioneer, with 100 tools | Free colonist | Hardy Pioneer | Free colonist | Free colonist |
| Soldier | Free colonist | Free colonist | Veteran | Free colonist |

The waiting colonists on the docks are the same for every nation, except Spain's Jesuit Missionary. The extra help a
human gets on the easy levels (starting gold, expert colonists on the docks, a veteran soldier) is in
[How Difficulty Affects the Game](difficulty.md#1-starting-out).

---

## 7. Identity

| | England | France | Spain | Netherlands |
|---|---|---|---|---|
| Adjective | English | French | Spanish | Dutch |
| Home port | London | La Rochelle | Seville | Amsterdam |
| Name for your new land | New England | New France | New Spain | New Netherlands |
| First colony name | Jamestown | Quebec | Isabella | New Amsterdam |
| Colony names available | 36 | 66 | 39 | 32 |
| Mission name | Church of … | Sainte Marie de … | Santa Maria del … | Church of … |
| Ruler | King | King | King | **Stadtholder** |
| Name as an independent republic | United States of America | Republic of Quebec | Republic of Mexico | Republic of Surinam |
| General of its intervention force | Cornwallis | Lafayette | "Spanish Generals" | de Ruyter |

When you first reach land you are asked to name it. That name is used for your colonies as a whole in the game's
messages. Saved games are named after your nation and the year, such as `eng1620.sav`.

Each nation has an anthem that plays when you meet it. **The Dutch anthem never plays**: the game plays the Spanish one
for the Netherlands by mistake.

---

## 8. The computer players' personalities

### Three hidden numbers

Each leader comes with three hidden numbers. They have no names in the game; the labels here come from what the code
does with them:

| | England | France | Spain | Netherlands |
|---|---|---|---|---|
| Aggression | +1 | 0 | +1 | −1 |
| Expansion | −1 | +1 | 0 | 0 |
| Garrison | 0 | 0 | −1 | +1 |

**Aggression:**

- makes a computer player readier to go to war with other computer players;
- makes it harder to talk out of being hostile towards you;
- sets how many muskets its colonies stockpile: 150 for England and Spain, 100 for France, 50 for the Dutch.

**Expansion** decides how many colonists it sends out to found new colonies, and how big its colonies must get first.
France founds new colonies once its colonies average about 4 colonists. England waits until they average about 10, so
it builds **fewer, larger** colonies. Spain and the Dutch wait for about 7.

**Garrison** decides how many soldiers each colony keeps. In a colony of 12, Spain keeps about 4 armed units, England
and France about 3, and the Dutch about 2.

### Hard-coded habits

- **Spain makes war on the natives.** A computer player normally attacks a tribe near its colonies only if the tribe
  is already uneasy with it, no other European is in the region, and the tribe is clearly weaker. Spain ignores the
  first two conditions and accepts twice the odds.
- **Spain never shares food** with a begging native settlement. Every other computer player always does.
- **France and Spain settle next to native settlements.** When choosing a colony site, the penalty for being near
  native land is halved for France and quartered for Spain.

Everything else the computer players do is the same for all four nations.

---

## 9. Meeting the other Europeans

### When a meeting happens

A meeting is triggered when one of your units on land moves next to another nation's unit or colony, or one of
theirs moves next to yours. A scout can also "meet with the mayor" of a rival colony. Ships never trigger a meeting,
and there are none during the War of Independence.

After the first meeting, a nation only talks to you again once **16 turns** have passed since the last conversation,
or **32 turns** after a peace treaty. A scout visit always gets a conversation.

### Whether they are hostile

Before speaking, the rival decides whether to be hostile. These make it hostile:

- **its forces and yours in the same region**, or its forces near a large colony of yours;
- **its units next to your colonies**, especially next to an undefended one;
- **you are the leading nation** (see [Rankings](#11-rankings)), after 1572, with more than three colonies;
- **it holds a grievance against you** (below), unless your field army is three times the size of its own;
- **the King has made you declare war on it**.

These calm it down:

- **you have it outgunned** in a region where it has colonies;
- **[Benjamin Franklin](founding-fathers.md#benjamin-franklin-)**, on either side;
- **the early game:** with no grievance, nobody is hostile before 1592 on Discoverer, 1582 on Explorer, 1572 on
  Conquistador, 1562 on Governor or 1552 on Viceroy;
- **it is busy with other enemies** (natives or Europeans), unless it is an aggressive nation.

### What they ask of you

A conversation can bring, in this order:

1. **Break a treaty.** *"We note that you have signed a treaty with those unrepentant heretics, the …"* Agreeing ends
   your peace with that nation, which then holds a grievance against you. The native version asks you to join a war
   on a tribe; agreeing adds 100 to that tribe's alarm towards you. Either "yes" calms the rival.
2. **Withdraw your privateers.** Asked if one of your privateers has attacked it. Agreeing sends **every privateer
   you own** to Europe, with anything stacked with them.
3. **Withdraw from their colonies.** Agreeing sends all your armed units next to its colonies to Europe.
4. **A "donation to the Church"**: tribute of up to 20,000 gold. The amount grows with difficulty, with the rival's
   strength near your colonies, and doubles if it holds a grievance against you. Paying ends the hostility; refusing
   means war.
5. **Reparations in goods**, if one of its units walked up to your colony: the goods of yours that are worth most at
   its prices.

If it is still hostile after all that, it declares war: *"We can no longer tolerate your foul provocations. Prepare for
WAR!"*

### What you can ask of them

At war with no treaty, a rival that is not hostile offers peace. If you refuse, a rival you have the upper hand on may
pay you to spare its colonies.

At peace, you can:

- **Demand they withdraw** their units from next to your colonies. Sometimes it is free; otherwise it costs
  (25 × difficulty + 50) × the attack strength of those units. You can also threaten them, and they back down with a
  chance that depends on your field strength against theirs.
- **Threaten them for a gift**: they pay what they think they owe you, if anything.
- **Propose an alliance**: pay them to declare war on a tribe or another European. The price is 500 to 10,000 and
  **grows with your own treasury**, so ask while you are poor. Franklin halves it.

### The truce after peace

After every meeting that ends at peace, a computer player may not attack you for **12, 10, 8, 6 or 4 turns** (from
Discoverer to Viceroy), halved with Franklin.

---

## 10. War and peace between Europeans

- **Met but without a treaty means war.** The Foreign Affairs report shows it as "War", and the computer players
  attack anyone they are not at peace with.
- **Grievances.** Capturing a colony, breaking a treaty, helping a rival against a third nation, or being caught
  using privateers gives the victim a grievance against you. While it holds one, its demands double, it will not pay
  to be spared, and it is hostile unless your army is three times its own.
- **Breaking a treaty** yourself takes a confirmation: "Cancel Action / Break Treaty".
- **Privateers** sit outside diplomacy. Attacking with one doesn't break a treaty, but it does make the victim
  complain, and on rare occasions it works out who did it.
- **Sneak attacks.** A rival that is secretly plotting against you while at peace gets a 1 in 4 chance each turn,
  once the truce has run out, to break the treaty **on its side only**. Its next attack is announced as *"Sneak attack
  by the treacherous …!"*

> **Tip:** The Foreign Affairs report shows each nation's view of its own treaties. A nation that lists you as "War"
> while your row still says "Peace" is about to attack.

### Wars between computer players

Two computer players reconsider their relations from time to time. They avoid war:

- **when you are the leading nation**, because they all make peace to deal with you;
- before 1532;
- while either is still tiny;
- with an independent republic;
- when either is outgunned where it has colonies.

Otherwise the more aggressive and the stronger the nation, the readier it is for war. A war you paid one nation to
start stays on until the grievance it created is gone.

---

## 11. Rankings

The game ranks the four nations by a hidden score, recalculated at every meeting:

**population + 2 × colonies + gold ÷ 100 + military strength**

One soldier counts as much as 16 colonists, so **the ranking is mostly about army size**. It is never shown, but it
matters:

| When | Effect |
|---|---|
| You are ranked first | Rivals gang up on you in meetings, and computer players stop fighting each other |
| A computer player ranks below you | Its missionaries **incite the natives against you** once it has 1500 gold |
| A computer player ranks at or above you | It concentrates on tools and muskets, and mines more ore |

---

## 12. The Foreign Affairs report

For each nation the report always shows:

- its leader;
- whether it is at war or at peace with each nation it has met, from **its own** point of view;
- its rebels and Tories.

With [Jan de Witt](founding-fathers.md#jan-de-witt-) it also shows the nation's colonies, average colony size,
population, military power, naval power and merchant marine. Military power is the sum of its units' attack values.

The report is not available after you declare independence.

---

## 13. How nations leave the game

**A rival is never eliminated by losing its colonies.** A computer player without colonies keeps buying ships and
colonists in Europe and tries again. Nations leave the game in three ways.

### The War of the Spanish Succession

When your rebel sentiment first reaches 50%, or when you declare independence if that comes first, a war in Europe
removes one rival from the New World:

> *"War of the Spanish Succession ends in Europe! {nation}, ravaged by war, agrees to cede New {land} to the {other}.
> Treaty of Utrecht specifies that all {nation} possessions in the New World now fall under {other} rule."*

- **The loser** is the weakest computer player, by population + 2 × colonies + 3 × ships.
- **The winner is the next weakest**, not the strongest.
- The winner takes the loser's colonies, units and missions in the New World, and its map. The colonies' liberty
  bells are reset to zero. Units in Europe or at sea are lost, and so is the loser's gold.
- The loser's place is later taken by the Crown when you declare independence.

### A rival winning independence

A computer player becomes independent when enough of its colonists support it: 80 rebel colonists on Discoverer,
down to 40 on Viceroy. *"The King of … grants independence to …! … elected first President of the new republic."*

- It is renamed: the United States of America, the Republic of Quebec, the Republic of Mexico or the Republic of
  Surinam.
- It makes peace with every European nation, **including you**, and forgets all grievances. It has to meet you again.
- It keeps playing. It still meets you, can still demand tribute (*"…does not recognize the right of european powers
  to establish colonies in this hemisphere…"*), and is left out of the King's wars.
- Each rival that wins independence before you shrinks your score bonus for independence.

### When you declare independence

- **The Crown** takes over the succession loser's place, at war with you.
- **The other two rivals withdraw.** All their units are removed, and their colonies stay on the map, frozen. They
  cannot be attacked.
- **The weaker of the two** becomes the **intervention power** that may join you (see
  [How Difficulty Affects the Game](difficulty.md#foreign-intervention)). The other supplies the wartime mercenaries.
- With de Witt you can still trade at their colonies. The intervention power takes a fixed cut of only
  5–9%, and food, lumber, tools and muskets can be bartered.

### The rivals and the King

The computer players have no royal army and never face a War of Independence. They do get tax raises, on the same
calendar as yours but without the difficulty adjustment, and they accept them silently. Their tax rate lowers what they
pay you for goods at their colonies.

---

## Curiosities and bugs found in the code

- **The Dutch anthem never plays.** The Netherlands gets Spain's anthem.
- **Reparations take furs.** When a rival demands goods as reparations and you agree, the code moves the goods with
  number 4, which is **furs**, not the goods it named. It does not check your stock, so your furs can go negative.
- **The succession winner is the second weakest rival**, not the strongest.
- **Spain's better odds for village treasure** are calculated and then ignored.
- **The "withdraw from our colonies" request** seems to come up whenever the rival's colonies are small, even if you
  have nothing near them. Part of the check always reads zero.
- **An independent rival's withdrawal request has its answers swapped.** Choosing "we shall stay" appears to withdraw
  your troops.
- **Hiring a rival against a tribe uses the wrong tribe's strength** for the price, and can list a tribe that no
  longer exists.
- **"They back down if you are three times stronger"** stops working once their field army is large: the comparison
  is done in a single byte and wraps around.
- **France's advantage is mostly a rounding effect.** Halving every rise and rounding down turns all the +1 steps of
  colony pressure into nothing.

---

## Sources

All of this comes from the reconstructed C source in `matched/game/`. Nation names, ports, leaders and their hidden
numbers are the game's text resources (COUNTRY, NATIONALITY, HOMEPORT, LEADERNAME2, COLONYNAME, INDEPENDENT, FRIEND,
MISSION); every quoted message is from the same resources.

| Topic | Files |
|---|---|
| National advantages | `europe_religious_threshold.c`, `piss_off.c`, `village_anger.c`, `tribe_mission.c`, `tribe_incite.c`, `combat_fight.c`, `tribe_extortion.c`, `traffic_to_europe.c`, `europe_adjust_prices.c` |
| Starting conditions | `start_new_game.c`, `europe_init.c`, `get_game_options.c`, `build_map.c` |
| Identity | `load_data.c`, `get_colony_name.c`, `KingRoom.c`, `KingHowdy.c`, `show_ship.c`, `HallOfFame.c`, `negotiate_europe.c` |
| Computer personalities | `colony_plan.c`, `build_another_colony.c`, `is_enemy.c`, `plan_move.c`, `negotiate_tribe.c` |
| Diplomacy | `negotiate_europe.c`, `negotiate_ai.c`, `treaty_encounters.c`, `foreign_scout.c`, `move_unit.c`, `foreign_turn.c` |
| Rankings and reports | `set_ranks.c`, `ReportWin_ReportsForeign.c` |
| Leaving the game | `conquest.c`, `end_of_game_check.c`, `revolution.c`, `intern.c`, `europe_new_taxes.c` |

These findings are for the Windows release. The DOS version is believed to behave the same, but has not been checked
line by line.
