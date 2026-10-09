# .PIK — pictures

*35 full-screen and strip pictures, each a MADSPACK file of two or three entries: a size, raw pixels, and a palette the game never reads.*

| Entry | Contents |
| --- | --- |
| 0 | 8 bytes: `WORD` height, `WORD` width, `WORD` 0, `WORD` **UNKNOWN** |
| 1 | height × width bytes, one colour index a pixel, rows top down |
| 2 | in 34 of the 35 files, `0x300` bytes of 6-bit VGA RGB |

## Evidence

`load_picture` (file `0x76aec`) reads the 8-byte header, takes its first two
words as height and width, and reads height × width bytes of entry 1 straight
into a port. **It never reads entry 2**, so the palette is only a way of looking
at the picture; the colours the game shows come from the palette it has loaded
at the time.

The last two header words are carried: the third is 0 in every file, the fourth
varies between 8110 and 9540 with no reader found.

## Sizes

Most pictures are 320 × 200, a full mode-13h screen. `COLONY.PIK` is 320 × 72
and is the one with no palette; `OPENING.PIK` is 960 × 132.

## Compared with Windows

The Windows release's full-screen art is the [`CVPC`](../windows/cvpc.md)
canvas: LZW-compressed, at 640 × 480, with a palette the game does use.
