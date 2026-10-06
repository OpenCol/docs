# How Europe Works

*A player's guide to Sid Meier's Colonization (Windows), based on the game's own code.*

Europe is your bank, your shipyard, your recruiting office and your tax collector. The manual says that prices "fall
when you sell" and "the King raises taxes". This guide gives the actual rules: what each good starts at, how many
tons it takes to move a price, how fast markets recover, what decides a tax raise, what a boycott costs to lift, and
what you can buy or train there.

Everything below was read out of the reconstructed game code. The source files are listed at the end. Where a
number depends on the difficulty level, this guide gives the Conquistador value and links to
[How Difficulty Affects the Game](difficulty.md) for the rest.

---

## At a glance

| Topic | The rule |
|---|---|
| Prices | Each good has one hidden price. Europe pays you that price **minus 1** (the bid) and charges the price **plus a spread** (the ask). |
| Starting prices | Rolled once per game and the same in all four European ports. Silver starts at 19/20, muskets at 2/3, tools at 1/2. |
| Selling | Every ton sold pushes a hidden counter. When it passes a per-good threshold, the price drops **one step**. |
| Speed of a crash | Silver drops a step for every **25** tons sold. Furs need **1000** tons. Lumber never moves at all. |
| Recovery | Raw goods slowly climb back on their own. Trade goods, tools and muskets slowly get **cheaper**. |
| Other nations | Every European nation's sales and purchases move **your** market too. |
| Tax | Only sales are taxed. Purchases, training and recruiting are not. The rate never goes above **75%**. |
| Tax raises | Possible from turn 30, once every 18 turns on Conquistador (more often later and on harder levels). Never while you have no colony. |
| Boycott | Refusing a raise ("Tea Party") dumps up to 100 tons, gives that colony liberty bells, and boycotts that good. Lifting it costs **500 × the ask price**. |
| Ships | Caravel 1000, Merchantman 2000, Privateer 2000, Galleon 3000, Frigate 5000. |
| Artillery | 500, plus 100 for every artillery you have ever bought. |
| Specialists | 600 (ore miner) to 2000 (veteran soldier). Fixed prices. |
| Crossing | Normally two turns each way, sometimes three. |
| Independence | Europe closes. Everything you still have in Europe or at sea is lost. |

---

## 1. The market: bid and ask

Behind every good in the market there is **one hidden price**. The two numbers you see are derived from it:

- **Bid** (what Europe pays you) = price − 1, never below 0.
- **Ask** (what you pay) = price + the good's spread.

All amounts are per ton: buying 100 tools at an ask of 2 costs 200 gold.

At the start of each game every good's price is drawn once at random from its starting range. The **same** price is
then written into all four European ports, so London, La Rochelle, Seville and Amsterdam start out identical. They
drift apart later, because each port updates on its own nation's turn.

| Good | Starting bid / ask | Bid can range over the game | Ask is always |
|---|---|---|---|
| Food | 0–2 / 8–10 | 0–5 | bid + 8 |
| Sugar | 3–6 / 5–8 | 2–6 | bid + 2 |
| Tobacco | 2–4 / 4–6 | 1–4 | bid + 2 |
| Cotton | 1–4 / 3–6 | 1–4 | bid + 2 |
| Furs | 3–5 / 5–7 | 1–5 | bid + 2 |
| Lumber | 1 / 6 | **fixed** | bid + 5 |
| Ore | 2–5 / 5–8 | 1–5 | bid + 3 |
| Silver | 19 / 20 | 1–19 | bid + 1 |
| Horses | 1–2 / 2–3 | 1–10 | bid + 1 |
| Rum, Cigars, Cloth, Coats | usually about 11 / 12 (anywhere from 7/8 to 17/18) | 0–19 | bid + 1 |
| Trade Goods | 1–2 / 2–3 | 1–11 | bid + 1 |
| Tools | 1 / 2 | 1–8 | bid + 1 |
| Muskets | 2 / 3 | 1–19 | bid + 1 |

- **Lumber can never change price.** Its lowest and highest price are the same number, so no amount of trade moves it.
- **Raw goods carry a spread; finished goods do not.** Food costs 8 more than it sells for, lumber 5, ore 3 and the four cash crops 2. Silver and everything manufactured is just 1 apart.
- **The four finished goods ignore their printed starting range.** Rum, cigars, cloth and coats start from a hidden "demand" figure (section 2). Their hidden price starts at 12 on average (11/12 in the market), but a lucky or unlucky roll can put one of them as low as 8 or as high as 18.

---

## 2. How prices move

### The hidden counter

Each port keeps a hidden **pressure counter** for every good.

- **Selling** adds to it. **Buying** subtracts from it.
- When the counter reaches the good's **fall threshold**, the price drops one step and the threshold is taken back out of the counter.
- When it reaches minus the **rise threshold**, the price rises one step in the same way.
- The price can move **only one step at a time**: once straight after each sale or purchase you make, and once per turn.

Each ton counts as 1, 2 or 4 points of pressure, depending on the good. The table turns this into tons, at Conquistador:

| Good | Tons sold to drop the price 1 step | Tons bought to raise it 1 step | With no trade at all |
|---|---|---|---|
| Food | 200 | 300 | +1 every ~300 turns |
| Sugar | 300 | 200 | +1 every ~50 turns |
| Tobacco | 400 | 200 | +1 every ~40 turns |
| Cotton | 300 | 200 | +1 every ~36 turns |
| Furs | **1000** | 200 | +1 every ~31 turns |
| Lumber | never | never | never |
| Ore | 400 | 200 | +1 every ~29 turns |
| Silver | **25** | 200 | +1 every ~100 turns |
| Horses | 200 | 300 | +1 every ~100 turns |
| Rum | 200 | 200 | +1 every ~33 turns, plus the demand pull below |
| Cigars | 200 | 200 | +1 every ~36 turns, plus the demand pull |
| Cloth | 200 | 200 | +1 every ~31 turns, plus the demand pull |
| Coats | 200 | 200 | +1 every ~36 turns, plus the demand pull |
| Trade Goods | 300 | 200 | **−1** every ~75 turns |
| Tools | 200 | 200 | **−1** every ~40 turns |
| Muskets | 200 | 200 | **−1** every ~33 turns |

- **The "no trade" drift also erases small trades.** A sale that does not reach the threshold is slowly forgotten. For example, 100 furs fill only a tenth of the fur threshold, and the drift wears that away again in about 15 turns.
- **Manufactured goods get cheaper over time.** Trade goods, tools and muskets drift *down* on their own, so a Europe-bought musket army gets a little cheaper every few dozen turns.
- **Harder levels make your trades push harder.** On Viceroy, 100 food counts like 132 tons, and on Discoverer like 68. Goods worth 2 or 4 points per ton are affected less. See [How fast the market reacts](difficulty.md#how-fast-the-market-reacts).

> **Tip:** Sell in full lots of 100. Because the price can drop only one step per sale, a whole hold of 100 sells at
> the quoted price. The rest of the drop arrives over the following turns. Splitting the same 100 into small sales
> lets the price fall between them.

### Demand: the pull on crops and finished goods

Two groups of goods also feel a **demand pull**. The game remembers how much of each good the whole of Europe has
taken. That memory starts at a random 600–1000 tons per good and fades by about 1/128 each turn, so it has a
half-life of roughly 90 turns. Every nation's sales add to it.

From that memory each good gets a **target price**: 3 × (the group's total volume) ÷ (this good's volume). The more
of a good has been sold compared with its group, the lower its target.

- **Rum, cigars, cloth and coats** form one group. Their pull is strong: the price moves **about one step a turn toward the target**. If you flood Europe with cloth while nobody sells coats, cloth heads down and coats head up, even if you stop selling.
- **Sugar, tobacco, cotton and furs** form the other group. Their pull is weak, only a few points of pressure a turn, so the ordinary drift matters more. Furs count only half their real volume, and fur demand gets an extra boost before 1700 (a bigger one before 1600).

> **Tip:** Spread your manufacturing over several finished goods. Four colonies making rum, cigars, cloth and coats
> keep all four targets near 12. One giant cloth town drives the cloth target down for everyone.

### The Dutch advantage

Amsterdam's market is gentler, as the Dutch nation description promises:

- Sales anywhere push Amsterdam's counter by only **two thirds** as much as the other ports'. Purchases push it the full amount.
- Amsterdam's natural drift runs twice as fast on every other turn, so on average it is 1.5× faster. Raw goods recover sooner, and manufactured goods get cheaper sooner.

### Price news

When your own port's price changes, the game tells you ("The price of silver in London has fallen to 18"). The
figure shown is the new bid.

---

## 3. Worked examples

These use Conquistador and ignore other nations' trade.

**Selling 100 furs at a bid of 5 with 10% tax.**

| | |
|---|---|
| Gross | 100 × 5 = **500** |
| Tax (10%) | **−50** |
| You receive | **450** |
| Price effect | That is a tenth of the 1000 tons furs need for one step. The price does not move. |

**Selling 100 silver at a bid of 19 with 20% tax.**

| | |
|---|---|
| Gross | 100 × 19 = **1900** |
| Tax (20%) | **−380** |
| You receive | **1520** |
| Price effect | One step at once (bid 18), then one more step on each of the next two turns (bid 16). |

**A galleon of silver, all six holds in one visit.** The holds sell at 19, 18, 17, 16, 15 and 14 for 9900 gold
before tax. That leaves the counter so full that silver keeps falling one step per turn and reaches a bid of
**1** about a dozen turns later. With no further sales it then needs roughly a century to climb back one step.

**Taxes are rounded down in your favour.** The tax is the gross times the rate, divided by 100, with the remainder
dropped. Selling 7 tons at a bid of 3 with 10% tax is 21 gross, 2 tax, 19 net.

---

## 4. Other nations' trade

Your market is not yours alone.

- **Every European nation's sales and purchases move all four ports' counters**, including yours. A rival dumping furs in Amsterdam pushes the fur price down in London too.
- The demand memory in section 2 is shared as well, so rivals' sales also shift the targets for crops and finished goods.
- **Computer players' trades push at the Discoverer rate** on every level.
- **Computer players pay no tax** when their ships sell in Europe. Only their custom houses pay.
- Computer players' trades do not move a price straight away. The effect shows up at the next turn's update.
- Computer players' own prices for horses, tools and muskets are held very low. See [How fast the market reacts](difficulty.md#how-fast-the-market-reacts).

---

## 5. Taxes

*For the whole tax picture in one place, with advice on when to pay and when to party, see
[How Taxes Work](taxes.md).*

### What is taxed

| Transaction | Taxed? |
|---|---|
| Selling cargo from a ship in Europe (by hand or by trade route) | **Yes**, at your current rate |
| Custom house sales | **Yes**, at your current rate (none after independence) |
| Treasure arriving in Europe on your own ship | Yes: the King takes your tax rate, but **never more than 50%** |
| Buying goods, ships, artillery | No |
| Recruiting or training colonists | No |
| Selling muskets, tools or horses off a unit on the docks | **No** (see Curiosities) |

The tax you pay goes into the King's war chest, which pays for the Royal Expeditionary Force. See
[How fast it grows](difficulty.md#how-fast-it-grows).

### When the King changes the rate

The King can announce a tax change only when **all** of these hold:

- you have at least one colony;
- it is turn 30 or later;
- the turn number is an exact multiple of the **tax period**;
- your tax is 85% or less.

The period is 18 turns on Conquistador. It shrinks by 3 after 1600, again after 1700 and again after 1750. Each
difficulty level above Conquistador takes 2 more turns off, and each level below adds 2. The full table is under
[Tax raises come more often](difficulty.md#tax-raises-come-more-often).

When the King acts, he rolls a **score**:

> score = random 1–1000 − 5 × tax rate + your population + gold ÷ 100 + turn ÷ 30 + 10 × rebel %

| Score | Announcement | Change |
|---|---|---|
| under 100 | "To celebrate our recent victory…" | tax **down** 2–5 points (never below 0) |
| 100–649 | "In honor of our recent wedding…" | **+1** |
| 650–949 | "Because of recent developments in our ongoing war…" | **+2** |
| 950–1099 | a new Navigation Act | **+3 or +4** |
| 1100 or more | a new Stamp Act | **+5 to +8** |

The wedding can only happen 30 times in a game. After that, a score in its range gives the war raise instead.

What the score means for you:

- **Rich, rebellious colonies attract big raises.** Each 1% of rebel sentiment adds 10 points, so at 50% rebels a tax cut is impossible and Stamp Acts become common.
- **A high tax rate protects you.** Every point of tax takes 5 off the score.
- At 0% tax, a "victory" roll does nothing at all.

**Two examples:**

| Situation | Cut | +1 | +2 | +3/4 | +5–8 |
|---|---|---|---|---|---|
| Early game: tax 0%, 10 colonists, 500 gold, turn 40, no rebels | (8%, no effect) | 55% | 30% | 7% | – |
| Mid game: tax 20%, 60 colonists, 3000 gold, turn 150, 30% rebels | – | 35% | 30% | 15% | 20% |

### Other ways the rate changes

- **The King's frigate.** When enemy warships threaten your shipping and you have no frigate, the King offers one every 8 turns. Accepting raises your tax by **10**.
- **Losing that frigate** is meant to earn you a tax cut ("In light of the unfortunate loss…"), but the amount comes from the wrong table entry. See Curiosities.
- **Thomas Paine** does not change the rate, but adds your tax rate as a bonus percentage to liberty bells. See [Thomas Paine](founding-fathers.md#thomas-paine-).

**The rate is capped at 75%.** A raise that would go above it is cut short.

---

## 6. Tea parties and boycotts

### The choice

When the King **raises** your tax, the game looks for something your colonists could throw into the harbour. If it
finds one, the announcement gets a second answer: *"Hold 'Boston Cloth Party'"* (or whatever the colony and good
are).

How the good and the colony are picked:

- Only **coastal** colonies count, and only goods that are not already boycotted.
- Each good gets a weight from your trading history in Europe: the net tons traded (sold minus bought, whichever way it leans), divided by 100. Food and tools count half, horses and muskets a quarter.
- The game takes the **last good in market order** (food first, muskets last) that has a weight and is stocked in a coastal colony. If no stocked good has any weight yet, it takes the **first** stocked good, which is usually food.
- The colony is the coastal colony holding the most of that good.

Cuts never offer a Tea Party, and neither does a raise when no coastal colony stocks anything.

### What a Tea Party does

| Effect | |
|---|---|
| The tax raise | **cancelled** entirely |
| The goods | up to **100 tons** removed from that colony |
| The colony | gains **liberty bells equal to the tons dumped** |
| The good | **boycotted** in your European port |

### Living with a boycott

While a good is boycotted:

- You cannot buy or sell it in Europe, by hand or by trade route. "Unload" on a ship sells everything else and leaves the boycotted cargo aboard ("Some of the cargo could not be unloaded…").
- On the docks you cannot buy or sell that equipment either. A muskets boycott stops you arming or disarming soldiers in Europe, tools stops pioneers, horses stops scouts and dragoons.
- **Your custom houses ignore the boycott.** Their code never checks it, so they keep selling the good.

### Lifting a boycott

Click the boycotted good in the market. Parliament demands back taxes of **500 × the good's current ask price**:

| Good (example ask) | Back taxes |
|---|---|
| Food (8) | 4000 |
| Furs (6) | 3000 |
| Cloth (12) | 6000 |
| Muskets (3) | 1500 |

If you cannot afford it, you are told how much you have and nothing happens. The money goes to the King's war
chest. **Jakob Fugger** lifts every current boycott for free, once. See [Jakob Fugger](founding-fathers.md#jakob-fugger-).

Computer players never hold Tea Parties.

> **Tip:** The game does not pick the good you trade least. It picks the last one in market order that has any
> weight, which is why tools come up so often. Look at the colony and good named in the option before you choose.
> Refusing a 1-point raise is rarely worth losing a good you sell every turn. Refusing a Stamp Act often is. To steer
> the choice, see [How Taxes Work](taxes.md#5-what-to-do-about-it).

> **Tip:** The 10-point raise for the King's frigate is an ordinary tax raise, so it can come with the Tea Party
> option. If you hold the party, you keep the frigate and refuse the tax.

---

## 7. Buying ships and artillery

| Unit | Price |
|---|---|
| Artillery | 500, **+100 for each artillery you have bought before** |
| Caravel | 1000 |
| Merchantman | 2000 |
| Privateer | 2000 |
| Galleon | 3000 |
| Frigate | 5000 |

- The artillery surcharge never goes down. The 5th artillery costs 900, the 10th 1400.
- Ship prices never change.
- Lines you cannot afford are greyed out.
- New units wait in Europe. When their ship sails, they head for the spot your last ship left from (section 11).
- The Man-o-War cannot be bought.

Computer players buy from the same list at the same prices, except that their artillery follows its own rule. See
[Recruiting](difficulty.md#recruiting).

---

## 8. Training specialists

The **Train** button ("The Royal University can provide us with specialists…") sells these experts at fixed
prices that never rise:

| Specialist | Price |
|---|---|
| Expert Ore Miner | 600 |
| Expert Lumberjack | 700 |
| Master Gunsmith | 850 |
| Expert Silver Miner | 900 |
| Master Fur Trader | 950 |
| Expert Fisherman | 1000 |
| Master Carpenter | 1000 |
| Master Blacksmith | 1050 |
| Expert Farmer | 1100 |
| Master Distiller | 1100 |
| Hardy Pioneer | 1200 |
| Master Tobacconist | 1200 |
| Master Weaver | 1300 |
| Jesuit Missionary | 1400 |
| Firebrand Preacher | 1500 |
| Elder Statesman | 1900 |
| Veteran Soldier | 2000 |

- **Not available for training:** master sugar, tobacco and cotton planters, expert fur trappers, seasoned scouts, veteran dragoons and expert teachers. Some of these can still turn up as immigrants.
- A **Hardy Pioneer** comes with 100 tools, a **Veteran Soldier** with muskets, and a **Jesuit Missionary** already blessed.
- **A Veteran Soldier sometimes arrives mounted**, as a Veteran Dragoon with free horses. The chance is **1 in 5** on Discoverer, falling to 1 in 9 on Viceroy. The same roll applies to veteran soldiers who arrive as immigrants.

> **Tip:** An Elder Statesman at 1900 is often the best buy in the list. The cheap ones (ore miner, lumberjack) can
> usually be had from a schoolhouse or a native village instead.

---

## 9. Recruiting and immigration

This is covered in detail in [Recruiting](difficulty.md#recruiting) and
[Who turns up on the docks](difficulty.md#who-turns-up-on-the-docks). In short:

**Three colonists wait on the docks.** When your crosses pass the requirement, one of the three, chosen at random,
emigrates for free ("Religious unrest…"). Your crosses then go back to **zero**, and any surplus is lost. The empty
slot is refilled at once.

**Crosses needed** for the next immigrant:

> 2 × (colonists in all your colonies + all your units, ships included) + 8, at most 4000

England needs only two thirds of that. For example, with 30 colonists in colonies and 20 units you need
2 × 50 + 8 = **108** crosses, or 72 as England.

**Crosses per turn** are your colonies' production plus a small amount from Europe itself:

- Europe adds **+2** a turn.
- After your first cross-driven immigrant has arrived, colonists you leave standing in Europe count against you. One waiting turns the +2 into **−2**, and each further one costs 2 more.

> **Tip:** Every unit you own raises the cross requirement by 2, ships and wagon trains included. And don't leave
> colonists idling in Europe: they slow down the next immigrant.

**Paying passage** (the Recruit button) buys one of the three at once:

> price = 140 + 20 × (difficulty + recruits you have bought), then discounted by the crosses you have gathered

The discount is (price − floor) × crosses ÷ (crosses needed + 1), where the floor is 100 or a fifth of the price,
whichever is larger. The price is never below 10. **Recruiting also resets your crosses to zero**, so the discount is
really the crosses you give up.

| Example (Conquistador) | Price |
|---|---|
| First recruit, no crosses | 180 |
| First recruit, crosses half-way to the requirement | 140 |
| Fourth recruit, no crosses | 240 |

The count of bought recruits stops at 180, so the price never goes above 3820.

**William Brewster** lets you choose the emigrant and keeps criminals and servants off the docks. See
[William Brewster](founding-fathers.md#william-brewster-).

---

## 10. The docks: equipping units

Clicking a colonist on the docks offers to equip or strip him at the current market price:

| Option | Cost or refund |
|---|---|
| Arm with muskets (colonist becomes a soldier, scout becomes a dragoon) | 50 × muskets ask |
| Sell muskets | 50 × muskets bid |
| Equip with tools (becomes a pioneer) | 100 × tools ask |
| Sell tools | 100 × tools bid |
| Equip with horses (colonist becomes a scout, soldier becomes a dragoon) | 50 × horses ask |
| Sell horses | 50 × horses bid |
| Bless as missionaries | free |

At the starting prices, muskets cost 150, tools 200 and horses 100–150.

- **Selling equipment on the docks is tax-free.** The refund is the full bid with no tax taken.
- **A pioneer always sells back a full 100 tools**, however many he has used up.
- Like a ship sale, these trades move the market counters, but the price itself only updates at the next turn.

> **Tip:** At a high tax rate, worn-out pioneers are worth bringing home. Selling one off the docks returns
> 100 tools at the full bid, tax-free, even if he has 20 left.

---

## 11. Sailing to and from Europe

### Leaving the New World

The game asks "Shall we sail for Europe?" when a ship:

- moves **east** from one high-seas square onto another, or
- tries to sail off the **left or right edge** of the map.

There is also a direct order to sail for Europe.

### How long a crossing takes

Each crossing starts a countdown of **1 turn**. If you own **3 or more ships**, there is an **11%** chance it is
2 turns instead. **Ferdinand Magellan** removes that extra turn. See [Ferdinand Magellan](founding-fathers.md#ferdinand-magellan-).

The ship also spends a turn in a second holding area before it arrives. By our reading of the turn order, a ship
that sails for Europe is in port **at the start of your second turn after leaving**, or the third with the extra turn.
The trip back works the same way.

### Arriving back

- A ship returning from Europe comes back to **the high-seas square it left from**, or the nearest square that will take it.
- Units bought or trained in Europe head for **the square your most recent ship left from**.
- Everything aboard sails and arrives together.

---

## 12. The King's other business

Briefly. The numbers are in [Europe, trade and the King](difficulty.md#4-europe-trade-and-the-king).

- **Treasure.** A treasure train brought to Europe on your own galleon pays the King your tax rate, at most 50%. Without a galleon, the King offers to carry it for double your tax rate (minimum 50–70% by level, cap 90%). **Hernan Cortes** brings this down to your plain tax rate. See [The King carries your treasure](difficulty.md#the-king-carries-your-treasure).
- **Mercenaries.** Before the war, about once every 21 turns, a European power offers regulars and artillery for 800–2200 a unit. See [Mercenaries](difficulty.md#mercenaries).
- **The King's wars.** The King may declare war on a rival for you and pay you gold and veteran soldiers for it, unless you have **Benjamin Franklin**. See [The King drags you into wars](difficulty.md#the-king-drags-you-into-wars).
- **The war chest.** Your sales tax, back taxes and the King's share of treasure all go into the chest that buys the Royal Expeditionary Force. See [How fast it grows](difficulty.md#how-fast-it-grows).

### Founding Fathers that change Europe

| Father | Effect on Europe |
|---|---|
| William Brewster | Choose your immigrants; no criminals or servants |
| William Penn | Preachers produce 50% more crosses |
| Jakob Fugger | Lifts all current boycotts, once |
| Peter Stuyvesant | Allows the custom house |
| Ferdinand Magellan | No random extra turn on the crossing |
| Hernan Cortes | The King carries treasure for just your tax rate |
| Benjamin Franklin | The King can no longer drag you into wars |
| Thomas Paine | Your tax rate becomes a liberty-bell bonus |
| Jan de Witt | Sell at foreign colonies instead of Europe |

Details for each are in [What Each Founding Father Does](founding-fathers.md).

---

## 13. After you declare independence

- **Europe closes.** Ships can no longer sail to or from Europe ("…for the duration of the War of Independence").
- **Everything you still have off the map is lost.** At the moment of the declaration, every unit of yours in Europe, on the docks or on a crossing is removed. Ships are announced as "seized on the high seas by the Royal Navy".
- **The European market freezes.** The yearly Europe step stops: no price changes, no immigration, no tax events and no King's wars.
- **Custom houses keep trading, tax-free**, at the frozen prices ("European smugglers"). They still stop while their colony is under siege or blockade.
- **Treasure is cashed in full** where it stands, with no King's cut.
- With **Jan de Witt**, selling at colonies of the power that intervenes on your side costs only a small fixed cut.

> **Tip:** Before you declare, bring every ship and colonist home, and spend your gold in Europe. Anything left
> there is gone.

---

## Curiosities and bugs found in the code

- **Artillery gets dearer even when you say no.** The purchase counter goes up as soon as you pick artillery in the list, before the "Purchase Artillery for N?" confirmation. Answering No still adds 100 to every future artillery.
- **Dock sales are tax-free, and pioneers sell tools they no longer have.** Selling muskets, tools or horses off a unit on the docks pays the full bid with no tax. A pioneer always refunds 100 tools, whatever he has left.
- **The Tea Party is not random.** The weights look like a weighted random draw, but nothing random is rolled. The game always lands on the last eligible good in market order, or the first stocked good if none has any trading history. Early in the game that is often **food**.
- **Custom houses ignore boycotts.** Nothing in the custom house code checks the boycott list.
- **The King's frigate refund reads the wrong entry.** When the frigate the King lent you is sunk, your tax is meant to drop and the "unfortunate loss" message to appear. The search loop overshoots by one, so the cut is read from past the end of the price table. The message is filled in but never shown, so the cut, whatever it is, happens silently.
- **An audience with the King was planned and never connected.** The code contains a full "audience" menu: ask for a grant, ask for lower taxes (which can backfire into a raise), or ask the Royal University for a specialist. Nothing in the game calls it, and the two texts it needs (AUDIENCE and KINGGOAWAY) are missing from the game's text file. The grant and "lower taxes" replies (KINGFUND, KINGNO, KINGLOWER, KINGRAISE, KINGNOTHING) are in the text file but can never be seen.
- **An unused tax text.** The text file contains PURCHASETAX ("…raise your tax rate … in recognition of your use of Crown resources"), which the program never references.
- **England ages the market faster.** The fading of the demand memory is applied whenever England's port is updated. That includes the instant update after each sale or purchase an English player makes, so playing England, every trade in Europe also fades demand by a 1/128 step.
- **The boycott warning only looks at one hold.** When "Unload" skips boycotted cargo, the warning flag is reset for every hold, so the message appears only if the boycotted good was in the ship's first hold.
- **Cheat mode tax keys.** With the cheat menu enabled, `[` and `]` on the Europe screen lower and raise your tax by 1 point.
- **The King's wedding count is shared.** The 30-wedding limit is one counter for the whole game, not one per nation.

---

## Sources

All of this comes from the reconstructed C source in `matched/game/`. The goods table is the
CARGO text resource (`export/text/COLTEXT0.DLL/99_CARGO.txt`),
whose columns are, in order: lowest start, highest start, minimum price, maximum price, spread, rise threshold,
fall threshold, drift and pressure per ton. The specialist prices are the JOB resource. Random rolls use
`rand_range(lo, hi)`, which includes both ends.

| Topic | Files |
|---|---|
| Prices and the market | `load_data.c`, `europe_init.c`, `start_new_game.c`, `europe_bid_price.c`, `europe_ask_price.c`, `europe_adjust_prices.c`, `traffic_to_europe.c`, `traffic_from_europe.c`, `cargo_diff_adjust.c`, `market_price_rise.c`, `market_price_fall.c` |
| Selling and buying | `EuropeWin_AttemptCargoToEurope.c`, `EuropeWin_AttemptCargoFromEurope.c`, `cargo_to_europe.c`, `cargo_from_europe.c`, `new_turn_colony.c`, `custom_sell.c`, `foreign_country.c` |
| Taxes | `europe_new_taxes.c`, `raise_taxes.c`, `new_turn_bookkeeping.c`, `special_kill.c`, `EuropeWin_MotherFuckinAsciiParse.c` |
| Boycotts | `boycott.c`, `free_boycott.c`, `EuropeWin_EuropeMouseUnits.c`, `EuropeWin_EuropeMouseMarket.c`, `europe_click_unit.c`, `give_me_liberty.c` |
| Ships, artillery, training | `init_data.c`, `setup_purchase.c`, `europe_purchase.c`, `europe_recruit_any.c`, `unit_from_docks.c` |
| Immigration | `europe_new_turn.c`, `europe_religious_threshold.c`, `europe_recruit.c`, `fill_docks.c` |
| The docks | `europe_click_unit.c` |
| Sailing | `move_is_legal.c`, `execute_move_unit.c`, `send_unit_to_europe.c`, `get_voyage_delay.c`, `set_course_for_new_world.c`, `transit_class.c`, `process_off_board_ships.c`, `arrivals_to_mapboard.c`, `stack_to_board.c` |
| The King | `free_galleon2.c`, `buy_mercs.c`, `europe_new_wars.c`, `king_meeting.c`, `king_grant_funds.c`, `king_adjust_tax.c` |
| Independence | `orders_europe.c`, `revolution.c`, `kill_offboard.c`, `foreign_cargo.c` |

These findings are for the Windows release. The DOS version is believed to behave the same but has not been checked
line by line.
