# What is in each file

A complete install is **64 files, 16,371,559 bytes**. Three quarters of it is
artwork in eleven data DLLs; an eighth is speech and sound effects.

| Kind | Files | Bytes | Share |
| --- | ---: | ---: | ---: |
| `COLDATA*.DLL` — art and tables | 10 | 12,181,504 | 74.4% |
| `COLTEXT0.DLL` — the game's text | 1 | 419,328 | 2.6% |
| `*.WAV` — speech and effects | 44 | 2,034,037 | 12.4% |
| `COLONIZE.EXE`, `SETUP.EXE` | 2 | 1,241,344 | 7.6% |
| `COLONIZE.$00` — the pre-patch executable, compressed | 1 | 448,483 | 2.7% |
| `AMER2.MP`, `AUTO01.SAV` | 2 | 38,119 | 0.2% |
| `COLWIN.PRF`, `SETUP.INF`, `INSTALL.LOG`, `README.TXT` | 4 | 8,744 | 0.1% |

Everything with resources in it — every `.DLL` and both `.EXE`s — is a Win16
**NE** module, and they all have the same shape: header and segments at the
front, then every resource in one contiguous run to the end of the file. See
[the container format](ne-container.md).

---

## The program

### `COLONIZE.EXE` — 1,227,264 bytes

The game. 34 segments (19 code), built with Borland C++ 4.52, linked for
Windows 3.10, importing `WING`, `COMMDLG`, `GDI`, `KERNEL`, `MMSYSTEM`, `USER`
and `WIN87EM`. Its 42 resources are the Windows interface chrome only — no game
art lives here:

| Type | Count | Ids |
| --- | ---: | --- |
| `RT_BITMAP` | 6 | 301–306, all 32×32 at 4 bpp |
| `RT_ICON` / `RT_GROUP_ICON` | 4 / 4 | 32×32 at 8 bpp |
| `RT_CURSOR` / `RT_GROUP_CURSOR` | 12 / 12 | 32×32 at 1 bpp, with hotspots |
| `RT_MENU` | 3 | 128–130 |
| `RT_DIALOG` | 1 | 400 |

This is the **patched** build: it carries five `Assertion failed` strings that
the original release does not, and one extra code segment. `README.TXT`
describes the patch as fixing "recurring lock-ups" and Windows 95 compatibility.

### `COLONIZE.$00` — 448,483 bytes

An **ARCV** archive holding the game's *original, pre-patch* `colonize.exe`:
1,175,040 bytes of valid NE executable, 33 segments (18 code), no assertion
strings. LZHUF compressed — adaptive Huffman over an LZSS window. See
[the ARCV format](arcv.md).

Two shipped builds of the same program from the same toolchain, laid out
differently by the linker, is unusually good material for validating a byte
comparator.

### `SETUP.EXE` — 14,080 bytes

The INSTWRAP installer, which carries the ARCV reader (its strings include *Not
an ARCV file*, *Incorrect ARCV version*, *Incorrect file checksum*) and the
LZHUF decompressor the archive format was read out of. Three resources, all
icons.

### `SETUP.INF` — 1,145 bytes

The installer's own script, signature `INF2`, compressed. Not decoded here.

### `INSTALL.LOG` — 2,073 bytes

Plain INI text listing every installed file against its destination path
(`coldata0.dll=c:\colwin\coldata0.dll`, …). Written at install time; the game
does not read it.

### `README.TXT` — 5,114 bytes

The patch's cover letter, ASCII with CRLF line endings.

### `COLWIN.PRF` — 412 bytes

Preferences, binary, structure **UNKNOWN**. `COLONIZE.EXE` opens it by name.

---

## The art: `COLDATA0` – `COLDATA9`

Ten modules, 12.2 MB, holding four private resource types — `SPRT` sprites,
`CVPC` canvases, `CTAB` colour tables and one `FLIC` animation — plus four
record tables whose layout is unknown. The developers' own names for these types
come from each module's `RT_NAMETABLE`.

Totals across all ten: **915 `SPRT`, 96 `CVPC`, 43 `CTAB`, 1 `FLIC`**.

> **On sprite colour.** A `CVPC` carries its own complete palette, so its colours
> are exactly what the game shows. A `SPRT` does not: its pixels are indices into
> a palette that is built in memory at startup and overwritten at runtime, so
> sprite colour is partly reconstruction. [Palettes](palettes.md) explains what is
> known and what is not.

### `COLDATA0.DLL` — 733,696 bytes, 534 resources

**530 `SPRT`, ids 5000–7009** — the calligraphy of the Declaration of
Independence, one stroke per frame. They fall into exactly **53 groups of ten
consecutive ids**, all 54 pixels tall, on 26 distinct canvases (16×54, 19×54,
14×54 and 27×54 are the commonest). Ten frames per letter.

The two unknown header words support that grouping independently: read as one
32-bit counter, the value is non-decreasing inside all 53 groups and **every one
of its 52 decreases falls exactly on a group boundary**.

Also 2 `CVPC` (640×480, 8 bpp) and a single `TEXT` resource, id 666.

### `COLDATA1.DLL` — 1,130,496 bytes, 26 resources

**25 `CVPC`**, the widest mix in the game: eleven 640×480 full screens plus
32×32, 28×28, 60×20 and 200×300 pieces, at 3, 5, 7 and 8 bpp.

`CVPC 201` is the 1280×480 **reference sheet** — unit figures, ships, terrain
tiles, forest overlays and production symbols ruled off into 222 cells by an
orange `(255,132,0)` grid on grey. Its loader blits one of the two 640×480
halves whole, never a cell, so it is a two-page reference picture rather than a
runtime atlas. The encyclopedia art is cut out of it positionally, which is why
those pictures are labelled *inferred* and not *code*.

### `COLDATA2.DLL` — 1,312,256 bytes, 16 resources

**15 `CVPC`, all 640×480**, at 6 and 8 bpp. Full-screen scenes.

### `COLDATA3.DLL` — 1,485,824 bytes, 26 resources

**19 `CVPC`** — twelve at 253×203 and seven at 640×480 — and **6 `SPRT`, ids
125–130**, all on a 155×391 canvas: six poses of the King, drawn through a
`CTAB`.

### `COLDATA4.DLL` — 1,217,536 bytes, 41 resources

**18 `CVPC`** (ten 640×480, eight 253×203) and **22 `SPRT`, ids 1000–2020**, on
wide short canvases — 632×58, 445×55, 535×58 — the banner strips, plus one
640×480 sprite.

### `COLDATA5.DLL` — 1,653,760 bytes, 199 resources

The animation module: **192 `SPRT`, ids 9001–9200**, over 18 canvases, the
commonest being 118×69 (54 frames), 73×73 (21), 83×66 (18) and 103×67 (15).
102 of them carry the unknown signed header pair — more than any other module.

Two `CVPC`: one 640×480 and one **1920×480** panorama.

It also holds the four record tables, one each: **`SHIP` 9500 (2,808 bytes),
`CRED` 9501, `MONS` 9502, `CRDS` 9503**. Their layout is **UNKNOWN**; `colwin`
carries them through untouched rather than shaping them into a plausible-looking
table.

### `COLDATA6.DLL` — 1,394,176 bytes, 108 resources

**97 `SPRT`, ids 350–724**, the most varied set in the game — 45 distinct
canvases. Two runs inside it are bound to game data:

- **`BUILDING<n>` is `SPRT 351+n`.** Established from the code: the building
  drawer reads the building type from the colony record, adds 351 and calls the
  sprite loader. The rule predicts art it never looked at — entry 0 `STOCKADE`
  is a palisade, entry 9 `TOWN HALL` is the one building with a cupola, entries
  37 and 38 `CHURCH` and `CATHEDRAL` are the only two steepled buildings.
- **`FATHER<n>` is `SPRT 700+n`** — 25 contiguous sprites for the 25 Founding
  Fathers, full-length figures in period dress, with index 16 the only woman, in
  native dress, where the prose has Pocahontas.

Also 10 `CVPC`, five of them 640×480.

### `COLDATA7.DLL` — 1,380,352 bytes, 2 resources

One resource and its name table. **`FLIC` 9600** is a stock Autodesk FLC:
640×480, 8 bpp, **66 frames at 71 ms**, 1,369,704 bytes inside a 1,370,112-byte
resource. The content is the Declaration-of-Independence celebration outside
Independence Hall, which pairs it with `WINFLC.WAV`.

### `COLDATA8.DLL` — 1,670,656 bytes, 105 resources

The colour module. **All 43 `CTAB` colour tables live here**, ids 111, 210–215,
220–223 and 260–291 — the same four bases the code computes colour-table ids
from at runtime.

**61 `SPRT`, ids 100–291**, in two clearly different groups: nineteen on a 32×32
canvas — ids 101–111 among them are the heraldic tiling patterns, rampant lions,
fleurs-de-lis, crowns and hatching on solid nation-coloured grounds, drawn with
palette indices 221–238, inside the `CTAB` window — and large portraits up to
284×337. Because these ids sit inside the `CTAB` id range, these are the sprites
whose colour reconstruction is best supported.

### `COLDATA9.DLL` — 202,752 bytes, 33 resources

The smallest data module, and the only one mixing text with art: **19 named
`TEXT` resources** (`AMERICA`, `ARTISTS`, `BADGUYS`, `CREATE`, `DANGER`,
`DEBUGOPTIONS`, `FORCED`, `FOREIGN`, …), **7 `SPRT`** banner strips (633×59,
536×59, 446×56, 261×59), **5 `CVPC`** at 80×50 and 7 bpp, and one `CRED` table.

The five canvases, ids 780–784, are the music-player transport buttons in order:
play, pause, stop, fast-forward, rewind.

---

## The text: `COLTEXT0.DLL` — 419,328 bytes

**717 `TEXT` resources, every one of them named** — `ABANDON`, `ACTIONS`,
`ALREADYHAVE`, `APACHE`, … — which is how the game resolves them: 453 of these
identifiers appear as literal strings in `COLONIZE.EXE`.

This is the game's entire authored text: dialogs, prompts, the Colonopedia, the
Founding Father biographies. Not all of it is prose — some resources are data
tables in text form, such as `ARAWAK`, a list of map coordinates giving the
Arawak villages' starting positions. Part of the *scenario* lives here, not just
the wording.

See [the TEXT format](text.md) for the directive and markup language.

---

## Sound: 44 `.WAV` files — 2,034,037 bytes

Every one is a plain RIFF/WAVE file, **PCM, mono, 11,025 Hz, 8-bit** — 184.3
seconds in total. No container tricks; any audio editor opens them, and `colwin`
leaves them alone.

They group by name into anthems and ceremony (`ENGLAND`, `FRANCE`, `SPAIN`,
`DUTCH`, `AMEN`, `POMP`, `1812`, `LIBERTY`, `MEETKING`, `MUSPARTY`, `GOLDCITY`,
`CRACKER1`–`4`), gunfire (`BIGGUN`, `LILGUN`, `CANNON0`, `CANNON1`, `GUNS`,
`GUNCOCK`, `COCKGUN`, `GUNWHOOP`, `WHOOP`), explosions (`BOOM1`–`4`, `BIGEXPLO`,
`LILEXPLO`, `EXPLO1`), movement (`HORSES`, `WHPHORSE`, `HORGNWHP`, `WGNSTOP`,
`DRAGOONS`, `BOARD`, `SHIPSINK`), work and impacts (`HAMMERS`, `FIRE1`, `ARROW`,
`BLTDIRT`, `BLTH20`) and `WINFLC.WAV`, which accompanies the `FLIC`.

---

## Game data

### `AMER2.MP` — 12,534 bytes

The Americas map: 58 × 72 tiles in three planes. Every byte is accounted for —
`6 + 3 × 58 × 72` is exactly the file size. Rendering plane 0 draws North,
Central and South America, the Caribbean chain, Florida, the Gulf and Baja
California. See [the .MP format](mp-map.md).

### `AUTO01.SAV` — 25,585 bytes

The one saved game that ships. Magic `COLONIZE\0`. Its **structure** is solved
from the save routine itself — 57 write calls accounting for all 25,585 bytes —
and it carries the same 58 × 72 dimensions as `AMER2.MP` at offset `0x0c`. What
the fields *mean* is open. See [the save format](save.md).
