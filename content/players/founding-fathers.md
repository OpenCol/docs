# What Each Founding Father Does

*A player's guide to Sid Meier's Colonization (Windows), based on the game's own code.*

The Colonopedia describes each Founding Father in a sentence or two. This guide explains what the game **actually does**
when a father joins your Continental Congress. That is sometimes more than the description promises, sometimes less, and
in a few cases something else entirely.

Each father is marked with one of these:

- ✅ **As described.** The code does what the Colonopedia says.
- ➕ **More than described.** There are useful hidden effects.
- ⚠️ **Differs from the description.** Read the details before you rely on him.

---

## Quick reference

| Father | Category | Effect | |
|---|---|---|---|
| Adam Smith | Trade | Unlocks factories and the arsenal | ✅ |
| Jakob Fugger | Trade | Lifts all current boycotts, once | ✅ |
| Peter Minuit | Trade | Native land is free | ➕ |
| Peter Stuyvesant | Trade | Unlocks the Custom House | ➕ |
| Jan de Witt | Trade | Trade at foreign colonies; better Foreign Affairs report | ✅ |
| Ferdinand Magellan | Exploration | +1 move for ships; no random extra turn at sea | ⚠️ |
| Francisco de Coronado | Exploration | Reveals every colony, now and later | ➕ |
| Hernando de Soto | Exploration | Better rumours **for scouts only**; land units see further | ⚠️ |
| Henry Hudson | Exploration | Fur from worked land ×2 | ✅ |
| Sieur de La Salle | Exploration | Free stockade at 3 colonists | ⚠️ |
| Hernan Cortes | Military | Bigger, guaranteed plunder; cheaper treasure transport | ➕ |
| George Washington | Military | Every winning soldier or dragoon is promoted | ➕ |
| Paul Revere | Military | Colonists defend with stored muskets | ➕ |
| Francis Drake | Military | Privateers +50% | ✅ |
| John Paul Jones | Military | A free Frigate | ✅ |
| Thomas Jefferson | Political | Bells +50% | ➕ |
| Pocahontas | Political | Native alarm wiped out, then rises at half speed | ➕ |
| Thomas Paine | Political | Bells + tax rate % | ✅ |
| Simon Bolivar | Political | +20% Sons of Liberty in every colony, forever | ➕ |
| Benjamin Franklin | Political | No King's wars; Europeans always offer peace | ➕ |
| William Brewster | Religious | No criminals or servants; you choose immigrants | ✅ |
| William Penn | Religious | Preachers +50% crosses | ⚠️ |
| Jean de Brebeuf | Religious | All missions act as expert missions | ➕ |
| Juan de Sepulveda | Religious | More converts after attacking natives | ⚠️ |
| Bartolome de las Casas | Religious | All converts become free colonists, once | ➕ |

---

## How fathers are offered

### The five candidates

Whenever you have no father pending, the game draws **one candidate from each of the five categories**: Trade,
Exploration, Military, Political and Religious. You pick one of them, and your liberty bells then go towards him.

- You can't change your mind later. Viewing a candidate's Colonopedia page brings you back to the same five candidates.
- The draw happens as soon as a choice is needed, which is right at the start of the game and again straight after each father joins.
- If no father is left in a category, that category is simply missing from the list.

### Who can appear when

Each father has a weight for each of three eras. Within his category, his chance of being drawn is his weight divided by
the total weight of the fathers still available. With every father still available, the chances are:

| Father | Before 1600 | 1600–1699 | 1700 on |
|---|---|---|---|
| **Trade** | | | |
| Adam Smith | 13% | 33% | 19% |
| Jakob Fugger | never | 21% | 25% |
| Peter Minuit | **60%** | 4% | never |
| Peter Stuyvesant | 13% | 17% | 25% |
| Jan de Witt | 13% | 25% | 31% |
| **Exploration** | | | |
| Ferdinand Magellan | 7% | 32% | 40% |
| Francisco de Coronado | 11% | 16% | 28% |
| Hernando de Soto | 19% | 32% | 20% |
| Henry Hudson | 37% | 3% | never |
| Sieur de La Salle | 26% | 16% | 12% |
| **Military** | | | |
| Hernan Cortes | 30% | 20% | 4% |
| George Washington | never | 16% | 40% |
| Paul Revere | **50%** | 8% | 4% |
| Francis Drake | 20% | 32% | 24% |
| John Paul Jones | never | 24% | 28% |
| **Political** | | | |
| Thomas Jefferson | 24% | 24% | 21% |
| Pocahontas | 41% | 24% | 11% |
| Thomas Paine | 6% | 10% | 29% |
| Simon Bolivar | never | 19% | 21% |
| Benjamin Franklin | 29% | 24% | 18% |
| **Religious** | | | |
| William Brewster | 29% | 14% | 6% |
| William Penn | 33% | 18% | 12% |
| Jean de Brebeuf | 25% | 21% | 6% |
| Juan de Sepulveda | 12% | 29% | 18% |
| Bartolome de las Casas | never | 18% | **59%** |

- **"Never" really means never.** Fugger, Washington, Jones, Bolivar and las Casas can't appear before 1600. Minuit and Hudson can't appear from 1700 on.
- As fathers are taken, the others in that category become more likely.
- A candidate drawn in 1599 stays on offer after 1600. The draw is not redone when the era changes.

> **Tip:** Peter Minuit and Henry Hudson have to be taken early or not at all. If you want them, take them before 1700.

### The bell cost

The cost rises with every father you already have, with the difficulty level, and in 1600, 1650, 1700 and 1750.
Your first father costs 24 bells on Discoverer and 56 on Viceroy. The full table is in
[How Difficulty Affects the Game](difficulty.md#3-founding-fathers-and-liberty-bells).

- **Extra bells are lost.** When a father joins, the bell count goes back to zero. Any bells above the cost are not carried over.
- **The price can change while you save up.** If a threshold year passes, the cost goes up even though you already chose the father.
- **No fathers join after you declare independence.** A father still pending at the declaration never arrives. From then on your bells count towards foreign intervention.

### The computer players

- **Rivals can have the same fathers as you.** Fathers are not exclusive: you, England and France can all have Adam Smith.
- **The AI does not choose by usefulness.** It takes the candidate from whichever category has the most fathers left, and Religious wins a tie. Before 1600 its first father is therefore always an explorer.
- **Fathers are cheaper for the AI on harder levels.** See the difficulty guide.

### Score

Each father adds **5 points** to your raw score. That is later multiplied by your independence bonus and the difficulty
rating.

---

## Trade

### Adam Smith ✅

> *Allows factory-level buildings, which produce 1½ units of manufactured goods for each unit of raw material.*

- He unlocks the **Textile Mill, Cigar Factory, Rum Factory, Fur Factory, Iron Works and Arsenal**. Each needs a colony of at least 8 people.
- A factory makes 50% more goods. For tools, rum, cigars, cloth and coats it uses only 2 raw units for every 3 it produces.
- **Exception:** the Arsenal seems to get no raw-material saving. It makes 50% more muskets but still uses one tool for each musket.

### Jakob Fugger ✅

> *All boycotts currently in effect are forgiven, without back taxes.*

- When he joins, every boycott you have is lifted, free of charge.
- This happens **once only**. The King can impose new boycotts afterwards as usual.

### Peter Minuit ➕

> *Indians no longer demand payment for their land.*

- Native land claims around your colonies disappear completely. You are never asked to pay, and using that land never angers anyone.
- Pioneers can clear forest and build roads on native land with no payment prompt.
- This counts for a lot, because native land prices rise steeply on harder levels.

### Peter Stuyvesant ➕

> *Allows construction of the Custom House.*

The Custom House sells goods for you every turn, without a ship:

- For each good you mark for export, once the colony holds **100 or more**, it sells everything above 50 at the European price.
- Before independence you pay the normal tax. **After independence it pays no tax at all.** It keeps working through the war, as the description promises.
- It does **not** sell while the colony is besieged or blockaded.
- **Quirk:** it appears to ignore boycotts, so it will sell boycotted goods.

### Jan de Witt ✅

> *Trade with foreign colonies is allowed, and the Foreign Affairs report becomes more revealing.*

**Trading at foreign colonies.** Without de Witt, foreign colonies refuse to trade with your ships and wagons. With him,
you can trade with any European colony whose nation is at peace with you.

- **Selling for gold:** you get the value at their prices, minus their tax, minus a further random cut. That cut grows with difficulty, up to 60% on Viceroy.
- **Barter:** you can take up to 100 of one of their goods instead. Barter is valued **before** the tax and the cut, so it is usually the better deal.
- Before independence they never offer food, lumber, tools or muskets.
- **Quirk:** the foreign colony never actually loses the goods it gives you.

**The Foreign Affairs report** shows six extra figures for each rival: colonies, average colony size, population,
military strength, naval strength and merchant marine.

---

## Exploration

### Ferdinand Magellan ⚠️

> *+1 movement for all naval vessels; sailing time between the west map edge and Europe is shortened.*

- **+1 movement for every ship type.** This works as described.
- **No extra turn at sea.** Once you have 3 or more ships, each crossing normally has an **11% chance** of taking one extra turn. Magellan removes that chance.
- **The west-edge shortening does nothing.** The game works out a separate sailing time for voyages to and from the west edge, including Magellan's reduction, and then throws the result away. West-edge voyages take the normal time with or without him.

### Francisco de Coronado ➕

> *All existing colonies and the area around them become visible.*

- When he joins, every European colony, including your own, is revealed together with an 11×11 area around it.
- **Colonies founded later** by anyone are revealed to you too, so the effect is permanent.
- **Undocumented: Coronado protects your scouts.** When a chief would kill a scout who comes to speak with him, the chief just gets bored and the scout survives. That includes the Arawak "sacred taboos" death. The scout gets no gift that visit, but stays alive.

### Hernando de Soto ⚠️

> *Lost City Rumours are always positive, and all units have an extended sighting radius.*

- **Sight:** every **land** unit sees 2 squares instead of 1, and scouts see 3 instead of 2. Ships get nothing.
- **Rumours: his bonus only works for Scouts.** A colonist, soldier or any other unit exploring a rumour gets no benefit from de Soto at all.

What he does for a Scout:

- "Vanishes", "holy shrines" (angry natives) and "nothing but rumours" are re-rolled.
- Ruins give more gold, and Cities of Cibola give 1000 more.
- The Fountain of Youth can turn up anywhere, without the usual terrain and timing requirements.
- **Not always positive:** Burial Mounds can still happen. Digging there can find nothing and anger a nearby tribe, possibly by a full 100 alarm.

> **Tip:** With de Soto, send only Scouts (ideally Seasoned Scouts) into rumours.

### Henry Hudson ✅

> *+100% output of all fur trappers.*

- Fur from every worked land square is doubled, for experts and non-experts alike.
- The doubling comes after all other bonuses, so an Expert Fur Trapper with Hudson makes four times a free colonist's base.
- The colony's own centre square does not seem to be doubled.
- **Remember:** he can't be chosen after 1699.

### Sieur de La Salle ⚠️

> *All existing and future colonies get a free stockade when their population reaches 3.*

- When he joins, every colony with 3 or more colonists gets a Stockade. After that, each colony gets one the moment it reaches 3.
- **The catch:** colonists can't leave a stockaded colony of 3 or fewer. La Salle effectively locks every small colony at 3 people, and you can't refuse the stockade.

---

## Military

### Hernan Cortes ➕

> *Conquered native settlements always yield treasure, in greater abundance, and the King transports treasure free of charge.*

**Plunder from destroyed settlements:**

| Settlement | Without Cortes | With Cortes |
|---|---|---|
| Nomadic camp | 1-in-7 chance (Spain 1-in-4) of 200–400 | Always; about +50% |
| Agrarian village | 1-in-3 chance of 300–800 | Always; about +50% |
| Aztec city / capital | 2000–6000 / 4000–10000 | +6000 |
| Inca city / capital | 3200–9600 / 5000–15000 | +2000 to +6000 |

Camps and villages that are capitals always give treasure and double it.

**Treasure transport:**

- Without Cortes the King takes at least 50–70% (depending on difficulty), and he only offers when you have no galleon of your own.
- With Cortes his cut is just your tax rate, and he offers even if you own galleons.
- So it is cheaper, not free. The in-game message says as much.

**Undocumented:** demanding tribute from natives gets a **+50%** bonus to your threat. This stacks with Spain's own +50%.

### George Washington ➕

> *Every non-veteran soldier or dragoon who wins a combat is automatically upgraded.*

- Promotion becomes **guaranteed** for a Soldier or Dragoon that wins, whether it attacked or defended.
- Each win moves the colonist up one step: Petty Criminal → Indentured Servant → Free Colonist → **Veteran**.
- Experts (an armed Expert Farmer and so on) and converts are never promoted.
- **Undocumented:** during the War of Independence, once the Continental Army has formed, a winning Veteran becomes **Continental Army** or **Continental Cavalry**. With Washington this also happens on every win.

### Paul Revere ➕

> *When a colony with no soldiers is attacked, a colonist takes up stockpiled muskets.*

- **When it applies:** the colony must have no unit able to fight. Colonists, pioneers, wagons and missionaries don't count, and neither do ships in port. A single Scout counts as a defender and **cancels** Revere.
- **What it needs:** at least **50 muskets** in the warehouse.
- **Who defends:** a random colonist working in the colony, at defence 2 instead of 1.
- **Why it matters more than "+1":** a defender weaker than 2 is halved against regular troops. Against soldiers, dragoons and artillery, Revere effectively **quadruples** your defence, before the stockade and fort bonuses.
- **The muskets are never used up**, win or lose.
- A Veteran Soldier working inside the colony gets no veteran bonus when picked.

### Francis Drake ✅

> *The combat strength of all privateers is increased by 50%.*

Privateers get +50% in attack **and** defence. The usual penalty for carried cargo is applied after the bonus.

### John Paul Jones ✅

> *A frigate is added to your colonial navy, without cost.*

A Frigate appears on the high seas, heading for your arrival point in the New World. It should arrive about a turn later.

---

## Political

### Thomas Jefferson ➕

> *Increases liberty bell production by 50%.*

The bonus applies to each colony's **whole** bell output, not only its statesmen. Each colony's bells are worked out in
this order:

1. Start with 1 free bell, plus what the statesmen produce.
2. **Jefferson:** +50%, rounded down.
3. **Paine:** + tax rate %, rounded down.
4. **Newspaper:** ×2, or **Printing Press:** +50%.

- **Example:** three Elder Statesmen make 18 + 1 = 19 bells. Jefferson takes that to 28, and a Newspaper to 56.
- A colony with no statesmen gains nothing, because half of 1 rounds down to 0.

### Pocahontas ➕

> *All tension between you and the natives is reduced to content, and alarm is generated half as fast.*

- **When she joins:** every tribe's alarm towards you, and every settlement's anger, drops to **zero**. That is fully calm, even below "content". It also appears to end your wars with the tribes.
- **Forever after:** every increase in alarm is **halved, rounded down**.
- "Half as fast" understates it, because small increases vanish completely. A +1 becomes 0, which wipes out the slow turn-by-turn tension from colonies near native land. With France's own halving as well, anything up to +3 becomes 0.
- Large events (burning burial grounds, attacks, demanding tribute) are halved but still count.

> **Tip:** Pocahontas is most valuable early, before 1600, when she is also most likely to be offered (41%).

### Thomas Paine ✅

> *Liberty bell production is increased by the current tax rate.*

- Each colony's bells go up by **tax rate %**, rounded down. This is applied after Jefferson and before the Printing Press or Newspaper, so it compounds with both.
- At a low tax rate, small colonies gain nothing because of the rounding.
- Your tax rate freezes when you declare independence, and Paine keeps working at that frozen rate.

### Simon Bolivar ➕

> *Sons of Liberty membership in all colonies is increased by 20%.*

- **This is permanent, not a one-time boost.** Every colony, including colonies founded later, always counts **+20 percentage points** of Sons of Liberty, up to 100%.
- A new colony starts at 20% with no bells at all. A colony at 80% counts as 100%.
- The bonus counts towards everything SoL affects: the 50% and 100% production bonuses, the Tory penalty, and the rebel combat bonus during the war.

### Benjamin Franklin ➕

> *The King's European wars have no further effect, and Europeans in the New World always offer peace in negotiations.*

- **No more King's wars.** The King never orders you to declare war on a rival. That also means you never get the war compensation of gold and veteran soldiers.
- **Peaceful negotiations:** in meetings, European leaders never demand tribute or threaten war. If you are at war, they offer peace. This works even if the **rival** has Franklin rather than you.
- **Cheaper deals:**
    - paying them to withdraw troops from near your colonies costs half
    - hiring them to attack a tribe costs half
    - hiring them to attack another European costs half
- **Safer threats:** demanding a gift never provokes war, and sometimes yields 100 extra gold.
- **The downside:** after a peace treaty, the period during which the other side may not attack you is **halved**.
- Rivals can still turn down your offers, complain about your privateers, or attack you outside negotiations.

---

## Religious

### William Brewster ✅

> *No more criminals or servants appear on the docks, and you choose which immigrant moves to the docks.*

- When he joins, any Indentured Servants and Petty Criminals waiting on the docks become Free Colonists.
- From then on, when your crosses bring a new immigrant, **you pick** which of the three people in the recruitment pool comes. Without him the game picks one at random.
- Criminals and servants no longer appear. They are replaced by Free Colonists.
- **Small catch:** without Brewster, every fourth immigrant is guaranteed to be a specialist. With him, that guarantee goes away. You get fewer bad colonists, but also slightly fewer experts.

### William Penn ⚠️

> *Cross production in all colonies is increased by 50%.*

- He only boosts **colonists working as preachers** in the church, by +50% rounded down. The colony's own free crosses from the church building get nothing.
- **Examples:**
    - a Free Colonist preacher: 3 → 4 crosses (6 → 9 with a Cathedral)
    - a Firebrand Preacher: 6 → 9 (12 → 18 with a Cathedral)
    - a Petty Criminal or convert preacher makes 1 cross and gains nothing
- He does not change how many crosses each immigrant needs.

> **Tip:** Penn is only worth taking if you staff your churches with preachers.

### Jean de Brebeuf ➕

> *All missionaries function as experts.*

When he joins, all your existing missions become expert missions, and every new mission is one. An expert mission:

- calms the village **four times as fast**
- doubles the chance of a convert when you trade gifts
- greatly improves the convert chance when you subjugate the village (see Sepulveda)
- makes inciting that tribe much cheaper (−1000 per mission instead of −250)
- defends twice as well when a rival denounces it as heresy

**Bonus:** if a village with your mission is destroyed, the missionary comes back as a **Jesuit Missionary**.

### Juan de Sepulveda ⚠️

> *Increases the chance that subjugated natives will convert and join a colony.*

**When a convert can appear:** after you defeat a native settlement's defenders, but **only if your mission is in that
village**. Without a mission there are no converts from fighting. The chances are:

| | Plain mission | Expert mission |
|---|---|---|
| Without Sepulveda | 31% | 62% |
| With Sepulveda | 62% | 92% |

Spain adds another +31%.

**Hidden downsides:**

- Your missions calm natives only **half** as well. A plain mission in an ordinary village then calms nothing at all.
- Founding a new mission causes more alarm when you already have missions in that tribe.

### Bartolome de las Casas ➕

> *All existing converts are assimilated into the colonies as free colonists.*

- **When he joins:** every convert you own becomes a **Free Colonist**. That includes converts on the map, on ships and working in colonies. It happens **once only**; converts you gain later stay converts.
- **Permanent effects:**
    - Missions calm natives **twice** as well.
    - Founding a mission causes **less** alarm.
    - Subjugating villages yields **fewer** converts. Without Spain or an expert mission, you get none at all.
- Las Casas and Sepulveda cancel each other out exactly.

> **Tip:** las Casas is a big score boost if you have many converts. A convert scores 1 point and a free colonist 2.

---

## Bugs and surprises at a glance

- **Magellan's west-edge sailing bonus** is calculated and then discarded.
- **De Soto's rumour bonus** only works for Scouts.
- **Penn** only helps preachers, not a colony's other cross production.
- **Coronado** secretly keeps your scouts from being killed by chiefs.
- **La Salle's stockades** lock colonies at a minimum of 3 colonists.
- **Bolivar's +20%** is a permanent bonus in every colony, not a one-time increase.
- **Pocahontas** makes small alarm rises disappear completely, not just halve.
- **Paul Revere's muskets** are never used up.
- **Brewster** removes the guaranteed every-fourth specialist from immigration.
- **Extra bells are lost** whenever a father joins.

---

## Sources

All of this comes from the reconstructed C source in `matched/game/`. The father list and category
order are in `include/fathers.h`. The in-game descriptions are the FATHER0–FATHER24 text
resources, and the era weights are the FATHERS table.

| Topic | Files |
|---|---|
| Offering and joining | `choose_freedom.c`, `avail_of_father.c`, `Century.c`, `freedom_level.c`, `add_liberty.c`, `give_me_liberty.c`, `ReportWin_Score.c` |
| Trade | `eligible_to_build.c`, `compute_colony_yield.c`, `colony_indian_table.c`, `village_bribe.c`, `new_turn_colony.c`, `foreign_cargo.c`, `ReportWin_ReportsForeign.c` |
| Exploration | `move_rate.c`, `get_voyage_delay.c`, `coronado_colony.c`, `create_colony.c`, `tribe_camp.c`, `explore_square.c`, `lost_city_exploration.c`, `compute_yield.c`, `set_job.c`, `job_change_legal.c` |
| Military | `combat_fight.c`, `free_galleon2.c`, `move_unit.c`, `tribe_extortion.c`, `try_to_improve.c`, `get_combat.c` |
| Political | `compute_colony_yield.c`, `piss_off.c`, `village_anger.c`, `colony_rebel.c`, `europe_new_wars.c`, `negotiate_europe.c` |
| Religious | `fill_docks.c`, `europe_new_turn.c`, `europe_recruit.c`, `compute_colonist_yield.c`, `tribe_mission.c`, `indian_village.c` |

These findings are for the Windows release. The DOS version is believed to behave the same but has not been checked
line by line.
