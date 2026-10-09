# Palettes

This is the one part of the toolkit that needed a design rather than a decoder,
so it is worth explaining in full.

## The problem

Sprite pixels are not colours. They are indices into a palette that **is not
stored anywhere in the game**.

The mechanism is decompiled and settled. The graphics object begins with a Win16
`LOGPALETTE`:

| Offset | Field | Value |
| --- | --- | --- |
| `0x000` | `WORD palVersion` | `0x0300`, written literally |
| `0x002` | `WORD palNumEntries` | `0x0100` = 256, written literally |
| `0x004` | `PALETTEENTRY[256]` | 4 bytes each: R, G, B, flags |
| `0x404` | `HPALETTE` | the handle `CreatePalette` returns |

`4 + 256 × 4 = 0x404` exactly, which is why the handle sits there. And the
sequence that fills it is:

1. `1070:0000` checks `GetDeviceCaps(hdc, RASTERCAPS) & RC_PALETTE`. On a device
   without a palette it clears a global flag and **no palette is created at
   all** — every later `CreatePalette` and `SetPaletteEntries` is guarded by it.
2. It seeds all 256 entries with `GetSystemPaletteEntries`. **The initial palette
   is the Windows system palette**, not game data.
3. `1068:004e` calls `CreatePalette` and stores the handle at `+0x404`.
4. Ranges are then overwritten: `1068:083b(obj, start, count, rgb)` walks a
   packed 3-byte RGB array and ends in `SetPaletteEntries`. It has 25 direct
   callers. [`CTAB`](ctab.md) blobs are exactly its argument list, and
   the loader at `1068:0180` is what establishes they are one of its payloads.
5. `1070:0342` sets `peFlags = PC_NOCOLLAPSE`, downgrading it where a colour
   duplicates an entry in the first or last `NUMCOLORS/2` slots.

So there is nothing on disk to read sprite colours out of, and a tool that
claims otherwise is guessing.

### The measurement agrees with the decompilation

Every one of the 75 256-entry palettes that *does* ship — 70 8-bpp canvases, the
FLIC's first frame, 4 icon DIBs — was scored against 19,029 sprite runs, using
the mean squared RGB distance between horizontally adjacent pixels of different
index (real art through its real palette is locally smooth), calibrated against
pairings whose answer is known:

| | ratio |
| --- | ---: |
| genuine pairing — a canvas through its own palette, median (n=68) | **0.167** |
| genuine pairing, 90th percentile | 0.350 |
| best shipped palette against the sprites | **0.413** |

Only 5 of 68 genuine pairings fit as badly as the best candidate does. Rendering
through it produces recognisable figures — the shapes were never in doubt — but
muddy, over-dark colour, which is what a structurally similar wrong palette
looks like. **No palette shipped with the game fits the sprites the way a real
palette fits its own art.** The two results are independent: the decompilation
says the palette is not on disk, the sweep says nothing on disk behaves like it.

## The rule

**Indices are the data. A palette is a way of looking at them.**

Three things follow.

### 1. Everything comes out indexed

Every extracted image is an indexed PNG whose pixel values *are* the game's index
bytes, byte for byte. Whatever the palette turns out to be, the export has lost
nothing. Index 0 is written transparent, which is safe because **none of the 915
sprites uses it** — re-checked per sprite on every extract.

### 2. The view palette is injective, so RGB editing still inverts

If two indices held the same colour, colour → index would be a guess. So before
a view palette is written, duplicates are nudged: one step on one channel, blue
first, then green, then red, by the smallest amount that lands on a free colour.
One part in 255 is invisible to the eye and decisive for the inverse.

That is what lets an artist work in a truecolour editor — one that throws the
indices away on save — and still get a bit-exact round trip. Introducing a
colour the palette does *not* hold is the one thing that cannot work, and
`colwin build` names those colours and stops rather than quietly rounding the
art. `--nearest` overrides it when that is what you mean.

### 3. A better palette costs one command

```sh
python3 colwin.py palette ws --set=ctab:111
```

rewrites the `PLTE` chunk of every sprite PNG and touches no pixel index. When
the real runtime palette is established, applying it will not lose a single edit
made before then. Swapping away and back leaves all 915 sprites still
re-encoding byte-identically — the verification proves it.

## What the default view palette claims

| Indices | Source | Status |
| --- | --- | --- |
| 0–9, 246–255 | the Windows 3.1 static system colours | **established** |
| 142–238 | a `CTAB` | payload established; *which* table is a heuristic |
| 10–141, 239–245 | a grey ramp | **UNKNOWN**, and says so |

The system-colour band is corroborated by the art itself. `NUMCOLORS` is 20 on a
standard 256-colour driver, so the runtime's flagging loops scan exactly indices
0–9 and 246–255 — and of those twenty, sprites use exactly **246, 247 and 249**:
cream, medium grey and red, the three that look like art colours. They never use
the dark system entries. (Index 249 alone is 5.2% of all sprite pixels.)

Measured over all 915 sprites and 4,226,289 opaque pixels, the unused indices
are exactly **0–9, 248 and 250–255**. That 248 is the one interior hole while
246, 247 and 249 are all used is not explained.

## Choosing a rule

| `--palette=` | What it does |
| --- | --- |
| `ctab-auto` *(default)* | per sprite, the `CTAB` whose id matches or is nearest, applied only inside the id range the tables occupy |
| `ctab:<id>` | one table for every sprite |
| `index` | an identity grey ramp — `i → (i,i,i)`, claiming nothing at all |

`ctab-auto` is a **rendering heuristic with a measured hit rate**, not the
program's rule. The program computes colour-table ids from game state, never
from a sprite id. What the heuristic reflects is that art and its colour tables
were numbered together during authoring, which is why sprite id predicts colour
well without the program ever using it that way.

Sprites outside the `CTAB` id range keep the neutral ramp rather than being
coloured by extrapolation — there is no id to pair on, and it was measured 0/4
for `COLDATA6`, whose sprite ids sit far above every table id.

## Canvases and bitmaps are the easy case

A [`CVPC`](cvpc.md) and an `RT_BITMAP` each carry their own complete
palette, so what you see is what the game shows, and editing the PNG's palette
edits the game's. Only sprites have the problem above.
