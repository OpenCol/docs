# `SPRT` — sprites

Implemented in [`colwin/formats/sprt.py`](https://github.com/OpenCol/win-tools/blob/main/colwin/formats/sprt.py). 915 resources across seven modules.

A sprite is a fixed canvas with exactly **one horizontal run per row**. There is
no compression and no per-row padding: a row states where its opaque pixels
start, how many there are, and lists them.

## Header — 25 bytes, little-endian

| Offset | Type | Meaning |
| --- | --- | --- |
| `0x00` | `WORD`, signed | **UNKNOWN** — non-zero in 141 of 915, always negative there |
| `0x02` | `WORD`, signed | **UNKNOWN** — the two move together |
| `0x04` | 2 × `WORD` | 0 in all 915 |
| `0x08` | `WORD` | `full_width` — the canvas the sprite sits on |
| `0x0a` | `WORD` | `full_height` |
| `0x0c` | `WORD` | `x0` ⎫ |
| `0x0e` | `WORD` | `y0` ⎪ bounding box of the opaque pixels |
| `0x10` | `WORD` | `x1` ⎪ |
| `0x12` | `WORD` | `y1` ⎭ |
| `0x14` | `WORD` | **UNKNOWN** — 101 distinct values; `0x000a` in all 78 empty sprites |
| `0x16` | `WORD` | **UNKNOWN** — 96 distinct values, zero in only 369 of 915 |
| `0x18` | `BYTE` | 0 in all 915 |

Then exactly `y1 - y0` rows, each one run:

```
WORD  skip            transparent pixels before the run, measured from x = 0
WORD  count           opaque pixel count
BYTE  pixels[count]   palette indices
```

Nothing is padded on the right — past `skip + count` the row is transparent. A
degenerate bounding box `(0,0,0,0)` is an empty sprite with no pixel data at
all, and 78 of the 915 are exactly that.

## The invariants an encoder needs

All measured over the 837 non-empty sprites, not assumed:

| | |
| --- | --- |
| `x0` is the minimum `skip` | 837 / 837 |
| `x1` is the maximum `skip + count` | 837 / 837 |
| the first and last row of the box are never blank | 837 / 837 |
| a blank row *inside* the box is `skip = 0, count = 0` | 32 sprites have them |
| **index 0 never appears inside a run** | 837 / 837 |

The last one is what lets index 0 mean *transparent* on the way out and on the
way back in without colliding with real pixel data. `colwin` re-checks it per
sprite on every extract.

## One run per row

This is the only rule with no equivalent in a paint program. A row cannot have
transparent pixels *between* two opaque stretches, because the format has
nowhere to put the second run. The original art never does; edited art can.

`colwin build` names the offending rows and stops. `--fill-holes=INDEX` fills
the gaps with a palette index instead, which is a visible change the caller has
asked for.

## The four fields nobody understands

They are **copied, never computed**. That is not caution for its own sake: an
encoder that recomputed them would be inventing data.

**`0x00` and `0x02` — a signed pair.** Non-zero in 141 of 915, always negative
there. Only 24 distinct values, constant across every sprite sharing a canvas
size, and confined to four modules (`COLDATA5` 102, `COLDATA4` 22, `COLDATA8`
10, `COLDATA9` 7).

Related to the canvas without being determined by it: `0x00 == -(full_width /
2)` in 66 of the 141, and both coordinates are exactly the canvas centre in 49.
Where they are not the centre they are near it in x and near the *bottom* in y —
sprite 213 is 296×222 with the pair `(-148, -206)`, x exactly centre, y sixteen
pixels off the bottom.

A draw origin, centred horizontally and at the feet, is what that arrangement
looks like. **It is not established as one**: no code has been shown reading
either field, so nothing here treats them as coordinates.

**`0x14` and `0x16` — one 32-bit counter.** Read as a little-endian DWORD, the
low word carries into the high word: `COLDATA0` ids 5000–5009 give `0x400a,
0x600a, 0xa00a, 0xe00a, 0x1000a, 0x1200a, 0x1600a, 0x1600a, 0x1800a, 0x1800a`,
and `0xe00a → 0x1000a` is a carry, not a coincidence of two independent fields.

What it counts is per-animation. `COLDATA0`'s 530 sprites fall into 53 groups of
ten consecutive ids — ten calligraphy frames per letter — and the counter is
non-decreasing inside **all 53** groups, with **all 52** of its decreases landing
exactly on a group boundary.

It is not derivable from the image. Seven image quantities — row count, opaque
pixel count, encoded byte count, canvas width, canvas height and both
bounding-box dimensions — were each tested against the field read three ways, as
the WORD at `0x14`, as the DWORD, and as the DWORD shifted right 13. The best of
those 21 hypotheses matches 89 of 915.

## Colour

Sprite pixels are palette **indices**, and the palette they index is not stored
anywhere in the game. See [Palettes](palettes.md).
