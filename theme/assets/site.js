/* site.js - the behaviour web-ui's sheet leaves to the page: the theme
 * switch, the folding index on narrow screens, the outline that follows the
 * scroll position, and search over search-index.json. No dependencies. */

const root = document.body.dataset.root || "./";

/* ---- theme: auto / light / dark, remembered per browser ---- */
{
  const seg = document.getElementById("docs-theme");
  const html = document.documentElement;
  const mark = (t) => {
    for (const b of seg.children) b.classList.toggle("is-active", b.dataset.t === t);
  };
  let saved = "auto";
  try {
    saved = localStorage.getItem("docs-theme") || "auto";
  } catch {}
  mark(saved);
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const t = b.dataset.t;
    if (t === "auto") delete html.dataset.theme;
    else html.dataset.theme = t;
    try {
      localStorage.setItem("docs-theme", t);
    } catch {}
    mark(t);
  });
}

/* ---- the index, folded behind "Menu" below 900px ---- */
{
  const toggle = document.querySelector(".col-docs-toggle");
  const side = document.getElementById("docs-index");
  toggle?.addEventListener("click", () => {
    const open = side.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ---- the outline follows the heading nearest the top ---- */
{
  const links = [...document.querySelectorAll(".col-toc-link")];
  const targets = links
    .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter(Boolean);
  /* A long outline scrolls on its own; keep the active entry inside it
   * without moving the page. */
  const box = document.querySelector(".col-docs-toc");
  const keepInView = (a) => {
    if (!box || box.scrollHeight <= box.clientHeight) return;
    const r = a.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    if (r.top < b.top + 40 || r.bottom > b.bottom - 40) box.scrollTop += r.top - b.top - b.height / 3;
  };
  if (targets.length) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = 90;
      let current = targets[0];
      for (const t of targets) {
        if (t.getBoundingClientRect().top - line <= 0) current = t;
        else break;
      }
      for (const a of links) {
        const on = a.hash === `#${current.id}`;
        a.classList.toggle("is-active", on);
        if (on) {
          a.setAttribute("aria-current", "true");
          keepInView(a);
        } else a.removeAttribute("aria-current");
      }
    };
    addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }
}

/* ---- search ---- */
{
  const input = document.getElementById("docs-search");
  const panel = document.getElementById("docs-results");
  let index = null;
  let loading = null;
  let items = [];
  let sel = -1;

  const esc = (s) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const load = () =>
    (loading ??= fetch(`${root}search-index.json`)
      .then((r) => r.json())
      .then((d) => {
        index = d.map((e) => ({ ...e, lh: e.h.toLowerCase(), lp: e.p.toLowerCase(), lx: e.x.toLowerCase() }));
      })
      .catch(() => {
        index = [];
      }));

  const highlight = (text, terms) => {
    let out = esc(text);
    for (const t of terms) out = out.replace(new RegExp(`(${reEsc(esc(t))})`, "gi"), "<mark>$1</mark>");
    return out;
  };

  const snippet = (e, terms) => {
    const at = Math.min(...terms.map((t) => e.lx.indexOf(t)).filter((i) => i >= 0));
    if (!Number.isFinite(at)) return e.x.slice(0, 140);
    const from = Math.max(0, at - 50);
    return (from ? "…" : "") + e.x.slice(from, from + 150) + (from + 150 < e.x.length ? "…" : "");
  };

  const search = (q) => {
    const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1 || /\d/.test(t));
    if (!terms.length) return [];
    const scored = [];
    for (const e of index) {
      let score = 0;
      let all = true;
      for (const t of terms) {
        const inH = e.lh.includes(t);
        const inP = e.lp.includes(t);
        const inX = e.lx.includes(t);
        if (!inH && !inP && !inX) {
          all = false;
          break;
        }
        score += (inH ? 8 : 0) + (inP ? 3 : 0) + (inX ? 1 : 0);
      }
      if (all) scored.push({ e, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 12).map(({ e }) => ({ e, terms }));
  };

  const show = (open) => {
    panel.hidden = !open;
    input.setAttribute("aria-expanded", String(open));
  };

  const select = (i) => {
    sel = i;
    items.forEach((el, j) => el.setAttribute("aria-selected", String(j === i)));
    items[i]?.scrollIntoView({ block: "nearest" });
  };

  const run = async () => {
    const q = input.value.trim();
    if (!q) return show(false);
    await load();
    const results = search(q);
    if (!results.length) {
      panel.innerHTML = `<p class="col-search-empty">Nothing matches “${esc(q)}”.</p>`;
      items = [];
    } else {
      panel.innerHTML = results
        .map(
          ({ e, terms }) =>
            `<a class="col-search-item" role="option" href="${root}${e.u}">` +
            `<span class="col-search-k">${esc(e.s)} · ${esc(e.p)}</span>` +
            `<span class="col-search-t">${highlight(e.h, terms)}</span>` +
            `<span class="col-search-d">${highlight(snippet(e, terms), terms)}</span></a>`,
        )
        .join("");
      items = [...panel.querySelectorAll(".col-search-item")];
    }
    sel = -1;
    show(true);
  };

  input.addEventListener("input", run);
  input.addEventListener("focus", () => {
    load();
    if (input.value.trim()) run();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" && items.length) {
      e.preventDefault();
      select((sel + 1) % items.length);
    } else if (e.key === "ArrowUp" && items.length) {
      e.preventDefault();
      select((sel - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      const target = items[sel >= 0 ? sel : 0];
      if (target) location.href = target.href;
    } else if (e.key === "Escape") {
      show(false);
      input.blur();
    }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".col-search")) show(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)) {
      e.preventDefault();
      input.focus();
    }
  });
}
