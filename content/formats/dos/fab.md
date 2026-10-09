# FAB — the compression

*The LZ77 codec inside a MADSPACK entry of type 1: a 4,096-byte window, flag bits interleaved with the data in 16-bit words.*

```
0x00  3     "FAB"
0x03  BYTE  shift (12 in every shipped stream; 10-13 decode)
0x04  WORD  the first word of the flag bit stream
0x06  ...   tokens, with further flag words interleaved
```

## Tokens

Flag bits are taken least significant first from 16-bit little-endian words.

```
1                 literal: one byte follows
0 0 a b           short copy: length 2 + (a<<1 | b), distance 256 - next byte
0 1               long copy: two bytes L, H follow
                    distance = 0x10000 - ((H >> (16-shift) | 0xff << (shift-8)) << 8 | L)
                    length   = H & ((1 << (16-shift)) - 1)
                    length 0 -> one more byte n: 0 ends the stream,
                                1 is a no-op, otherwise length n + 1
                    length k -> k + 2
```

With shift 12 that is a 4,096-byte window: literals cost 9 bits, copies of
2–5 bytes reachable 256 back cost 12, copies of 3–17 bytes cost 18, and copies
of up to 256 bytes cost 26.

## When a flag word is fetched

A new flag word is fetched **the moment the previous one's sixteenth bit is
asked for**. So it sits in the byte stream *before* the data bytes of the token
whose flag bit emptied the old word, and an encoder has to reproduce exactly
that placement.

## Evidence

The decoder is `ff_decode`'s type-1 branch (file `0x772fa`), the same codec the
MADS engine's own games use. Every type-1 entry in the 246 shipped MADSPACK
files — 793 streams — decodes to exactly its declared size and ends exactly at
its declared packed size, with no byte left over.

## The shipped packer

MicroProse's packer seems to work in 40,960-byte blocks: the no-op token turns
up 44 times, every time within 223 bytes after the output passes a multiple of
`0xa000`, and nowhere else.

A packer that does not imitate it still produces valid streams that decode to
the same bytes; dos-tools' packer comes out byte-identical for 479 of the 793.
That is why a rebuild never re-packs an entry whose contents did not change.
