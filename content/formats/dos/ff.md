# .FF — fonts

*Five bitmap fonts, each one MADSPACK entry: a height, 128 widths, 128 offsets and two-bit glyphs.*

```
0x000  BYTE   height of every glyph
0x001  BYTE   width of the widest glyph
0x002  BYTE   width[128]
0x082  WORD   offset[128], from the start of the entry
0x182  glyph rows, back to back in slot order
```

Slot *s* draws character *s* + 1: slot 31 is the space (no ink in any font) and
slot 64 is `A`. A glyph is `height` rows of ⌈width / 4⌉ bytes, **two bits a
pixel**, the leftmost pixel in the top two bits. A pixel is 0 (paper) or 1–3,
one of three ink colours the drawing code chooses.

The fonts are `FONT-NP`, `FONTINTR`, `FONTKING`, `FONTSMAL` and `FONTTINY`.

## Evidence

The layout is the MADS engine's font format. What makes it established for
these files, rather than borrowed, is a set of checks that hold in all five:
each glyph starts exactly where the one before it ends, the last ends exactly at
the end of the entry, byte 1 is the largest width, and no row has a bit set past
its glyph's width. Every byte of every font is accounted for.

`dos_181f_2a86` (file `0x76c70`) loads the whole file into memory under a tag
of its name; `game_main` loads `fontintr` with it.
