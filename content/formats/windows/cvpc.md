# `CVPC` — canvases

Implemented in [`colwin/formats/cvpc.py`](https://github.com/OpenCol/win-tools/blob/main/colwin/formats/cvpc.py) and [`colwin/formats/lzw.py`](https://github.com/OpenCol/win-tools/blob/main/colwin/formats/lzw.py). 96
resources across eight modules, from 10×10 buttons to a 1920×480 panorama.

Unlike a sprite, a canvas carries **its own complete palette**, so what you see
when you open one is exactly what the game shows, and editing the PNG's palette
edits the game's.

## Layout

| Offset | Type | Meaning |
| --- | --- | --- |
| `0x00` | `WORD` **big-endian** | width |
| `0x02` | `WORD` **big-endian** | height |
| `0x04` | `BYTE` | `bpp`, also the LZW minimum code size — 3, 5, 6, 7, 8 observed |
| `0x05` | `BYTE` | pixel mask, always exactly `(1 << bpp) - 1` |
| `0x06` | RGB × `2^bpp` | palette; entry 0 is white |
| `6 + 3·2^bpp` | | LZW codestream, framed in sub-blocks |

Big-endian dimensions in an x86 title are unusual, and they are what made the
header legible in the first place.

### The three bytes that cost a decode

A first reading took the header as `… bpp, mask, ff ff ff, palette at 0x09`,
treating `ff ff ff` as padding. That decoded 14 pixels out of 307,200. The call
site settled it: `1068:4c05` computes the decompressor's source pointer as
`base + (mask + 1) * 3 + 6` and passes the palette itself as `base + 6`, so the
palette starts at offset 6 and `ff ff ff` is entry 0, white. With that
three-byte correction the decode went from 0/96 to 96/96.

## The codestream is GIF's LZW

Codes packed LSB-first, initial width `bpp + 1`, clear code `1 << bpp`, end code
`+ 1`, first free entry `+ 2`, width growing to 12, framed in length-prefixed
sub-blocks. There is no zero-length terminator; the end code stops the stream.

None of that is a guess. The game's decompressor is `1088:0000` — 1,002 bytes of
hand-written 386 assembly in one of the only two code segments in the whole
binary with no relocation records at all. It allocates three 4,096-entry WORD
tables (prefix, suffix, length), initialises them as an LZW dictionary, and
computes `2 << bpp`, `+2` and `+4` as word offsets and `bpp + 1` as the initial
code width. Its caller carries the string *"Error: Cannot allocate
decompres…"* — the authors naming it themselves.

`CVPC` is not a GIF file: no resource carries a `GIF87a` or `GIF89a` signature
and the header above is nothing like GIF's. But the binary holds a real GIF
decoder, evidenced by its own error strings (*"Error: Resource is not a GIF - "*,
*"Error: GIF contains no global color map - "*), and the developers' build paths
survive beside them: `..\resource\logo.gif`, `..\resource\opencrd1.gif`,
`..\resource\ablogo.spr`. The art was authored as GIF and converted at build
time by people who already had GIF LZW in hand.

## Encoding

`colwin`'s encoder mirrors that decoder's state machine step for step, including
**when** it widens a code: the decoder's dictionary lags the encoder's by one
entry, so widening on the encoder's own counter desynchronises the stream by one
code. It tracks the decoder's counter instead.

Re-encoding all 96 shipped canvases reproduces identical pixels and identical
palettes, in files between 0.991× and 1.001× the original size. The bytes are
not identical, because the two encoders place their clear codes differently —
which is why `colwin` never re-encodes a canvas you have not edited.
