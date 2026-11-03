/* Projects: six small working models. The canvas ones run only while on screen and can be paused;
   with reduced motion they start paused. Every figure shown is simulated around the real builds' numbers. */
(() => {
  const { reduce, clamp, lerp, ease, whenVisible, canvas, loop } = window.Site;

  const h = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];
  const shuffle = a => {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  };
  const gauss = () => {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  const money = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const accent = root => getComputedStyle(root).getPropertyValue('--c').trim() || '#2997ff';
  const rgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  };
  const luma = hex => {
    const n = parseInt(hex.slice(1), 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  };
  const font = (size, weight = 500) => `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  const key = (root, k) => root.querySelector(`[data-k="${k}"]`);
  const once = (el, fn) => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { o.disconnect(); fn(); } }, { threshold: 0.3 });
    o.observe(el);
  };
  function text(ctx, s, x, y, { size = 12, weight = 500, color = '#a1a1a6', align = 'center', base = 'alphabetic' } = {}) {
    ctx.font = font(size, weight);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = base;
    ctx.fillText(s, x, y);
  }

  // A canvas model that animates while visible, with an optional Play/Pause button.
  function animated(root, cv, step, draw) {
    let paused = reduce, visible = false;
    const run = loop(dt => { step(dt); draw(box); });
    const box = canvas(cv, () => { if (!run.running) draw(box); });
    const btn = root.querySelector('.dplay');
    const sync = () => {
      if (visible && !paused) run.start(); else run.stop();
      if (btn) btn.textContent = paused ? 'Play' : 'Pause';
    };
    if (btn) {
      btn.removeAttribute('aria-pressed');
      btn.addEventListener('click', () => { paused = !paused; sync(); });
    }
    whenVisible(cv, () => { visible = true; sync(); }, () => { visible = false; sync(); }, '0px');
    sync();
    return { redraw: () => { if (!run.running) draw(box); } };
  }

  /* ---------- ShadowDB: a proxy mirroring traffic to a shadow, with a latency chart ---------- */
  function shadowdb(root) {
    const C = accent(root);
    const QUERIES = [
      'SELECT * FROM orders WHERE customer_id = ?',
      'UPDATE inventory SET qty = qty - ? WHERE sku = ?',
      'SELECT … FROM payments JOIN ledger USING (txn_id)',
      'INSERT INTO events (type, payload) VALUES (?, ?)',
      'SELECT * FROM sessions WHERE token = ?',
      'DELETE FROM carts WHERE updated_at < ?'
    ];
    const st = { migrated: false, killed: false, packets: [], spawn: 0, sample: 0, over: 0, regs: 0, affected: [], prim: [], shad: [], clock: 0 };
    for (let i = 0; i < 90; i++) { const b = 12 + gauss(); st.prim.push(b); st.shad.push(b + 0.4 + gauss() * 0.8); }
    const logEl = root.querySelector('.sd-log');

    function flag(gap) {
      const q = st.affected.shift();
      if (!q) return;
      st.regs++;
      key(root, 'reg').textContent = st.regs;
      const li = h('li');
      li.append(h('b', '', `Regression: +${Math.round(gap)} ms on the shadow`), h('span', '', q));
      logEl.prepend(li);
      while (logEl.children.length > 3) logEl.lastElementChild.remove();
    }
    function stats() {
      key(root, 'tput').textContent = `${(50 + Math.random() * 1.4).toFixed(1)}K`;
      key(root, 'add').textContent = `${(2.8 + Math.random() * 0.4).toFixed(1)} ms`;
      key(root, 'mirror').textContent = st.killed ? '0%' : '100%';
    }

    function step(dt) {
      st.spawn += dt;
      while (st.spawn > 85) { st.spawn -= 85; st.packets.push({ leg: 0, t: 0 }); }
      for (let i = st.packets.length - 1; i >= 0; i--) {
        const p = st.packets[i];
        p.t += dt / (p.leg === 'm' ? 640 : 520);
        if (p.t < 1) continue;
        if (p.leg === 0) { p.leg = 1; p.t = 0; st.packets.push({ leg: 'm', t: 0, dead: st.killed }); }
        else if (p.leg === 1) { p.leg = 2; p.t = 0; }
        else if (p.leg === 2) { p.leg = 3; p.t = 0; }
        else st.packets.splice(i, 1);
      }
      st.sample += dt;
      while (st.sample > 140) {
        st.sample -= 140;
        const b = 12 + gauss();
        const s = st.killed ? null : b + 0.4 + gauss() * 0.8 + (st.migrated ? 10 + Math.abs(gauss()) * 7 : 0);
        st.prim.push(b);
        st.shad.push(s);
        if (st.prim.length > 90) { st.prim.shift(); st.shad.shift(); }
        if (s !== null && s - b > 6) st.over++; else st.over = 0;
        if (st.over >= 5) { st.over = 0; flag(s - b); }
      }
      st.clock += dt;
      if (st.clock > 700) { st.clock = 0; stats(); }
    }

    function node(ctx, [x, y], r, fill, stroke, label) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) { ctx.setLineDash([4, 4]); ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]); }
      text(ctx, label, x, y + r + 18, { size: 12.5 });
    }

    function draw({ ctx, w, h: H }) {
      ctx.clearRect(0, 0, w, H);
      const dh = H * 0.54;
      const P = { app: [w * 0.1, dh * 0.5], proxy: [w * 0.43, dh * 0.5], prim: [w * 0.84, dh * 0.24], shad: [w * 0.84, dh * 0.78] };
      const seg = (a, b) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#2c2c2e';
      seg(P.app, P.proxy);
      seg(P.proxy, P.prim);
      ctx.setLineDash([5, 6]);
      ctx.strokeStyle = st.killed ? 'rgba(255,69,58,.35)' : rgba(C, 0.5);
      seg(P.proxy, P.shad);
      ctx.setLineDash([]);

      for (const p of st.packets) {
        let a, b, col;
        if (p.leg === 0) { a = P.app; b = P.proxy; col = '#f5f5f7'; }
        else if (p.leg === 1) { a = P.proxy; b = P.prim; col = '#f5f5f7'; }
        else if (p.leg === 2) { a = P.prim; b = P.proxy; col = '#30d158'; }
        else if (p.leg === 3) { a = P.proxy; b = P.app; col = '#30d158'; }
        else {
          a = P.proxy; b = P.shad; col = p.dead ? '#ff453a' : C;
          if (p.dead && p.t > 0.6) continue;
        }
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(lerp(a[0], b[0], p.t), lerp(a[1], b[1], p.t), 3.4, 0, Math.PI * 2);
        ctx.fill();
      }

      const r = clamp(w * 0.028, 13, 22);
      node(ctx, P.app, r * 0.85, '#3a3a3c', null, 'App');
      ctx.fillStyle = C;
      ctx.beginPath();
      ctx.roundRect(P.proxy[0] - r, P.proxy[1] - r, r * 2, r * 2, r * 0.45);
      ctx.fill();
      text(ctx, 'Netty proxy', P.proxy[0], P.proxy[1] + r + 18, { size: 12.5, color: '#f5f5f7', weight: 600 });
      node(ctx, P.prim, r, '#f5f5f7', null, 'Primary');
      node(ctx, P.shad, r, st.killed ? '#3a0f0d' : '#0a0a0b', st.killed ? '#ff453a' : C,
        st.killed ? 'Shadow · down' : st.migrated ? 'Shadow · new schema' : 'Shadow');

      // latency chart
      const left = 18, right = w - 18, top = dh + 22, bot = H - 16;
      ctx.fillStyle = '#121214';
      ctx.beginPath();
      ctx.roundRect(left - 8, top - 10, right - left + 16, bot - top + 20, 12);
      ctx.fill();
      text(ctx, 'Query latency, ms', left + 2, top + 8, { size: 12, align: 'left', color: '#a1a1a6' });
      text(ctx, 'primary', right - 74, top + 8, { size: 12, align: 'right', color: '#f5f5f7' });
      text(ctx, 'shadow', right, top + 8, { size: 12, align: 'right', color: C });
      const ymax = 44;
      const y = v => bot - (v / ymax) * (bot - top - 22);
      const plot = (arr, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.beginPath();
        let pen = false;
        arr.forEach((v, i) => {
          const x = left + (i / (arr.length - 1)) * (right - left);
          if (v === null) { pen = false; return; }
          if (pen) ctx.lineTo(x, y(v)); else { ctx.moveTo(x, y(v)); pen = true; }
        });
        ctx.stroke();
      };
      plot(st.prim, 'rgba(245,245,247,.8)');
      plot(st.shad, C);
    }

    const model = animated(root, root.querySelector('canvas'), step, draw);
    root.querySelector('[data-act="migrate"]').addEventListener('click', e => {
      st.migrated = !st.migrated;
      e.currentTarget.setAttribute('aria-pressed', String(st.migrated));
      e.currentTarget.textContent = st.migrated ? 'Roll back the shadow' : 'Apply a migration to the shadow';
      st.affected = st.migrated ? shuffle(QUERIES).slice(0, 3) : [];
      st.over = 0;
      model.redraw();
    });
    root.querySelector('[data-act="kill"]').addEventListener('click', e => {
      st.killed = !st.killed;
      e.currentTarget.setAttribute('aria-pressed', String(st.killed));
      e.currentTarget.textContent = st.killed ? 'Restart the shadow database' : 'Kill the shadow database';
      stats();
      model.redraw();
    });
  }

  /* ---------- API Gateway: a contract suite that finds three race conditions ---------- */
  function gateway(root) {
    const SV = ['accounts', 'payments', 'cards', 'loans', 'fx'];
    const CASES = [
      'accepts a valid request', 'rejects a missing auth header', 'rejects an expired token', 'returns 404 for an unknown id',
      'rejects a negative amount', 'rejects amounts with 3 decimals', 'rejects an unknown currency', 'replays the same idempotency key',
      'maps upstream 503 to 502', 'honours Retry-After on 429', 'matches the response contract', 'pages with a stable cursor',
      'rejects an oversized payload', 'trims whitespace in references', 'times out slow upstreams cleanly', 'returns ISO-8601 timestamps',
      'masks account numbers', 'rejects a closed account', 'rate limits per client', 'propagates the correlation id',
      'rejects a zero amount', 'handles unicode names', 'rejects malformed JSON', 'returns 415 for the wrong content type',
      'keeps decimals exact', 'rejects a future value date', 'handles daylight-saving boundaries', 'rejects duplicate references',
      'returns problem+json errors', 'validates the API version header'
    ];
    const RACES = {
      accounts: 'concurrent debits never overdraw the balance',
      payments: 'a double submit charges exactly once',
      loans: 'parallel repayments update the balance atomically'
    };
    const suite = () => {
      const t = [];
      for (let i = 0; i < CASES.length; i++) SV.forEach((s, j) => t.push({ s, n: CASES[(i + j * 7) % CASES.length] }));
      [['accounts', 41], ['payments', 97], ['loans', 133]].forEach(([s, at]) => t.splice(at, 0, { s, n: RACES[s], race: true }));
      return t;
    };

    const logEl = root.querySelector('.gw-log'), btn = root.querySelector('[data-act="run"]');
    const sum = root.querySelector('.gw-summary'), bar = root.querySelector('.gw-bar i');
    const rows = Object.fromEntries(SV.map(s => [s, root.querySelector(`[data-s="${s}"]`)]));
    let fixed = false, busy = false;

    btn.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      btn.disabled = true;
      logEl.textContent = '';
      sum.className = 'gw-summary';
      sum.textContent = fixed ? 'Re-running with the fixes in place…' : 'Running the suite…';
      const tests = suite();
      const tally = Object.fromEntries(SV.map(s => [s, { done: 0, fail: 0, total: tests.filter(t => t.s === s).length }]));
      SV.forEach(s => { rows[s].className = 'run'; rows[s].querySelector('small').textContent = `0 / ${tally[s].total}`; });
      let done = 0, failed = 0;
      for (const t of tests) {
        await wait(t.race && !fixed ? 280 : 24);
        done++;
        const ok = !t.race || fixed;
        const T = tally[t.s];
        T.done++;
        if (!ok) { failed++; T.fail++; }
        rows[t.s].querySelector('small').textContent = `${T.done} / ${T.total}`;
        if (T.done === T.total) rows[t.s].className = T.fail ? 'fail' : 'ok';
        const line = h('div', `gw-line${ok ? '' : ' fail'}`);
        line.append(h('span', 'mk', ok ? '✓' : '✗'), h('span', 'svc', t.s), h('span', '', ok ? t.n : `${t.n}: race condition`), h('span', 'ms', `${Math.round(rand(4, 38))}ms`));
        logEl.append(line);
        while (logEl.children.length > 16) logEl.firstElementChild.remove();
        const p = done / tests.length;
        bar.style.setProperty('--p', p.toFixed(3));
        key(root, 'done').textContent = done;
        key(root, 'cov').textContent = `${Math.round(92 * ease(p))}%`;
      }
      if (failed) {
        sum.className = 'gw-summary bad';
        sum.textContent = `${done - failed} passed, ${failed} failed. Mockito isolation exposed ${failed} race conditions.`;
        btn.textContent = 'Apply the fixes and re-run';
        fixed = true;
      } else {
        sum.className = 'gw-summary good';
        sum.textContent = `All ${done} passed, at 92% line coverage.`;
        btn.textContent = 'Run the suite again';
      }
      busy = false;
      btn.disabled = false;
    });
  }

  /* ---------- StayFinder: geo and price search, and the booking saga ---------- */
  function stayfinder(root) {
    const C = accent(root);
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const select = t => {
      tabs.forEach(x => { x.setAttribute('aria-selected', String(x === t)); x.tabIndex = x === t ? 0 : -1; });
      root.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== t.dataset.tab; });
    };
    tabs.forEach((t, i) => {
      t.tabIndex = i ? -1 : 0;
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        select(n);
        n.focus();
      });
    });

    // Search: 4,000 dots, each standing for 250 of the 1M seeded listings.
    const cities = [[0.2, 0.36, 0.07, 180], [0.42, 0.64, 0.06, 140], [0.64, 0.3, 0.08, 240], [0.82, 0.66, 0.05, 120], [0.5, 0.45, 0.1, 160]];
    const L = [];
    for (let i = 0; i < 4000; i++) {
      const c = cities[i % cities.length];
      L.push({
        x: clamp(c[0] + gauss() * c[2], 0.02, 0.98),
        y: clamp(c[1] + gauss() * c[2] * 0.9, 0.04, 0.96),
        price: Math.round(clamp(c[3] * Math.exp(gauss() * 0.45), 40, 900))
      });
    }
    const S = { x: 0.44, y: 0.5, r: 0.15, max: 300 };
    const sample = () => Math.exp(Math.log(46) + gauss() * 0.38);
    const lat = Array.from({ length: 3000 }, sample);
    let ring = 0;
    const P = { p50: 0, p99: 0 };

    const mapCv = root.querySelector('.sf-map');
    const mapBox = canvas(mapCv, () => query(false));
    function drawMap() {
      const { ctx, w, h: H } = mapBox;
      ctx.clearRect(0, 0, w, H);
      const R = S.r * w;
      let n = 0;
      for (const l of L) {
        const dx = (l.x - S.x) * w, dy = (l.y - S.y) * H;
        const hit = l.price <= S.max && dx * dx + dy * dy <= R * R;
        if (hit) n++;
        ctx.fillStyle = hit ? C : '#2c2c2e';
        ctx.fillRect(l.x * w - 1.2, l.y * H - 1.2, 2.4, 2.4);
      }
      ctx.beginPath();
      ctx.arc(S.x * w, S.y * H, R, 0, Math.PI * 2);
      ctx.fillStyle = rgba(C, 0.08);
      ctx.fill();
      ctx.strokeStyle = C;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(S.x * w, S.y * H, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f5f5f7';
      ctx.fill();
      return n;
    }
    function query(measure = true) {
      const n = drawMap();
      key(root, 'match').textContent = (n * 250).toLocaleString('en-US');
      if (!measure) return;
      const t = sample();
      lat[ring] = t;
      ring = (ring + 1) % lat.length;
      key(root, 'took').textContent = `${Math.round(t)} ms`;
    }
    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; query(); });
    };
    let drag = false;
    const move = e => {
      const r = mapCv.getBoundingClientRect();
      S.x = clamp((e.clientX - r.left) / r.width);
      S.y = clamp((e.clientY - r.top) / r.height);
      schedule();
    };
    mapCv.addEventListener('pointerdown', e => { drag = true; mapCv.setPointerCapture(e.pointerId); move(e); });
    mapCv.addEventListener('pointermove', e => { if (drag) move(e); });
    mapCv.addEventListener('pointerup', () => { drag = false; });
    mapCv.addEventListener('pointercancel', () => { drag = false; });
    mapCv.addEventListener('keydown', e => {
      const d = { ArrowLeft: [-0.03, 0], ArrowRight: [0.03, 0], ArrowUp: [0, -0.05], ArrowDown: [0, 0.05] }[e.key];
      if (!d) return;
      e.preventDefault();
      S.x = clamp(S.x + d[0]);
      S.y = clamp(S.y + d[1]);
      schedule();
    });
    const range = root.querySelector('.sf-range input');
    range.addEventListener('input', () => {
      S.max = +range.value;
      key(root, 'price').textContent = `$${S.max}`;
      schedule();
    });

    const histBox = canvas(root.querySelector('.sf-hist'), () => drawHist());
    function percentiles() {
      const s = Float64Array.from(lat).sort();
      P.p50 = s[Math.floor(s.length * 0.5)];
      P.p99 = s[Math.floor(s.length * 0.99)];
      key(root, 'p50').textContent = `${Math.round(P.p50)} ms`;
      key(root, 'p99').textContent = `${Math.round(P.p99)} ms`;
    }
    function drawHist() {
      const { ctx, w, h: H } = histBox;
      ctx.clearRect(0, 0, w, H);
      const bins = 50, max = 200, counts = new Array(bins).fill(0);
      for (const v of lat) counts[Math.min(bins - 1, Math.floor((v / max) * bins))]++;
      const top = Math.max(...counts);
      const x0 = 14, x1 = w - 14, base = H - 20, bw = (x1 - x0) / bins;
      const X = v => x0 + (v / max) * (x1 - x0);
      counts.forEach((c, i) => {
        const bh = (c / top) * (base - 22);
        ctx.fillStyle = rgba(C, 0.8);
        ctx.fillRect(x0 + i * bw + 1, base - bh, Math.max(1, bw - 2), bh);
      });
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = '#f5f5f7';
      ctx.beginPath(); ctx.moveTo(X(P.p99), 16); ctx.lineTo(X(P.p99), base); ctx.stroke();
      ctx.strokeStyle = '#ff453a';
      ctx.beginPath(); ctx.moveTo(X(150), 16); ctx.lineTo(X(150), base); ctx.stroke();
      ctx.setLineDash([]);
      text(ctx, `p99 ${Math.round(P.p99)} ms`, X(P.p99) - 6, 12, { size: 11.5, align: 'right', color: '#f5f5f7', weight: 600 });
      text(ctx, '150 ms budget', X(150) + 6, 12, { size: 11.5, align: 'left', color: '#ff6961' });
      [0, 50, 100, 150, 200].forEach(v => text(ctx, `${v}`, X(v), H - 4, { size: 10.5, color: '#6e6e73' }));
    }
    function load() {
      for (let i = 0; i < 375; i++) { lat[ring] = sample(); ring = (ring + 1) % lat.length; }
      percentiles();
      drawHist();
    }
    percentiles();
    let timer = 0;
    whenVisible(root, () => { if (!timer && !reduce) timer = setInterval(load, 250); }, () => { clearInterval(timer); timer = 0; }, '0px');

    // Saga
    const cells = [...root.querySelectorAll('.sf-cal div')];
    const events = root.querySelector('.sf-events'), status = root.querySelector('.sf-status'), book = root.querySelector('[data-act="book"]');
    let pay = 'fail', offset = 1040, busy = false;
    root.querySelectorAll('[data-pay]').forEach(b => b.addEventListener('click', () => {
      pay = b.dataset.pay;
      root.querySelectorAll('[data-pay]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }));
    const setDays = cls => [1, 2, 3].forEach(i => { cells[i].className = cls; });
    const ev = (topic, svc, tone) => {
      const li = h('li', tone || '');
      li.append(h('span', 'topic', topic), h('span', 'svc', svc), h('span', 'off', `offset ${offset++}`));
      events.append(li);
    };
    book.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      book.disabled = true;
      events.textContent = '';
      setDays('');
      status.textContent = 'Booking requested…';
      await wait(300); ev('booking.requested', 'booking-service');
      await wait(700); ev('dates.held', 'booking-service'); setDays('held');
      status.textContent = 'Fri to Sun are held while the payment runs.';
      await wait(800); ev('payment.requested', 'booking-service');
      await wait(1000);
      if (pay === 'ok') {
        ev('payment.succeeded', 'payment-service', 'good');
        await wait(700); ev('booking.confirmed', 'booking-service', 'good'); setDays('booked');
        status.textContent = 'Paid and confirmed. The dates are booked.';
      } else {
        ev('payment.failed', 'payment-service', 'bad');
        await wait(800); ev('dates.released', 'booking-service', 'good'); setDays('');
        await wait(400); ev('booking.cancelled', 'booking-service');
        status.textContent = 'The payment failed, so the saga released Fri to Sun. Nobody is locked out of those dates.';
      }
      book.textContent = 'Book again';
      busy = false;
      book.disabled = false;
    });
  }

  /* ---------- Trip Planner: N+1 versus DataLoader, and a cached LLM call ---------- */
  function tripplanner(root) {
    const bars = root.querySelector('.tp-bars'), sqlEl = key(root, 'sql'), callsEl = key(root, 'calls');
    const plans = {
      off: () => {
        const c = [{ x: 0, w: 9, q: 'SELECT * FROM trips LIMIT 6' }];
        for (let t = 0; t < 6; t++) c.push({ x: 10 + t * 1.5, w: 7, q: `SELECT * FROM days WHERE trip_id = ${101 + t}` });
        for (let d = 0; d < 36; d++) c.push({ x: 20 + d * 1.6, w: 6, q: `SELECT * FROM stops WHERE day_id = ${2001 + d}` });
        return c;
      },
      on: () => [
        { x: 0, w: 9, q: 'SELECT * FROM trips LIMIT 6' },
        { x: 10, w: 9, q: 'SELECT * FROM days WHERE trip_id IN (101, …, 106)' },
        { x: 20, w: 12, q: 'SELECT * FROM stops WHERE day_id IN (2001, …, 2036)' }
      ]
    };
    let mode = 'off', gen = 0;
    async function run() {
      const my = ++gen;
      const calls = plans[mode]();
      bars.textContent = '';
      bars.classList.toggle('few', mode === 'on');
      for (let i = 0; i < calls.length; i++) {
        if (my !== gen) return;
        const b = h('i');
        b.style.setProperty('--x', calls[i].x);
        b.style.setProperty('--w', calls[i].w);
        bars.append(b);
        callsEl.textContent = i + 1;
        sqlEl.textContent = calls[i].q;
        await wait(mode === 'on' ? 280 : 45);
      }
    }
    root.querySelectorAll('[data-dl]').forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.dl;
      root.querySelectorAll('[data-dl]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      run();
    }));
    once(root, run);

    const SAMPLES = {
      Lisbon: 'Morning in Alfama and up to the castle viewpoints. Lunch near Rua dos Remédios. Tram 28 west in the afternoon, then sunset at Miradouro de Santa Catarina.',
      Kyoto: 'Start early at Fushimi Inari before the crowds. Nishiki Market for lunch. Walk the Philosopher’s Path in the afternoon and finish the day in Gion.',
      'New York': 'Morning on the High Line into Chelsea Market. Cross the Brooklyn Bridge after lunch and stay in DUMBO for the skyline at dusk.'
    };
    const cache = new Set();
    let llm = 0, hits = 0, aiGen = 0;
    const out = root.querySelector('.tp-ai-out'), cacheEl = key(root, 'cache');
    root.querySelectorAll('[data-city]').forEach(b => b.addEventListener('click', async () => {
      const city = b.dataset.city, my = ++aiGen;
      root.querySelectorAll('[data-city]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const words = SAMPLES[city];
      if (cache.has(city)) {
        hits++;
        out.textContent = words;
        cacheEl.textContent = 'Cache hit, served from Redis';
        cacheEl.className = 'hit';
      } else {
        llm++;
        cacheEl.textContent = 'Cache miss, calling the model';
        cacheEl.className = 'miss';
        out.textContent = '';
        const cur = h('span', 'cursor');
        out.append(cur);
        const list = words.split(' ');
        for (let i = 0; i < list.length; i++) {
          if (my !== aiGen) return;
          cur.before((i ? ' ' : '') + list[i]);
          await wait(42);
        }
        cur.remove();
        cache.add(city);
        cacheEl.textContent = 'Stored in Redis for next time';
        cacheEl.className = '';
      }
      key(root, 'llm').textContent = llm;
      key(root, 'hits').textContent = hits;
    }));
  }

  /* ---------- FinSight: an agent run over synthetic transactions ---------- */
  function finsight(root) {
    const ROWS = [
      ['Mar 3', 'Card purchase', 'Atlas Freight Co.', 84.2],
      ['Mar 3', 'Cash deposit', 'Branch 112', 9800, 'hot'],
      ['Mar 4', 'Wire out', 'Blue Heron Imports', 1250],
      ['Mar 4', 'Cash deposit', 'Branch 087', 9700, 'hot'],
      ['Mar 4', 'ACH credit', 'Payroll', 3410.55],
      ['Mar 5', 'Cash deposit', 'Branch 112', 9950, 'hot'],
      ['Mar 5', 'Card purchase', 'Corner Market', 23.75],
      ['Mar 5', 'Cash deposit', 'Branch 203', 9500, 'hot'],
      ['Mar 6', 'Wire out', 'Meridian Holdings Ltd', 36000, 'watch']
    ];
    const tbody = root.querySelector('tbody'), trace = root.querySelector('.fs-trace');
    const report = root.querySelector('.fs-report'), btn = root.querySelector('[data-act="run"]');
    const trs = [];
    let busy = false, resolveFill;
    const filled = new Promise(r => { resolveFill = r; });
    const idle = () => { trace.textContent = ''; const li = h('li'); li.append(h('span', 'res', 'Run the agent to watch it work through the account.')); trace.append(li); };
    idle();
    once(root, async () => {
      for (const r of ROWS) {
        const tr = h('tr');
        tr.append(h('td', '', r[0]), h('td', '', r[1]), h('td', '', r[2]), h('td', 'r', money(r[3])));
        tbody.append(tr);
        trs.push(tr);
        await wait(90);
      }
      resolveFill();
    });
    const step = (kind, code, res, cls) => {
      const li = h('li', cls || '');
      li.append(h('span', 'kind', kind));
      if (code) li.append(h('code', '', code));
      if (res) li.append(h('span', 'res', res));
      trace.append(li);
      return li;
    };
    btn.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      btn.disabled = true;
      await filled;
      trace.textContent = '';
      report.hidden = true;
      trs.forEach(tr => { tr.className = ''; });
      let li = step('Tool call', 'get_transactions(account="••4821", window="7d")');
      await wait(700); li.append(h('span', 'res', '9 transactions returned'));
      await wait(600);
      step('Reasoning', null, '4 cash deposits from $9,500 to $9,950 at three branches within 72 hours. Each sits just under the $10,000 currency transaction report threshold.');
      ROWS.forEach((r, i) => { if (r[4] === 'hot') trs[i].className = 'hot'; });
      await wait(900);
      step('Flag', null, 'Possible structuring under the Bank Secrecy Act (31 U.S.C. § 5324)', 'flag');
      await wait(800);
      li = step('Tool call', 'screen_watchlists(["Atlas Freight Co.", "Blue Heron Imports", "Meridian Holdings Ltd"])');
      await wait(900); li.append(h('span', 'res', 'OFAC and AML lists: two clear, Meridian Holdings Ltd a possible match (0.91)'));
      trs[8].className = 'watch';
      await wait(700);
      li = step('Tool call', 'draft_report(case="FS-0412")');
      await wait(800); li.append(h('span', 'res', 'Report drafted for analyst review'));

      report.textContent = '';
      report.append(h('h4', '', 'Case FS-0412 · Suspicious activity summary'), h('p', 'sub', 'Draft for analyst review, written by the agent'));
      const dl = h('dl');
      [
        ['Subject', 'Account ••4821'],
        ['Finding', 'Possible structuring: 4 cash deposits totalling $38,950 between Mar 3 and Mar 5, each under $10,000, across 3 branches. Followed by a $36,000 wire to Meridian Holdings Ltd on Mar 6.'],
        ['Watchlists', 'Meridian Holdings Ltd: possible match (0.91), needs review. All other counterparties clear.'],
        ['Evidence', 'Transactions 2, 4, 6, 8 and 9'],
        ['Recommendation', 'Escalate for SAR review.']
      ].forEach(([k, v]) => dl.append(h('dt', '', k), h('dd', k === 'Recommendation' ? 'rec' : '', v)));
      report.append(dl);
      report.hidden = false;
      btn.textContent = 'Run the agent again';
      busy = false;
      btn.disabled = false;
    });
  }

  /* ---------- The Gallery: a 10 Hz scorer directing the camera ---------- */
  function gallery(root) {
    const C = accent(root);
    const N = 720, pts = [], cum = [0];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const r = 1 + 0.16 * Math.sin(3 * t) + 0.08 * Math.cos(5 * t + 0.6);
      pts.push([Math.cos(t) * r, Math.sin(t) * r * 0.64]);
    }
    for (let i = 1; i <= N; i++) { const a = pts[i - 1], b = pts[i % N]; cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const total = cum[N];
    const at = s => {
      const target = (((s % 1) + 1) % 1) * total;
      let lo = 1, hi = N;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < target) lo = mid + 1; else hi = mid; }
      const a = pts[lo - 1], b = pts[lo % N];
      const f = (target - cum[lo - 1]) / (cum[lo] - cum[lo - 1] || 1);
      return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)];
    };

    const NUM = [1, 4, 11, 16, 44, 55, 63, 81, 14, 22];
    const COL = ['#ff453a', '#ff9f0a', '#ffd60a', '#30d158', '#64d2ff', '#2997ff', '#5e5ce6', '#ff375f', '#f5f5f7', '#ac8e68'];
    const BASE = 0.06;
    const cars = NUM.map((n, i) => ({ n, col: COL[i], d: -i * 0.011, v: BASE, pace: 1 + (Math.random() - 0.5) * 0.05, noise: 0 }));
    const pairKey = (a, b) => (a.n < b.n ? `${a.n}-${b.n}` : `${b.n}-${a.n}`);
    let order = cars.slice();
    let time = 0, acc = 0, cam = null, camNo = 1, prevKey = null, camSince = 0, base = null, baseUntil = 0, scores = [];
    const flashes = [];
    const tally = { passes: 0, dir: 0, base: 0 };
    const scoresEl = key(root, 'scores');

    function score() {
      scores = [];
      for (let i = 1; i < order.length; i++) {
        const a = order[i - 1], b = order[i];
        const gap = a.d - b.d, closing = b.v - a.v;
        const s = Math.exp(-gap / 0.005) * clamp(0.55 + (closing / BASE) * 12, 0.15, 1.6);
        scores.push({ a, b, pos: i + 1, key: pairKey(a, b), s: clamp(s * 62, 0, 100) });
      }
      const best = scores.reduce((m, x) => (x.s > m.s ? x : m), scores[0]);
      const cur = cam && scores.find(x => x.key === cam.key);
      if (!cur || best.s > cur.s * 1.35 + 4 || cur.s < 12) {
        if (!cam || best.key !== cam.key) { prevKey = cam && cam.key; camSince = time; }
        cam = best;
        camNo = Math.floor((((cam.b.d % 1) + 1) % 1) * 8) + 1;
      } else cam = cur;
      if (time > baseUntil || !base) { base = pick(scores); baseUntil = time + rand(3, 7); }
      else base = scores.find(x => x.key === base.key) || pick(scores);
    }

    function tick() {
      const prev = new Map(order.map((c, i) => [c, i]));
      order = cars.slice().sort((a, b) => b.d - a.d);
      const now = new Map(order.map((c, i) => [c, i]));
      if (time > 2) {
        for (let i = 0; i < cars.length; i++) for (let j = i + 1; j < cars.length; j++) {
          const a = cars[i], b = cars[j];
          if ((prev.get(a) < prev.get(b)) === (now.get(a) < now.get(b))) continue;
          const passer = now.get(a) < now.get(b) ? a : b, passed = passer === a ? b : a;
          const k = pairKey(passer, passed);
          const caught = cam && (cam.key === k || (prevKey === k && time - camSince < 0.8));
          tally.passes++;
          if (caught) tally.dir++;
          if (base && base.key === k) tally.base++;
          flashes.push({ car: passer, t: 1, caught });
        }
      }
      score();
      side();
    }

    function side() {
      key(root, 'cam').textContent = `Camera ${camNo}`;
      key(root, 'shot').textContent = `Battle for P${cam.pos - 1}: #${cam.b.n} chasing #${cam.a.n}`;
      scoresEl.textContent = '';
      for (const x of scores.slice().sort((p, q) => q.s - p.s).slice(0, 3)) {
        const li = h('li', x.key === cam.key ? 'on' : '');
        const row = h('span');
        row.append(h('span', '', `P${x.pos - 1} · #${x.b.n} on #${x.a.n}`), h('span', '', String(Math.round(x.s))));
        const bar = h('i');
        bar.style.setProperty('--s', x.s.toFixed(0));
        li.append(row, bar);
        scoresEl.append(li);
      }
      const pct = n => (tally.passes ? ` (${Math.round((n / tally.passes) * 100)}%)` : '');
      key(root, 'dir').textContent = `${tally.dir} of ${tally.passes}${pct(tally.dir)}`;
      key(root, 'base').textContent = `${tally.base} of ${tally.passes}${pct(tally.base)}`;
    }

    function step(dt) {
      const s = dt / 1000;
      time += s;
      const lead = order[0].d;
      for (let i = 0; i < order.length; i++) {
        const c = order[i], ahead = order[i - 1];
        c.noise += (-c.noise * 0.6 + gauss() * 0.35) * s;
        c.pace = clamp(c.pace + gauss() * 0.002 * s * 10, 0.965, 1.035);
        let v = BASE * c.pace * (1 + c.noise * 0.05);
        if (ahead) {
          const gap = ahead.d - c.d;
          if (gap < 0.014) v *= 1.025;
          if (gap < 0.0035) v *= 0.985;
        }
        if (lead - c.d > 0.06) v *= 1.03;
        c.v = v;
        c.d += v * s;
      }
      for (let i = flashes.length - 1; i >= 0; i--) { flashes[i].t -= dt / 1100; if (flashes[i].t <= 0) flashes.splice(i, 1); }
      acc += dt;
      while (acc >= 100) { acc -= 100; tick(); }
    }

    function draw({ ctx, w, h: H }) {
      ctx.clearRect(0, 0, w, H);
      const sc = Math.min(w / 2.75, H / 1.85), cx = w / 2, cy = H / 2;
      const P = p => [cx + p[0] * sc, cy + p[1] * sc];
      ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach((p, i) => { const q = P(p); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); });
      ctx.closePath();
      const tw = clamp(sc * 0.13, 14, 26);
      ctx.strokeStyle = '#3a3a3c'; ctx.lineWidth = tw; ctx.stroke();
      ctx.strokeStyle = '#1f1f21'; ctx.lineWidth = tw - 4; ctx.stroke();
      const s0 = P(at(0));
      ctx.fillStyle = '#f5f5f7';
      ctx.fillRect(s0[0] - tw / 2, s0[1] - 1.5, tw, 3);

      if (cam) {
        for (const c of [cam.a, cam.b]) {
          const q = P(at(c.d));
          ctx.strokeStyle = C; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(q[0], q[1], 13, 0, Math.PI * 2); ctx.stroke();
        }
        const q = P(at(cam.b.d));
        ctx.fillStyle = C;
        ctx.beginPath(); ctx.roundRect(q[0] - 30, q[1] - 40, 60, 20, 10); ctx.fill();
        text(ctx, `CAM ${camNo}`, q[0], q[1] - 26, { size: 11, weight: 700, color: '#fff' });
      }
      for (const c of order.slice().reverse()) {
        const q = P(at(c.d));
        ctx.fillStyle = c.col;
        ctx.beginPath(); ctx.arc(q[0], q[1], 8, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(c.n), q[0], q[1] + 0.5, { size: 8.5, weight: 700, color: luma(c.col) > 0.6 ? '#000' : '#fff', base: 'middle' });
      }
      for (const f of flashes) {
        const q = P(at(f.car.d));
        ctx.globalAlpha = clamp(f.t);
        text(ctx, f.caught ? 'Pass · on air' : 'Pass · missed', q[0], q[1] + 26 + (1 - f.t) * 10, { size: 11.5, weight: 700, color: f.caught ? C : '#a1a1a6' });
        ctx.globalAlpha = 1;
      }
    }

    order = cars.slice().sort((a, b) => b.d - a.d);
    score();
    side();
    animated(root, root.querySelector('canvas'), step, draw);
  }

  /* ---------- Wire up ---------- */
  const builders = { shadowdb, gateway, stayfinder, tripplanner, finsight, gallery };
  document.querySelectorAll('[data-demo]').forEach(root => {
    const make = builders[root.dataset.demo];
    if (make) make(root);
  });

  // Highlight the project in view in the sticky index.
  const pnav = document.querySelector('.pnav-in');
  const links = [...document.querySelectorAll('.pnav a')];
  const spy = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach(a => {
        const on = a.hash === `#${e.target.id}`;
        a.setAttribute('aria-current', String(on));
        if (on && pnav) pnav.scrollTo({ left: a.offsetLeft - pnav.clientWidth / 2 + a.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
      });
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('.proj').forEach(p => spy.observe(p));
})();
