# ARCV — `COLONIZE.$00`

448,483 bytes holding the game's **original, pre-patch** `colonize.exe`. Solved;
`colwin` does not extract it.

## Container

```
0x00  "ARCV"
0x04  WORD   version               0x0110
0x06  WORD   offset of first CHNK  59
0x0c  BYTE   member name length    12
0x0d  char[] "colonize.exe\0"
0x19  DWORD  uncompressed size     0x0011EE00 = 1,175,040
0x1d  DWORD  compressed size       0x0006D798 = 448,408
...
0x3b  "CHNK" + WORD version + WORD header size (16)
0x4b  payload
```

Exact: `75 + 448,408 = 448,483`, the file size. The uncompressed-size field was
not identified until after decompression produced exactly 1,175,040 bytes — the
field and the result agree, which checks both.

## Payload: LZHUF

Adaptive Huffman over an LZSS window. Nothing here was guessed: `SETUP.EXE`
carries the ARCV reader — its strings include *Not an ARCV file*, *Incorrect
ARCV version* and *Incorrect file checksum* — and every constant came out of it.

| Routine in `SETUP.EXE` | What it is |
| --- | --- |
| `1008:0809` | `StartHuff` — `freq[i]=1, son[i]=i+T, prnt[i+T]=i` |
| `1008:08b5` | `reconst` — halve frequencies, rebuild the tree |
| `1008:0a0f` | `update` — `MAX_FREQ = 0x8000` |
| `1008:0b23` | `DecodeChar` — walk `son[]` from `son[R]`, one bit per level |
| `1008:0b8d` | `DecodePosition` — `d_code[]` / `d_len[]` at `DS:0x4ee` / `DS:0x5ee` |
| `1008:0c49` | `Decode` — 4,096-byte ring prefilled with `' '`, `r = 0xdc3` |

Parameters: `N = 4096`, `T = 573`, `N_CHAR = 287`, `R = 572`. `T = N_CHAR × 2 −
1` holds exactly, and **287 = 256 literals + 1 end marker + 30 length codes**,
which is what fixes the alphabet. A match code `c` copies `c − 0xFF + 1` bytes.

## What the pre-patch binary shows

| | shipped (patched) | recovered (pre-patch) |
| --- | --- | --- |
| module, linker, target | `COLONIZE`, linker 6.1, Windows 3.10 | identical |
| imports | WING, COMMDLG, GDI, KERNEL, MMSYSTEM, USER, WIN87EM | identical |
| segments | 34 (19 code) | **33 (18 code)** |
| size | 1,227,264 | 1,175,040 |
| `Assertion failed` strings | 5 | **0** |

The patch added a code segment and added the asserts — consistent with
`README.TXT`, which describes it as fixing recurring lock-ups.
