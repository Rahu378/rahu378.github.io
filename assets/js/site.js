/* Shared behaviour: navigation, reveals, counters and scroll-linked progress. Page scripts use window.Site. */
(() => {
  const doc = document;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const fmt = (n, dec = 0) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  /* ---------- Navigation ---------- */
  const nav = doc.querySelector('.nav');
  const toggle = nav && nav.querySelector('.nav-toggle');
  const menu = nav && nav.querySelector('.nav-menu');
  if (toggle && menu) {
    const set = open => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      doc.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => set(!nav.classList.contains('open')));
    menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); toggle.focus(); }
    });
    matchMedia('(min-width: 821px)').addEventListener('change', e => { if (e.matches) set(false); });
    menu.querySelectorAll('a').forEach((a, i) => a.style.setProperty('--i', i));
  }

  // The bar takes the tone of whichever section sits underneath it.
  const toned = [...doc.querySelectorAll('[data-tone]')].filter(el => el !== nav && el !== doc.body);
  const baseTone = doc.body.dataset.tone || 'light';
  function setTone() {
    if (!nav) return;
    let tone = baseTone;
    for (const el of toned) {
      const r = el.getBoundingClientRect();
      if (r.top <= 26 && r.bottom > 26) tone = el.dataset.tone;
    }
    if (nav.dataset.tone !== tone) nav.dataset.tone = tone;
  }

  /* ---------- Reveals ---------- */
  doc.querySelectorAll('[data-stagger]').forEach(group => {
    group.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--i', i));
  });
  const revealer = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      revealer.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
  doc.querySelectorAll('.reveal').forEach(el => revealer.observe(el));

  /* ---------- Counters ---------- */
  function count(el) {
    const to = parseFloat(el.dataset.count);
    const from = parseFloat(el.dataset.from || 0);
    const dec = +(el.dataset.dec || 0);
    const pre = el.dataset.pre || '';
    const suf = el.dataset.suf || '';
    const dur = +(el.dataset.dur || 1700);
    const paint = v => { el.textContent = pre + fmt(v, dec) + suf; };
    if (reduce) { paint(to); return; }
    const t0 = performance.now();
    const step = now => {
      const t = clamp((now - t0) / dur);
      paint(t === 1 ? to : from + (to - from) * (1 - Math.pow(2, -10 * t)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const counter = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      count(e.target);
      counter.unobserve(e.target);
    }
  }, { threshold: 0.6 });
  doc.querySelectorAll('[data-count]').forEach(el => {
    if (!reduce) el.textContent = (el.dataset.pre || '') + fmt(parseFloat(el.dataset.from || 0), +(el.dataset.dec || 0)) + (el.dataset.suf || '');
    counter.observe(el);
  });

  /* ---------- Scroll-linked progress ----------
     'view': 0 when the element's top enters at the bottom of the screen, 1 when its bottom leaves at the top.
     'pin':  0 when a tall wrapper's top reaches the top of the screen, 1 when its bottom reaches the bottom
             (use with a position: sticky child). */
  const scrubs = [];
  let queued = false;
  function queue() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  function frame() {
    queued = false;
    const vh = innerHeight;
    for (const s of scrubs) {
      const r = s.el.getBoundingClientRect();
      const p = clamp(s.mode === 'pin' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height));
      if (Math.abs(p - s.last) > 0.0004) { s.last = p; s.fn(p, r); }
    }
    setTone();
  }
  function scrub(el, fn, mode = 'view') { scrubs.push({ el, fn, mode, last: -1 }); queue(); }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);

  /* ---------- Statements that light up word by word ---------- */
  doc.querySelectorAll('[data-words]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(w => {
      const s = doc.createElement('span');
      s.className = 'w';
      s.textContent = w;
      el.append(s, ' ');
    });
    const spans = [...el.querySelectorAll('.w')];
    if (reduce) { spans.forEach(s => s.classList.add('on')); return; }
    let lit = -1;
    scrub(el, p => {
      const n = Math.round(clamp((p - 0.16) / 0.42) * spans.length);
      if (n === lit) return;
      lit = n;
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    });
  });

  /* ---------- Helpers for page scripts ---------- */
  function whenVisible(el, on, off, margin = '160px') {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) on(); else if (off) off(); }, { rootMargin: margin });
    o.observe(el);
    return o;
  }

  function canvas(c, onResize) {
    const ctx = c.getContext('2d');
    const box = { ctx, w: 0, h: 0, dpr: 1 };
    const fit = notify => {
      const r = c.getBoundingClientRect();
      box.dpr = Math.min(2, devicePixelRatio || 1);
      box.w = Math.max(1, r.width);
      box.h = Math.max(1, r.height);
      c.width = Math.round(box.w * box.dpr);
      c.height = Math.round(box.h * box.dpr);
      ctx.setTransform(box.dpr, 0, 0, box.dpr, 0, 0);
      if (notify && onResize) onResize(box);
    };
    // Size now without notifying (the caller has not stored the box yet); the observer's first call notifies.
    fit(false);
    new ResizeObserver(() => fit(true)).observe(c);
    return box;
  }

  function loop(fn) {
    let id = 0, last = 0, running = false;
    const tick = t => {
      if (!running) return;
      const dt = Math.min(64, last ? t - last : 16);
      last = t;
      if (!doc.hidden) fn(dt, t);
      id = requestAnimationFrame(tick);
    };
    return {
      start() { if (running) return; running = true; last = 0; id = requestAnimationFrame(tick); },
      stop() { running = false; cancelAnimationFrame(id); },
      get running() { return running; }
    };
  }

  doc.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  requestAnimationFrame(() => requestAnimationFrame(() => doc.body.classList.add('ready')));

  window.Site = { reduce, clamp, lerp, ease, fmt, scrub, whenVisible, canvas, loop, count };
})();
