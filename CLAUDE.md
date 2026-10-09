# CLAUDE.md

Guidance for Claude Code working in this repo.

## What this is

The public documentation site for the Colonization RE project, deployed to
<https://opencol.github.io/docs/> by `.github/workflows/pages.yml` on
every push to `main`. Markdown in `content/` → static HTML in `_site/`.

## Commands

```sh
npm run build          # must pass before saying you're done
npm run dev            # build + serve on :8001
npm run dev:local-ui   # same, against ../web-ui/dist/col.min.css
```

## Rules

- **Styling comes from web-ui.** Use its classes (`col-*`). `theme/assets/site.css`
  holds only this site's composition, with `docs-*` class names. A rule that
  would be useful to another project belongs in web-ui: add it there, release a
  new version, and bump `WEB_UI_VERSION`. Do not vendor or copy col.css here.
- **`WEB_UI_VERSION` names a published web-ui release tag.** The build
  downloads that release's `col.min.css` and verifies it against
  `SHA256SUMS.txt`; a tag that is not released yet fails the build.
- **The build is strict about links.** Do not work around a broken-link error
  by deleting the check — fix the link. Links into private repositories must
  not appear: the site is public, so a path into the research tree becomes
  plain `code` text, not a link.
- **Page order lives in `site.json`.** A Markdown file that is not listed there
  is not built.
- **`_site/` is generated** and git-ignored. Never edit it.
- **Content is for players and readers**, not reverse engineers. Keep internal
  tooling, addresses and repository names out of the prose unless a page is
  explicitly about them. The file format pages (`content/formats/`) are: they
  cite code addresses as evidence and link the public tools that implement
  each format.
- **The format pages are the only copy.** win-tools, dos-tools and sav-editor
  link to them instead of keeping their own. Their code docstrings still carry each
  layout; when a page and a docstring disagree, re-derive the fact, do not
  copy one over the other.
- **Figures on the Windows format pages are tested.** win-tools'
  `tests/test_docs.py` re-derives the counts in `formats/windows/files.md`,
  `sprt.md`, `cvpc.md`, `ctab.md` and `ne-container.md` from a real install and
  matches them as literal strings, line breaks included. Change a figure there
  only together with the measurement, and run that test against this checkout
  (`COLWIN_DOCS=<this repo>`) after editing those pages.
- **Addresses differ per release.** Windows pages use segment:offset in
  `COLONIZE.EXE` (`1068:0180`); DOS pages use file offsets in `VICEROY.EXE`
  with the routine name (`draw_icon`, file `0xe76a`). Do not mix them.
