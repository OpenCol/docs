# Windows file formats

*Every file of the 1995 Windows release, and every layout in them, byte by byte, with the evidence each one rests on.*

Addresses of the form `1068:0180` are segment:offset in `COLONIZE.EXE`, the
shipped, patched build. Counts are measured over a complete install, and the
figures on these pages are re-derived from one by the
[win-tools](https://github.com/OpenCol/win-tools) test suite, which fails when a
page drifts from the data. The same tools extract every format here to editable
files and rebuild the game from them.

Start with [what is in each file](files.md): all 64 files of an install and what
each one holds.

| Format | Where it is | Status |
| --- | --- | --- |
| [NE container](ne-container.md) | every `.DLL` and `.EXE` | rebuilds byte-identical |
| [`SPRT`](sprt.md) | 915 across 7 modules | re-encodes byte-identical |
| [`CVPC`](cvpc.md) | 96 across 8 modules | re-encodes pixel-identical |
| [`CTAB`](ctab.md) | 43, all in `COLDATA8` | re-encodes byte-identical |
| [Palettes](palettes.md) | built at runtime, stored nowhere | the mechanism is decompiled |
| [`TEXT`](text.md) | 737, mostly `COLTEXT0` | re-encodes byte-identical |
| [`FLIC`](flic.md) | 1, in `COLDATA7` | decoded; carried through on rebuild |
| [Windows DIBs](dib.md) | bitmaps, icons, cursors | bitmaps round-trip |
| [`.MP` maps](mp-map.md) | `AMER2.MP` | solved |
| [`.SAV` saves](save.md) | `AUTO01.SAV` | structure solved; the map planes are drawn |
| [ARCV](arcv.md) | `COLONIZE.$00` | solved |

## Not solved

`CRDS`, `CRED`, `MONS` and `SHIP` — five record tables in `COLDATA5` and
`COLDATA9` — have no known layout. They are carried through untouched rather
than shaped into a plausible-looking table.

`COLWIN.PRF` (412 bytes of preferences) and `SETUP.INF` (the installer's own
compressed script) are likewise unread.

## The other release

The DOS game of 1994 shares the rules, the map file and the save layout, but
keeps its art in entirely different containers. See
[DOS file formats](../dos/index.md), and
[the two releases compared](../../versions/asset-formats.md).
