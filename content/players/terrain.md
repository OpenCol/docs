# Terrain and Production

*A player's guide to Sid Meier's Colonization (Windows), based on the game's own code.*

Every square on the map has a terrain type. It may also have a river, a road, plowed fields or a special resource. Together
these decide what a colonist working the square produces, how fast units cross it, and how well a unit standing on it
defends. The Colonopedia shows a simplified summary. This guide gives the formula the game actually uses, and the
numbers that come out of it.

The terrain figures come from the game's own data tables (`UNFORESTED`, `FORESTED`, `OTHER` and `RESOURCE` in
COLTEXT0.DLL). The rules that turn those figures into production were read out of the reconstructed game code. Sources
are listed at the end.

In the tables below, **"free / expert"** means what a free colonist makes, then what the matching expert makes
(Expert Farmer for food, Expert Fur Trapper for furs, and so on). A dash means the square makes none of that good.

---

## At a glance

| Rule | Value |
|---|---|
| Best food square | Plains: 5 food (6 plowed, 7 plowed with a river) |
| Expert farmer / fisherman | **+2** on top of a free colonist (the Colonopedia says +3) |
| Every other expert | **×2** |
| Plowing | +1 to food, sugar, tobacco and cotton (+2 for an expert planter) |
| Road | +1 to furs, lumber, ore and silver (+2 for experts, and always +2 for lumber) |
| River | +1 to everything on the square (+2 for experts other than farmers and fishermen, and for lumber) |
| Major river | only better than a minor river when the river is the square's *only* bonus. It never adds extra food |
| Fishing | needs **Docks**. 4 food on a coastal or lake square, 2 near the coast, 1 in open sea |
| Colony square | 3 food on most open land (+1 plowed), plus one secondary good |
| Mines that run out | Minerals and Silver Deposits. **Ore Deposits on hills never do** |
| Clearing a forest | the nearest colony within 3 squares gets 20 lumber, or up to 80 with a Lumber Mill (doubled for a Hardy Pioneer) |
| Road movement | 1/3 of a move per step, when both squares have a road |
| River movement | 1/3 of a move per step, when both squares have a river and the step is not diagonal |
| Defence | marsh/swamp +25%, forest +50%, rain forest +75%, hills +100%, mountains +150% |
| Colony on hills | **gets no hills bonus**. Inside a colony only the colony's own +50% and its stockade, fort or fortress count |

---

## 1. The terrain types

There are eight open terrains and eight forests. Each forest sits on one of the open terrains, and clearing it turns
the square into that terrain. Hills and mountains are never forested.

| Terrain | Becomes when cleared | Move cost | Defence | Special resource | Road (turns) | Plow / clear (turns) |
|---|---|---|---|---|---|---|
| Tundra | – | 1 | – | Minerals | 4 (2) | 6 (3) |
| Desert | – | 1 | – | Oasis | 3 (1) | 5 (2) |
| Plains | – | 1 | – | Wheat | 3 (1) | 5 (2) |
| Prairie | – | 1 | – | Prime Cotton | 3 (1) | 5 (2) |
| Grassland | – | 1 | – | Prime Tobacco | 3 (1) | 5 (2) |
| Savannah | – | 1 | – | Prime Sugar | 3 (1) | 5 (2) |
| Marsh | – | 2 | +25% | Minerals | 5 (2) | 7 (3) |
| Swamp | – | 2 | +25% | Minerals | 7 (3) | 9 (4) |
| Boreal Forest | Tundra | 2 | +50% | Game | 4 (2) | 6 (3) |
| Scrub Forest | Desert | **1** | +50% | Oasis | 4 (2) | 6 (3) |
| Mixed Forest | Plains | 2 | +50% | Beaver | 4 (2) | 6 (3) |
| Broadleaf Forest | Prairie | 2 | +50% | Game | 4 (2) | 6 (3) |
| Conifer Forest | Grassland | 2 | +50% | Prime Timber | 4 (2) | 6 (3) |
| Tropical Forest | Savannah | 2 | +50% | Prime Timber | 6 (3) | 8 (4) |
| Wetland Forest | Marsh | 3 | +50% | Minerals | 6 (3) | 8 (4) |
| Rain Forest | Swamp | 3 | +75% | Minerals | 7 (3) | 9 (4) |
| Hills | – | 2 | +100% | Ore Deposit | 4 (2) | cannot plow |
| Mountains | – | 3 | +150% | Silver Deposit | 7 (3) | cannot plow |
| Arctic | – | 2 | – | – | 4 (2) | 6 (3), pointless |
| Ocean | – | 1 | – | Fishery | – | – |
| Sea Lane | – | 1 | – | – | – | – |

- **Move cost** is in whole moves. A colonist has one move (see §8).
- **Turns** count the turn you give the order. The number in brackets is for a **Hardy Pioneer**, who halves the time (rounding down). Plowing and clearing take 2 turns longer than a road on the same square.
- The **Plow** order is greyed out on hills and mountains. On a forest square the same order is called "Clear Forest".
- Colonies cannot be built on mountains, on water, in the top or bottom map rows (the Arctic Circle), or next to another colony.

---

## 2. What each square produces

This is the base production of every terrain, with no plowing, road, river or resource. The free colonist is the first
number and the expert the second.

| Terrain | Food | Sugar | Tobacco | Cotton | Furs | Lumber | Ore | Silver |
|---|---|---|---|---|---|---|---|---|
| Tundra | 3 / 5 | – | – | – | – | – | 2 / 4 | – |
| Desert | 2 / 4 | – | – | 1 / 2 | – | – | 2 / 4 | – |
| Plains | **5 / 7** | – | – | 2 / 4 | – | – | 1 / 2 | – |
| Prairie | 3 / 5 | – | – | **3 / 6** | – | – | – | – |
| Grassland | 3 / 5 | – | **3 / 6** | – | – | – | – | – |
| Savannah | 4 / 6 | **3 / 6** | – | – | – | – | – | – |
| Marsh | 3 / 5 | – | 2 / 4 | – | – | – | 2 / 4 | – |
| Swamp | 3 / 5 | 2 / 4 | – | – | – | – | 2 / 4 | – |
| Boreal Forest | 2 / 4 | – | – | – | **3 / 6** | 4 / 8 | 1 / 2 | – |
| Scrub Forest | 2 / 4 | – | – | 1 / 2 | 2 / 4 | 2 / 4 | 1 / 2 | – |
| Mixed Forest | 3 / 5 | – | – | 1 / 2 | **3 / 6** | **6 / 12** | – | – |
| Broadleaf Forest | 2 / 4 | – | – | 1 / 2 | 2 / 4 | 4 / 8 | – | – |
| Conifer Forest | 2 / 4 | – | 1 / 2 | – | 2 / 4 | **6 / 12** | – | – |
| Tropical Forest | 3 / 5 | 1 / 2 | – | – | 2 / 4 | 4 / 8 | – | – |
| Wetland Forest | 2 / 4 | – | 1 / 2 | – | 2 / 4 | 4 / 8 | 1 / 2 | – |
| Rain Forest | 2 / 4 | 1 / 2 | – | – | 1 / 2 | 4 / 8 | 1 / 2 | – |
| Hills | 2 / 4 | – | – | – | – | – | **4 / 8** | – |
| Mountains | – | – | – | – | – | – | **4 / 8** | 0 / 1 (see §4) |
| Arctic | – | – | – | – | – | – | – | – |

Ocean and Sea Lane squares produce only fish, which counts as food. See §5.

How these numbers come about:

- **Food** gets +1 on top of the data table on every square that grows any. This +1 is part of the formula, not a bonus you can earn.
- **Lumber** is the table figure doubled. So Mixed and Conifer forests give 6.
- **Expert farmers and expert fishermen add 2.** All other experts **double** their output.
- On the land, an **Indentured Servant or Petty Criminal produces exactly what a free colonist does**. The formula only asks whether the worker is the matching expert or a native convert (§10).

> **Tip:** A free colonist on plains makes as much food as an expert farmer on prairie or grassland. Put your first farmer on plains, or on savannah if there is no plains.

---

## 3. Plowing, roads and rivers

Each improvement adds a fixed **step** after the base and the expert bonus:

- The step is **1** for free colonists, expert farmers and expert fishermen.
- The step is **2** for every other expert, and for anyone cutting lumber.

| What is on the square | Which goods it helps | How much |
|---|---|---|
| Plowed | food, sugar, tobacco, cotton | +1 step |
| Road (or a colony or village on the square) | furs, lumber, ore, silver | +1 step |
| River, minor or major | everything | +1 step |
| Major river | everything | +1 more step, **but only if nothing else above applied** |

**Furs get the road and the river twice.** Before the steps, the fur yield already gets +1 for a road, +1 for a river and
+1 more for a major river. A free trapper therefore makes +2 from a road and +2 from a river, and an expert, who doubles that
earlier part, makes +4 from each.

**The major-river rule is a trap.** Food always takes its built-in +1 first, so a major river never gives more food than a
minor one. A plowed field or a road also cancels the major river's extra. A major river is only worth more on unplowed
crop land, or on a forest, hill or mountain without a road.

### Food

| Terrain | Free colonist: bare / plowed / plowed + river | Expert farmer: bare / plowed / plowed + river |
|---|---|---|
| Plains | 5 / 6 / **7** | 7 / 8 / **9** |
| Savannah | 4 / 5 / 6 | 6 / 7 / 8 |
| Tundra, Prairie, Grassland, Marsh, Swamp | 3 / 4 / 5 | 5 / 6 / 7 |
| Desert | 2 / 3 / 4 | 4 / 5 / 6 |
| Hills | 2 / – / – | 4 / – / – |
| Mixed or Tropical forest | 3 / – / 4 with a river | 5 / – / 6 with a river |
| Other forests | 2 / – / 3 with a river | 4 / – / 5 with a river |

### Cash crops (sugar, tobacco, cotton)

| Square | Free: bare / plowed / plowed + river | Expert: bare / plowed / plowed + river |
|---|---|---|
| Savannah (sugar), Grassland (tobacco), Prairie (cotton) | 3 / 4 / 5 | 6 / 8 / **10** |
| Swamp (sugar), Marsh (tobacco), Plains (cotton) | 2 / 3 / 4 | 4 / 6 / 8 |
| Desert (cotton) | 1 / 2 / 3 | 2 / 4 / 6 |
| Forests with a crop yield of 1 (cannot be plowed) | 1 / – / 2 with a river | 2 / – / 4 with a river |

On unplowed land a major river gives the same as plowed land with a river, for example 5 sugar on savannah, or 10 for
an expert.

### Furs, lumber and ore

| Square | Free: bare / road / road + river | Expert: bare / road / road + river |
|---|---|---|
| Furs: Boreal or Mixed forest | 3 / 5 / 7 | 6 / 10 / 14 |
| Furs: the other 2-yield forests | 2 / 4 / 6 | 4 / 8 / 12 |
| Lumber: Mixed or Conifer forest | 6 / 8 / 10 | 12 / 14 / 16 |
| Lumber: the 4-yield forests | 4 / 6 / 8 | 8 / 10 / 12 |
| Ore: Hills or Mountains | 4 / 5 / 6 | 8 / 10 / 12 |
| Ore: Tundra, Desert, Marsh, Swamp | 2 / 3 / 4 | 4 / 6 / 8 |

> **Tip:** A road matters little to an expert lumberjack (+2 on 12), but it lifts an expert fur trapper from 6 to 10.

### Worked examples

- A free colonist on **plowed plains with a river** makes 7 food. An expert farmer makes 9. With **Wheat** on the square they make 9 and 13.
- An expert tobacco planter on **plowed grassland with Prime Tobacco and a river** makes 16. That is 3 doubled for the expert, doubled again by the resource, then +2 for plowing and +2 for the river.
- An expert fur trapper on **mixed forest with Beaver, a road and a river** makes 20. With Henry Hudson that becomes 40.

---

## 4. Special resources

| Resource | Found on | Effect | For the matching expert | Runs out? |
|---|---|---|---|---|
| Wheat | Plains | food +2 | +4 | no |
| Oasis | Desert, Scrub Forest | food +2 | +4 | no |
| Game | Boreal and Broadleaf Forest | food +2 **and** furs +2 | +4 each | no |
| Beaver | Mixed Forest | furs +3 | +6 | no |
| Prime Cotton | Prairie | cotton ×2 | ×2 on top of the expert's ×2 | no |
| Prime Tobacco | Grassland | tobacco ×2 | ×2 on top | no |
| Prime Sugar | Savannah | sugar ×2 | ×2 on top | no |
| Prime Timber | Conifer, Tropical Forest | lumber +4 (+2 before lumber is doubled) | +8 | no |
| Minerals | Tundra, Marsh, Swamp, Wetland and Rain Forest | ore +3, silver +1 | +6 ore, +2 silver | **yes** |
| Ore Deposit | Hills | ore +2 | +4 | **never** |
| Silver Deposit | Mountains | silver +2 | +4 | **yes** |
| Fishery | Ocean | fish +3 | +6 | no |

- The "prime" doubling is applied **before** plowing and the river. Those still add only their normal step.
- **A Minerals square appears to yield a little silver even though the terrain has none.** The formula gives 1, or 2 for an expert silver miner, plus the usual road and river steps.
- **Silver with no resource is barely worth mining.** On a mountain without a Silver Deposit, a free colonist makes nothing unless the square has a road. With a road, or as an expert, the output is fixed at **1**: no road, river or expert bonus applies.

### Where resources appear

Resources are not stored on the map. The game recalculates them from each square's position, a number picked when
the map was made, and whether the square is forested.

- Within every 4×4 block of squares there are **two candidate positions, two squares apart diagonally**. Which two depends on that number, and on whether the square is forest or open land.
- **Clearing a forest removes its forest resource.** Because open land uses different positions, a freshly cleared square can occasionally turn out to hold an open-land resource such as Wheat.
- A native village square never shows a resource.
- **Fisheries only exist near land.** When the map is made, any ocean resource with no land within two squares (a 5×5 area without its corners) is erased.

### Mines running out

Each turn, a colony rolls once for each colonist mining ore on Minerals or mining silver on a Silver Deposit, and **twice**
for each colonist mining silver on Minerals. A roll comes up with a chance that rises with difficulty:
**1/2 · 2/3 · 3/4 · 4/5 · 5/6**. Each success adds 1 to a counter that the colony's mines share. When it reaches **50**:

- **every** Minerals or Silver Deposit square in that colony being worked by an ore or silver miner is exhausted at once;
- the "Mine depleted" message is shown;
- the counter drops back by 50.

For the average number of turns this takes on each level, see [How Difficulty Affects the Game](difficulty.md).

What is left afterwards:

- **Minerals simply disappear**, leaving ordinary terrain.
- **A Silver Deposit becomes a "Depleted Mine".** It still mines like a plain mountain, but **without the plain mountain's limit**: 1 silver for a free colonist and 2 for an expert, plus road and river steps. So a depleted mine with a road (2 / 4) still beats an untouched plain mountain (0 or 1 / 1).
- **Ore Deposits on hills are never counted and never run out.**

> **Tip:** Put your ore miners on hills with an Ore Deposit. An expert there makes 12 ore, 14 with a road, forever.

---

## 5. Water: fishing, coasts, lakes and the sea lane

Ocean and Sea Lane squares both have a base fish yield of 3. That figure is then adjusted for how many of the square's 8
neighbours are also water. Land squares and off-map squares count as not water.

| Water squares around it | Free colonist | Expert fisherman | With a Fishery: free / expert |
|---|---|---|---|
| 0–5 (a coast, a bay or a lake) | **4** | **6** | 7 / **12** |
| 6–7 | 2 | 4 | 5 / 10 |
| 8 (open sea) | 1 | 3 | 4 / 9 |

- **Nothing is caught without Docks.** The colony can only build Docks if at least one of its 8 surrounding squares is water.
- **Lakes count.** An inland lake is just enclosed ocean, so it is usually a 4-food square. Ships cannot enter a lake, though, and when you found a colony with water access only to a lake, the advisor warns that it has no port.
- **Sea Lanes** fish like ocean, but they are open sea far from shore, so in practice you will never work one.
- Fish is added to the colony's food.

> **Tip:** The best fishing square is not open sea. It is a bay surrounded by land on three sides or more.

---

## 6. The colony square

The square a colony stands on produces food and one other good every turn without anyone working it. **This does not use
the terrain's normal food yield.** The game uses a fixed figure instead:

| Colony square | Food | Food if plowed |
|---|---|---|
| Tundra, Plains, Prairie, Grassland, Savannah, Marsh, Swamp | 3 | 4 |
| Hills, and every forest except Scrub | 2 | – |
| Desert, Scrub Forest | 1 | 2 (Desert) |
| Arctic | 0 | 1 |

On top of that:

- **+2 food** if the square has an Oasis, Wheat or Game.
- Extra food on the two easiest levels: see [difficulty.md](difficulty.md#free-food-on-the-colony-square).
- +1 food at 50% Sons of Liberty and +1 more at 100%.

**The secondary good** is whichever of sugar, tobacco, cotton, furs, ore or silver the terrain yields most of. The game uses
the raw data figure plus any resource bonus, and doubles it for a "prime" resource. Lumber is never chosen. On a tie the
first in that list wins. It then gets **+1 for a minor river or +2 for a major one**, the Sons of Liberty bonus, and +1 on
Discoverer. Plowing does **not** raise it.

| Colony square | Secondary good |
|---|---|
| Hills | 4 ore (6 with an Ore Deposit) |
| Prairie / Grassland / Savannah | 3 cotton / tobacco / sugar (6 with the prime resource) |
| Boreal or Mixed Forest | 3 furs (5 with Game, 6 with Beaver) |
| Plains | 2 cotton |
| Tundra, Desert | 2 ore (Tundra: 5 with Minerals) |
| Marsh / Swamp | 2 tobacco / sugar (5 ore if the square has Minerals) |
| Scrub, Broadleaf, Conifer, Tropical, Wetland Forest | 2 furs (Broadleaf: 4 with Game. Wetland: 4 ore with Minerals) |
| Rain Forest | 1 sugar (4 ore with Minerals) |

Nobody works the colony square, so there are no expert bonuses, Tory penalties or Henry Hudson doubling.

> **Tip:** Don't build your colony on the best farming square. On plains the colony square makes 3 food, but a farmer working that plains square would make 5 to 7. Build on prairie, grassland or tundra next to the plains instead.

> **Tip:** Have a pioneer clear and plow the colony square. A forested colony square makes 2 food, a cleared one 3, and a plowed one 4.

> **Tip:** A colony on **hills** makes 4 ore for free, which keeps a blacksmith busy from day one.

---

## 7. Pioneers: clearing, plowing and roads

The turn counts are in the table in §1. A job uses up **20 tools** when it finishes. A pioneer left with fewer than 20 tools
becomes a plain colonist again.

### Lumber from clearing a forest

When a forest is cleared, lumber goes to **your nearest colony**, if it is within distance 3. The game measures distance
as the longer side plus half the shorter side, rounded down. So 3 squares in a straight line counts, and so does 2
squares diagonally. The colony doesn't need to be on the same landmass.

| Colony | Lumber delivered (Hardy Pioneer in brackets) |
|---|---|
| Without a Lumber Mill | **20 (40)**, whatever the forest |
| With a Lumber Mill: Mixed or Conifer | 80 (160) |
| With a Lumber Mill: Boreal, Broadleaf, Tropical, Wetland, Rain | 60 (120) |
| With a Lumber Mill: Scrub | 40 (80) |

The amount is capped by the room left in the colony's warehouse.

> **Tip:** If you plan to clear a lot of forest, build the Lumber Mill first. It quadruples what a Mixed or Conifer forest gives.

### Clearing is not plowing

Clearing a forest leaves open land that is **not yet plowed**. Plowing it is a second job. A colony's square can be
cleared and plowed like any other square.

### Natives

**Plowing open land never upsets the natives.** Clearing forest or building a road on land a tribe claims raises its alarm,
unless you pay when asked. For how much, see [difficulty.md](difficulty.md#making-them-angry).

---

## 8. Moving across the map

Internally a unit's moves are counted in thirds. The cost of a step is the terrain's move cost from §1 (×3), except:

- **Road at both ends:** 1/3 of a move. Colony and village squares count as having a road.
- **River at both ends, and the step is not diagonal:** 1/3 of a move. Minor and major rivers both count.
- **Entering a colony or village square** never costs more than 1 move.
- **Stepping between land and water** with no colony at either end (landing, or boarding a ship at sea) uses up the unit's whole turn.

**Running short.** A unit that hasn't moved yet this turn can always make its first step, however expensive. A unit that has
already moved, and has fewer points left than the step costs, gets one roll: the step succeeds with a chance of
**points left ÷ step cost**. If it fails, the unit's turn ends where it stands.

*Example:* a colonist moves 1/3 along a road and then tries to climb hills (cost 2). It has 2/3 of a move left against a
cost of 2, so it gets there one time in three.

**Hills and mountains do not let a unit see further.** Sight range depends only on the unit type and on Hernando de Soto.

---

## 9. Fighting on terrain

A unit's defence is multiplied by **1 + (bonus × 25%)**, where the bonus is the terrain's defence figure. The percentages
in §1 come from this. The Colonopedia shows the same percentages.

| Situation | What counts |
|---|---|
| In the open | the terrain's defence |
| **In a colony** | **not the terrain.** +50% plus +50% per fortification level: stockade +100%, fort +150%, fortress +200% |
| Fortified (not ships) | +50% more, but only while the bonus so far is +100% or less. That gives +150% on hills, nothing extra on mountains, and inside a colony stops adding once there is a fort |

**Ambush.** When **natives** attack one of your units outside a colony, the defender gets no terrain bonus. The attacker
gets it instead, as an attack bonus. After you declare independence the same works in your favour: your troops attacking
the King's troops, with neither unit in a colony, gain the terrain's defence as an ambush bonus.

> **Tip:** Building a colony on hills is good for its ore, not its defence. Inside the colony the hills don't count. Soldiers fortified on the hills *next to* the colony get +150%.

---

## 10. Other things that change land production

These apply to worked squares (not the colony square):

- **Sons of Liberty:** +1 at 50% and +2 at 100% on every square that produces something. The bonus is added early, so an expert's ×2, lumber's ×2, a prime resource and Henry Hudson all double it as well. Expert farmers and fishermen get it twice instead.
- **Tories:** the production penalty is taken off **last**, so on the land it is never doubled. For when it applies, see [difficulty.md](difficulty.md#tories-and-the-production-penalty).
- **Native converts:** +1 food, sugar, tobacco, cotton, furs or fish (not lumber, ore or silver). The +1 appears to be added even where the square's own yield is 0.
- **Henry Hudson:** furs from worked land ×2, applied after everything else. See [founding-fathers.md](founding-fathers.md#henry-hudson-).

---

## Curiosities and bugs found in the code

- **Bigger fishing bonuses were written but can never happen.** The fish formula has steps of +2, +3 and +4 for squares with fewer than 4, 3 and 1 water neighbours. An earlier "fewer than 6" step already catches all of those, so the best coastal bonus is +1.
- **A major river never adds extra food**, and adds nothing extra to plowed land or a square with a road (§3).
- **The Colonopedia overstates expert farmers and fishermen.** It says "Expert +3". The production formula adds +2.
- **Henry Hudson does not double the colony square's furs.** The colony square's production is calculated separately and never checks for him.
- **A depleted Silver Deposit mines better than an untouched plain mountain** (§4).
- **The resource list has two "Prime Timber" entries.** No terrain ever uses the second one, and it has no production effect.
- **Clearing gives a flat 20 lumber without a Lumber Mill.** Only with the mill does the type of forest matter.
- **Colonies were apparently meant to grow.** The code that decides which squares a colony may work can widen the work area from the 8 surrounding squares to 12, and then to 20, as the second and third Town Hall levels are built. Neither of those Town Halls can ever be built, so the area is always 8 squares.
- **Lost City Rumours are placed the same way as resources:** a hash of the square's position and the map's number. There is at most one per 4×4 block, never on water or arctic.

---

## Sources

All rules come from the reconstructed C source in `matched/game/`. The terrain figures are the data
tables the game loads at start-up: `UNFORESTED`, `FORESTED`, `OTHER` and `RESOURCE` in COLTEXT0.DLL, exported to
`export/text/COLTEXT0.DLL/`. Each terrain row holds the move cost, defence, improvement
turns, an AI site value and nine yields, in that order. These tables match the DOS version's `NAMES.TXT` line for line.
The terrain-to-resource table is read straight from the executable (segment 27, offset 0x2ca), the same table the
Colonopedia draws its resource icon from. The terrain ids are in `include/terrain.h`, and the
background is in `docs/findings/terrain-table.md` and
`docs/findings/map-planes.md`. Random rolls use `rand_range(lo, hi)`, which includes both ends.

| Topic | Files |
|---|---|
| Terrain data | `load_data.c`, `load_terrain.c`, `terrain_type.c`, `terrain_at.c` |
| Land production | `compute_yield.c`, `get_yield_type.c`, `resource_bonus.c`, `resource_at.c`, `scan_for_terrain.c`, `scan_for_one_terrain.c` |
| Colony square | `compute_colony_yield.c` |
| Mines running out | `compute_yield.c`, `new_turn_colony.c`, `colony_depletion.c` |
| Resource placement | `resource_at.c`, `build_map.c`, `lost_city_at.c` |
| Pioneers | `orders_clear.c`, `orders_road.c`, `perform_orders_clear.c`, `perform_orders_road.c`, `use_tools.c`, `find_close_colony.c`, `xy_dist.c`, `MainWin_CheckMenuItems.c` |
| Colony sites and Docks | `orders_build.c`, `eligible_to_build.c`, `colony_map_status.c`, `on_colony_map.c`, `building_level.c`, `move_is_legal.c` |
| Movement and sight | `move_unit.c`, `explore_square.c` |
| Combat | `get_defense.c`, `combat_fight.c` |
| Colonopedia | `PediaWin_DoTerrainArticle.c` |

These findings are for the Windows release. The DOS version is believed to behave the same but has not been checked
line by line.
