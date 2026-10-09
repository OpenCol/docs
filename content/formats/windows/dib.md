# Windows bitmaps, icons and cursors

Implemented in [`colwin/formats/dib.py`](https://github.com/OpenCol/win-tools/blob/main/colwin/formats/dib.py). All of these live in `COLONIZE.EXE` and
`SETUP.EXE` — they are the Windows interface chrome, not game art.

## `RT_BITMAP` — round-trips

Six 32×32 4-bpp DIBs with a `BITMAPINFOHEADER`, ids 301–306. Ordinary indexed
images carrying their own palette, so they extract and re-import the same way a
canvas does.

Scanlines are bottom-up and padded to a 4-byte boundary. The palette is stored
BGR(A), not RGB.

One detail worth naming, because getting it wrong is invisible until you compare
bytes: `biClrImportant` is **16** in bitmap 306 and zero in the other five. An
encoder that writes a constant there produces a file that decodes identically
and is not the same file. `colwin` preserves `biXPelsPerMeter`,
`biYPelsPerMeter`, `biClrUsed` and `biClrImportant` from the manifest, which is
what takes the six bitmaps from five byte-exact to six.

## `RT_ICON` and `RT_CURSOR` — read only

An icon is a colour image and a 1-bpp AND mask **stacked in one DIB of doubled
height**. The header declares one bit depth and twice the real height, but only
the top half is at that depth:

| | |
| --- | --- |
| `RT_ICON` | 32×64 declared at 8 bpp: 32×32×8 colour + 32×32×1 mask = 1,152 bytes, exactly the declared `biSizeImage` |
| `RT_CURSOR` | a 4-byte hotspot, then 32×64 declared at 1 bpp |

Reading the whole thing at the declared depth is what makes an icon look
truncated — it asks for twice the data that is there.

`colwin` decodes both for viewing, writing RGBA PNGs into `reference/` with the
AND mask applied as alpha, and carries the original bytes through on a rebuild.
Putting an edited alpha channel back into a 1-bpp mask plus an indexed image is
a lossy choice, and not one to make on the artist's behalf without being asked.

## `RT_MENU`, `RT_DIALOG`, `RT_GROUP_ICON`, `RT_GROUP_CURSOR`

Carried through untouched.
