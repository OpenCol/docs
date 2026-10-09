# `TEXT` — the game's authored text

Implemented in [`colwin/formats/text.py`](https://github.com/OpenCol/win-tools/blob/main/colwin/formats/text.py). 737 resources — 717 in `COLTEXT0.DLL`,
19 in `COLDATA9.DLL`, 1 in `COLDATA0.DLL` — and every one in `COLTEXT0` and
`COLDATA9` carries the developers' own name in the module's `RT_NAMETABLE`.

The game resolves them **by name**: 453 of those identifiers appear as literal
strings in `COLONIZE.EXE`.

## Body format

Plain 8-bit text, LF-separated, with a small directive header:

```
@width=380
@default=1
Shall we indeed {abandon} our %STRING0 colony,
Your Excellency, forfeiting all of our hard work
here?

Yes, it is God's will.
Never! That would be folly.
```

**Directives** — `@name=value`, one per line, at the top:

| Directive | Count | Meaning, from usage |
| --- | ---: | --- |
| `@width` | 458 | dialog width in pixels |
| `@default` | 13 | index of the default answer |
| `@x`, `@y` | 3, 5 | explicit dialog placement |

**Substitutions**, filled in at runtime: `%STRING0`–`%STRING4` (382, 210, 88, 49
and 6 uses), `%NUMBER0`–`%NUMBER3` (125, 36, 11, 2), `%COUNTRY` (5), `%F` (1).

**Markup**:

- `{…}` — emphasis. 1,125 opens and 1,125 closes across the corpus, perfectly
  balanced.
- `^` (619) — section delimiter. `^{TITLE}^body…` is the encyclopedia form, e.g.
  `100_CARGO0` is `^{FOOD}^Food is one of the most valuable commodities…` and
  `197_FATHER2` is `^{Peter Minuit (1580-1639)}^Director-general of the Dutch
  West India Company's colony…`.
- `~` (11) — rare, purpose **UNKNOWN**.
- A blank line separates the prompt from the list of selectable answers.
- Byte **`0xA4`** is the game's gold/coin glyph: *Treasure sold to foreign agents
  for {%NUMBER0¤}.*

## Encoding

cp1252 in and out — which is what makes `0xA4` the currency sign `¤`, so the
editable file shows the gold glyph as a character rather than an escape.
`colwin` writes UTF-8 files and converts on the way back; anything cp1252 cannot
hold is refused by line number rather than silently replaced, because a mangled
byte here is a mangled string in a shipped dialog.

CRLF is normalised to LF, which is how the game stores it.

## Not everything here is prose

Some resources are data tables in text form. `ARAWAK` is a list of map
coordinates —

```
37,29
32,25
31,27
```

— the Arawak villages' starting positions. Part of the game's *scenario data*,
not just its wording, lives in the text resources.

> A first sweep classified 51 bodies as "non-printable". They are not: the only
> offending byte is `0xA4`. All 717 bodies are text.
