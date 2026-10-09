# `.SAV` — saved games

`AUTO01.SAV`, 25,585 bytes, is the only save that ships. `colwin` reads its
four map planes — `colwin map-preview` draws them as a PNG, see
[map preview](https://opencol.github.io/win-tools/map-preview.html) — and writes nothing back. This page records
what is known.

**The structure is solved; the meanings are not.** All 57 fields have a known
offset and size and they account for the file exactly — 25,585 computed against
25,585 actual.

## Where the layout comes from

Not from periodicity in the bytes: from the routine that writes them.
`1008:a7f6` is the save routine, and it is the only function that calls the
file-write forwarder — **57 times**. Each call is `cdecl`, so the pushes at each
site give the file's fields in order together with the address each is written
from. `1008:9056` is the matching loader, calling the read forwarder 56 times.

## Checks that agree

| | |
| --- | --- |
| write 1 is 9 bytes | the file opens `COLONIZE\0` — magic plus terminator |
| writes 2–4 are 1, 2 and 4 bytes | which puts write 4 at `0x0c`, where the dimension words **58** and **72** sit |
| four 58×72 planes | 4,176 bytes each, the same grid as `AMER2.MP` |

## What is open

What the 202-, 28- and 18-byte records hold. Nothing carries such a label,
though drawing the planes puts one cross-check on the table: this save has 84
native villages against its 84 18-byte records, and 1 European colony against
its single 202-byte record. See [map preview](https://opencol.github.io/win-tools/map-preview.html).

Which plane is which is no longer open. Plane 0 is terrain, plane 1 a bitfield
of what has been built on a square, plane 2 a nation index in each nibble and
plane 3 a per-nation bitmask in the high one — established from
the map accessor library at `1038:b4b6`, which is four identical families of
functions, one per plane, and from the writers that set each bit.

## The DOS save is the same file

A DOS save has the same layout: the same magic and `0x1a`, the same version
word — 73 in `AUTO01.SAV` and in the 1994 DOS saves alike — the map size at
`0x0c`, and records of the same three sizes, 18, 28 and 202 bytes, ahead of the
planes. The DOS page gives the offset arithmetic and where the scenery seed
sits: [DOS maps and saves](../dos/maps-and-saves.md).
