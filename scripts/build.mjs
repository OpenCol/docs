#!/usr/bin/env node
/* build.mjs - render content/ into _site/, a static site for GitHub Pages.
 *
 *   node scripts/build.mjs                  build against the pinned web-ui release
 *   node scripts/build.mjs --css <file>     build against a local col.css instead
 *   node scripts/build.mjs --serve          ...then serve _site/ on :8001
 *
 * site.json lists the sections and the order of their pages; that order is the
 * sidebar, the pager and the landing page. Each section is a directory in
 * content/ with an index.md and one .md file per page.
 *
 * The stylesheet is web-ui's col.min.css at the release named in
 * WEB_UI_VERSION. It is downloaded once into .cache/, checked against the
 * release's SHA256SUMS.txt, and served from the site itself: GitHub serves
 * release assets as application/octet-stream with nosniff, which a browser
 * refuses as a stylesheet.
 *
 * The build is strict. A link to a page that does not exist, or to an anchor
 * that is not on the target page, fails it.
 */
import { Marked } from "marked";
import { createHash } from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");
const THEME = path.join(ROOT, "theme");
const OUT = path.join(ROOT, "_site");

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const read = (p) => fs.readFileSync(p, "utf8");
const site = JSON.parse(read(path.join(ROOT, "site.json")));
const WEB_UI_VERSION = read(path.join(ROOT, "WEB_UI_VERSION")).trim();
const errors = [];

/* ------------------------------------------------------------- helpers */

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const decode = (s) =>
  s.replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[e]);

const stripTags = (html) => decode(html.replace(/<[^>]*>/g, ""));

/* GitHub's heading slug, so that links written against GitHub's rendering of
 * the Markdown keep working here. */
const slugify = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_\- ]/gu, "")
    .replace(/ /g, "-");

/* Markdown source to searchable plain text. */
const plain = (md) =>
  md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*\|?[-:| ]+\|?\s*$/gm, " ")
    .replace(/[`*_>#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* The prefix that takes a page at `url` back to the site root. */
const rootOf = (url) => (url === "" ? "./" : "../".repeat(url.split("/").filter(Boolean).length));

/* --------------------------------------------------------------- pages */

/* Every page in order: the landing page, then each section's index and pages. */
function collect() {
  const pages = [];
  for (const section of site.sections) {
    if (section.soon) continue;
    const add = (slug) => {
      const src = `${section.dir}/${slug}.md`;
      const file = path.join(CONTENT, src);
      if (!fs.existsSync(file)) throw new Error(`site.json lists ${src}, which does not exist`);
      pages.push({
        section,
        src,
        md: read(file),
        url: slug === "index" ? `${section.dir}/` : `${section.dir}/${slug}/`,
      });
    };
    add("index");
    for (const slug of section.pages) add(slug);
  }
  return pages;
}

/* Turn one page's Markdown into HTML, its outline and its search entries. */
function render(page, bySrc) {
  const tokens = new Marked({ gfm: true }).lexer(page.md);

  /* The first h1 is the title; an all-italic paragraph right after it is the
   * lead. Both move into the page header rather than the body. */
  const h1 = tokens.findIndex((t) => t.type === "heading" && t.depth === 1);
  if (h1 < 0) throw new Error(`${page.src} has no "# Title" line`);
  page.title = tokens[h1].text;
  tokens.splice(h1, 1);
  let i = h1;
  while (tokens[i] && tokens[i].type === "space") i++;
  const lead = tokens[i];
  if (lead && lead.type === "paragraph" && /^\*[^*].*\*$/s.test(lead.raw.trim())) {
    page.lead = lead.text.replace(/^\*|\*$/g, "");
    tokens.splice(i, 1);
  }

  /* Heading ids, assigned in document order before rendering. */
  const used = new Map();
  const ids = [];
  page.outline = [];
  page.ids = new Set();
  const search = [];
  let entry = { h: "", id: "", text: [] };
  const inlineText = (md) => stripTags(new Marked({ gfm: true }).parseInline(md));
  for (const t of tokens) {
    if (t.type === "heading") {
      const text = inlineText(t.text);
      let id = slugify(text);
      const n = used.get(id) || 0;
      used.set(id, n + 1);
      if (n) id = `${id}-${n}`;
      ids.push(id);
      page.ids.add(id);
      if (t.depth === 2 || t.depth === 3) page.outline.push({ depth: t.depth, text, id });
      if (t.depth <= 3) {
        search.push(entry);
        entry = { h: text, id, text: [] };
      }
    } else if (t.raw) {
      entry.text.push(plain(t.raw));
    }
  }
  search.push(entry);
  page.search = search
    .map((e) => ({ h: e.h, id: e.id, x: e.text.join(" ").slice(0, 600) }))
    .filter((e) => e.h || e.x);

  /* Links: a relative .md link becomes the URL of that page, relative to this
   * one. Anything else relative is a link into a repo this site does not
   * carry, and is an error. */
  const root = rootOf(page.url);
  page.links = [];
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens: inline, depth }) {
        const id = ids.shift();
        const text = this.parser.parseInline(inline);
        return (
          `<h${depth} id="${id}">${text}` +
          ` <a class="col-anchor" href="#${id}" aria-label="Link to this section">#</a></h${depth}>\n`
        );
      },
      link({ href, title, tokens: inline }) {
        const text = this.parser.parseInline(inline);
        const t = title ? ` title="${esc(title)}"` : "";
        if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
          return `<a href="${esc(href)}"${t} rel="noopener">${text}</a>`;
        }
        if (href.startsWith("#")) {
          page.links.push({ page, anchor: href.slice(1) });
          return `<a href="${esc(href)}"${t}>${text}</a>`;
        }
        const [file, anchor] = href.split("#");
        const target = path.posix.normalize(path.posix.join(path.posix.dirname(page.src), file))
          .replace(/(^|\/)README\.md$/, "$1index.md");
        const dest = bySrc.get(target);
        if (!dest) {
          errors.push(`${page.src}: link to ${href} does not resolve to a page`);
          return text;
        }
        if (anchor) page.links.push({ page: dest, anchor, from: page.src });
        return `<a href="${root}${dest.url}${anchor ? `#${anchor}` : ""}"${t}>${text}</a>`;
      },
    },
  });
  page.html = marked
    .parser(tokens)
    .replace(/<table>/g, '<div class="col-tablewrap"><div class="col-scroll"><table>')
    .replace(/<\/table>/g, "</table></div></div>");
}

/* ------------------------------------------------------------- web-ui */

async function stylesheet() {
  const local = opt("--css");
  if (local) return fs.readFileSync(path.resolve(local));
  if (!/^v\d+\.\d+\.\d+$/.test(WEB_UI_VERSION)) {
    throw new Error("WEB_UI_VERSION must hold a release tag such as v1.2.0");
  }
  const cache = path.join(ROOT, ".cache", "web-ui", WEB_UI_VERSION);
  const base = `https://github.com/colonization-re/web-ui/releases/download/${WEB_UI_VERSION}`;
  fs.mkdirSync(cache, { recursive: true });
  const fetchTo = async (name) => {
    const file = path.join(cache, name);
    if (!fs.existsSync(file)) {
      const res = await fetch(`${base}/${name}`);
      if (!res.ok) throw new Error(`web-ui ${WEB_UI_VERSION}: ${name} answered HTTP ${res.status}`);
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    }
    return fs.readFileSync(file);
  };
  const css = await fetchTo("col.min.css");
  const sums = (await fetchTo("SHA256SUMS.txt")).toString("utf8");
  const line = sums.split("\n").find((l) => l.trim().endsWith(" col.min.css"));
  if (!line) throw new Error("SHA256SUMS.txt has no line for col.min.css");
  const want = line.trim().split(/\s+/)[0];
  const got = createHash("sha256").update(css).digest("hex");
  if (want !== got) throw new Error(`col.min.css checksum mismatch: expected ${want}, got ${got}`);
  return css;
}

/* -------------------------------------------------------------- layout */

const template = read(path.join(THEME, "layout.html"));

function fill(vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in vars)) throw new Error(`layout.html uses {{${k}}}, which the build does not set`);
    return vars[k];
  });
}

function nav(current, root) {
  const groups = site.sections.map((section) => {
    if (section.soon) {
      return (
        `<div class="col-nav-group"><p class="col-nav-title">${esc(section.title)}</p>` +
        `<span class="col-nav-link col-nav-link--soon">In preparation</span></div>`
      );
    }
    const links = [{ url: `${section.dir}/`, title: "Overview" }]
      .concat(section.pages.map((slug) => ({ url: `${section.dir}/${slug}/`, title: null })))
      .map((l) => {
        const page = pagesByUrl.get(l.url);
        const cur = current && current.url === l.url ? ' aria-current="page"' : "";
        return `<a class="col-nav-link" href="${root}${l.url}"${cur}>${esc(l.title || page.title)}</a>`;
      });
    return `<div class="col-nav-group"><p class="col-nav-title">${esc(section.title)}</p>${links.join("")}</div>`;
  });
  return `<nav class="col-nav" aria-label="Documentation">${groups.join("")}</nav>`;
}

function toc(page) {
  if (!page.outline || page.outline.length < 2) return "";
  const items = page.outline
    .map(
      (h) =>
        `<li><a class="col-toc-link${h.depth === 3 ? " col-toc-link--sub" : ""}" href="#${h.id}">${esc(h.text)}</a></li>`,
    )
    .join("");
  return `<nav class="col-toc" aria-label="On this page"><p class="col-toc-title">On this page</p><ul class="col-toc-list">${items}</ul></nav>`;
}

function crumbs(page, root) {
  const parts = [`<li><a href="${root}">Docs</a></li>`];
  if (page.url !== `${page.section.dir}/`) {
    parts.push(`<li><a href="${root}${page.section.dir}/">${esc(page.section.title)}</a></li>`);
    parts.push(`<li aria-current="page">${esc(page.title)}</li>`);
  } else {
    parts.push(`<li aria-current="page">${esc(page.section.title)}</li>`);
  }
  return `<ol class="col-crumbs">${parts.join("")}</ol>`;
}

function pager(page, root) {
  const i = pages.indexOf(page);
  const prev = pages[i - 1];
  const next = pages[i + 1];
  const link = (p, kind) =>
    p
      ? `<a class="col-pager-link${kind === "Next" ? " col-pager-link--next" : ""}" href="${root}${p.url}">` +
        `<span class="col-pager-k">${kind}</span><span class="col-pager-t">${esc(p.title)}</span></a>`
      : "";
  if (!prev && !next) return "";
  return `<nav class="col-pager" aria-label="Pages">${link(prev, "Previous")}${link(next, "Next")}</nav>`;
}

function header(page) {
  return (
    `<header class="docs-head">${crumbs(page, rootOf(page.url))}` +
    `<h1>${esc(page.title)}</h1>` +
    (page.lead ? `<p class="col-lead">${esc(page.lead)}</p>` : "") +
    `</header>`
  );
}

function landing(root) {
  const cards = site.sections
    .map((section) => {
      if (section.soon) {
        return (
          `<div class="col-card docs-section docs-section--soon"><p class="col-eyebrow">${esc(section.title)}</p>` +
          `<p class="col-dim">${esc(section.blurb)}</p><span class="col-badge">In preparation</span></div>`
        );
      }
      const list = section.pages
        .map((slug) => {
          const p = pagesByUrl.get(`${section.dir}/${slug}/`);
          return `<li><a href="${root}${p.url}">${esc(p.title)}</a></li>`;
        })
        .join("");
      return (
        `<div class="col-card docs-section"><p class="col-eyebrow">${esc(section.title)}</p>` +
        `<p class="col-dim">${esc(section.blurb)}</p><ul class="docs-section-list">${list}</ul>` +
        `<a class="col-btn col-btn--outline col-btn--sm" href="${root}${section.dir}/">Overview</a></div>`
      );
    })
    .join("");
  return (
    `<div class="col-plate"><p class="col-eyebrow">${esc(site.title)}</p>` +
    `<h1>How Colonization really works</h1>` +
    `<p class="col-lead">${esc(site.description)}</p>` +
    `<dl class="col-plate-meta"><div><dt>Game</dt><dd>Sid Meier's Colonization</dd></div>` +
    `<div><dt>Build</dt><dd>Windows, 1995</dd></div>` +
    `<div><dt>Source</dt><dd>Reconstructed code</dd></div>` +
    `<div><dt>Guides</dt><dd>${pages.filter((p) => !p.url.endsWith(`${p.section.dir}/`)).length}</dd></div></dl></div>` +
    `<div class="docs-sections">${cards}</div>`
  );
}

function page404() {
  return (
    `<div class="col-plate"><p class="col-eyebrow">404</p><h1>No such page</h1>` +
    `<p class="col-lead">The page you asked for is not here. It may have moved when the documentation was reorganised.</p>` +
    `<a class="col-btn" href="${site.base}">Back to the documentation</a></div>`
  );
}

/* ---------------------------------------------------------------- main */

const pages = collect();
const bySrc = new Map(pages.map((p) => [p.src, p]));
const pagesByUrl = new Map(pages.map((p) => [p.url, p]));
for (const p of pages) render(p, bySrc);
for (const p of pages) {
  for (const l of p.links) {
    if (!l.page.ids.has(l.anchor)) {
      errors.push(`${l.from || p.src}: anchor #${l.anchor} is not on ${l.page.src}`);
    }
  }
}
if (errors.length) {
  console.error(errors.map((e) => `  error  ${e}`).join("\n"));
  console.error(`\n${errors.length} broken link(s). Nothing was written.`);
  process.exit(1);
}

const css = await stylesheet();
const hash = (b) => createHash("sha256").update(b).digest("hex").slice(0, 10);
const siteCss = fs.readFileSync(path.join(THEME, "assets", "site.css"));
const siteJs = fs.readFileSync(path.join(THEME, "assets", "site.js"));

fs.rmSync(OUT, { recursive: true, force: true });
const write = (rel, data) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
};
write("assets/col.min.css", css);
write("assets/site.css", siteCss);
write("assets/site.js", siteJs);
write(".nojekyll", "");

const common = (root) => ({
  root,
  colcss: `${root}assets/col.min.css?v=${hash(css)}`,
  sitecss: `${root}assets/site.css?v=${hash(siteCss)}`,
  sitejs: `${root}assets/site.js?v=${hash(siteJs)}`,
  sitetitle: esc(site.title),
  repo: esc(site.repo),
  webui: esc(WEB_UI_VERSION),
  year: String(new Date().getUTCFullYear()),
});

write(
  "index.html",
  fill({
    ...common("./"),
    title: esc(`${site.title} ${site.subtitle}`),
    description: esc(site.description),
    nav: nav(null, "./"),
    toc: "",
    body: landing("./"),
    pager: "",
    kind: "home",
  }),
);

for (const p of pages) {
  const root = rootOf(p.url);
  write(
    `${p.url}index.html`,
    fill({
      ...common(root),
      title: esc(`${p.title} · ${site.title}`),
      description: esc(p.lead || site.description),
      nav: nav(p, root),
      toc: toc(p),
      body: `${header(p)}<div class="col-prose">${p.html}</div>`,
      pager: pager(p, root),
      kind: "page",
    }),
  );
}

write(
  "404.html",
  fill({
    ...common(site.base),
    title: esc(`Not found · ${site.title}`),
    description: esc(site.description),
    nav: nav(null, site.base),
    toc: "",
    body: page404(),
    pager: "",
    kind: "home",
  }),
);

const index = pages.flatMap((p) =>
  p.search.map((e) => ({
    p: p.title,
    s: p.section.title,
    h: e.h || p.title,
    u: `${p.url}${e.id ? `#${e.id}` : ""}`,
    x: e.x,
  })),
);
write("search-index.json", JSON.stringify(index));

console.log(`_site/  ${pages.length + 1} pages, ${index.length} search entries, web-ui ${opt("--css") ? "local" : WEB_UI_VERSION}`);

/* --------------------------------------------------------------- serve */

if (args.includes("--serve")) {
  const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json" };
  const prefix = site.base.replace(/\/$/, "");
  http
    .createServer((req, res) => {
      let url = decodeURIComponent(req.url.split("?")[0]);
      if (url.startsWith(prefix)) url = url.slice(prefix.length) || "/";
      let file = path.join(OUT, url);
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!file.startsWith(OUT) || !fs.existsSync(file)) {
        res.writeHead(404, { "content-type": "text/html" });
        return res.end(fs.readFileSync(path.join(OUT, "404.html")));
      }
      res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
      res.end(fs.readFileSync(file));
    })
    .listen(8001, () => console.log(`serving http://localhost:8001${site.base}`));
}
