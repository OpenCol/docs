# `.MP` — map files

*The map file both releases read: a size, a version word and three byte planes. The one that ships, `AMER2.MP`, is the same file in both.*

`AMER2.MP`, 12,534 bytes, ships with both the DOS and the Windows game, byte
for byte identical. The map previews of
[win-tools](https://opencol.github.io/win-tools/map-preview.html) and
[dos-tools](https://github.com/OpenCol/dos-tools) draw it as a PNG.

```
WORD  width          58
WORD  height         72
WORD  version        4
BYTE  terrain[w*h]   plane 0
BYTE  plane1[w*h]    plane 1
BYTE  plane2[w*h]    plane 2
```

Every byte is accounted for: `6 + 3 × 58 × 72 = 12,534`, exactly the file size.

## The loader

The DOS game's `load_map_file` (`VICEROY.EXE` file `0x71106`) reads the size,
then the version word, which it **refuses unless it is 4**, then exactly three
planes into the game's planes 0, 1 and 2. A map of more than 12,000 squares is
refused (`map_check`). The Windows loader has not been traced, but it reads the
same file.

Plane 3 — which nations have seen each square — is not in a map file; it exists
only in a [save](save.md), which carries all four planes.

## Planar, not three bytes per tile

The evidence is plane 1: it is **uniformly zero across all 4,176 tiles**.
Reading the data as interleaved gives three lanes that all look alike (71, 65
and 76 distinct values, similar histograms); reading it as planes gives one
plane with 87 values, one with exactly one value, and one with 15. No
interleaving of three per-tile fields produces a lane that is entirely zero.

## The planes

**Plane 0 — terrain**, and the byte is a bitfield rather than an id: the low
five bits are a terrain id when bit `0x20` is clear, bit `0x20` means hills and
with bit `0x80` mountains, bit `0x40` a river and with `0x80` a major one.
That is `terrain_from_map_byte` (`1040:42b5`), and it is what turns the 87
distinct values into the 29 terrains of the game's own `TERRAIN0..TERRAIN28`
table. The two commonest values are 25 (2,109 tiles) and 26 (810) — ocean and
sea lane — together just under half the map. Drawn through the game's own tile
art the plane is the Americas: North, Central and South America, the Caribbean
chain, Florida, the Gulf of Mexico, Baja California, with the Rockies and the
Andes where they belong.

**Plane 1 — all zero.** The loader reads it into the game's plane 1, which in a
running game is the bitfield of what is on a square: units, settlements, roads,
plowing (see [the save's planes](save.md#the-map-planes)). All zero is what a
map nobody has played on would hold; whether every `.MP` must carry it zero is
not established, as only one file ships.

**Plane 2 — correlated with land and water, not established as either.**

| | `plane2 = 1` | `= 2` | `= 0` | other |
| --- | ---: | ---: | ---: | ---: |
| terrain 25/26 (water) | 2,664 | 0 | 235 | 20 |
| any other terrain | 21 | 1,162 | 21 | 53 |

1 tracks water and 2 tracks land, but roughly 250 tiles disagree and the values
3, 5, 6 and 7 are unexplained. Every value is below 16, so all of it lives in
the low nibble of the game's plane 2 — the nibble a save's plane 2 leaves
unidentified, beside the owning nation in the high one.

## Cross-check

Every known save carries `3a 00 48 00` — 58 × 72 — at offset `0x0c`: the same
dimensions, in a different file, written by a different routine.
