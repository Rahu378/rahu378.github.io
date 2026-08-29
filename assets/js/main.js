/* ═══════════════════════════════════════════════════════════════
   RAHUL REDDY CHIDIPUDI — interaction layer

   No framework, no animation library, no smooth-scroll hijacking.
   Scrolling is the browser's own, which is why it feels instant.
   Everything here is IntersectionObserver + CSS class toggles.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── page-in wipe ─────────────────────────────────────────────
     The curtain starts covering the page (CSS) and lifts on load.
     Kept short on purpose — a long intro just reads as a slow site. */
  var wipe = $('#wipe');
  function lift() {
    if (wipe) wipe.classList.remove('down');
    // releases the hero headline, which CSS holds below its mask until now
    document.body.classList.add('ready');
  }
  if (REDUCED && wipe) wipe.style.display = 'none';
  lift();
  addEventListener('pageshow', function (e) { if (e.persisted) lift(); });

  /* ── page-out wipe + hover prefetch ───────────────────────────
     Prefetch on hover so the next page is usually already cached by
     the time the curtain finishes falling. */
  var prefetched = {};
  function prefetch(url) {
    if (prefetched[url]) return;
    prefetched[url] = 1;
    var l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = url;
    document.head.appendChild(l);
  }

  function isInternal(a) {
    return a && a.host === location.host && a.protocol === location.protocol &&
           !a.hasAttribute('download') && a.target !== '_blank';
  }

  document.addEventListener('mouseover', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (isInternal(a) && a.pathname !== location.pathname) prefetch(a.href);
  }, { passive: true });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a');
    if (!isInternal(a)) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto|tel):/i.test(href)) return;
    if (a.pathname === location.pathname) return;
    if (REDUCED || !wipe) return;

    e.preventDefault();
    wipe.classList.add('down');
    var go = function () { location.href = a.href; };
    // navigate when the curtain lands, with a timer as the backstop
    var done = false;
    var fire = function () { if (!done) { done = true; go(); } };
    wipe.addEventListener('transitionend', fire, { once: true });
    setTimeout(fire, 420);
  });

  /* ── menu ─────────────────────────────────────────────────── */
  (function menu() {
    var burger = $('#burger');
    var nav    = $('#menu');
    if (!burger || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('open', open);
      nav.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('is-locked', open);
    }
    burger.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
    });
  })();

  /* ── sticky top bar ───────────────────────────────────────── */
  (function stickybar() {
    var bar = $('.topbar');
    if (!bar) return;
    var ticking = false;
    function update() { bar.classList.toggle('stuck', scrollY > 40); ticking = false; }
    addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ── reveals ──────────────────────────────────────────────────
     One observer for the whole page. CSS owns the transition; this
     only adds the class and then stops watching the element. */
  (function reveals() {
    var items = $$('.reveal, .sec__head');
    if (REDUCED || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ── counters ─────────────────────────────────────────────── */
  (function counters() {
    var els = $$('.count');
    if (!els.length) return;

    function run(el) {
      var to     = parseFloat(el.dataset.to || '0');
      var suffix = el.dataset.suffix || '';
      if (REDUCED) { el.textContent = to + suffix; return; }
      var dur = 1100, t0 = 0;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        run(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ── diagrams ─────────────────────────────────────────────────
     Nodes settle in, then the connectors start flowing, so the
     architecture reads left-to-right the first time you see it. */
  (function diagrams() {
    var ds = $$('.diagram');
    if (!ds.length) return;
    if (REDUCED || !('IntersectionObserver' in window)) {
      ds.forEach(function (d) { d.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var d = en.target;
        $$('.node, .cluster', d).forEach(function (n, i) {
          n.style.transitionDelay = (i * 55) + 'ms';
        });
        d.classList.add('in');
        io.unobserve(d);
      });
    }, { threshold: 0.15 });
    ds.forEach(function (d) { io.observe(d); });
  })();

  /* ── hero portrait: cursor parallax ───────────────────────── */
  (function portrait() {
    var stage = $('#portraitStage');
    if (!stage || REDUCED || matchMedia('(pointer: coarse)').matches) return;

    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    function loop() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      stage.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) raf = requestAnimationFrame(loop);
      else raf = 0;
    }
    addEventListener('mousemove', function (e) {
      tx = ((e.clientX / innerWidth) - 0.5) * -30;
      ty = ((e.clientY / innerHeight) - 0.5) * -20;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  })();

  /* ── in-page anchors (skip link) ──────────────────────────── */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = $(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════
   TERMINAL — a real shell, not a chatbot.

   Every command is deterministic and hand-written. It never pretends
   to think, because a fake thinking indicator is exactly what makes
   these things feel cheap.
   ═══════════════════════════════════════════════════════════════ */
(function terminal() {
  'use strict';

  var term  = document.getElementById('term');
  if (!term) return;

  var body  = document.getElementById('termBody');
  var form  = document.getElementById('termForm');
  var input = document.getElementById('termInput');
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var history = [];
  var hIndex  = -1;
  var busy    = false;

  function line(text, cls) {
    var el = document.createElement('div');
    el.className = 'tline' + (cls ? ' ' + cls : '');
    el.innerHTML = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function type(text, cls, speed) {
    return new Promise(function (resolve) {
      if (REDUCED) { line(text, cls); resolve(); return; }
      var el = line('', cls);
      var i = 0;
      var step = function () {
        el.textContent = text.slice(0, ++i);
        body.scrollTop = body.scrollHeight;
        if (i < text.length) setTimeout(step, speed || 12);
        else resolve();
      };
      step();
    });
  }

  function pause(ms) {
    return new Promise(function (r) { setTimeout(r, REDUCED ? 0 : ms); });
  }

  var PAGES = {
    projects: '/projects/', systems: '/projects/', work: '/work/',
    experience: '/work/', skills: '/skills/', stack: '/skills/',
    about: '/about/', contact: '/contact/', home: '/'
  };

  /* Only URLs that were verified to resolve. shadowdb has no public repo,
     so it is handled explicitly rather than 404-ing the visitor. */
  var REPOS = {
    finsight: 'https://github.com/Rahu378/finsight-agent',
    text2workflow: 'https://rahu378.github.io/text2workflow/',
    graph: 'https://github.com/Rahu378/distributed-graph-analysis'
  };
  var PRIVATE = { shadowdb: 1 };

  var COMMANDS = {
    help: function () {
      return [
        ['whoami',      'who you are talking to'],
        ['stack',       'languages, infra and tooling'],
        ['projects',    'the four systems, with repo links'],
        ['experience',  'where I have shipped'],
        ['contact',     'how to reach me'],
        ['open <name>', 'jump to a page or repo'],
        ['clear',       'wipe the screen']
      ].map(function (r) {
        return '<span class="tc">' + r[0] + '</span>'
             + '<span class="td">' + r[1] + '</span>';
      }).map(function (h) { return '<div class="trow">' + h + '</div>'; }).join('');
    },
    whoami: function () {
      return '<div class="trow"><span class="tc">name</span><span class="td">Rahul Reddy Chidipudi</span></div>'
           + '<div class="trow"><span class="tc">role</span><span class="td">Software Engineer &mdash; backend &amp; distributed systems</span></div>'
           + '<div class="trow"><span class="tc">where</span><span class="td">McLean, Virginia</span></div>'
           + '<div class="trow"><span class="tc">now</span><span class="td">NextGen IT Solutions</span></div>';
    },
    stack: function () {
      return '<div class="trow"><span class="tc">languages</span><span class="td">Go &middot; Java &middot; Python &middot; C++ &middot; JavaScript &middot; TypeScript &middot; SQL</span></div>'
           + '<div class="trow"><span class="tc">services</span><span class="td">gRPC &middot; FastAPI &middot; Spring Boot &middot; Django</span></div>'
           + '<div class="trow"><span class="tc">infra</span><span class="td">Kubernetes &middot; Docker &middot; Terraform &middot; AWS &middot; GCP</span></div>'
           + '<div class="trow"><span class="tc">data</span><span class="td">Kafka &middot; PostgreSQL &middot; Spark &middot; Redis &middot; MongoDB</span></div>'
           + '<div class="trow"><span class="tc">ai</span><span class="td">LangGraph &middot; PyTorch &middot; Bedrock &middot; RAG</span></div>'
           + '<div class="tnote">full list &rarr; <a href="/skills/">/skills</a></div>';
    },
    projects: function () {
      return '<div class="trow"><span class="tc">shadowdb</span><span class="td">traffic-forking proxy &middot; 50K+ rps at 3ms overhead</span></div>'
           + '<div class="trow"><span class="tc">finsight</span><span class="td">AML/OFAC agent &middot; 94% precision</span></div>'
           + '<div class="trow"><span class="tc">text2workflow</span><span class="td">plain English &rarr; validated swimlanes <a href="https://rahu378.github.io/text2workflow/" target="_blank" rel="noopener noreferrer">live &nearr;</a></span></div>'
           + '<div class="trow"><span class="tc">graph</span><span class="td">PageRank on Spark &middot; linear scalability</span></div>'
           + '<div class="tnote">diagrams &rarr; <a href="/projects/">/projects</a> &middot; try <span class="tc">open shadowdb</span></div>';
    },
    experience: function () {
      return '<div class="trow"><span class="tc">2026&ndash;now</span><span class="td">Software Engineer &middot; NextGen IT Solutions</span></div>'
           + '<div class="trow"><span class="tc">2025&ndash;26</span><span class="td">Associate Software Engineer &middot; Appworks</span></div>'
           + '<div class="trow"><span class="tc">2022</span><span class="td">Software Developer Intern &middot; DXC Technology</span></div>'
           + '<div class="tnote">detail &rarr; <a href="/work/">/work</a></div>';
    },
    contact: function () {
      return '<div class="trow"><span class="tc">email</span><span class="td"><a href="mailto:rahul.r24.c@gmail.com">rahul.r24.c@gmail.com</a></span></div>'
           + '<div class="trow"><span class="tc">github</span><span class="td"><a href="https://github.com/Rahu378" target="_blank" rel="noopener noreferrer">github.com/Rahu378</a></span></div>'
           + '<div class="trow"><span class="tc">linkedin</span><span class="td"><a href="https://www.linkedin.com/in/rahulchidipudi/" target="_blank" rel="noopener noreferrer">in/rahulchidipudi</a></span></div>';
    },
    ls: function () {
      return '<div class="tls">'
           + ['projects/','work/','skills/','about/','contact/']
               .map(function (d) { return '<span>' + d + '</span>'; }).join('')
           + '</div>';
    },
    sudo: function () { return '<span class="terr">nice try.</span>'; },
    clear: function () { body.innerHTML = ''; return null; }
  };

  function resolveOpen(arg) {
    if (!arg) return '<span class="terr">open what? try: open projects</span>';
    var key = arg.toLowerCase().replace(/^\/+|\/+$/g, '');
    if (PRIVATE[key]) {
      return '<span class="terr">' + esc(key) + ' is not public yet.</span> '
           + 'the architecture is on <a href="/projects/">/projects</a>.';
    }
    if (REPOS[key]) {
      window.open(REPOS[key], '_blank', 'noopener');
      return 'opening <span class="tc">' + key + '</span>&hellip;';
    }
    if (PAGES[key]) {
      setTimeout(function () { location.href = PAGES[key]; }, 380);
      return 'navigating to <span class="tc">' + PAGES[key] + '</span>&hellip;';
    }
    return '<span class="terr">no such target: ' + esc(arg) + '</span>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function run(raw) {
    var cmd = raw.trim();
    if (!cmd) return;
    history.push(cmd);
    hIndex = history.length;

    line('<span class="tp">&rsaquo;</span> ' + esc(cmd), 'techo');

    var parts = cmd.split(/\s+/);
    var name  = parts[0].toLowerCase();
    var arg   = parts.slice(1).join(' ');

    var out;
    if (name === 'open') out = resolveOpen(arg);
    else if (COMMANDS[name]) out = COMMANDS[name]();
    else if (PAGES[name]) out = resolveOpen(name);
    else out = '<span class="terr">command not found: ' + esc(name)
             + '</span> &mdash; try <span class="tc">help</span>';

    if (out) line(out, 'tout');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    run(input.value);
    input.value = '';
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hIndex > 0) input.value = history[--hIndex] || '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIndex < history.length - 1) input.value = history[++hIndex] || '';
      else { hIndex = history.length; input.value = ''; }
    } else if (e.key === 'Tab') {
      var v = input.value.trim().toLowerCase();
      if (!v) return;
      var all = Object.keys(COMMANDS).concat(['open']);
      var hit = all.filter(function (c) { return c.indexOf(v) === 0; })[0];
      if (hit) { e.preventDefault(); input.value = hit; }
    }
  });

  Array.prototype.forEach.call(term.querySelectorAll('.term__hints button'), function (b) {
    b.addEventListener('click', function () {
      if (busy) return;
      run(b.dataset.cmd);
      input.focus();
    });
  });

  // clicking anywhere in the shell focuses the prompt, like a real one
  term.addEventListener('click', function (e) {
    if (e.target.closest('a') || e.target.closest('button')) return;
    input.focus();
  });

  /* boot sequence — short, and it never blocks typing */
  (function boot() {
    busy = true;
    var seq = [
      ['$ whoami', 'techo'],
      ['Rahul Reddy Chidipudi — Software Engineer', 'tout'],
      ['$ uptime', 'techo'],
      ['3 roles · 4 systems · McLean, VA', 'tout']
    ];
    var i = 0;
    (function next() {
      if (i >= seq.length) {
        busy = false;
        line('<span class="tnote">type <span class="tc">help</span> to see what this thing does.</span>', 'tout');
        return;
      }
      var s = seq[i++];
      type(s[0], s[1], s[1] === 'techo' ? 26 : 10).then(function () {
        return pause(s[1] === 'techo' ? 160 : 320);
      }).then(next);
    })();
  })();

  // don't steal focus on load; only once the user reaches for it
  input.addEventListener('focus', function () { term.classList.add('focused'); });
  input.addEventListener('blur',  function () { term.classList.remove('focused'); });
})();
