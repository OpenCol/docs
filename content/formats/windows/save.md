# `.SAV` — saved games

*Version `0x49`, the same file in both releases: a 16-byte header, a globals block, three counted record arrays, four map planes and a fixed tail. 57 fields, no checksum.*

`AUTO01.SAV`, 25,585 bytes, is the only save that ships with the Windows game.
Addresses below are in `COLONIZE.EXE`. The DOS game writes the same layout (see
[the DOS save](#the-dos-save-is-the-same-file)).

**The structure is solved; many meanings are not.** All 57 fields have a known
offset and size, and they account for the file exactly: 25,585 bytes computed
against 25,585 actual.

The [sav-editor](https://github.com/OpenCol/sav-editor) library and browser
editor read and write every field. Its field tables in
[`src/format/`](https://github.com/OpenCol/sav-editor/tree/main/src/format)
give each record field by field, with a confidence on every name. win-tools'
[map preview](https://opencol.github.io/win-tools/map-preview.html) draws the
four map planes.

## Where the layout comes from

The layout was not inferred from patterns in the bytes. It comes from the
routine that writes them. `1008:a7f6` is the save routine, 2,627 bytes, and it
is the only function that calls the file-write forwarder — **57 times**. Each
call is `cdecl`, so the pushes at each site give the file's fields in order
together with the address each is written from.

`1008:9056` is the matching loader. It makes 56 read calls where the saver
makes 57, because it reads three contiguous runs in one call — including the
first ten bytes, which it reads into a stack local in order to *validate*
rather than keep. Derived from the loader alone, the layout agrees with the
saver's on every field's source address and size.

## Five facts that shape any editor

1. **There is no checksum.** The loader checks exactly two things: the ten-byte
   magic, by string comparison, and the version word, which must be exactly
   `0x49` (it branches separately on newer and older). Nothing else is
   verified, so an edited save loads.
2. **It is little-endian.** The saver looks as if it byte-swaps: every block is
   wrapped in a swap, write, swap-back sequence. But `swap_word_identity` is a
   21-byte function whose whole body is `return a;`, and its 32-bit sibling
   likewise. They are left over from the big-endian Macintosh source. Nothing
   is swapped on the Windows build.
3. **Those same swap helpers are a map of the field widths.** To swap a record
   they had to list every word and long in it, so `colonies_swap_words`,
   `units_swap_words`, `nations_swap_words`, `records_swap_words` and
   `records18_swap_words` between them say exactly where the multi-byte fields
   are. Everything they skip is a byte. See
   [widths](#widths-settled-by-the-swap-helpers).
4. **Seven of the 57 fields are sized at runtime**, so the file length varies:
   three record arrays and four map planes. Changing a count moves every byte
   after it, so an editor has to re-serialise the whole file rather than patch
   it in place.
5. **Four bytes are uninitialised stack.** See
   [the shipped bug](#four-bytes-of-stack).

## Overall shape

| Offset | Bytes | What | Writes |
| --- | --- | --- | --- |
| `0x0000` | 10 | magic `COLONIZE\0` + `0x1a` | 1–2 |
| `0x000a` | 2 | version word, must be `0x49` | 3 |
| `0x000c` | 4 | map width, map height (58 × 72 in every known save) | 4 |
| `0x0010` | 142 | the [globals block](#the-globals-block) | 5 |
| `0x009e` | 208 | four 52-byte records, unidentified | 6 |
| `0x016e` | 24 | four 6-byte records, unidentified | 7 |
| `0x0186` | colonies × 202 | [colonies](#records) | 8 |
| … | units × 28 | units | 9 |
| … | 1,264 | four 316-byte European nation records | 10 |
| … | settlements × 18 | native settlements | 11 |
| … | 624 | eight 78-byte tribe records | 12 |
| … | 727 | 33 assorted scalars and blocks | 13–45 |
| … | 4 × width × height | the four [map planes](#the-map-planes) | 46–49 |
| … | 1,502 | [the tail](#the-tail) | 50–57 |

The fixed parts add up to 3,005 bytes before the planes, so

```
planes start = 3005 + 202·colonies + 28·units + 18·settlements
file size    = planes start + 4·width·height + 1502
```

`AUTO01.SAV` has 1 colony, 95 units and 84 settlements: the planes start at
7,379 and the file is 7,379 + 16,704 + 1,502 = 25,585 bytes.

## The globals block

Write 5 is a raw dump of `SEG20:0x7782`..`0x780f`, so every named global in that
range is a save field at

```
file offset = 0x10 + (SEG20 address - 0x7782)
```

That is where `year`, `season`, `turnCounter`, `difficulty`, `playerNation`,
`revealAll` and the three record counts come from. The counts land at
`0x2a` (settlements), `0x2c` (units) and `0x2e` (colonies), and read 84, 95 and
1 in `AUTO01.SAV`, exactly as the write table predicts. The same address
arithmetic names fields in the other blocks.

### The calendar cross-check

`year`, `season` and `turnCounter` are three separate words. `advance_turn`
(`1008:29b4`) keeps them in step: a new game starts in 1492, turn 0, spring; the
year rises by one each turn until 1600; from 1600 the season alternates, so the
year moves every *second* turn.

Every known save satisfies that rule: `AUTO01.SAV` at turn 4 is 1496, a turn-340
save is 1716 (108 + 2 × 116 turns), and all ten 1994 DOS saves agree too.
Three independent words agreeing with the game's own arithmetic over hundreds
of turns is a strong check on the decoding of the whole header. An editor that
changes the date should write all three.

## Records

Each array is identified by its allocator, the function that increments its
count. Two of the three own the game's refusal messages:

| Array | Record | Count at | Cap | Identified by |
| --- | ---: | --- | ---: | --- |
| units | 28 bytes | `SEG20:0x779e` | 300 | the allocator owns `TOOMANYUNITS` |
| colonies | 202 bytes | `SEG20:0x77a0` | 48 | the allocator owns `TOOMANYCOLONIES` |
| native settlements | 18 bytes | `SEG20:0x779c` | 84 | every named indexer is a tribe function |

The **largest** record is the colony, which holds the most state: buildings,
sixteen goods, the professions of up to thirty-two colonists. An earlier
reading assigned the records by size order and got this wrong.

Drawing the planes gives an independent check: `AUTO01.SAV` has 84 squares
holding a native settlement against its 84 18-byte records, and 1 European
colony against its single 202-byte record.

Solidly identified fields include each nation's gold, tax rate, bells, crosses
and Europe market prices; a colony's name, position, population, colonists'
jobs and specialties, buildings and all sixteen warehouse stocks; a unit's
position, type, owner, orders and cargo; native settlement and tribe state; the
difficulty, the date and the game-state flags, including whether independence
has been declared. Roughly a third of the file is carried without being
understood.

### Widths settled by the swap helpers

| Record | Words and longs, per the swap helper | Consequence |
| --- | --- | --- |
| Unit (28) | words at `+0x18`, `+0x1a` only | everything else is bytes |
| Colony (202) | words `+0x90`, `+0x92`, `+0x98`, `+0x9a[16]`; longs `+0xc2`, `+0xc6` | **stock is sixteen words**, one per good, not the 20, 22 or 24 that conflicting readings claimed |
| Nation (316) | 11 words and 3 longs in the head, then `+0x5c[16]` words and three `[16]` long arrays | `+0x14` and `+0x48` are **bytes** |
| Tribe (78) | words `+0xa`, `+0xc`, `+0xe[16]`, `+0x2e[4]`, `+0x46[4]` | |
| Settlement (18) | four words at `+0xa` | the rest is ten bytes |

## The map planes

Four planes of width × height bytes, read through a library of accessors at
`1038:b4b6` that is four identical families of functions, one per plane, and
from the writers that set each bit.

| Plane | What it holds |
| --- | --- |
| 0 — terrain | low five bits a terrain id from the game's 29-entry `TERRAIN0`..`TERRAIN28` table; bit `0x20` hills, with `0x80` mountains; bit `0x40` a river, with `0x80` a major one |
| 1 — what is on the square | a bitfield: `0x01` unit present, `0x02` settlement, `0x04` depleted resource, `0x08` road, `0x10` native claim settled, `0x20` unidentified, `0x40` plowed |
| 2 — who owns it | high nibble the owning nation's index, 15 meaning none; the accessors read the low nibble as a nation index too, but what it records is unidentified |
| 3 — who has seen it | high nibble a per-nation explored bitmask, bit `(1 << nation) << 4`; low nibble unidentified |

Plane 3 is a bitmask rather than an owner: every caller computes
`(1 << nation) << 4`, four bits for four European powers. `reveal_around_colony`
sets it over an 11 × 11 area, a sight radius rather than a worked one.

The [`.MP` map file](mp-map.md) holds planes 0–2 only.

## The tail

| Writes | Bytes | What |
| --- | ---: | --- |
| 50–53 | 604 | four blocks, unidentified |
| 54 | 4 | [uninitialised stack](#four-bytes-of-stack) |
| 55 | 4 | `DGROUP:0x4bc2`, unidentified |
| 56 | 2 | the **scenery seed** (`DGROUP:0x1ca6`) |
| 57 | 888 | the trade routes, `SEG20:0xc804` |

The scenery seed decides which squares carry a prime resource or a lost-city
rumour; they are hashed from it, not stored. It sits 890 bytes from the end of
every save.

The 888 route bytes are all zero in `AUTO01.SAV`, and were long taken for
end-of-file padding. That their start offset falls exactly out of the write
arithmetic is what proved the 57-field chain correct.

## Four bytes of stack

Write 54 is four bytes from a stack local the saver never assigns. It is passed
through an identity function, written, passed through again, and that is its
whole life. So **every save carries four bytes of whatever was on the stack,
and two saves of the same game never compare equal.** The loader reads them
into a local of its own and discards them, so they do no harm.

They sit 898 bytes from the end of the file — at `0x606f` in `AUTO01.SAV`.
Never compare two saves on them.

## The DOS save is the same file

A DOS save has the same layout: the same magic and `0x1a`, the same version
word — `0x49`, 73, in `AUTO01.SAV` and in the 1994 DOS saves alike — the map
size at `0x0c`, and records of the same three sizes ahead of the planes. All
ten 1994 DOS saves tested parse with this layout and re-serialise byte for
byte. The DOS page gives the DOS routine's address:
[DOS maps and saves](../dos/maps-and-saves.md).

## What is still unknown

- What most of `Colony+0x84..0x8f`, `Unit+0x04..0x0b` and the words at the head
  of the nation record mean.
- How a unit's cargo region at `+0x0d..+0x16` splits: one reading says
  `cargo[3]` then `amount[7]`, another a single `cargo[10]`.
- The 208-byte block at `0x9e`. The swap helpers say four 52-byte records with a
  word at `+0x32`; a reading of the code places a 52-byte array with a control
  byte at `SEG20:0x7840`, 48 bytes into the block and so not a multiple of 52.
  Both cannot be right.
- How far the Founding Father bitset at `Nation+0x14` runs: 25 fathers need four
  bytes.
- The low nibbles of planes 2 and 3, and plane 1's bit `0x20`.
- Whether any other version word was ever written. Every known save, DOS and
  Windows, is `0x49`.
