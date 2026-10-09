# `CTAB` — colour tables

Implemented in [`colwin/palette.py`](https://github.com/OpenCol/win-tools/blob/main/colwin/palette.py). 43 resources, all in `COLDATA8.DLL`, ids
111, 210–215, 220–223 and 260–291.

| Offset | Type | Value |
| --- | --- | --- |
| `0x00` | `WORD` | `start` — 142 in all 43 |
| `0x02` | `WORD` | `count` — 97 in all 43 |
| `0x04` | RGB × `count` | 291 bytes |

Exactly `4 + 3 × 97 = 295` bytes. A table whose last entries are black ends
short once the resource's NUL padding is trimmed; that is not corruption, and a
decoder that treats it as such will reject real data.

## Not a reading of the bytes

The field meanings come from the loader. `1068:0180` matches the literal `'CTAB'`
in DGROUP, takes the WORD at 0 as `start`, the WORD at 2 as `count`, and calls
`1068:083b(port, start, count, data + 4)` — which walks a packed 3-byte RGB array
with stride 3 and ends in `SetPaletteEntries`.

So a `CTAB` is exactly the argument list of the routine that writes ranges into
the runtime palette. That these blobs *are* one of its payloads is established.

## What is not established

**Which table a sprite is drawn under.** `1068:0180`'s only caller, `1050:1d16`,
computes the `CTAB` id from *game state* at four sites, from base constants 111,
210, 220 and 260 — exactly the four id groups that ship. No sprite id is
involved anywhere in the program.

Sprite id nevertheless predicts colour well, because art and its colour tables
were numbered together during authoring: for sprites with enough pixels in the
`CTAB` window, the best-fitting table carries the sprite's own id in 36 of 57
cases, against 1.0 by chance, from a scorer that never sees an id. `colwin` uses
that as a rendering heuristic and labels it a reconstruction. See
[Palettes](palettes.md).

**Why there are 43 variants of one 97-entry range** — colour cycling, per-nation
recolouring, per-context palettes — is open.

## The reserved teal

`(0,173,173)` appears **exactly once** in 42 of the 43 tables; table 222 is the
sole exception and has none. The index it occupies is not fixed: 18 distinct
indices over 209–233, one per table.

Sprites drawn through such a table use that index at a median 8.5% of their
pixels and up to 41%, in long contiguous runs — mean run 15.3 px against 4.0 for
a frequency-matched control index in the same sprite, longer in 33 of 33 sprites
measured. One reserved colour per palette, at a palette-specific index, filling
solid regions of the art is what a colour key or backdrop looks like.

**It is not established as one**, and `colwin` does not treat it as one. No code
has been shown keying that colour out, and because the index differs per table a
blitter could not test for it with a constant index. It is recorded per sprite
in the manifest and rendered as ordinary colour — which is why extracted
portraits show a teal backdrop.

One entry is constant across all 43 tables: index 142, the first of the range,
is pure white in every one.
