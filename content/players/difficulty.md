# How Difficulty Affects the Game

*A player's guide to Sid Meier's Colonization (Windows), based on the game's own code.*

When you start a new game you pick one of five levels:

| # | Level | In short |
|---|---|---|
| 1 | **Discoverer** | Training wheels. Free money, expert colonists, doubled attacks, tutorial hints on. |
| 2 | **Explorer** | Still forgiving. Some money, good colonists, protection from early attacks. |
| 3 | **Conquistador** | The "neutral" level. Most formulas sit at their middle value here. |
| 4 | **Governor** | Harsher prices, angrier natives, a bigger Royal army, a richer AI. |
| 5 | **Viceroy** | Everything above, at full strength. Scores the most. |

The manual only says the game gets "harder". This guide gives the actual numbers. Everything below was read out of the
reconstructed game code. It is not guesswork from play-testing, and the source locations are listed at the end.

Difficulty works in three ways:

1. **It makes things harder for you.** Prices, taxes, native anger and the King's army all scale up.
2. **It quietly helps the computer players.** On harder levels the AI nations get free gold, cheap recruits, cheap muskets and faster immigration.
3. **It removes beginner protections.** The two easiest levels shield you from early raids, starvation and attacks.

Every table below runs left to right from the easiest level to the hardest: **Discoverer · Explorer · Conquistador · Governor · Viceroy**.

---

## At a glance

| What changes | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Starting gold | 1000 | 300 | 0 | 0 | 0 |
| Veteran starting soldier | ✔ | ✔ | – | – | – |
| Tories per −1 production penalty | 10 | 9 | 8 | 7 | 6 |
| Bells for your 1st Founding Father (before 1600) | 24 | 32 | 40 | 48 | 56 |
| Price of your first recruit in Europe | 140 | 160 | 180 | 200 | 220 |
| Royal Expeditionary Force at the start (regulars) | 15 | 23 | 31 | 39 | 47 |
| King's minimum cut for carrying treasure | 50% | 55% | 60% | 65% | 70% |
| Bells for foreign intervention | 2000 | 3500 | 5000 | 6500 | 8000 |
| Your attacks are doubled | ✔ | – | – | – | – |
| Final score multiplier (relative) | ×1 | ×1.25 | ×1.5 | ×2 | ×2.5 |

---

## 1. Starting out

### Starting gold

| Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|
| 1000 | 300 | 0 | 0 | 0 |

Computer nations always start with nothing.

### The three colonists waiting on the docks

| Level | Who is waiting for you in Europe |
|---|---|
| Discoverer | Expert Carpenter, Expert Farmer, Seasoned Scout |
| Explorer | Indentured Servant, Expert Farmer, Seasoned Scout |
| Conquistador | Indentured Servant, two specialists |
| Governor | Indentured Servant, one random immigrant (could be a criminal), one specialist |
| Viceroy | **Petty Criminal**, one random immigrant, one specialist |

Spain's first slot is always a Jesuit Missionary, whatever the level. Spain's missionary even replaces the Discoverer carpenter.

### Your starting soldier

On **Discoverer and Explorer** your starting Soldier is a **Veteran Soldier**. On the harder levels it is an ordinary
Soldier. Spain always gets a veteran.

### Tutorial and advisor warnings

- **Discoverer** switches **Tutorial Hints** on. Every other level starts with them off. You can toggle them under Game Options on any level.
- On **Discoverer and Explorer**, the advisors warn you before you found a colony on a poor site. You get "only a few productive squares" or "none of the surrounding squares are forested". You can cancel or build anyway. On harder levels there is no warning.

---

## 2. Your colonies

### Tories and the production penalty

This is one of the most important difficulty effects. Every colony with too many Tories loses **1 production point on
every worked square and every building job** for each block of Tories:

| Tories per −1 penalty | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| −1 at | 10 | 9 | 8 | 7 | 6 |
| −2 at | 20 | 18 | 16 | 14 | 12 |
| −3 at | 30 | 27 | 24 | 21 | 18 |

- The penalty hits building jobs **before** the expert or building multipliers. An expert or an upgraded building therefore loses **2** points per penalty step, not 1.
- The Tory numbers in the colony window change colour at these same thresholds. They first turn to a warning colour, then a stronger one at double the number.
- The Sons of Liberty bonus (+1 at 50%, +2 at 100%) is the same at every level.
- **The AI never suffers this penalty.** Computer colonies are treated as having no Tories.

> **Tip:** On Viceroy a colony of just 6 non-rebels already takes a penalty. Keep colonies small, or get liberty bells going early.

### Free food on the colony square

| Colony square bonus | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Extra food | +2 | +1 | 0 | 0 | 0 |
| Extra secondary good (cotton, furs, ore…) | +1 | 0 | 0 | 0 | 0 |

### Starvation protection

Normally, a colony that runs out of food loses a colonist. The two easiest levels soften this:

| Chance a colonist dies when food runs out | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Before 1520 | never | never | always | always | always |
| From 1520 | 1 in 3 | 1 in 2 | always | always | always |

### Hidden food for the AI

Computer colonies get free food every turn: **0 · 0 · +1 · +1 · +2** per colony.

### Mines run out faster

Worked ore and silver deposits are eventually exhausted ("Mine depleted near…"). On harder levels this happens sooner.
A deposit worked for one product lasts on average about:

| Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|
| ~100 turns | ~75 turns | ~67 turns | ~63 turns | ~60 turns |

Working minerals for silver uses them up twice as fast.

### Things that do *not* change

- **Pioneer work time.** Roads, clearing and plowing take the same number of turns on every level.
- The **Sons of Liberty production bonus.**

---

## 3. Founding Fathers and liberty bells

Fathers cost more bells for you on harder levels, and **fewer** for the AI. For what each father does, see
[What Each Founding Father Does](founding-fathers.md).

| Bells for your Nth father (before 1600) | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| 1st | 24 | 32 | 40 | 48 | 56 |
| 2nd | 97 | 129 | 161 | 193 | 225 |
| 10th | 481 | 641 | 801 | 961 | 1121 |

- These costs grow by half again in **1600, 1650, 1700 and 1750**. From 1750 the base is about 5× the table above.
- The AI's first father costs **56 · 52 · 48 · 44 · 40** bells. It gets cheaper as the level rises.
- **Which fathers are offered does not depend on difficulty.** It depends on the century. Early fathers like Henry Hudson are mostly offered before 1600, and late ones like George Washington or Thomas Paine mostly after 1700.

---

## 4. Europe, trade and the King

### Recruiting

| Price of your first recruit | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Gold | 140 | 160 | 180 | 200 | 220 |

Each later recruit costs 20 more, on every level. Crosses you have already earned discount the price.

The AI recruits on its own, cheaper scale. A plain colonist costs it **140 · 120 · 100 · 80 · 60**, and artillery after the early game costs it **1000 · 900 · 800 · 700 · 600**.

### Who turns up on the docks

When a new immigrant appears, harder levels give you more undesirables and fewer specialists:

| New immigrant is… | Discoverer | Explorer / Conquistador | Governor / Viceroy |
|---|---|---|---|
| Petty Criminal | 7% | 13% | 20% |
| Indentured Servant | 9% | 17% | 24% |
| Free Colonist | 10% | 17% | 21% |
| Specialist | **74%** | 52% | **35%** |

The AI always gets the middle column. William Brewster turns criminals and servants into free colonists.

### Immigration speed for the AI

On harder levels the AI needs fewer crosses per immigrant: **100% · 87.5% · 75% · 62.5% · 50%** of the normal amount.
Your own requirement does not change with difficulty.

### How fast the market reacts

Every sale pushes the price down and every purchase pushes it up. On harder levels each trade moves the price further:

| Market movement per trade | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Food, lumber, ore, horses, tools, muskets, trade goods | 68% | 84% | 100% | 116% | 132% |
| Raw cash crops and finished goods | 84% | 92% | 100% | 108% | 116% |
| Silver | 92% | 96% | 100% | 104% | 108% |

The AI's trades always move the market at the Discoverer rate. On top of that, the AI's prices for **horses, tools and
muskets** are held very low, at no more than **9 · 7 · 6 · 4 · 3** gold. This is why AI nations field so many dragoons on Viceroy.

### Tax raises come more often

The King's tax events (raises, plus the occasional cut) can only happen at fixed intervals. Harder levels shorten the interval:

| Turns between possible tax events | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Before 1600 | 22 | 20 | 18 | 16 | 14 |
| 1600–1700 | 19 | 17 | 15 | 13 | 11 |
| 1700–1750 | 16 | 14 | 12 | 10 | 8 |
| After 1750 | 13 | 11 | 9 | 7 | 5 |

The **size** of each tax change is the same on every level. Tax events start after turn 30 (1522) and stop once tax is above 85%.

### The King carries your treasure

Without a galleon of your own, the King offers to transport treasure for a cut. The cut is double your tax rate, but never less than:

| Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|
| 50% | 55% | 60% | 65% | 70% |

The cut is capped at 90%. With **Hernan Cortes** it is just your tax rate, with no minimum.

### The King drags you into wars

Unless you have **Benjamin Franklin**, the King may order you to declare war on a European rival. He gives you gold and Veteran Soldiers as compensation.

| | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Can start from | ~1746 | ~1679 | ~1646 | ~1626 | ~1613 |
| Chance per check (one rival at peace) | 1.6% | 3.3% | 4.9% | 6.6% | 8.2% |
| Chance per check (three rivals at peace) | 4.8% | 9.5% | 14% | 19% | 24% |
| Gold given (base / maximum) | 100 / 2500 | 200 / 2000 | 300 / 1500 | 400 / 1000 | 500 / 500 |
| Veteran soldiers given (maximum) | 6 | 5 | 4 | 3 | 2 |

The gold and soldiers grow when the enemy is stronger than you, up to the maximums above.

### Mercenaries

Mercenaries cost more per unit on harder levels:

| Price per unit | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Peacetime offer | 800–1400 | 1000–1600 | 1200–1800 | 1400–2000 | 1600–2200 |
| During the War of Independence | 600–1200 | 800–1400 | 1000–1600 | 1200–1800 | 1400–2000 |

A peacetime offer comes about once every 21 turns (less often while you are at war, because the offering nation must be at peace with you), and artillery counts as two units. During the war, the offer also has fewer regulars on harder levels: 2–4 on Discoverer, down to exactly 2 on Governor and Viceroy.

### Trading at foreign colonies

You need **Jan de Witt** to sell cargo at a rival's colony. The rival pays less on harder levels: on top of their tax, they cut a random
**10–12% · 10–24% · 10–36% · 10–48% · 10–60%** off the price.

### Free gold for the AI

Every turn from about 1512, each computer nation receives free gold. The amount grows with its number of colonies and
with the year, and doubles from 1700.

| Example: an AI with 10 colonies in 1750 | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Free gold per turn | 0 | 120 | 240 | 540 | 960 |

---

## 5. The Native Americans

Natives are the area where difficulty shows most. Almost every interaction is tuned against you on harder levels.

### Starting attitude

Every tribe starts with some alarm towards you, on average **7 · 9 · 11 · 13 · 15** (out of 100). That is never enough to make them start out Uneasy.

### Making them angry

| Alarm caused by… | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Attacking a tribe in the open | +5 | +6 | +7 | +8 | +9 |
| Attacking a village | +10 | +12 | +14 | +16 | +18 |
| Attacking a capital | +30 | +36 | +42 | +48 | +54 |
| Building a road on their land | +3 | +4 | +5 | +6 | +7 |
| Clearing forest on their land | +5 | +6 | +7 | +8 | +9 |
| Working their land without paying | +5 | +6 | +7 | +8 | +9 |
| Demanding tribute, refused | +1 | +2 | +3 | +4 | +5 |
| Demanding tribute, paid | +2 | +4 | +6 | +8 | +10 |

- Land actions count double within 2 squares of a village and triple right next to one.
- Your colonies also make nearby villages tense faster on harder levels. Every building in the colony counts for more: **×½ · ×¾ · ×1 · ×1½ · ×2**.
- France and Pocahontas still halve every alarm rise.

When a tribe at maximum alarm gets angrier, there is a chance it **burns all your missions**: **18% · 27% · 36% · 45% · 55%**.
Against the AI the chance is always 27%.

### Buying their land

The price natives ask for land rises by roughly **65 gold per level**. For example, a square next to an Agrarian village with
a content tribe costs **195 · 260 · 325 · 390 · 455**. The AI pays *less* on harder levels: **300 · 275 · 250 · 225 · 200**.
Peter Minuit makes land free on every level.

### Trading with villages

| | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| What they pay for your goods (vs Discoverer) | 100% | ~92% | ~85% | ~77% | ~69% |
| Asking for a better price works (first try) | 100% | 88% | 75% | 63% | 50% |
| Haggling *their* price down works (typical) | 78% | 67% | 56% | 44% | 33% |

Natives also charge more when you buy from them, especially for silver and finished goods. A failed haggle makes the
village refuse those goods until your next completed trade there. The haggling odds above are for goods the village
barely wants; goods it wants badly allow more tries. See [How the Native Americans Work](natives.md#trading).

### Scouts and chiefs

| | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Chief's gift of gold (average, × (tribe level + 1)) | 231 | 210 | 189 | 168 | 147 |
| Arawak chief kills your scout ("sacred taboos") | 11% | 13% | 14% | 17% | 20% |
| …with a Seasoned Scout | 6% | 7% | 8% | 9% | 11% |
| Uneasy village refuses to teach your colonist | 10% | 30% | 50% | 70% | 90% |

The Arawak taboo death can happen even with a happy tribe.

### Lost City Rumours: holy shrines

The "you have trespassed near our holy shrines" rumour angers the nearby tribe:

| Alarm from a shrine | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Non-scout unit | +6 to +11 | +11 to +16 | +16 to +21 | +21 to +26 | +26 to +31 |
| Scout | +1 to +6 | +6 to +11 | +11 to +16 | +16 to +21 | +21 to +26 |
| Seasoned Scout | −4 to +1 | +1 to +6 | +6 to +11 | +11 to +16 | +16 to +21 |

Explore rumours with scouts, and the higher the level, the more it matters. Scouts are also less likely to trigger the shrine result at all.

### Natives demanding goods and begging for food

- When natives demand goods, they ask for **muskets** more often on harder levels. They are also less likely to settle for half: **50% · 33% · 25% · 20% · 17%**.
- When they beg for food and you give, a village may send a gift back (a convert or goods). The chance is **100% · 50% · 33% · 25% · 20%**.

### Armed braves

Muskets that natives get from trading or raiding go further on harder levels. One lot of muskets arms on average **1 · 2 · 3 · 4 · 5** braves.

### Raids on your colonies

Harder levels make native raids more likely to succeed and more destructive:

| Raid gets through | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| No defences | 69% | 77% | 85% | 92% | 100% |
| Stockade | 46% | 54% | 62% | 69% | 77% |
| Fort | 23% | 31% | 38% | 46% | 54% |
| Fortress | 0% | 8% | 15% | 23% | 31% |

| Once a raid gets through | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| "Burn a building" becomes mere theft | 67% | 56% | 44% | 33% | 22% |
| A stockade stops a theft | 89% | 78% | 67% | 56% | 44% |
| Early protection (no burning, no ship damage; theft still happens) | until ~1572 | until ~1532 | – | – | – |

### During the War of Independence

Tribes that dislike you may side with the Crown. They burn your missions, and the Tories multiply whatever muskets
they already have ([details](natives.md#13-the-war-of-independence)).
On harder levels a hostile tribe is more likely to join: roughly **1.1% · 1.4% · 1.8% · 2.5% · 4.2%** per tribe per turn
at an alarm of 50. The chance grows with alarm.

---

## 6. Combat

This section only covers what difficulty changes. For how a fight works in general, see [How Combat Works](combat.md).

### A bonus for your units

Every fight you take part in gives your side a small flat bonus. It counts whether you attack or defend, and against anyone:

| | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Bonus combat strength | +0.5 | +0.375 | +0.25 | +0.125 | 0 |

For comparison, a Free Colonist defending a colony is worth about 1.5, and a Veteran Soldier attacking in the open about 4.5.

### Discoverer: doubled attacks

On **Discoverer, every attack you make is doubled in strength**, against natives, Europeans, the Royal army, and with ships.

### Protection on the easy levels

On **Discoverer and Explorer** you get extra protection against attacks:

| Attacks against you | Discoverer | Explorer | Harder levels |
|---|---|---|---|
| Any attack on your colony before ~1572 | ×3/8 strength | ×1/4 strength | full |
| European attack on your colony later | ×1/2 | ×1/2 | full |
| European attack on your units, at any time | ×1/2 | ×1/2 | full |
| Native attack on your units before ~1572 | ×1/2 | ×1/2 | full |

- On Discoverer, if an early attack finds a colony with no units inside, the attacker simply loses.
- During the War of Independence, Royal land attacks on your *colonies* get no reduction. Their attacks on your units in the field are still halved.

### Your main colony

Your largest colony gets extra defence: **+2 · +1.5 · +1 · +0.5 · 0** strength. It must hold at least half of all your colonists, so a single colony always qualifies.

> Not a difficulty effect, but worth knowing: natives can never destroy your **last** colony, on any level.

### The Royal army in the field

During the War of Independence, Royal units attacking outside colonies get **+0% · +5% · +10% · +15% · +20%**.

### Promotions

Difficulty barely changes the chance of a promotion after a win, by about one percentage point between levels.

---

## 7. The War of Independence

### The size of the Royal Expeditionary Force

The King's army **at the start of the game**:

| | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Regulars | 15 | 23 | 31 | 39 | 47 |
| Cavalry (Dragoons) | 5 | 10 | 15 | 20 | 25 |
| Artillery | 2 | 8 | 14 | 20 | 26 |
| Men-of-War | 2 | 5 | 8 | 11 | 14 |

### How fast it grows

Until you declare independence, the King adds gold to a war chest every turn. He buys a new unit for the force each time it reaches 1800.
The taxes you pay on sales also go into the chest, on every level.

| King's gold per turn | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Before 1600 | 10 | 18 | 26 | 34 | 42 |
| 1600–1699 | 20 | 36 | 52 | 68 | 84 |
| 1700–1749 | 40 | 72 | 104 | 136 | 168 |
| 1750 onward | 80 | 144 | 208 | 272 | 336 |

> **Tip:** On Viceroy after 1750, the King buys a unit about every five turns from this allowance alone. Declaring earlier means facing a smaller army.

### Foreign intervention

After you declare, a foreign power joins your side once you produce enough liberty bells. The count starts again from zero when you declare:

| Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|
| 2000 | 3500 | 5000 | 6500 | 8000 |

The intervention force itself is set mostly by how big that power is in the New World. Difficulty only shaves a unit or two off it.

### Tory uprisings

Once the King has landed all his land troops, Tories may rise up near one of your colonies each turn. The chance is **50% · 67% · 75% · 80% · 83%**.
Tory soldiers are also more likely to be veterans or mounted on harder levels. Colonies with many Tories and few defenders are the targets.

---

## 8. Rival nations

On harder levels the computer players are not just richer. They also behave more aggressively:

- **They plan against colonies they haven't found.** On Discoverer, AI nations only plan moves against colonies of yours they have actually seen. On other levels that limit lifts, at roughly **never · ~1636 · ~1583 · ~1553 · ~1538**.
- **Their colonies build armories sooner** and train **master carpenters** slightly faster.
- **They win their own independence sooner.** A rival is granted independence once enough of its colonists support it: **80 · 70 · 60 · 50 · 40** rebels. This lowers *your* score (see below).
- **Scouting their colonies is riskier.** A scout sent to infiltrate a colony is caught **28% · 31% · 33% · 36% · 39%** of the time, or **11% · 14% · 17% · 19% · 22%** for a Seasoned Scout. Stockades raise the chance.

Summary of the AI's hidden advantages on harder levels:

| AI advantage | Discoverer | Viceroy |
|---|---|---|
| Free gold per turn | none | large, grows with colonies and year |
| Crosses per immigrant | 100% | 50% |
| Bells per Founding Father | more than you | far fewer than you |
| Price of a colonist recruit | 140 | 60 |
| Horses, tools, muskets | normal | 3 gold or less |
| Extra food per colony | 0 | +2 |
| Tory production penalty | none | none |
| Native land price | higher than yours | far lower than yours |

---

## 9. Score and the Hall of Fame

### The final rating

Your raw score (colonists, fathers, gold, rebels, bells, and so on) is converted into a final **Colonization Rating** with a
difficulty multiplier:

| | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Rating per 1000 raw points | 20 | 25 | 30 | 40 | 50 |
| Raw score needed for the top title ("A CONTINENT!") | ~4825 | ~3860 | ~3217 | ~2413 | ~1930 |

The same game is worth **2.5 times as much on Viceroy** as on Discoverer. The jump from Conquistador to Governor is bigger than the others.

### Other score effects

- **Burning native villages** costs **1 · 2 · 3 · 4 · 5** points per village.
- **Rivals gaining independence first** shrinks your independence bonus. Winning the war doubles your score if no rival is independent yet, ×1.5 after one, ×1.25 after two, and ×1.125 after three. Rivals get there faster on harder levels.
- Your difficulty level is recorded in the Hall of Fame and shown on save slots.

### What does *not* change

- You must still have a colony by 1600 on every level.
- The retirement years and the conditions for winning or losing the war are the same everywhere.

---

## 10. Your title

The level name is also your title. The King, native chiefs and the opening narration address you as
"Discoverer …", "Conquistador …" or "Viceroy …". The title has no effect on the game.

---

## Curiosities found in the code

- **On Explorer, early attacks on your colonies are weaker than on Discoverer.** The two easy-level reductions stack differently: before ~1572, Explorer quarters the attack while Discoverer cuts it to 3/8. Discoverer still comes out ahead overall, because it doubles your own attacks.
- **The "inefficient government" warning and the actual penalty count Tories slightly differently.** The warning rounds down and the penalty rounds to nearest, so occasionally you take the −1 without seeing the warning.
- **The size of a Tory uprising** is taken from the wrong colony (the last one the game checked), not the one being attacked.
- **Refusing food to begging natives was meant to anger them.** The alarm is written to the wrong place, so in practice it seems not to.
- **The score multiplier may overflow** on very high scores, because the calculation uses 16-bit numbers: above roughly 3270 raw points on Viceroy, or 8190 on Discoverer. A score that high may not be reachable in normal play, so this is unconfirmed.

---

## Sources

All figures come from the reconstructed C source in `matched/game/`, where the level is the
byte `g_difficulty` (0 = Discoverer … 4 = Viceroy, see `include/difficul.h`). Random rolls
use `rand_range(lo, hi)`, which includes both ends. Years assume one turn per year until 1600 and two per year after.

| Topic | Files |
|---|---|
| Start of game | `europe_init.c`, `start_new_game.c`, `get_game_options.c`, `orders_build.c` |
| Colonies | `compute_yield.c`, `compute_colonist_yield.c`, `compute_colony_yield.c`, `new_turn_colony.c`, `ColonyWin_DrawColonists.c` |
| Founding Fathers | `freedom_level.c`, `choose_freedom.c` |
| Europe and the King | `europe_recruit.c`, `fill_docks.c`, `europe_religious_threshold.c`, `cargo_diff_adjust.c`, `europe_adjust_prices.c`, `europe_new_taxes.c`, `europe_new_wars.c`, `free_galleon2.c`, `buy_mercs.c`, `foreign_cargo.c`, `foreign_country.c` |
| Natives | `start_indians.c`, `move_unit.c`, `perform_orders_road.c`, `perform_orders_clear.c`, `set_field.c`, `tribe_extortion.c`, `piss_off.c`, `village_anger.c`, `village_bribe.c`, `tribe_trade.c`, `tribe_camp.c`, `tribe_live.c`, `lost_city_exploration.c`, `negotiate_tribe.c`, `indian_village.c`, `indian_move.c`, `resolve_raid.c`, `indian_turn.c` |
| Combat | `combat_fight.c`, `try_to_improve.c` |
| War of Independence | `start_new_game.c`, `royal_edicts.c`, `revolution.c`, `revolution_check.c`, `tory_unrest.c` |
| Rivals | `plan_strategy.c`, `colony_plan.c`, `end_of_game_check.c`, `foreign_scout.c` |
| Score | `Fame.c`, `ReportWin_Score.c`, `FinalScore.c` |

These numbers are for the Windows release. The DOS version is believed to behave the same but has not been checked
line by line.
