# Shared file formats

*The files the DOS and Windows releases read and write identically: saved games and maps. A file from one release is a file for the other.*

The two releases keep their art, colours and text in entirely different
containers (see [Windows file formats](../windows/index.md) and
[DOS file formats](../dos/index.md)), but the game state they save and the map
they start from are the same bytes.

| Format | Files | Status |
| --- | --- | --- |
| [`.SAV` saves](save.md) | `AUTO01.SAV` (Windows), `COLONYnn.SAV` (DOS) | all 57 fields placed; about two thirds understood |
| [`.MP` maps](mp-map.md) | `AMER2.MP`, identical in both releases | solved |

Each page gives the evidence from both games: segment:offset addresses in the
Windows `COLONIZE.EXE`, and file offsets with routine names in the DOS
`VICEROY.EXE`.

What else differs, and what does not, is in
[the two releases compared](../../versions/asset-formats.md).
