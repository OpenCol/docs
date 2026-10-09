# .SS — sprite sheets

*206 MADSPACK files of four entries: a header, a sprite table, a palette and the sprites' run-length encoded pixels. 1,517 sprites in all.*

| Entry | Contents |
| --- | --- |
| 0 | `0x98`-byte header |
| 1 | 16 bytes per sprite |
| 2 | the palette: `0x300` bytes of 6-bit VGA RGB |
| 3 | the sprites' RLE, back to back |

## The header — entry 0

| Offset | Type | Meaning |
| --- | --- | --- |
| `0x00` | `BYTE` | 0 in every shipped sheet: the pixels are RLE (non-zero would mean FAB-packed frames) |
| `0x26` | `WORD` | count of sprites |
| `0x94` | `DWORD` | bytes in entry 3 |

Everything else is **UNKNOWN** and carried verbatim. The sheet loader
(`dos_181f_2372`, file `0x76642`) does read the words at `+2`, `+4`,
`+6`…`0x25` and `+0x90`/`+0x92`, but what the game does with them is not
established.

## The sprite table — entry 1

| Type | Meaning |
| --- | --- |
| `DWORD` | offset into entry 3 |
| `DWORD` | size in entry 3 |
| `WORD` x, y | **UNKNOWN**: the loader copies them, `draw_icon` never reads them |
| `WORD` w, h | width and height |

The x and y look like positions on the artist's original sheet; nothing in the
game has been shown using them.

19 of the 1,517 sprites are 0×0 and have nothing to draw.

## The palette — entry 2

`0x300` bytes, 256 entries of 6-bit VGA RGB. One sheet, `WIN-FWRK.SS`, has 104
bytes of something else here, carried untouched. See
[palettes](palettes.md).

## The RLE — entry 3

Per row, as `draw_icon` (file `0xe76a`) reads it:

```
FF                 an empty row: all transparent
FD (n c)* FF       runs only: n copies of colour c
xx (...)* FF       anything else leads a plain row, whose bytes are
                   colours, except FE n c, a run
after the last row, one FC
```

Colour `FD` (253) is transparent wherever it appears. The drawer skips a row it
has clipped by scanning for the next `FF` byte, so `FF` can never appear inside
a row: **index 255 cannot be drawn**, and no count is ever `FF`.

`draw_icon` numbers sprites from 1 — `tiles_load` draws icon *i* + 1 into tile
*i* — so sprite *k* of a sheet counted from zero is icon *k* + 1 in the game's
code.

## How the shipped sheets were packed

Measured over all 1,517 sprites rather than assumed:

- trailing transparent pixels are cut from each row;
- a plain row leads with `FE` and writes a run only for 4 or more equal pixels;
- a runs-only row is used exactly when it is strictly shorter than the plain one;
- no run is longer than 252.

An encoder that follows those four rules reproduces every shipped sprite byte
for byte.

## Compared with Windows

The Windows release stores its sprites as [`SPRT`](../windows/sprt.md)
resources: one run per row with no compression, index 0 for transparency, and no
palette at all. A DOS sheet carries its palette with it.
