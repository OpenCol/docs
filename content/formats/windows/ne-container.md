# The NE container

Implemented in [`colwin/ne.py`](https://github.com/OpenCol/win-tools/blob/main/colwin/ne.py).

The eleven data DLLs, `COLONIZE.EXE` and `SETUP.EXE` are Win16 **NE** modules,
and all thirteen have the same shape:

```
[ NE header + segments ]  [ resources: one contiguous run, to EOF ]
```

Measured over all thirteen: no overlapping resources, exactly one contiguous
run, and a single gap — the one at the front. That is what makes rebuilding
safe: a rebuild never has to move a segment or touch a relocation record. It
re-lays the tail and patches the 12-byte table entries, which live in the
header and do not move.

## The resource table

At `ne_rsrctab` in the NE header: a WORD alignment shift, then, per type, a
type record followed by its entries.

| | |
| --- | --- |
| `WORD` shift | alignment shift; **9** (512 bytes) in every module here |
| `WORD` type id | `0x8000 \| ordinal` for standard types, else a name offset; 0 ends the table |
| `WORD` count | entries of this type |
| `DWORD` | reserved |

then `count` entries of twelve bytes:

| | |
| --- | --- |
| `WORD` offset | in units of `1 << shift` |
| `WORD` length | likewise — so it **includes** the NUL padding |
| `WORD` flags | |
| `WORD` id | `0x8000 \| ordinal`, else a name offset |
| `DWORD` | reserved |

Because offset and length are stored in 512-byte units, every resource body is
NUL-padded to that boundary. The padding is not content: `colwin` trims it, with
two exceptions that matter — an empty `SPRT`'s 25-byte header ends in zeros, and
a `CTAB` whose last entries are black does too. Trimming into either makes a
correct encoder look wrong.

A 16-bit offset field at a 512-byte alignment caps a module at 33.5 MB, so
resources have a great deal of room to grow. Growing one tenfold and rebuilding
was checked: the tail reflows and all 717 other resources in that module still
read back identically.

## Resource names: `RT_NAMETABLE`

Type 15, undocumented by Microsoft, is how a Win16 module records the string
names behind numeric resource ids. It is one blob of variable-length entries:

| | |
| --- | --- |
| `WORD cbEntry` | size of this entry, **including** this field |
| `WORD wTypeId` | `0x8000 \| ordinal`, else a name offset |
| `WORD wResId` | likewise |
| `char[]` | NUL-terminated type name, then NUL-terminated resource name |

`6 + len(type) + 1 + len(name) + 1 == cbEntry` holds for every entry of every
module, which is what verifies the layout. This is where the private type names
`SPRT`, `CVPC`, `CTAB`, `FLIC`, `TEXT`, `CRDS`, `CRED`, `MONS` and `SHIP` come
from — the developers' own words, not labels adopted from magic bytes.

> The canvas type is spelled `CvPc` inside the executable's type-name block,
> which reads `SMEDS CTAB FLIC FRRS LBMS PCXS GIFS CvPc SPRT SPRT`. Four of
> those types — `FRRS`, `LBMS`, `PCXS`, `GIFS` — ship in no data DLL at all.

## Rebuilding

`Module.rebuild(replacements)` keeps every resource in its original file order,
copies anything not replaced verbatim with its padding intact, pads replacements
to the alignment, and patches the offset and length of each entry in place.

With no replacements it reproduces the input byte for byte — checked on all
thirteen modules, and the reason an unedited workspace rebuilds an install file
for file.
