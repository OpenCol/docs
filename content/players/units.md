# Units and Colonists

*A player's guide to Sid Meier's Colonization (Windows), based on the game's own code.*

The Colonopedia tells you what each unit is for. This guide gives the numbers behind it: what every unit costs, how far
it moves and sees, what a criminal, a servant, a free colonist and an expert each produce, and how a colonist climbs from
one rank to the next. Everything below was read from the reconstructed game code and the data tables the game loads at
start-up. The source locations are listed at the end.

Combat is covered in its own guide, [How Combat Works](combat.md). This guide gives each unit's base strength and
stops there. Difficulty effects are in [How Difficulty Affects the Game](difficulty.md), and Founding Father effects in
[What Each Founding Father Does](founding-fathers.md).

---

## At a glance

| Question | Answer |
|---|---|
| Colonist's movement | 1 square a turn (scouts and dragoons 4) |
| Equipment for a soldier / scout / dragoon | 50 muskets / 50 horses / both |
| Tools a pioneer uses per job | 20; a pioneer carries up to 100, so 5 jobs |
| Hardy Pioneer | works in half the turns (rounded down) |
| Building job output, free colonist vs expert | 3 vs 6 (base level) |
| Building job output, servant / criminal or convert | 2 / 1 |
| Field work: servant and criminal | exactly as good as a free colonist |
| Turns to teach | 4 (schoolhouse), 6 (college), 8 (university) |
| Teachers per school | 1 / 2 / 3 |
| Who a teacher teaches | a random criminal, servant or free colonist in the colony |
| Learning on the job | only sugar, tobacco and cotton planters and fur trappers, ~1% a turn |
| Sight radius | 1 square; 2 for scouts, galleons, privateers and frigates; +1 for land units with de Soto |
| Most units per European nation | about 200 |

---

## 1. The unit table

The game reads every unit's statistics from a text table (`UNITS`) when it starts. Movement is stored in thirds of a
move: the loader multiplies the table's figure by 3, which is how a road can cost a third of a move.

| Unit | Moves | Attack | Defence | Cargo holds | Holds it needs on a ship | Price in Europe | Built in a colony |
|---|---|---|---|---|---|---|---|
| Colonist | 1 | 0 | 1 | – | 1 | see §4 | – |
| Soldier | 1 | 2 | 2 | – | 1 | – | – |
| Pioneer | 1 | 0 | 1 | – | 1 | – | – |
| Missionary | 2 | 0 | 1 | – | 1 | – | – |
| Dragoon | 4 | 3 | 3 | – | 1 | – | – |
| Scout | 4 | 1 | 1 | – | 1 | – | – |
| Artillery | 1 | 7 | 5 | – | 1 | 500, +100 per purchase | 192 hammers, 40 tools (Armory) |
| Treasure train | 1 | 0 | 0 | – | **6** | – | – |
| Wagon train | 2 | 0 | 1 | 2 | cannot board | – | 39 hammers (any colony) |
| Caravel | 4 | 0 | 2 | 2 | – | 1000 | 128 hammers, 40 tools (Shipyard) |
| Merchantman | 5 | 0 | 6 | 4 | – | 2000 | 192 hammers, 80 tools (Shipyard) |
| Galleon | 6 | 0 | 10 | 6 | – | 3000 | 320 hammers, 100 tools (Shipyard) |
| Privateer | 8 | 8 | 8 | 2 | – | 2000 | 256 hammers, 120 tools (Shipyard) |
| Frigate | 6 | 16 | 16 | 4 | – | 5000 | 512 hammers, 200 tools (Shipyard) |
| Man-O-War | 5 | 24 | 24 | 6 | – | – (the King's) | – |
| Regulars | 1 | 5 | 5 | – | 1 | – (the King's) | – |
| Cavalry | 4 | 6 | 6 | – | 1 | – (the King's) | – |
| Continental Army | 1 | 4 | 4 | – | 1 | – | – |
| Continental Cavalry | 4 | 5 | 5 | – | 1 | – | – |
| Braves | 1 | 1 | 1 | – | – | – | – |
| Armed Braves | 1 | 2 | 2 | – | – | – | – |
| Mounted Braves | 4 | 2 | 2 | – | – | – | – |
| Mounted Warriors | 4 | 3 | 3 | – | – | – | – |

- **Attack 0 means the unit cannot attack.** A colonist, pioneer, missionary, treasure train, wagon train or unarmed ship that tries gets "cannot attack" (ships fail silently).
- **Treasure needs six holds.** Only a Galleon (or a Man-O-War) has that many, which is why the Colonopedia says a treasure train always needs a galleon.
- **Artillery in Europe gets dearer.** Every artillery you buy adds 100 to the price of the next one, for good. The other Europe prices never change.
- **Shipyard for every ship.** All five buildable ships need a Shipyard in the colony; artillery needs an Armory; a wagon train needs nothing.
- **Colony build cost.** The hammers come from a column of the unit table times 32, and the tools from another column times 10. The wagon train's figure would be 32 hammers, but the code raises anything below 39 to 39.
- **Ferdinand Magellan** adds 1 move to every ship.
- **Defence is also a ship's repair time** (see §9).

> **Tip:** The Europe price list shows the artillery price *including* the surcharge, so you can always see what the next gun will cost.

---

## 2. Who your colonists are

Every colonist carries a **specialty**. It stays with him whether he is working in a colony, carrying muskets or
sailing to Europe. There are five kinds:

| Kind | Where they come from | Strengths and limits |
|---|---|---|
| **Petty Criminal** | the docks in Europe (more often on hard levels) | Weakest at building jobs. Cannot learn from natives. |
| **Indentured Servant** | the docks; or a criminal after one lesson | Middling at building jobs. Can learn from natives. |
| **Free Colonist** | the docks; colony growth; a servant after one lesson; "Clear Specialty" | The all-rounder. Can learn anything. |
| **Specialist** (expert) | the docks; training in Europe; schools; natives; on the job | Double output at their own job. Ordinary output at any other job. |
| **Indian Convert** | missions and conquered villages | Good outdoors, weak indoors. Cannot carry equipment or be taught. |

- Out in the **fields**, criminals, servants and free colonists produce **exactly the same**. Only experts and converts differ there.
- In **buildings**, a specialist at the wrong job works like a free colonist.
- **Clear Specialty** (colony screen, Jobs menu) turns any specialist into an ordinary free colonist. It is only offered for specialists, so you cannot use it to "clean" a criminal or servant.
- The same unit types serve everyone: a "Soldier" is any colonist carrying muskets, and it keeps its specialty underneath.

For the odds of each kind turning up on the docks, see [difficulty.md](difficulty.md#who-turns-up-on-the-docks).

---

## 3. Working in a colony

### Building jobs

Each building job starts from a **rate** set by who is doing it: **1** for a petty criminal or a convert, **2** for an
indentured servant, **3** for everyone else. Then:

| Job (building) | Criminal / Convert | Servant | Free colonist or other specialist | Expert at this job |
|---|---|---|---|---|
| Distiller, Tobacconist, Weaver, Fur Trader, Blacksmith, Gunsmith: **house** (level 1) | 1 | 2 | 3 | 6 |
| … **shop** (level 2) | 2 | 4 | 6 | 12 |
| … **factory** (level 3) | 3 | 6 | 9 | 18 |
| Carpenter: Carpenter's Shop | 1 | 2 | 3 | 6 |
| Carpenter: Lumber Mill | 2 | 4 | 6 | 12 |
| Preacher: Church | 1 | 2 | 3 | 6 |
| Preacher: Cathedral | 2 | 4 | 6 | 12 |
| Statesman: Town Hall | 1 | 2 | 3 | 6 |

- The shop adds the worker's rate once more. The factory adds half again. An expert then doubles the result.
- **William Penn** adds +50% to each preacher, on top of the cathedral.
- Printing press, newspaper and the bell-related fathers are not part of this per-worker figure.
- The Tory penalty and the Sons of Liberty bonus are applied to the rate **before** the building and expert multipliers. See [difficulty.md](difficulty.md#tories-and-the-production-penalty).
- **Upkeep.** The Windows version charges upkeep on some buildings. If you cannot pay it ("we cannot afford to pay the upkeep"), colonists in buildings that have an upkeep appear to produce at **half** rate, as the message says.
- A building holds at most **three** colonists ("We cannot put more than three colonists in any one building").

### Field work

Field yields depend mostly on the terrain, so the details belong in the terrain guide. What matters for the colonist is:

| Colonist | Effect on a field square |
|---|---|
| Criminal, servant, free colonist | The square's normal yield. No difference between them. |
| Expert Farmer, Expert Fisherman | **+2** on their own crop (and the Sons of Liberty bonus is counted twice) |
| Any other outdoor expert | **×2** on their own good, and the road, river and plowing bonuses count +2 instead of +1 |
| Indian Convert | **+1** on food, sugar, tobacco, cotton, furs and fish |

- A fisherman needs **Docks** in the colony; without them the water squares give nothing.
- **Henry Hudson** doubles furs from worked land.
- Silver on a square without a silver resource gives at most 1, and only with a road (or the colony square) or an expert.

> **Tip:** Put your criminals and servants in the fields and your free colonists in the buildings. Outdoors you lose nothing; indoors a criminal makes a third of what a free colonist does.

---

## 4. Getting better colonists

There are five ways to raise a colonist's rank.

### 4.1 Schools

A colonist working as a **Teacher** in a schoolhouse, college or university teaches his own specialty.

| School | Teachers at once | Turns per lesson | Who may teach there |
|---|---|---|---|
| **Schoolhouse** | 1 | 4 | Expert Farmer, Fur Trapper, Lumberjack, Ore Miner, Silver Miner, Fisherman; Master Carpenter; Hardy Pioneer; Seasoned Scout |
| **College** | 2 | 6 | all of the above, plus Master Sugar, Tobacco and Cotton Planters; Master Distiller, Tobacconist, Weaver, Fur Trader, Blacksmith, Gunsmith; Veteran Soldier |
| **University** | 3 | 8 | all of the above, plus Firebrand Preacher, Elder Statesman, Jesuit Missionary |

The lesson time depends on **what is taught**, not on the building: an Expert Farmer still teaches every 4 turns in a
university. Free colonists, servants, criminals and converts cannot teach at all ("Only colonists who have mastered a
profession may teach"). Moving a colonist to a different job restarts his count.

**Who gets the lesson.** When a lesson is ready, the game picks a pupil **at random** from every petty criminal,
indentured servant and free colonist in the colony, whatever job they are doing. Then:

| Pupil | Becomes |
|---|---|
| Petty Criminal | Indentured Servant |
| Indentured Servant | Free Colonist |
| Free Colonist | the teacher's profession |

Each pupil can be promoted only once per turn. If there is no pupil at all, the lesson is lost and you get the
"all the colonists there already have specialty professions" message. The teacher's count starts again either way.

> **Tip:** A Master Blacksmith teaching in a colony full of criminals will spend his first lessons turning criminals into servants. To get blacksmiths out of him, move the criminals and servants elsewhere so the only pupils left are free colonists.

### 4.2 Learning on the job

At the end of each turn, a colonist working as a **sugar planter, tobacco planter, cotton planter or fur trapper** may
become an expert at it. These are the four experts you cannot train in Europe.

| Colonist | Chance per turn |
|---|---|
| Free Colonist | 1 in 100 |
| Indentured Servant | 1 in 200 (straight to expert) |
| Petty Criminal | 1 in 300 (straight to expert) |

The catch: it only happens while your nation has **no** expert of that kind anywhere: in a colony, on the map or in Europe.
Once you have one Master Cotton Planter, nobody else learns cotton planting by working. Farmers, fishermen, miners,
lumberjacks and all building jobs never learn on the job.

### 4.3 Learning from the natives

An unarmed colonist entering a village you are at peace with can choose **Live among the natives**.

- **Only free colonists and indentured servants can learn.** A criminal is refused ("we doubt that you will ever be more than a common criminal"), a specialist is told to bring someone without a skill, and a convert "already knows the Indian ways".
- **Each village teaches one fixed skill.** It is worked out from the village's position, so it never changes, and a scout who speaks with the chief is told what it is.
- **A village teaches only once.** A tribe's **capital is the exception**: it keeps teaching.
- **The tribe's level limits the skill.** Semi-nomadic tribes never teach fur traders or ore miners. Only Advanced and Civilized tribes teach weavers, tobacconists and silver miners. Only Civilized tribes teach master distillers. Fishermen are only taught by coastal villages, and some fur-trapping villages teach Seasoned Scouts instead.
- **Angry tribes refuse.** An angry tribe sends the colonist away and its alarm rises by 3. An uneasy tribe refuses some of the time: 10% to 90% by difficulty, see [difficulty.md](difficulty.md#scouts-and-chiefs).

> **Tip:** Natives make indentured servants straight into experts, skipping the free-colonist step. Send servants, not free colonists.

### 4.4 Promotion in battle

A **soldier or dragoon** who wins a fight may be promoted. The promotion goes one step up this ladder:

| Before | After |
|---|---|
| Petty Criminal | Indentured Servant |
| Indentured Servant | Free Colonist |
| Free Colonist | Veteran |
| Veteran | Continental Army / Cavalry (only after you declare independence, and only under a further condition not yet identified) |

A soldier whose specialty is anything else (an Expert Farmer with muskets, say) is **never** promoted.
**George Washington** makes every eligible win a promotion. The odds are in [combat.md](combat.md).

### 4.5 Training in Europe

The King's recruiting office trains experts for a fixed price. The price never rises.

| Expert | Price | Expert | Price |
|---|---|---|---|
| Expert Ore Miner | 600 | Expert Farmer | 1100 |
| Expert Lumberjack | 700 | Master Distiller | 1100 |
| Master Gunsmith | 850 | Hardy Pioneer | 1200 |
| Expert Silver Miner | 900 | Master Tobacconist | 1200 |
| Master Fur Trader | 950 | Master Weaver | 1300 |
| Master Carpenter | 1000 | Jesuit Missionary | 1400 |
| Expert Fisherman | 1000 | Firebrand Preacher | 1500 |
| Master Blacksmith | 1050 | Elder Statesman | 1900 |
| | | Veteran Soldier | 2000 |

Not for sale: the three master planters, the Expert Fur Trapper and the Seasoned Scout.

---

## 5. Professions and their equipment

A colonist becomes a soldier, dragoon, scout or pioneer by carrying goods. Taking the goods back off returns them.

| Profession | Needs | From a colony | In Europe |
|---|---|---|---|
| Soldier | muskets | 50 muskets | buy 50 muskets |
| Dragoon | muskets + horses | 50 of each | add horses to a soldier, or muskets to a scout |
| Scout | horses | 50 horses | buy 50 horses |
| Pioneer | tools | at least 20; takes all the colony has in 20s, up to 100 | buy 100 tools |
| Missionary | – | needs a church in the colony (a Jesuit Missionary needs none) | "Bless as Missionaries", free |

- **Converts cannot take any of these professions**, from a colony or in Europe. They cannot found colonies either.
- Changing a soldier back to a colonist in a colony returns 50 muskets to the warehouse. A pioneer returns whatever tools he still carries.
- In Europe, a Jesuit Missionary cannot have his missionary status cancelled.
- A boycott on muskets, tools or horses removes the matching buy and sell lines in Europe.

---

## 6. Pioneers

### Tools

Every completed job (a road, a clearing or a plowing) uses **20 tools**. When fewer than 20 are left, the pioneer
puts down the rest and becomes a colonist again ("Our pioneer has reverted to colonist status after using all its
tools"). A full pioneer with 100 tools therefore does **5 jobs**. Pioneers created at the start of the game carry 100.

### How long the work takes

Each terrain has a work figure in the terrain table. A **road** takes that many turns. **Clearing a forest** or
**plowing** takes 2 turns more. A **Hardy Pioneer halves** the time, rounding down. The turn you give the order counts
as the first.

| Terrain | Road | Road (Hardy) | Plow / clear | Plow / clear (Hardy) |
|---|---|---|---|---|
| Desert, Plains, Prairie, Grassland, Savannah | 3 | 1 | 5 | 2 |
| Tundra | 4 | 2 | 6 | 3 |
| Marsh | 5 | 2 | 7 | 3 |
| Swamp | 7 | 3 | 9 | 4 |
| Boreal, Scrub, Mixed, Broadleaf, Conifer forest | 4 | 2 | 6 | 3 |
| Tropical, Wetland forest | 6 | 3 | 8 | 4 |
| Rain forest | 7 | 3 | 9 | 4 |
| Arctic | 4 | 2 | – | – |
| Hills | 4 | 2 | cannot plow | – |
| Mountains | 7 | 3 | cannot plow | – |

Difficulty does not change any of these times.

### Clearing forest

Clearing turns the forest into the matching open terrain. A second order then plows it.

| Forest | Becomes |
|---|---|
| Boreal | Tundra |
| Scrub | Desert |
| Mixed | Plains |
| Broadleaf | Prairie |
| Conifer | Grassland |
| Tropical | Savannah |
| Wetland | Marsh |
| Rain | Swamp |

If one of your colonies is within 3 squares, it receives the **lumber**:

| | Ordinary pioneer | Hardy Pioneer |
|---|---|---|
| Colony **without** a Lumber Mill | 20 | 40 |
| Colony **with** a Lumber Mill | (forest's lumber yield + 1) × 20 | twice that |

With a Lumber Mill, that is 80 from Mixed or Conifer forest, 40 from Scrub, and 60 from the rest (doubled for a Hardy
Pioneer). The lumber is capped by the room left in the warehouse.

### Native land

Roads and clearings on land a nearby tribe claims, unless you have paid for it, raise that tribe's alarm. Before you
start, a tribe at peace with you may ask for payment. The amounts are in
[difficulty.md](difficulty.md#making-them-angry).

---

## 7. Scouts

A **Scout** is a colonist with 50 horses. A **Seasoned Scout** is one whose specialty is scouting; he is better at
everything below. What a scout can do:

- **Move 4 squares a turn and see 2 squares around** (3 with Hernando de Soto). See §12.
- **Speak with the chief** of a native village. Nobody else can.
- **Get better results from Lost City Rumours.**
- **Spy on foreign colonies.** The capture odds are in [difficulty.md](difficulty.md#8-rival-nations).

### Speaking with the chief

First the chief decides whether to kill the scout. He always does so when the tribe's alarm is 75 or more, and may do
so from 25 upward. The Arawaks have their own extra risk; see [difficulty.md](difficulty.md#scouts-and-chiefs).
Francisco de Coronado appears to prevent the killing entirely (see [founding-fathers.md](founding-fathers.md)).

If the scout lives, the chief tells you **what the village teaches and the three goods it wants most**. Then, **once
per village** and only if the tribe is calm enough, one of three things happens, each equally likely:

| Result | Effect |
|---|---|
| Guides | The scout becomes a **Seasoned Scout**. A scout who already is one gets the next result instead. |
| Tales of nearby lands | The map is revealed for **6 squares** around the scout. |
| Gift | Gold, more from more advanced tribes (averages in [difficulty.md](difficulty.md#scouts-and-chiefs)). |

Otherwise the chief is merely bored.

### Lost City Rumours

A mounted Scout counts as level 1, a Seasoned Scout as level 2, and Hernando de Soto adds 1 more. Other units count as
level 0. A dismounted Seasoned Scout counts as 0. The level helps in several ways:

| Rumour | Level 0 | Scout (1) | Seasoned Scout (2) |
|---|---|---|---|
| Ruins: gold | 30–240 | ×1.5 | ×2 |
| Seven Cities of Cibola: treasure train | 2,100–4,000 | 3,100–5,000 | 4,100–6,000 |
| "Vanished" or "holy shrines" | as drawn | re-drawn as "nothing" half the time | two times in three |
| Holy shrines: alarm | see [difficulty.md](difficulty.md#lost-city-rumours-holy-shrines) | 5 less | 10 less |

> **Tip:** Explore rumours with mounted Seasoned Scouts whenever you can. They find bigger treasure and lose fewer units.

---

## 8. Wagon trains and treasure trains

### Wagon trains

- 2 moves, 2 cargo holds, defence 1, no attack.
- They carry goods only, not colonists or artillery, and can follow trade routes.
- They can trade with native villages, like ships.
- Entering a colony ends a wagon train's move.
- Built for **39 hammers** in any colony, with no building needed.

The Colonopedia says "You may never build more wagon trains than you have colonies". **The Windows code does not seem
to enforce this.** The colony's build check allows a wagon train with no conditions, and the message for the limit
(`NOMOREWAGONS`) is in the text file but never used by the program. See Curiosities.

### Treasure trains

- 1 move, attack 0, defence 0. A ship needs **6 free holds** to carry one, so only a Galleon will do.
- Their value is stored in hundreds of gold, so a treasure can be worth up to 25,500.
- They come from Lost City Rumours (Cibola, burial mounds) and from destroying native villages ([combat.md](combat.md)).

**The King's offer.** When your treasure train enters one of your coastal colonies that has access to the open ocean,
and you own **no galleon**, the King offers to ship it home for a cut. The cut is your tax rate doubled, with a minimum
that depends on difficulty and a maximum of 90%. See [difficulty.md](difficulty.md#the-king-carries-your-treasure).

- With **Hernan Cortes** the offer is made even if you do have a galleon, and the cut is just your tax rate.
- **After you declare independence** there is no King to pay: you keep the whole treasure, at any such colony.

---

## 9. Ships

| Ship | Moves | Holds | Defence (= repair turns in Europe) | Sight | Price in Europe |
|---|---|---|---|---|---|
| Caravel | 4 | 2 | 2 | 1 | 1000 |
| Merchantman | 5 | 4 | 6 | 1 | 2000 |
| Galleon | 6 | 6 | 10 | **2** | 3000 |
| Privateer | 8 | 2 | 8 | **2** | 2000 |
| Frigate | 6 | 4 | 16 | **2** | 5000 |
| Man-O-War | 5 | 6 | 24 | 1 | – |

- **Magellan** gives every ship +1 move.
- **Every land unit, wagon trains excepted, takes one hold.** A treasure train takes six.
- **Repairs.** A damaged ship's repair counter rises by 1 each turn in Europe and by **2** each turn in a colony. It is ready when the counter reaches the ship's defence value. A frigate takes 16 turns in Europe but only 8 in a colony drydock. You are told "has completed its repairs".
- Entering a colony ends a ship's move.
- The fighting side of ships (privateers hiding their flag, damage versus sinking) is in [combat.md](combat.md).

---

## 10. Native units

| Unit | Moves | Attack | Defence | How a village makes one |
|---|---|---|---|---|
| Braves | 1 | 1 | 1 | the basic brave |
| Armed Braves | 1 | 2 | 2 | the tribe has muskets |
| Mounted Braves | 4 | 2 | 2 | the tribe has 50 horses (used up) |
| Mounted Warriors | 4 | 3 | 3 | both |

A village that has reached its full size trains a new brave whenever its growth counter fills. One lot of muskets arms
several braves before it runs out, more on harder levels ([difficulty.md](difficulty.md#armed-braves)).

**Converts lose faith.** A convert standing **alone** outside any colony or village counts the turns. After more than
8 such turns he leaves ("Converts who do not join colonies within eight turns of their conversion are eliminated"). Turns
inside a settlement, or in company with another unit, do not count.

---

## 11. Movement

A unit has 3 movement points per square of movement in the table: a colonist has 3, a dragoon 12, a privateer 24.
A step costs:

| Step | Cost |
|---|---|
| Ordinary step | the terrain's movement cost × 3 (table below) |
| Road (or settlement) on **both** squares | 1 point (a third of a move) |
| River on **both** squares, moving straight (not diagonally) | 1 point |
| Into any colony or native village | at most 3 points (one move) |
| Landing from a ship, or boarding a ship at sea, outside a colony | **the unit's whole turn** |

| Terrain | Movement cost |
|---|---|
| Tundra, Desert, Plains, Prairie, Grassland, Savannah, Scrub forest, Ocean | 1 |
| Marsh, Swamp, Arctic, Hills, Boreal / Mixed / Broadleaf / Conifer / Tropical forest | 2 |
| Wetland forest, Rain forest, Mountains | 3 |

- Colonies and native villages count as roads, so moving from a road straight into a village costs a third of a move.
- **A unit's first step of the turn always succeeds**, however expensive. A colonist can always walk into mountains.
- **After the first step, an expensive move is a gamble.** If the step costs more than the unit has left, it succeeds with a chance of *points left ÷ cost*. Either way, the points are used. For example, a colonist with 2 points left (after a road step) entering hills (6 points) gets through 2 times in 6.

> **Tip:** A unit with any points left over always has some chance of one more square, even into mountains. Plan long marches so that the expensive square is the first step of a turn.

---

## 12. Sight

When a unit moves (and again at the start of each turn) it reveals the map around it:

| Unit | Radius |
|---|---|
| Most units | 1 (the 8 surrounding squares) |
| Galleon, Privateer, Frigate | 2 |
| Scout | 2 |
| Any land unit with **Hernando de Soto** | 2 |
| Scout with de Soto | 3 |
| Caravel, Merchantman, Man-O-War | 1 (de Soto does not help ships) |

The radius is a square, not a circle. Past the first ring a land unit only reveals land on its own landmass, and a ship
only reveals water. So a scout on the coast does not see the ocean two squares out.

---

## 13. Unit limits

The game has room for 300 units in all.

- A European nation cannot have more than about **200** units ("the maximum number of units for the game has been reached").
- Native and computer nations stop getting new units at 292 units in total, so the last eight places are kept for you.

---

## Curiosities and bugs found in the code

- **No wagon train limit.** The Colonopedia says you may never have more wagon trains than colonies, and the game's text
  file contains the message for it. But the Windows program never uses that message, and the build check accepts a
  wagon train in any colony. This has not been tested in play.
- **The wagon train costs 39 hammers, not 32.** The table says 32 and the code raises anything below 39 to 39. A
  second floor (raise below 52 to 52) can never apply to any unit in the shipped table.
- **Cancelling an artillery purchase still raises the price.** The +100 surcharge is booked before the "Really buy?"
  question, so answering No still makes the next gun 100 dearer. And if the unit cannot be created because of the
  unit limit, the gold has already been taken.
- **A pioneer's tools sell as a full 100 in Europe.** "Sell Tools" always pays for 100 tools, however many the pioneer
  has left. A pioneer with 20 tools can be shipped home and sold for five times what he carries.
- **The three-per-building limit skips the distillery.** The check is written for jobs after the distiller, so the
  rum distillery appears to accept a fourth colonist. Not tested in play.
- **The Man-O-War is near-sighted.** The galleon, privateer and frigate see 2 squares; the King's biggest ship sees 1.
- **Lessons go to a random pupil.** A teacher cannot choose who he teaches, so criminals and servants in the colony
  soak up lessons meant for free colonists.
- **On-the-job learning is a one-time bonus.** It only works while you have no expert of that kind at all, so it can give you your first Master Cotton Planter but never your second.
- **Native capitals never stop teaching.** Ordinary villages teach once; a capital teaches every colonist you send.
- **A Jesuit pioneer goes back to being a missionary.** When a pioneer whose specialty is Jesuit Missionary runs out of
  tools, he becomes a missionary unit again, not a colonist.
- **Ship type does not change the voyage to Europe.** The function that sets the crossing time also works out a
  figure that would have made privateers and galleons faster and caravels slower. The result is thrown away.

---

## Sources

All figures come from the reconstructed C source in `matched/game/`. Unit ids are in
`include/units.h` and professions in `include/jobs.h`. The unit table is
the `UNITS` text resource and the profession table the `JOB` resource
(`export/text/COLTEXT0.DLL/`); terrain figures are the `UNFORESTED`, `FORESTED` and
`OTHER` resources. Random rolls use `rand_range(lo, hi)`, which includes both ends.

| Topic | Files |
|---|---|
| Unit table and costs | `load_data.c`, `get_production_cost.c`, `eligible_to_build.c`, `produce_something.c`, `init_data.c`, `europe_purchase.c`, `create_unit.c` |
| Production | `compute_colonist_yield.c`, `compute_yield.c`, `job_change_legal.c`, `try_to_set_job.c` |
| Teaching and promotion | `new_turn_colony.c`, `set_job.c`, `set_progress.c`, `job_available.c`, `collect_stats_1.c`, `any_spec.c`, `tribe_live.c`, `try_to_improve.c`, `next_improve.c`, `europe_recruit_any.c`, `colony_select_profession.c` |
| Equipment | `job_cargo.c`, `set_job.c`, `job_available.c`, `europe_click_unit.c` |
| Pioneers | `orders_clear.c`, `orders_road.c`, `perform_orders_clear.c`, `perform_orders_road.c`, `use_tools.c`, `load_terrain.c`, `MainWin_CheckMenuItems.c` |
| Scouts | `tribe_village.c`, `tribe_camp.c`, `lost_city_exploration.c` |
| Wagon and treasure trains | `eligible_to_build.c`, `move_unit.c`, `free_galleon2.c`, `create_colony.c` |
| Ships | `move_rate.c`, `new_turn_bookkeeping.c`, `get_voyage_delay.c` |
| Natives and converts | `indian_village.c`, `unit_rules.c` |
| Movement and sight | `move_unit.c`, `is_city.c`, `explore_square.c`, `explore_area.c`, `explore_around_square.c` |
| Unit limits | `create_unit.c` |

These findings are for the Windows release. The DOS version is believed to behave the same but has not been checked
line by line.
