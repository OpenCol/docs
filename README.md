# Colonization RE documentation

How Sid Meier's Colonization really works, read out of the game's own code.

**Read it at <https://colonization-re.github.io/docs/>.**

The site is plain Markdown in `content/`, rendered to static HTML by a small
Node script and styled with [web-ui](https://github.com/colonization-re/web-ui).
Every push to `main` rebuilds and deploys it.

## What is here

| Section | Status |
| --- | --- |
| Player guides — map generation, terrain, units, Europe, taxes, combat, Founding Fathers, difficulty | published |
| File formats — save games, maps, graphics, text resources | in preparation |
| Version differences — DOS, Windows and Macintosh | in preparation |

## Working on it

```sh
npm ci
npm run dev            # build, then serve http://localhost:8001/docs/
npm run build          # build into _site/
```

`npm run dev:local-ui` builds against `../web-ui/dist/col.min.css` instead of
the pinned release, for trying out a web-ui change before it is released.

### Adding a page

1. Write `content/<section>/<page>.md`. The first `# Heading` becomes the page
   title; an all-italic paragraph straight after it becomes the lead.
2. Add `<page>` to that section's `pages` list in `site.json`. The list order
   is the order of the sidebar, the pager and the landing page.
3. Link to other pages with ordinary relative Markdown links —
   `[Combat](combat.md#3-defence)`. The build turns them into site URLs.

### Adding a section

Add an entry to `sections` in `site.json` with a `dir`, `title`, `blurb` and
`pages`, and create `content/<dir>/index.md`. An entry with `"soon": true` is
listed as "in preparation" and needs no files yet.

### The build is strict

A link to a page that does not exist, or to an anchor that is not on its
target page, fails the build with the file and the link. Links into other
repositories must be absolute URLs.

## Layout

```
site.json            title, sections and page order
content/             one directory per section, Markdown
theme/layout.html    the page template
theme/assets/        site.css (composition on top of col.css), site.js
scripts/build.mjs    Markdown → _site/, search index, web-ui download
WEB_UI_VERSION       the web-ui release the site is styled with
```

## Disclaimer

Sid Meier's Colonization belongs to its rights holders, and this project is
not affiliated with them.
