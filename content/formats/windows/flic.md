# `FLIC` — the animation

Implemented in [`colwin/formats/flic.py`](https://github.com/OpenCol/win-tools/blob/main/colwin/formats/flic.py). One resource: `COLDATA7.DLL` id 9600.

It is not a private format at all. The header carries the published Autodesk
magic, and the file is a stock FLC:

| Offset | Value | Meaning |
| --- | --- | --- |
| `0x00` | 1,369,704 | file size — inside a 1,370,112-byte resource, the rest padding |
| `0x04` | `0xAF12` | FLC magic (`0xAF11` would be the older FLI) |
| `0x06` | 66 | frames |
| `0x08` | 640 × 480 | width × height |
| `0x0c` | 8 | bits per pixel |
| `0x10` | 71 ms | frame delay |

The content is the Declaration-of-Independence celebration outside Independence
Hall, which pairs it with `WINFLC.WAV`.

## Chunks

Present in this file: 18 `PSTAMP` (a postage-stamp preview, skipped), 4
`COLOR_256`, 15 `BYTE_RUN` and 7 `DELTA_FLC`. The decoder also implements 11
`COLOR_64`, 12 `DELTA_FLI`, 13 `BLACK` and 16 `FLI_COPY`.

Validation is exact: every frame's chunks consume precisely the byte count its
frame header declares, and every frame yields exactly 640×480 pixels.

## Writing

`colwin` can write an FLC — one `COLOR_256` chunk whenever the palette changes
and one `BYTE_RUN` keyframe per frame, no inter-frame deltas. That is lossless,
and it is about **7× larger** than the shipped animation, which does use deltas.

So the animation is extracted to `reference/` for viewing and the original bytes
are carried through on a rebuild. The round trip is checked against this
module's own reader; it has **not** been checked by playing the result in the
game.
