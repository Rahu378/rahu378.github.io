#!/usr/bin/env python3
"""Generate the site's HTML pages from one shared template.

The published site is plain static HTML with no runtime dependencies —
GitHub Pages never runs this script. Its only job is to stop six pages of
shared chrome (head, top bar, menu, act nav, footer) from drifting apart.

    python3 tools/build.py

Edit copy in tools/pages.py, chrome in the TEMPLATE below, then re-run.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pages import PAGES  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VER = "1"

# Applied only on the home page, where the portrait lives.
SVG_FILTERS = """
<svg class="filter-lab" aria-hidden="true" focusable="false">
  <defs>
    <filter id="inkPortrait" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" in="SourceGraphic" result="lum"
        values="0.30 0.59 0.11 0 0
                0.30 0.59 0.11 0 0
                0.30 0.59 0.11 0 0
                0    0    0    1 0" />

      <!-- Soften before quantising: posterizing a smooth gradient straight off
           the sensor speckles the forehead and cheek into islands. Edge
           detection below still runs off the sharp luma. -->
      <feGaussianBlur in="lum" stdDeviation="1.6" result="lumSoft" />

      <feComponentTransfer in="lumSoft" result="crushed">
        <feFuncR type="linear" slope="1.14" intercept="-0.06" />
        <feFuncG type="linear" slope="1.14" intercept="-0.06" />
        <feFuncB type="linear" slope="1.14" intercept="-0.06" />
      </feComponentTransfer>

      <feComponentTransfer in="crushed" result="posterized">
        <feFuncR type="discrete" tableValues="0 0.125 0.25 0.375 0.5 0.625 0.75 0.875 1" />
        <feFuncG type="discrete" tableValues="0 0.125 0.25 0.375 0.5 0.625 0.75 0.875 1" />
        <feFuncB type="discrete" tableValues="0 0.125 0.25 0.375 0.5 0.625 0.75 0.875 1" />
      </feComponentTransfer>

      <!-- Warm duotone: ink -> oxblood -> rust -> warm bone, so the portrait
           sits in the same family as the red accent instead of reading as a
           cold studio shot. Top stop is warm bone, not white, so neither the
           lit forehead nor the grey backdrop clips. -->
      <feComponentTransfer in="posterized" result="duotone">
        <feFuncR type="table" tableValues="0.039 0.110 0.208 0.333 0.490 0.659 0.804 0.925" />
        <feFuncG type="table" tableValues="0.039 0.071 0.098 0.137 0.208 0.329 0.541 0.851" />
        <feFuncB type="table" tableValues="0.055 0.086 0.110 0.122 0.153 0.200 0.369 0.753" />
      </feComponentTransfer>

      <feConvolveMatrix in="lum" result="edgeRaw" order="3" preserveAlpha="true"
        kernelMatrix="-1 -1 -1  -1  8 -1  -1 -1 -1" divisor="1" bias="0" />
      <feColorMatrix in="edgeRaw" type="matrix" result="edgeLuma"
        values="0.33 0.33 0.33 0 0
                0.33 0.33 0.33 0 0
                0.33 0.33 0.33 0 0
                0    0    0    1 0" />
      <!-- White where flat, darkening on strong edges: the multiply below keys
           off RGB, so white must be the no-op. -->
      <feComponentTransfer in="edgeLuma" result="inkLines">
        <feFuncR type="table" tableValues="1 0.92 0.58 0.18 0" />
        <feFuncG type="table" tableValues="1 0.92 0.58 0.18 0" />
        <feFuncB type="table" tableValues="1 0.92 0.58 0.18 0" />
      </feComponentTransfer>
      <feGaussianBlur in="inkLines" stdDeviation="0.4" result="inkSoft" />
      <feBlend in="duotone" in2="inkSoft" mode="multiply" result="inked" />
      <feComposite in="inked" in2="SourceGraphic" operator="in" />
    </filter>

    <filter id="inkPlate" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" in="SourceGraphic" result="lum"
        values="0.30 0.59 0.11 0 0
                0.30 0.59 0.11 0 0
                0.30 0.59 0.11 0 0
                0    0    0    1 0" />
      <feConvolveMatrix in="lum" result="e" order="3" preserveAlpha="true"
        kernelMatrix="0 -1 0  -1 4 -1  0 -1 0" divisor="1" />
      <feComponentTransfer in="e">
        <feFuncA type="discrete" tableValues="0 0 0 0.85 1" />
      </feComponentTransfer>
    </filter>
  </defs>
</svg>
"""

TEMPLATE = """<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<meta name="theme-color" content="#07080a" />
<meta name="color-scheme" content="dark" />
<link rel="canonical" href="{canonical}" />

<meta property="og:type" content="website" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{desc}" />
<meta property="og:url" content="{canonical}" />
<meta property="og:image" content="https://rahu378.github.io/assets/img/rahul.jpg" />
<meta name="twitter:card" content="summary_large_image" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" />
<link rel="stylesheet" href="/assets/css/style.css?v={ver}" />
{preload_img}<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%2307080a'/><text y='70' x='50' text-anchor='middle' font-size='58' font-family='monospace' font-weight='700' fill='%23e8232f'>R</text></svg>" />
</head>
<body data-page="{page_id}">
{svg_filters}
<div class="wipe" id="wipe" aria-hidden="true"></div>
<div class="grid-bg" aria-hidden="true"></div>
<div class="noise" aria-hidden="true"></div>

<a class="skip" href="#main">Skip to content</a>

<header class="topbar">
  <a class="brand" href="/">
    <span class="brand__dot" aria-hidden="true"></span>
    <span class="brand__txt">rahul<span>.dev</span></span>
  </a>

  <nav class="nav" aria-label="Sections">
{nav_items}  </nav>

  <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu">
    <span></span><span></span>
  </button>
</header>

<nav class="menu" id="menu" aria-hidden="true">
  <div class="menu__bg" aria-hidden="true"></div>
  <ul class="menu__list">
{menu_items}  </ul>
  <div class="menu__foot">
    <a href="mailto:rahul.r24.c@gmail.com">rahul.r24.c@gmail.com</a>
    <a href="https://github.com/Rahu378" target="_blank" rel="noopener noreferrer">github.com/Rahu378</a>
    <a href="https://www.linkedin.com/in/rahulchidipudi/" target="_blank" rel="noopener noreferrer">in/rahulchidipudi</a>
    <span>McLean, VA</span>
  </div>
</nav>

<main id="main">
{body}
{actnav}</main>

<footer class="foot">
  <span>&copy; <span id="yr">2026</span> Rahul Reddy Chidipudi</span>
  <a href="/">Back to home &uarr;</a>
</footer>

<script src="/assets/js/main.js?v={ver}" defer></script>
</body>
</html>
"""

ACTNAV_LINK = """  <a class="actnav__side actnav__side--{dir}" href="{href}">
    <span class="actnav__dir">{label}</span>
    <span class="actnav__n">{num}</span>
    <span class="actnav__t">{nav}</span>
  </a>
"""

ACTNAV_END = """  <div class="actnav__side actnav__side--{dir} actnav__side--end">
    <span class="actnav__dir">{label}</span>
    <span class="actnav__t">{txt}</span>
  </div>
"""


def href_for(slug):
    return "/" if slug == "" else "/%s/" % slug


def canonical_for(slug):
    return "https://rahu378.github.io" + href_for(slug)


def build_nav(current):
    out = []
    for p in PAGES:
        if p["slug"] == "":
            continue
        cur = ' aria-current="page"' if p["slug"] == current else ""
        cls = ' class="nav__cta"' if p["slug"] == "contact" else ""
        out.append('    <a href="%s"%s%s>%s</a>\n'
                   % (href_for(p["slug"]), cls, cur, p["nav"].title()))
    return "".join(out)


def build_menu(current):
    out = []
    for p in PAGES:
        cur = ' aria-current="page"' if p["slug"] == current else ""
        out.append('    <li><a href="%s" data-i="%s"%s><span>%s</span></a></li>\n'
                   % (href_for(p["slug"]), p["num"], cur, p["nav"]))
    return "".join(out)


def build_actnav(i):
    prev_html = ""
    next_html = ""
    if i > 0:
        p = PAGES[i - 1]
        prev_html = ACTNAV_LINK.format(dir="prev", href=href_for(p["slug"]),
                                       label="&larr; PREVIOUS", num=p["num"], nav=p["nav"])
    else:
        prev_html = ACTNAV_END.format(dir="prev", label="START", txt="HOME")

    if i < len(PAGES) - 1:
        p = PAGES[i + 1]
        next_html = ACTNAV_LINK.format(dir="next", href=href_for(p["slug"]),
                                       label="NEXT &rarr;", num=p["num"], nav=p["nav"])
    else:
        next_html = ACTNAV_END.format(dir="next", label="THE END", txt="FIN.")

    return '<nav class="actnav" aria-label="Page navigation">\n%s%s</nav>\n' % (prev_html, next_html)


def main():
    written = []
    for i, p in enumerate(PAGES):
        slug = p["slug"]
        html = TEMPLATE.format(
            title=p["title"], desc=p["desc"], canonical=canonical_for(slug), ver=VER,
            page_id=slug or "home",
            svg_filters=SVG_FILTERS if p.get("portrait") else "",
            preload_img=('<link rel="preload" as="image" href="/assets/img/rahul.jpg" />\n'
                         if p.get("portrait") else ""),
            nav_items=build_nav(slug),
            menu_items=build_menu(slug),
            body=p["body"],
            actnav=build_actnav(i),
        )
        if slug == "":
            path = os.path.join(ROOT, "index.html")
        else:
            os.makedirs(os.path.join(ROOT, slug), exist_ok=True)
            path = os.path.join(ROOT, slug, "index.html")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(html)
        written.append(os.path.relpath(path, ROOT))

    notfound = TEMPLATE.format(
        title="Not found — Rahul Reddy Chidipudi", desc="That page does not exist.",
        canonical="https://rahu378.github.io/404.html", ver=VER, page_id="notfound",
        svg_filters="", preload_img="",
        nav_items=build_nav(None), menu_items=build_menu(None),
        body=('<section class="sec notfound">\n'
              '  <header class="sec__head">\n'
              '    <span class="sec__tag">404</span>\n'
              '    <h2 class="sec__title">No route to host.</h2>\n'
              '    <p class="sec__sub">That page isn\'t here. Head back and pick another way in.</p>\n'
              '  </header>\n'
              '  <a class="cta" href="/"><span class="cta__disc">'
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l10 7-10 7z"/></svg>'
              '</span><span class="cta__txt">BACK TO HOME</span></a>\n'
              '</section>\n'),
        actnav="",
    )
    with open(os.path.join(ROOT, "404.html"), "w", encoding="utf-8") as fh:
        fh.write(notfound)
    written.append("404.html")

    urls = "\n".join("  <url><loc>%s</loc></url>" % canonical_for(p["slug"]) for p in PAGES)
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as fh:
        fh.write('<?xml version="1.0" encoding="UTF-8"?>\n'
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n%s\n</urlset>\n' % urls)
    written.append("sitemap.xml")

    with open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8") as fh:
        fh.write("User-agent: *\nAllow: /\n\nSitemap: https://rahu378.github.io/sitemap.xml\n")
    written.append("robots.txt")

    print("wrote %d files:" % len(written))
    for w in written:
        print("  " + w)


if __name__ == "__main__":
    main()
