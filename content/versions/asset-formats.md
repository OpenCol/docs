# Asset formats, DOS and Windows

*The two releases share their map file and their save layout byte for byte, and almost nothing else: the DOS art lives in MADS engine archives, the Windows art in Win16 resources.*

The full layouts are in [DOS file formats](../formats/dos/index.md) and
[Windows file formats](../formats/windows/index.md). This page lines them up.

## What is the same

| | DOS 1994 | Windows 1995 |
| --- | --- | --- |
| The map | `AMER2.MP`, 12,534 bytes | the same file, byte for byte |
| `.MP` layout | width, height, version 4, three planes | the same |
| Save header | `COLONIZE\0`, `0x1a`, version 73, map size at `0x0c` | the same bytes |
| Save records | 18-byte settlements, 28-byte units, 202-byte colonies, ahead of four map planes | the same sizes, in the same order |
| Every save field | all ten 1994 saves parse with the Windows layout and re-serialise byte for byte | the [57-field layout](../formats/windows/save.md) |

Measured on `AMER2.MP` from both installs, on the Windows `AUTO01.SAV` and on
the 1994 DOS saves. See [DOS maps and saves](../formats/dos/maps-and-saves.md),
[the Windows .MP](../formats/windows/mp-map.md) and
[the Windows .SAV](../formats/windows/save.md).

## What differs

| | DOS 1994 | Windows 1995 |
| --- | --- | --- |
| Container | [MADSPACK 2.0](../formats/dos/madspack.md), one file per sheet, picture or font | [NE resources](../formats/windows/ne-container.md) in eleven `.DLL` modules |
| Compression | [FAB](../formats/dos/fab.md), LZ77 with a 4,096-byte window | [GIF-style LZW](../formats/windows/cvpc.md) for canvases; none for sprites |
| Sprites | [`.SS` sheets](../formats/dos/ss.md): RLE, several runs a row, index 253 transparent | [`SPRT`](../formats/windows/sprt.md): one run a row, index 0 transparent |
| Full-screen art | [`.PIK`](../formats/dos/pik.md): raw pixels, mostly 320 × 200 | [`CVPC`](../formats/windows/cvpc.md): LZW, mostly 640 × 480 |
| Sprite colours | [stored](../formats/dos/palettes.md): `VICEROY.PAL` and a palette in each sheet | [stored nowhere](../formats/windows/palettes.md): built at runtime, ranges overwritten from [`CTAB`](../formats/windows/ctab.md) tables |
| Fonts | [`.FF`](../formats/dos/ff.md) bitmap fonts, two bits a pixel | no font file ships |
| Text | [`.TXT` files](../formats/dos/text.md), code page 437, line by line | [`TEXT` resources](../formats/windows/text.md), code page 1252, named, with directives and markup |
| Animation | — | one [`FLIC`](../formats/windows/flic.md), the Declaration celebration |
| Sound | `.COL` banks, not yet described | 44 plain `.WAV` files |
