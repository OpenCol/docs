# MADSPACK — the container

*Every `.SS`, `.PIK` and `.FF` file is a MADSPACK 2.0 container, the archive format of MicroProse's MADS adventure engine: up to sixteen entries, each stored or FAB-packed.*

All 206 `.SS`, 35 `.PIK` and 5 `.FF` files have this shape:

```
0x00  13    "MADSPACK 2.0\x1a"
0x0d  BYTE  0
0x0e  WORD  count of entries (1-16)
0x10  16 x 10-byte entry slots:
        BYTE  type    0 stored, 1 FAB-packed
        BYTE  flag    carried; identical across one file's entries
        DWORD size    bytes after unpacking
        DWORD packed  bytes in the file
0xb0  the entries' data, back to back, in entry order
....  sometimes more bytes after the last entry (4 of the 246 files)
```

## Evidence

`ff_open` (file `0x76e50`) reads the 16-byte head, checks the magic and reads
`count` entries; `ff_read` (file `0x77100`) takes the entries in order, treating
type 0 as a stored copy and any other type as packed. Every shipped file closes
on that arithmetic: `0xb0` plus the sum of `packed` is the file size, or the
start of the trailing bytes.

## Carried, not computed

The slots past `count` are **not zeroed** in the shipped files. They hold
whatever was in the packer's memory — x86 code among it — so the whole
`0xb0`-byte header is carried verbatim. The `flag` byte is not what `ff_read`
decides anything on, and it is carried too, as are the trailing bytes.

That is what lets a rebuilt file with one edited entry differ from the original
in that entry and its sizes only.

Packed entries use [FAB](fab.md).
