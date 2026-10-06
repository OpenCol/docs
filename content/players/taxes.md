# How Taxes Work

*A player's guide to Sid Meier's Colonization (Windows), based on the game's own code.*

A common complaint goes like this:

> "It always seems to happen when I've got 100 tools in a coastal colony in order to finish a building. I could then
> have a tea party, dump the tools into the ocean and not be able to buy tools in Europe anymore, which isn't handy
> early game. But I also don't like paying taxes."

It is not bad luck. The game does not pick the Tea Party good at random. Tools come up so often because of a fixed
rule, and you can plan around it. This guide explains what tax actually costs you, when the King can raise it, how the
Tea Party good is chosen, and how to keep your tools.

For the market itself (prices, how they move, what a sale earns), see [How Europe Works](europe.md).

---

## At a glance

| Topic | The rule |
|---|---|
| What is taxed | Only **sales**: cargo sold in Europe, custom house sales, and treasure. **Buying is never taxed.** |
| Highest rate | **75%**. A raise that would go higher is cut short. |
| When the King acts | Only on turns that are a multiple of the tax period, from turn 30 on. These turns are predictable. See [section 2](#2-when-the-king-can-change-the-rate). |
| Size of a change | A cut of 2–5 points, or a raise of +1, +2, +3–4 or +5–8. A rich, rebellious nation gets the big raises. |
| Other raises | Accepting the King's frigate: **+10**. |
| Tea Party good | Not random. It is the **last good in market order** that is stocked in a coastal colony and that you have traded enough of. Only muskets come after tools. |
| Tea Party colony | The coastal colony holding the **most** of that good. |
| What a party does | Cancels the raise, dumps up to 100 tons, gives that colony that many liberty bells, and boycotts the good in Europe. |
| Lifting a boycott | **500 × the good's ask price**. Tools at an ask of 2 cost 1000 gold. |

---

## 1. What tax actually costs you

Tax is taken only when money comes **to** you from Europe:

| Transaction | Taxed? |
|---|---|
| Selling cargo from a ship in Europe (by hand or by trade route) | **Yes**, at your current rate |
| Custom house sales | **Yes**, at your current rate (none after independence) |
| Treasure arriving in Europe on your own ship | Yes, at your rate, but **never more than 50%** |
| Buying goods, tools, muskets, horses, ships, artillery | **No** |
| Recruiting or training colonists | **No** |
| Selling muskets, tools or horses off a unit on the docks | **No** |

So a raise costs you exactly that many percent of every **future sale**. It does not make anything you buy more
expensive.

**This matters most early in the game.** In the first few decades most players buy far more than they sell: tools,
horses, colonists. At that stage a 1- or 2-point raise costs you almost nothing. It starts to hurt once you are
shipping furs, silver, cigars or cloth to Europe every few turns.

A higher rate also has two side effects that help you:

- **It makes later raises smaller.** Every point of tax takes 5 off the King's score (see below), which pushes him
  away from the +5–8 Stamp Acts.
- **Thomas Paine** adds your tax rate as a percentage to every colony's liberty bells. See
  [Thomas Paine](founding-fathers.md#thomas-paine-).

The tax you pay goes into the King's war chest, which pays for the Royal Expeditionary Force. See
[How fast it grows](difficulty.md#how-fast-it-grows).

---

## 2. When the King can change the rate

The King's regular tax event can only happen when **all** of these hold:

- you have at least one colony;
- it is turn 30 (1522) or later;
- the turn number is an exact multiple of the **tax period**;
- your tax is 85% or less. (The rate can never go above 75%, so in practice this never stops him.)

The period depends on the difficulty level and shrinks as the years pass:

| Turns between tax events | Discoverer | Explorer | Conquistador | Governor | Viceroy |
|---|---|---|---|---|---|
| Up to 1600 | 22 | 20 | 18 | 16 | 14 |
| 1601–1700 | 19 | 17 | 15 | 13 | 11 |
| 1701–1750 | 16 | 14 | 12 | 10 | 8 |
| After 1750 | 13 | 11 | 9 | 7 | 5 |

Before 1600 the game moves one year per turn and turn 0 is 1492, so the years when a tax event is possible are fixed:

| Level | Tax event years before 1600 |
|---|---|
| Discoverer | 1536, 1558, 1580 |
| Explorer | 1532, 1552, 1572, 1592 |
| Conquistador | 1528, 1546, 1564, 1582, 1600 |
| Governor | 1524, 1540, 1556, 1572, 1588 |
| Viceroy | 1534, 1548, 1562, 1576, 1590 |

The event is decided at the **start** of that turn, before your colonies produce anything. What counts is what was in
your colonies when you pressed End Turn on the turn before.

### How big the change is

When the King acts, he rolls a score:

> score = random 1–1000 − 5 × tax rate + your population + gold ÷ 100 + turn ÷ 30 + 10 × rebel %

| Score | Announcement | Change |
|---|---|---|
| under 100 | "To celebrate our recent victory…" | tax **down** 2–5 points (never below 0) |
| 100–649 | "In honor of our recent wedding…" | **+1** |
| 650–949 | "Because of recent developments in our ongoing war…" | **+2** |
| 950–1099 | a new Navigation Act | **+3 or +4** |
| 1100 or more | a new Stamp Act | **+5 to +8** |

The wedding can only happen 30 times in a game, counted across all nations. After that, a score in its range gives the
war raise instead. At 0% tax a "victory" roll does nothing at all, so early in the game nearly every event is a raise.

What pushes the score up:

- **Rebel sentiment.** Each 1% adds 10 points. At 50% rebels a cut is impossible and Stamp Acts become common.
- **Gold in the treasury.** Every 100 gold adds 1 point. Spending your gold before a tax year lowers the score a little.
- **Population** and **the turn number**, slowly.

What pulls it down: **your current tax rate**, 5 points per percent.

### Other ways the rate changes

- **The King's frigate.** When enemy warships threaten your shipping and you have no frigate, the King offers one every
  8 turns. Accepting raises your tax by **10**. This is an ordinary raise, so it can come with the Tea Party option.
  If you hold the party you keep the frigate and refuse the tax.
- **Losing that frigate** is meant to earn you a tax cut, but the amount is read from the wrong table entry. See
  [How Europe Works](europe.md).
- **Cheat mode.** With the cheat menu on, `[` and `]` on the Europe screen lower and raise your tax by 1.

---

## 3. How the Tea Party good is chosen

Every time the King **raises** your tax, the game looks for a good your colonists could throw into the harbour. Cuts
never offer a Tea Party. If it finds one, the announcement gets a second answer such as *"Hold 'Boston Tools Party'"*.

### Step 1: each good gets a weight

The weight comes from your **trading history in Europe**: the net tons of that good you have sold there, minus the tons
you have bought there. It does not matter which way it leans. Buying 300 tons counts the same as selling 300. That
figure is divided by 100, rounded down, and then:

| Good | Weight | Net tons needed for a weight |
|---|---|---|
| Food, tools | halved | 200 |
| Horses, muskets | quartered | 400 |
| Everything else | as is | 100 |

Custom house sales count as Europe sales here too. Goods lost from a full warehouse do not count.

### Step 2: the game looks at coastal colonies

Only **coastal** colonies are searched, and only goods that are **not already boycotted**. For each good the game
notes the coastal colony that holds the most of it.

### Step 3: it takes the last good in market order

The market lists the goods in this order:

> food, sugar, tobacco, cotton, furs, lumber, ore, silver, horses, rum, cigars, cloth, coats, trade goods, **tools**,
> muskets

The game picks the **last** good in this list that is in stock in a coastal colony **and** has a weight above zero.
The weights do not act as odds. Nothing is random. A good with weight 1 beats a good with weight 50 if it comes later
in the list.

If no stocked good has any weight yet, the game picks the **first** stocked good instead, which is usually food.

### Why it is always the tools

Tools are 15th of 16 in the list. Only muskets come after them. You need a net 200 tons of tools traded in Europe to
give them a weight. Most players buy that much in the first few decades.

From then on, **whenever a coastal colony has tools in its warehouse during a raise, the Tea Party good is tools**. The
one exception is muskets, if a coastal colony also stocks some and you have bought or sold a net 400 tons of them. The
colony named is the coastal colony with the most tools, which is usually the one saving up for a building.

---

## 4. What the Tea Party does

The party is optional. If you pick the first answer you simply accept the raise.

If you hold the party:

| Effect | |
|---|---|
| The tax raise | **cancelled** entirely |
| The goods | up to **100 tons** removed from that colony |
| The colony | gains **liberty bells equal to the tons dumped** |
| The good | **boycotted** in your European port |

While a good is boycotted:

- You cannot buy or sell it in Europe, by hand or by trade route. "Unload" sells everything else and leaves the
  boycotted cargo aboard.
- You cannot equip or strip the matching unit on the docks: tools stop pioneers, muskets stop soldiers, horses stop
  scouts and dragoons.
- **Your custom houses ignore the boycott** and keep selling the good.

### Lifting the boycott

Click the boycotted good in the Europe market. Parliament demands back taxes of **500 × the good's current ask
price**. You pay in full or nothing happens.

| Good | Typical ask | Back taxes |
|---|---|---|
| Tools | 2 | **1000** |
| Muskets | 3 | 1500 |
| Furs | 6 | 3000 |
| Food | 8 | 4000 |
| Cloth | 12 | 6000 |

**Jakob Fugger** lifts every current boycott for free, once. See [Jakob Fugger](founding-fathers.md#jakob-fugger-).

Computer players never hold Tea Parties.

---

## 5. What to do about it

### Keep the tools out of the warehouse on tax years

Only goods **in a coastal colony's warehouse** can be picked. Tools on a ship, in a wagon train or in an inland colony
are invisible to the Tea Party check. The tax years are fixed (see [section 2](#2-when-the-king-can-change-the-rate)).
So at the end of the turn before one:

- load the tools onto a wagon train or a ship standing in the colony, and unload them next turn; or
- keep your building stock in an inland colony.

The offer then moves to the next good down the list that you have traded and are holding, such as trade goods, coats,
cloth, cigars, rum or silver. If none of your stocked goods have a weight, it falls back to the first stocked good.
Check the offer before you answer: it may now name a good you sell every trip.

### Decide whether to pay or to party

Ask what the raise will cost over the rest of the game, and compare that with getting the good back.

- **Accepting** costs that many percent of everything you will sell in Europe from now on. Early in the game, when you
  mostly buy, a +1 or +2 is nearly free.
- **A tools party** costs the 100 tools and about **1000 gold** in back taxes to lift. You also get 100 bells in that
  colony, which you keep even after paying the back taxes.

Rules of thumb:

- **Accept small raises early.** +1 and +2 cost little while you are still buying. Your higher rate also takes 5 to 10
  points off the next roll.
- **Consider a party for a Stamp Act (+5 to +8) or the frigate's +10.** If you expect to sell 20,000 gold of goods in
  Europe over the rest of the game, an 8-point raise costs about 1600 gold. Dumping 100 tools and paying 1000 to lift
  the boycott is cheaper, and the colony gets 100 bells.
- **Tools are the cheapest boycott to lift.** Their ask is so low that the back taxes are small. A boycott on furs,
  sugar or cloth costs several times as much.
- **Muskets and horses are worth protecting.** A boycott on them stops you arming soldiers and dragoons in Europe. The
  same hiding trick works for them.

> **Tip:** Late in the game, with your rebels high, nearly every tax event is a big raise. A Tea Party on a good you no
> longer buy or sell in Europe, perhaps because a custom house now handles it, refuses the raise for free. You can
> steer the offer to that good by keeping the later goods in the list out of your coastal warehouses on tax years.

---

## Sources

All of this comes from the reconstructed C source in `matched/game/`.

| Topic | Files |
|---|---|
| The tax event, its timing and its score | `europe_new_taxes.c`, `europe_new_turn.c`, `new_turn_bookkeeping.c` |
| Applying a change, the 75% cap, the Tea Party | `raise_taxes.c` |
| Trade history used for the weights | `traffic_to_europe.c`, `traffic_from_europe.c`, `new_turn_colony.c` |
| What is taxed | `traffic_to_europe.c`, `custom_sell.c`, `europe_click_unit.c` |
| Boycotts and back taxes | `boycott.c`, `free_boycott.c` |
| The frigate | `new_turn_bookkeeping.c`, `special_kill.c` |

These findings are for the Windows release. The DOS version is believed to behave the same but has not been checked
line by line.
