# Text files

*The DOS game's text — `GAME.TXT`, `PEDIA.TXT`, `MENU.TXT` and the rest — is plain DOS text in code page 437, read line by line.*

The 18 `.TXT` and 2 `.DB` files are read by `text_open` / `text_get` (file
`0x6f8fa`) through the C runtime's stdio, one line at a time, with CRLF line
endings. They need no decoding, only a character set.

Every shipped file is ASCII except one byte of `PEDIA.TXT`: `0xF9`, which is
cp437's `∙`. Code page 437 assigns a character to all 256 bytes, so converting
to and from Unicode is exact both ways.

## Compared with Windows

The Windows release moves its text into [`TEXT`](../windows/text.md) resources
inside `COLTEXT0.DLL`, one named resource per dialog or article, in code page
1252, with a directive header and its own markup.
