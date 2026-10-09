# DOS file formats

*The asset files of the 1994 DOS release: the MADSPACK containers of MicroProse's MADS engine, the FAB compression inside them, and the sprites, pictures, fonts, palettes, maps and text they carry.*

Every claim on these pages is either read from the code of `VICEROY.EXE` or
measured over every shipped file. Addresses are **file offsets** in the shipped
494,910-byte executable, given with the routine's name — `draw_icon`, file
`0xe76a`. Anything not established is carried through untouched and called
**UNKNOWN**.

The [dos-tools](https://github.com/OpenCol/dos-tools) suite implements every
format here, extracts each to editable files, rebuilds the game from them, and
its tests re-measure the counts on these pages against a real install.

| Format | Files | Status |
| --- | --- | --- |
| [MADSPACK](madspack.md) — the container | all 246 `.SS`, `.PIK` and `.FF` | rebuilds byte-identical |
| [FAB](fab.md) — the compression | 793 packed entries | decodes all; repacks 479 identically |
| [`.SS` sprite sheets](ss.md) | 206, holding 1,517 sprites | re-encodes byte-identical |
| [`.PIK` pictures](pik.md) | 35 | round-trips |
| [`.FF` fonts](ff.md) | 5 | every byte accounted for |
| [Palettes and `VICEROY.PAL`](palettes.md) | 1, plus one in nearly every sheet and picture | stored on disk, 6 bits a channel |
| [Maps and saves](maps-and-saves.md) | `AMER2.MP`, `COLONYnn.SAV` | map planes and scenery seed solved |
| [Text files](text.md) | 18 `.TXT`, 2 `.DB` | plain code page 437 |

## Not covered yet

The sound banks (`*.COL`), `COLDIG.BIN`, the `.DAT` files, `AMERICA.MOV` and
the separate `OPENING.EXE`, `CLOSING.EXE` and `MAPEDIT.EXE` programs are not
described here.

## The other release

The Windows game of 1995 shares the rules, the map file and the save layout,
but keeps its art as Win16 resources. See
[Windows file formats](../windows/index.md), and
[the two releases compared](../../versions/asset-formats.md).
