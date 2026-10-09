# Maps and saves

*`.MP` map files and the DOS `.SAV`, as byte planes: where the planes sit, how a save's size closes, and where the scenery seed is.*

```
.MP                                   .SAV (COLONYnn.SAV)
0x00  WORD  width                     0x00  "COLONIZE\0" 0x1a
0x02  WORD  height                    0x0a  WORD  version
0x04  WORD  version, must be 4        0x0c  WORD  width, WORD height
0x06  plane 0, 1, 2 (w*h each)        0x2a  WORD  settlements (18 bytes each)
                                      0x2c  WORD  units (28 bytes each)
                                      0x2e  WORD  colonies (202 bytes each)
                                      ....  planes 0, 1, 2, 3 (w*h each)
                                      ....  1,502 bytes, the scenery seed
                                            among them
```

## `.MP`

`load_map_file` (file `0x71106`) reads the size, then a version word it
**refuses unless it is 4**, then exactly three planes into planes 0, 1 and 2.
Plane 3 — who has seen each square — is not in a map file. A map of more than
12,000 squares is refused (`map_check`).

The one map that ships, `AMER2.MP`, is 58 × 72 squares and 12,534 bytes, and is
byte for byte the same file the Windows release ships. The
[Windows page](../windows/mp-map.md) describes its planes.

## `.SAV`

`save_game` (file `0x734f8`) writes the magic with `save_string` (the string, a
NUL, then `0x1a`), a version word, the map size, then fixed blocks and three
record arrays whose counts are words of the game state, then the four planes,
then 1,502 more bytes. So the planes start at

```
map_start = 3005 + 18·settlements + 28·units + 202·colonies
```

and the file is exactly `map_start + 4·w·h + 1502` bytes. That closure holds for
every save checked, rather than being assumed. The version word is 73 in the
1994 saves.

## The scenery seed

Which squares carry a prime resource or a lost-city rumour is not stored per
square. It is hashed from a **scenery seed** (`resource_at`, `lost_city_at`),
and the seed is a little-endian word 890 bytes from the end of the save,
followed by the 888-byte route table.

## The fields

The DOS save is the [Windows save](../windows/save.md), field for field: the same
magic, the same version word, the same record sizes and the same 57 writes. All
ten 1994 DOS saves parse with the Windows layout and re-serialise byte for
byte, and their dates agree with the game's turn-to-year rule. The Windows page
describes every block, the records, the map planes and the tail.

A `.MP` from one release is a `.MP` for the other.
