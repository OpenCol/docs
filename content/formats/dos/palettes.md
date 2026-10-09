# Palettes and VICEROY.PAL

*The DOS game stores its colours: a master palette loaded at start-up, and a palette inside almost every sheet and picture, all in 6-bit VGA form.*

## `VICEROY.PAL`

1,024 bytes. `load_palette_file` (file `0x781de`) reads exactly the first
`0x300` bytes and copies them to the master palette at start-up: 256 entries,
R, G, B, six bits a channel.

The last 256 bytes are never read. They are **UNKNOWN** and carried.

## Palettes inside the art

Every [`.SS`](ss.md) sheet but one and 34 of the 35 [`.PIK`](pik.md) pictures
carry a `0x300`-byte palette of their own, in the same form. The exceptions are
`WIN-FWRK.SS`, whose palette entry holds 104 bytes of something else, and
`COLONY.PIK`, which has none. `load_picture` never reads a picture's palette.

## Six bits to eight

The VGA DAC takes six bits a channel. Widening to eight as `v << 2 | v >> 4`
maps 0 to 0 and 63 to 255, and narrowing back as `v >> 2` inverts it exactly for
all 64 values, so a palette survives the trip through an 8-bit image file.

## Compared with Windows

The Windows release stores **no** palette for its sprites: they index a palette
built at runtime from the Windows system palette and [`CTAB`](../windows/ctab.md)
overwrites. On DOS the colours are on disk. See
[Windows palettes](../windows/palettes.md).
