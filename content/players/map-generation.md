# How the New World Is Generated

*A player's guide to Sid Meier's Colonization (Windows), based on the game's own code.*

Every "New World" game is played on a freshly invented continent. The manual says the four world settings make the land
"larger" or the climate "wetter". This guide shows what the generator actually does with them, step by step, from the
first brush stroke of land to the square your caravel is sent to. It also covers the parts of the map that are *not*
stored anywhere: the special resources and the Lost City Rumours are laid over the map by a fixed formula, and once you
know the formula you can predict them.

How much each terrain type produces is a separate topic, covered in [terrain.md](terrain.md).

Map coordinates below count from 0 at the top-left: columns 0–57, rows 0–71.

---

## At a glance

| What | Rule |
|---|---|
| Map size | **58 × 72** squares, for both the New World and the America map |
| Where land can be drawn | roughly columns 4–52; one end of the map (chosen at random) keeps its last 4–6 rows as open sea |
| Climate | latitude bands from the middle row outwards, then reworked by moisture blowing in off the sea |
| Mountains | where three or more strokes of the land brush overlap, plus a random scatter |
| Forests | almost all coastal and "thin" land; the overlapping heart of a continent stays open |
| Rivers | 16 to 48 of them with the Customize settings, up to 64 on a random world |
| High Seas, east | from the east edge to 4 squares off the easternmost coast, never more than half-way in (column 29) |
| High Seas, west | the two westernmost columns |
| Polar ice | the top and bottom rows; land on the next row is turned to Arctic |
| Special resources | a fixed pattern: **2 squares in every 4 × 4 block**, one pattern for forest and one for everything else |
| Lost City Rumours | a fixed pattern: **at most 1 per 4 × 4 block**, about half the blocks |
| Native settlements | one capital per tribe, then at most one village per 5 × 5 block, **84** at most in all |
| Your starting square | row 28 or 42, at the inner edge of the High Seas (any of four rows on the America map) |

---

## 1. Three ways to start

The opening menu offers three kinds of new game:

| Menu choice | Map | World settings |
|---|---|---|
| **Start a Game in NEW WORLD** | generated | each setting rolled at random, **0 to 3** |
| **Start a Game in AMERICA** | loaded from the file `AMER2.MP` | not used |
| **CUSTOMIZE New World** | generated | you pick; the screen always opens on the middle choice of each |

The Customize screen has four settings with three choices each:

| Setting | 0 | 1 | 2 |
|---|---|---|---|
| Land Mass | Small | Moderate | Large |
| Land Form | Archipelago | Normal | Continents |
| Temperature | Cool | Temperate | Warm |
| Climate | Arid | Normal | Wet |

There is also a **fifth, hidden setting** that controls how rough the land is (see step 4). Customize always sets it to 1.

**The quick-start NEW WORLD game rolls each setting from 0 to 3, not 0 to 2.** A quarter of the time each setting lands
on a fourth step the Customize screen cannot offer: more land than Large, a stronger brush than Continents, warmer than
Warm, wetter than Wet. The hidden roughness setting is rolled the same way.

> **Tip:** If you want an extreme world (a huge, wet, river-filled continent), the random NEW WORLD start is the only way
> to get one. Customize caps every setting at the third choice.

---

## 2. What each setting changes

| Setting | What it changes in the code |
|---|---|
| **Land Mass** | How much land is drawn. Also adds 8 rivers per step. |
| **Land Form** | Also how much land is drawn (exactly as much as Land Mass). Continents switches to a fatter brush. Archipelago always adds the maximum number of extra islands. |
| **Temperature** | Shifts the latitude bands by 2 rows per step. |
| **Climate** | How much moisture the sea gives the land, and how slowly it is used up. Adds 8 rivers per step and makes major rivers longer and more likely. |
| **Hidden roughness** | How many random hills, mountains and terrain changes are scattered: 800 per step, starting at 800. |

Land Mass and Land Form are simply added together to set the amount of land. "Small + Continents" gives the same amount of
land as "Large + Archipelago". What Land Form changes on top of that is the *shape*.

---

## 3. Step 1: drawing the land

The map starts as all Ocean. Land is then painted on with a random-walk brush, one stroke at a time:

- Each stroke starts at a random point (columns 8–49, rows 4–67) and wanders diagonally for **3 to 66 steps**, dropping a
  small L-shaped mark of three squares at every step.
- With **Continents** (or the random fourth step) the stroke is shorter, **3 to 50 steps**, but each step also has a 1 in 4
  chance of an extra mark on each of its four diagonal neighbours. That gives fatter, blobbier land.
- Strokes stop at the edges of a drawing area: **columns 4 to 51** (a stray mark can reach column 52 or 53).
  At one end of the map, chosen by a coin flip, no land is drawn in roughly the last six rows, and the four
  outermost rows there are always open sea. At the other end, land may run right up to the polar ice.

Strokes are added until the total painted area passes a target:

| Painted area target | Archipelago | Normal | Continents |
|---|---|---|---|
| **Small** | 320 | 640 | 960 |
| **Moderate** | 640 | 960 | 1280 |
| **Large** | 960 | 1280 | 1600 |

The formula is 320 × (Land Mass + Land Form + 1), so the random fourth steps can reach 2240. The target counts painted
squares *per stroke*, so a square covered by two strokes counts twice. The land you actually get is smaller than these
numbers, and the bigger settings overlap more.

### Extra islands

Next the game adds small islands. Each one is a short walk of 3–18 orthogonal steps from a random sea square, drawn
once (6 times in 10), twice (1 in 10) or three times over (3 in 10). The number of island strokes is:

- **Archipelago:** always **15**.
- **Normal or Continents:** a random number from **0 to 15**.

This was meant to top the map up to 15 separate landmasses. The count it is based on is broken, so it always adds the
maximum (see *Curiosities*).

### Tidying corners

Finally, wherever two land squares touch only at a corner, the gap is filled in. Apart from polar ice, you will not find
land that meets other land only diagonally.

---

## 4. Step 2: latitude, moisture, hills

### Latitude bands

Every land square first gets a terrain from its distance to the **middle row (row 36)**, jittered by up to 8 rows either
way. Because of the jitter, the band edges are ragged:

| Rows from the equator (Temperate) | Starting terrain |
|---|---|
| 0–3 | Savannah |
| 4–7 | Grassland |
| 8–11 | Desert |
| 12–15 | Prairie |
| 16–23 | Plains |
| 24 or more | Tundra |

**Cool** adds 2 rows to every distance, so each band moves 2 rows towards the equator. **Warm** moves them 2 rows away, and the
random fourth step moves them 4.

Squares covered by three or more overlapping strokes become **Mountains**. So mountain ranges grow in the thick middle of
big landmasses. (Squares covered by exactly two strokes are briefly marked as hills, but the next pass flattens them all.)

### Moisture from the sea

Next, each row is swept twice, **west to east** and then **east to west**, carrying a store of moisture:

- Every sea square tops the store up by 1, up to a ceiling.
- Every land square spends part of it: a random 1 to (7 − 2 × Climate).
- A mountain spends 3 more.
- While the store is **positive**, the land gets one step wetter.
- When the store goes **negative**, the land gets one step drier. That happens just after the store runs out and in the lee
  of mountains, and only in the west-to-east sweep.

| | Arid | Normal | Wet | random 4th step |
|---|---|---|---|---|
| Ceiling, west-to-east sweep | q | q + 4 | q + 8 | q + 12 |
| Ceiling, east-to-west sweep | d/2 | d/2 + 1 | d/2 + 2 | d/2 + 3 |
| Spent per land square | 1–7 | 1–5 | 1–3 | 1 |

Here *d* is the row's distance from the middle row, and *q* is the gap between *d* and 18. The west-to-east ceiling
is therefore highest at the equator and the poles and lowest about 18 rows out (around rows 18 and 54). On Arid it is
zero there, so those latitudes are the driest. The west-to-east sweep starts with a
random amount up to its ceiling. The east-to-west sweep starts empty.

| Terrain | Wetter (west-to-east) | Wetter (east-to-west) | Drier |
|---|---|---|---|
| Tundra | Plains | Plains | stays |
| Desert | stays | Prairie | stays |
| Plains | Prairie | Prairie | Tundra |
| Prairie | Grassland | Grassland | Desert (usually) or Plains |
| Grassland | Marsh 1 in 4 | Marsh 1 in 2 | Prairie |
| Savannah | Swamp 1 in 4 | Swamp | stays |

A Grassland or Savannah square spends 2 extra moisture whether or not it turns to Marsh or Swamp.

In practice the land next to the sea is lush. Deserts and tundra form deep inside
large continents and on the east side of mountain ranges.

### The scatter: hills, mountains and rough edges

Finally, a random scatter hits **800 × (roughness + 1)** points: 1600 on a customized world, and 800, 1600, 2400 or
3200 on a random one. Half the points are random squares. The other half are next to (or on) the previous point. Each hit does
this:

| Terrain hit | Becomes Hills | …and then Mountains | Terrain nudge |
|---|---|---|---|
| Tundra | 1 in 2 | never | 1 in 2 → Plains |
| Desert | 1 in 2 | 1 in 2 | 1 in 2 → Prairie |
| Plains | 1 in 3 | 1 in 3 | – |
| Prairie | 1 in 3 | 1 in 3 | 1 in 3 → Plains |
| Grassland | 1 in 4 | 1 in 2 | 1 in 2 → Marsh |
| Savannah | 1 in 4 | 1 in 3 | 1 in 2 → Swamp |
| Marsh | 1 in 6 | 1 in 4 | 1 in 2 → Grassland |
| Swamp | 1 in 6 | 1 in 4 | 1 in 2 → Savannah |
| Hills | become Mountains | | |
| Mountains | flattened, unless a diagonal neighbour is sea | | |

This is the only source of Hills. The hills from step 1 are all gone by now.

---

## 5. Step 3: forests

Every land square except Hills and Mountains then gets a chance to become forest:

| Land square | Chance of forest |
|---|---|
| Reached by only one stroke of the land brush (thin land, the edges of continents, small islands) | always |
| Next to the sea (any of the 8 neighbours) | 9 in 10 |
| Anything else, i.e. the inland heart where strokes overlapped | none: stays open |

A forest keeps the character of the land under it:

| Open terrain | Its forest |
|---|---|
| Tundra | Boreal Forest |
| Desert | Scrub Forest |
| Plains | Mixed Forest |
| Prairie | Broadleaf Forest |
| Grassland | Conifer Forest |
| Savannah | Tropical Forest |
| Marsh | Wetland Forest |
| Swamp | Rain Forest |

Hills and mountains are never forested. Any forest that lands on them is removed at the end.

---

## 6. Step 4: rivers

The generator then tries to draw this many rivers, giving up after 512 attempts:

| Rivers | Arid | Normal | Wet |
|---|---|---|---|
| **Small** | 16 | 24 | 32 |
| **Moderate** | 24 | 32 | 40 |
| **Large** | 32 | 40 | 48 |

The formula is 16 + 8 × Land Mass + 8 × Climate, so a random world can ask for up to 64.

How a river is drawn:

- It starts on a random land square that is not hills or mountains, heading north, east, south or west.
- Each step it goes straight 60% of the time. Otherwise it turns 90°, usually to the opposite side from its last turn, which
  gives rivers their zig-zag.
- It stops as soon as one of its four neighbours is water or an older river, and joins it there.
- A river that walks into hills, runs off the map, or ends up shorter than 3 squares is erased. **Every river therefore
  reaches the sea or another river, and none crosses hills or mountains.**

A river that reaches the sea or another river may become a **Major River** for a few squares upstream of where it joins:

| | Arid | Normal | Wet |
|---|---|---|---|
| Chance of a major section | 1 in 2 | 4 in 7 | 5 in 8 |
| Length of the major section | 1–3 squares | 1–5 squares | 1–7 squares |

Each open square within two squares of a river's source (the 5 × 5 area without its corners) also has a 1 in 2 chance of
becoming forest.

---

## 7. Step 5: the poles, the High Seas and the Pacific

### Polar ice

| Rows | What happens |
|---|---|
| Top and bottom rows (0 and 71) | all Arctic |
| Second row (1 and 70) | every land square becomes Arctic, and about 40 random squares, sea included, become ice floes |
| Third row (2 and 69) | each land square becomes Arctic or Tundra, 50/50 |
| Fourth row (3 and 68) | each land square becomes plain Tundra, 1 in 2 |

### High Seas

"High Seas" is the game's SEA LANE terrain, the water from which ships sail to Europe.

- **East edge.** In every row, the open water from the east edge westwards becomes High Seas, until it reaches land or
  the middle of the map (column 29). Then any sea within **3 squares** of the easternmost land nearby (looking 3 rows up and
  down) is turned back into plain Ocean, along with everything west of it. So the High Seas begin about **4 squares
  off the eastern coast** and are never more than 29 columns wide. The last column is always High Seas.
- **West edge.** The two westernmost columns are always High Seas.

> **Tip:** From a colony on the easternmost stretch of coast, the High Seas are only about four squares away. That
> makes a short and safe round trip to Europe. Colonies on western bays and inland seas have much further to sail.

### The Pacific

Open water that is reachable straight in from the west edge (up to half-way across the map) is marked as "the Pacific".
The first time one of your units sees such a square, the game plays the **Discovery of the Pacific Ocean** scene.

---

## 8. Special resources: a fixed pattern

Resources are **not stored in the map.** Each time the game looks at a square, it works out from a formula whether the
square has a resource. The formula uses only the square's position, a hidden map seed, and whether the square is forest.

### The rule

Cut the map into 4 × 4 blocks, aligned to the top-left corner. In every block exactly **two squares are "resource spots" for
forest** and **two for everything else** (open land, hills, mountains and sea). The two spots of each kind sit **two squares
apart diagonally**, at opposite corners of a 3 × 3 square. A square has a resource if it is on the spot pattern for its
own kind.

For the curious, the exact test is:

```
bx = x / 4,  by = y / 4                       (which block)
p  = 4 × (x mod 4) + (y mod 4)                 (which square in the block, 0–15)
k  = (17 × bx + 19 × by + seed + f) mod 16     (f = 15 for forest, 0 otherwise)

resource if  p = k  or  p = k XOR 10
```

The seed is re-rolled for every new game, on the America map as well. Only its last four bits matter, so there are
**16 possible patterns**. Here is the pattern for one of them. `R` is a resource spot for non-forest squares, `F` a
resource spot for forest, and `?` a possible Lost City Rumour (section 9):

```
+----+----+----+----+----+----+
|R.?.|F...|..R.|..F.|.R.?|.F..|
|.F..|R...|F...|..R.|..F.|.R..|
|..R.|..F.|R.?.|F...|...R|...F|
|...F|..R.|..F.|R...|F...|...R|
+----+----+----+----+----+----+
|..F.|.R.?|.F..|...R|...F|..R.|
|..R.|..F.|.R..|.F..|...R|...F|
|F...|...R|...F|.R.?|.F..|R...|
|R...|F...|...R|...F|.R..|.F..|
+----+----+----+----+----+----+
```

Moving one block east moves the spots one square further down inside the block (wrapping round into the next
column of the block). Moving one block south moves them three squares down. As a result **the pattern repeats every
12 squares east and 4 squares north**. About one square in eight carries a resource.

### What the resource is

The terrain decides which resource appears on a spot:

| Terrain | Resource |
|---|---|
| Plains | Wheat |
| Prairie | Prime Cotton |
| Grassland | Prime Tobacco |
| Savannah | Prime Sugar |
| Desert, Scrub Forest | Oasis |
| Tundra, Marsh, Swamp, Wetland Forest, Rain Forest | Minerals |
| Mixed Forest | Beaver |
| Boreal Forest, Broadleaf Forest | Game |
| Conifer Forest, Tropical Forest | Prime Timber |
| Hills | Ore Deposit |
| Mountains | Silver Deposit |
| Ocean | Fishery |
| Arctic, High Seas | none |

Exceptions:

- **No resource on a native village square.** The resource shows up if the village is destroyed.
- **A Fishery needs land nearby.** When the map is made, a Fishery with no land within two squares (the 5 × 5 area
  without its corners) is removed for good.
- **Depleted deposits.** A worked-out Silver Deposit becomes a "Depleted Mine". Any other depleted resource just
  disappears.

### Clearing forest moves resources

Because the forest and non-forest spots are different squares, **changing a square's terrain changes its resource**:

- Clearing a forest that has a resource (Prime Timber, Beaver, Game…) destroys it.
- Clearing a forest that stands on a non-forest spot uncovers a new one. Conifer Forest becomes Grassland with Prime
  Tobacco, Tropical Forest becomes Savannah with Prime Sugar, and so on.

> **Tip:** Every visible resource has a twin two squares away diagonally, in the same 4 × 4 block. If you see Prime
> Tobacco on open grassland and one of the four squares two steps diagonally away is forest, that forest may be on the
> twin spot. Clear it and it gains its own resource. Equally, never clear a forest square that shows a resource unless you
> want the lumber more than the resource.

---

## 9. Lost City Rumours: also a pattern

Rumours are not stored either. A square has a rumour if:

- it is land, but not Arctic (hills, mountains and forest all qualify);
- no one has "claimed" it yet (see below);
- it is the one rumour spot of its 4 × 4 block. That spot is
  `(17 × bx + 19 × by + seed + 8) mod 32`, numbered the same way as above. When that number is 16 or more, the block has
  no rumour at all, which happens for about half the blocks.

On average, one land square in 32 has a rumour. The seed is the same one the resources use, so:

- **A rumour never shares a square with a resource spot** of either kind.
- **A rumour always sits exactly two squares east or west of a non-forest resource spot**, in the same row and block
  (the `?` marks in the diagram above).

A rumour disappears once a **European unit stops on its square**, because the square then gets an owner. Seeing a rumour
from a distance does not use it up, and native braves walking over it do not either. The square a village is built on
is owned from the start, so a village never sits on a rumour.

> **Tip:** Natives cannot "steal" a rumour, and your ships can sail past without spoiling it. A rumour you can see but
> cannot reach yet will still be there later, unless a rival walks onto it first.

---

## 10. The native tribes

On a generated map the eight tribes are placed in this order, each with a capital, before any other village:

| Order | Tribe | Level |
|---|---|---|
| 1 | Inca | Civilized (3) |
| 2 | Aztec | Advanced (2) |
| 3 | Arawak | Agrarian (1) |
| 4 | Iroquois | Agrarian (1) |
| 5 | Cherokee | Agrarian (1) |
| 6 | Apache | Semi-Nomadic (0) |
| 7 | Sioux | Semi-Nomadic (0) |
| 8 | Tupi | Semi-Nomadic (0) |

### Capitals

Each capital is found by up to 12,000 random tries, on any land that is not hills or mountains, within columns 8–50 and
rows 12–60. A try is rejected if:

- it is closer to an existing village than **90 minus a quarter of the tries so far**. Early on this demands an
  impossible distance, and the requirement relaxes as the tries go on. In effect each capital lands about as far from
  the others as the map allows;
- it is closer than 8 squares to a village, unless (8 − distance) × 1000 tries have gone by;
- for the **Inca and the Aztecs only**, its column is more than an eighth of the tries so far. This pushes the two
  great empires **to the west side of the map**, roughly where they are in history;
- its 5 × 5 block already has a village, unless 10,000 tries have gone by.

Distances here are "move distances": the longer of the two offsets plus half the shorter.

### The other villages

Then villages are added until there are **84 settlements** in all, the map is full, or 2,160 attempts have been made:

1. A tribe is picked at random and a random walk starts from its capital, over a grid of 5 × 5 blocks, until it finds a
   block with no village.
2. Inside that block, only the middle 3 × 3 squares are candidates. A candidate must be Tundra, Plains, Prairie,
   Grassland, Savannah or Marsh, or the forest of one of those. **Desert, Swamp, Scrub Forest, Rain Forest, Hills,
   Mountains and Arctic are never used.** It also must not be next to another village.
3. One candidate is picked at random. **The village goes to whichever tribe has the nearest village**, not necessarily the
   tribe whose capital the walk began from. That keeps tribal lands in one piece.
4. The block is marked used, even if no village fitted.

So there is **at most one village per 5 × 5 block** and no two villages are ever adjacent. They are usually three or more
squares apart. Tribes spread outwards from their capitals until they meet their neighbours or the sea.

Every settlement then gets one brave, placed within two squares on the same landmass. For the Aztecs and Incas, the
Mountains within two squares of each village are also counted at this point. That count appears to feed the silver
those villages trade.

Each tribe's starting anger towards you depends on difficulty; see [difficulty.md](difficulty.md).

---

## 11. Where the Europeans start

The map's height is cut into fifths, giving four **starting rows: 14, 28, 42 and 56**. The four nations are dealt
into them at random, except that on a generated map **the human player always gets row 28 or 42**, never the far north or
the far south.

In its row, each nation's start is the **westernmost square of the High Seas**: the inner edge of the band, closest to
land. The caravel with your first colonists is sent there.

> **Tip:** Rows 28 and 42 are only 8 and 6 rows from the equator, so the land due west of your start begins in the
> warm bands. Rows 14 and 56, where two of your rivals start, are 22 and 20 rows out, near where the tundra band begins.

---

## 12. The America map

"Start a Game in AMERICA" loads the terrain from `AMER2.MP` (58 × 72) instead of generating it. The steps above are skipped,
except for the tidy-up at the end. Here is how it differs:

| | New World | America |
|---|---|---|
| Terrain, rivers, coasts | generated | fixed, from the file |
| Polar rows | rows 0 and 71 Arctic | same: forced to Arctic on load |
| Edge High Seas | west two columns and east column | the same frame is applied |
| Pacific | marked up to half-way across | marked up to 16 columns short of the east edge |
| Resources and rumours | from the pattern | **from the pattern too, with a new seed every game** |
| Your starting row | 28 or 42 | **any of the four** |
| Native villages | generated as above | **59 fixed sites**, each nudged at random |

The native sites come from one text list per tribe. The first site in each list is the capital:

| Tribe | Sites | Capital near |
|---|---|---|
| Inca | 5 | column 36, row 52 |
| Aztec | 4 | column 17, row 27 |
| Arawak | 5 | column 37, row 29 |
| Iroquois | 11 | column 27, row 15 |
| Cherokee | 4 | column 25, row 20 |
| Apache | 7 | column 16, row 15 |
| Sioux | 7 | column 10, row 8 |
| Tupi | 16 | column 47, row 45 |

Each site is moved by two random steps of −1, 0 or +1 on each axis, so up to 2 squares and usually 0 or 1. It then has to
pass the same terrain test as above and have no village within 3 squares. That limit relaxes to 2 and then 1 as the
tries run out. A site that fails 100 tries is dropped. No extra villages are added.

So on the America map the coastline never changes, but **the resources, rumours and starting rows change every game.**

---

## Curiosities and bugs found in the code

- **The continent count runs on a blank map.** Before adding extra islands, the generator counts the landmasses so that it
  can top them up to 15. The land at that point exists only on a scratch layer, though, and the terrain is still all Ocean.
  The count is always zero, so the generator always adds the maximum: 15 island strokes on Archipelago, and a random 0–15
  otherwise.
- **Random worlds can go past the menu.** The quick NEW WORLD start rolls each setting from 0 to 3, so it can make worlds
  the Customize screen cannot.
- **A hidden fifth setting.** The amount of hill-and-mountain scatter is a fifth world option that no screen shows.
- **Two kinds of forest, merged at the end.** The game has two copies of every forest type (terrain 8–15 and 16–23). The
  generator carefully chooses between them, with different odds, and then converts every second-band forest back to the
  first band in its last pass. A generated map ends up with only one kind.
- **The "ocean" step that makes no ocean.** During the scatter, a mountain is passed to a helper (the developers called it
  `ocean`) that writes an Ocean square when no diagonal neighbour is sea. The generator writes the old square straight back
  over it, so the only effect is that **inland** mountains hit by the scatter are flattened, while those touching the sea at a
  corner survive.
- **Leftover odds.** When the scatter hits a square that is already hilly, the hill chances it uses are left over from the
  previous flat square it hit.
- **The polar rows lose their hills.** The code for the second and third rows from the ice tries to keep each square's
  hill and river bits. It reads them from a value that never carries them, so land on those rows turns into flat Arctic or
  Tundra and loses any hills, mountains or river.
- **A gap in the frame.** The routine that draws the High Seas down the map edges stops one row short. The squares in row
  70 of the edge columns keep whatever they had.
- **Two lonely mountains on the America map.** Every America game turns two single-square islands into Mountains: one at
  column 21, row 1, the other at column 43, row 68. Why is not known.
- **A shared village site.** On the America map, the Aztec and Tupi lists both contain column 26, row 34, in Central
  America. The Aztecs are placed first, so the Tupi village there is pushed to a nearby square, or dropped.
- **Two sets of labels.** The Customize screen draws its own labels ("Moderate", "Continents"). They differ from the game's
  text resources for the same choices ("Normal", "Large Continents").

---

## Sources

All of this comes from the reconstructed C source in `matched/game/`. Terrain ids are in
`include/terrain.h`, and the map layers are described in
`docs/findings/map-planes.md` and `docs/formats/map-file.md`. Random rolls
use `rand_range(lo, hi)`, which includes both ends.

| Topic | Files |
|---|---|
| Menu and settings | `begin_game.c`, `customize.c`, `Customize_Init.c`, `Customize_DrawBoxText.c` |
| Land | `build_map.c`, `elevate.c`, `blob.c`, `blob2.c`, `bloop.c`, `island.c`, `map_find_continents.c` |
| Climate, hills, forests | `build_map.c`, `ocean.c`, `water_access.c`, `terrain_at.c` |
| Rivers | `do_rivers.c` |
| Poles, High Seas, Pacific | `build_map.c`, `buffer_draw_box.c`, `buffer_rect_fill.c`, `explore_around_square.c` |
| Resources | `resource_at.c`, the terrain-to-resource table at SEG27:0x2ca (`disasm/SEG27.asm`), the RESOURCE text |
| Lost City Rumours | `lost_city_at.c`, `put_down_unit.c`, `explore_map_square.c`, `create_village.c` |
| Native tribes | `start_indians.c`, `find_close_village.c`, `xy_dist.c`, `set_village.c`, `create_village.c`, the TRIBES text and the per-tribe site lists (INCA, AZTEC, …) |
| Starting positions | `build_map.c`, `start_new_game.c` |
| America map | `start_new_game.c`, `build_map.c`, `game/AMER2.MP` |

These findings are for the Windows release. The DOS version is believed to behave the same but has not been checked
line by line.
