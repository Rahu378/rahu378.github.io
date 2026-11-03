# rahu378.github.io

Portfolio for **Rahul Reddy Chidipudi** — software engineer, backend and
distributed systems.

**Live:** https://rahu378.github.io

---

## What it is

Six static pages, no framework, no runtime dependencies. Total JavaScript
shipped is about 19 KB, unminified — there is no React, no GSAP, no
smooth-scroll library. Scrolling is the browser's own, which is why it feels
instant.

| Layer | Choice |
| --- | --- |
| Pages | Six hand-written static HTML files, generated from one template |
| Styling | One stylesheet, CSS custom properties, dark only |
| Motion | IntersectionObserver + CSS transitions |
| Diagrams | Inline SVG with CSS dash-flow animation |
| Portrait | SVG filter chain applied live in-browser |
| Hosting | GitHub Pages via GitHub Actions |

## Layout

```
index.html            home — portrait hero + terminal
projects/             the four systems, with architecture diagrams
work/                 experience
skills/               tooling
about/                background, education, leadership
contact/
assets/
  css/style.css
  js/main.js          chrome, reveals, counters, terminal
  img/rahul.jpg
tools/
  build.py            regenerates the pages from the shared template
  pages.py            per-page copy
```

## Editing

Copy lives in `tools/pages.py`; shared chrome (head, top bar, menu, act nav,
footer) lives in the `TEMPLATE` inside `tools/build.py`. After editing either:

```bash
python3 tools/build.py
```

That rewrites the six pages, `404.html` and `sitemap.xml`. The generator is a
convenience, not a build step — GitHub Pages serves the committed HTML directly
and never runs Python.

Preview locally with any static server:

```bash
python3 -m http.server 4321
```

## The terminal

The home page carries a working shell. Commands are deterministic and
hand-written — `help`, `whoami`, `stack`, `projects`, `experience`, `contact`,
`ls`, `open <target>`, `clear`. Arrow keys walk history, Tab completes.

It is deliberately not a chatbot. It never pretends to think, because a fake
thinking indicator is what makes these things feel cheap.

## Design notes

The visual system follows two references, both dark technical products:

- **Surfaces** use a four-step progression (`#08090a → #0f1011 → #161718 →
  #23252a`). Elevation comes from hairline borders and contrast, never from
  drop shadows or glows.
- **Type authority comes from size and tracking, not weight.** Display weight is
  capped at 500 with negative tracking that scales with size. Nothing is bold.
- **Colour is rationed.** Red is the brand accent and marks interface emphasis.
  Cyan, violet and green appear only inside the architecture diagrams, where
  they mean *live request path*, *forked shadow path* and *verified*. A request
  path can never be mistaken for a button.
- **UI motion runs at 0.17s** on a `cubic-bezier(.4,0,.2,1)` curve — the feel of
  a CLI tool. Longer easing is reserved for the page transition and scroll
  reveals.

## Accessibility & resilience

- `prefers-reduced-motion` is honoured throughout: the page transition, reveals,
  terminal typing and portrait parallax all resolve to their end state.
- The page-transition curtain defaults to *out of the way* and is animated in,
  so a throttled background tab or a JavaScript failure can never leave a
  visitor staring at a blank overlay.
- Internal links prefetch on hover, so the next page is usually cached before
  the transition finishes.
- Every external link was verified to resolve before shipping. `shadowdb` has
  no public repository and is labelled as such rather than linking to a 404.

## Licence

Content and imagery © Rahul Reddy Chidipudi.
