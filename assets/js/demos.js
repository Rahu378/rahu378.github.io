/* Projects: three small working models. The animated ones run only while on screen; the race can be paused,
   and with reduced motion it starts paused. Figures are the real builds' numbers; anything modelled says so. */
(() => {
  const { reduce, clamp, lerp, whenVisible, canvas, loop } = window.Site;

  const h = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];
  const gauss = () => {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const usd = n => '$' + n.toLocaleString('en-US', { maximumFractionDigits: n < 10 ? 2 : 0, minimumFractionDigits: n < 10 ? 2 : 0 });
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
  const press = (buttons, on) => buttons.forEach(b => b.setAttribute('aria-pressed', String(b === on)));
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
    if (btn) btn.addEventListener('click', () => { paused = !paused; sync(); });
    whenVisible(cv, () => { visible = true; sync(); }, () => { visible = false; sync(); }, '0px');
    sync();
    return { redraw: () => { if (!run.running) draw(box); } };
  }

  /* ---------- Hardware-Aware Gateway: where a decode token's time goes ---------- */
  function hwgateway(root) {
    const TPS = { eager: 28.0, graph: 48.1 };
    const eagerMs = 1000 / TPS.eager;
    const gpuMs = eagerMs * 0.46; // 54% of an eager token is CPU dispatch; the rest is GPU work
    const bar = root.querySelector('.hw-bar'), out = root.querySelector('.hw-text');
    const buttons = [...root.querySelectorAll('[data-mode]')];
    const words = ('Measure before you optimize. The roofline said decode was waiting on the CPU, not on memory, so the fastest fix ' +
      'was to stop launching thousands of tiny kernels one at a time. Capture them once as a CUDA graph, replay it for every token, ' +
      'and the same words come out faster. ').split(' ').filter(Boolean);
    let mode = 'eager', acc = 0, wi = 0;

    function set(m) {
      mode = m;
      press(buttons, buttons.find(b => b.dataset.mode === m));
      const tps = TPS[m], ms = 1000 / tps, cpuMs = ms - gpuMs;
      bar.style.setProperty('--total', (ms / eagerMs).toFixed(3));
      bar.style.setProperty('--cpu', (cpuMs / ms).toFixed(3));
      key(root, 'tps').textContent = tps.toFixed(1);
      key(root, 'ms').textContent = `${ms.toFixed(1)} ms`;
      key(root, 'x').textContent = `${(tps / TPS.eager).toFixed(2)}×`;
      key(root, 'split').textContent = m === 'eager'
        ? '54% of every token waits on CPU dispatch, across about 6,130 ops.'
        : `The ops are captured once as a CUDA graph and replayed, so dispatch drops to about ${cpuMs.toFixed(1)} ms of each token (modelled). Same tokens out.`;
    }
    buttons.forEach(b => b.addEventListener('click', () => set(b.dataset.mode)));
    set('eager');

    const token = () => {
      out.textContent += `${words[wi % words.length]} `;
      wi++;
      if (out.textContent.length > 700) out.textContent = out.textContent.slice(-420);
    };
    if (reduce) { for (let i = 0; i < 40; i++) token(); return; }
    const run = loop(dt => {
      acc += dt;
      const every = 1000 / TPS[mode];
      while (acc >= every) { acc -= every; token(); }
    });
    whenVisible(root, run.start, run.stop, '0px');
  }

  /* ---------- FinOpsAI: spend, forecast and the pre-dispatch policy ---------- */
  function finopsai(root) {
    const C = accent(root);
    const DAYS = 30, TODAY = 20, MAPE = 0.0416;
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const centers = [
      { id: 'support', name: 'Support assistant', budget: 3000, base: 92 },
      { id: 'research', name: 'Research agents', budget: 2000, base: 77 },
      { id: 'marketing', name: 'Marketing copy', budget: 800, base: 38 }
    ];
    centers.forEach(c => { c.daily = Array.from({ length: TODAY }, () => c.base * (0.8 + rnd() * 0.4)); });
    const project = c => {
      const spent = c.daily.reduce((a, b) => a + b, 0);
      const recent = c.daily.slice(-7).reduce((a, b) => a + b, 0) / 7;
      return { spent, proj: spent + recent * (DAYS - TODAY) };
    };
    const decide = (c, size) => {
      const r = project(c).proj / c.budget;
      if (r <= 1) return 'allow';
      if (r <= 1.25) return size === 'large' ? 'downgrade' : 'allow';
      return 'block';
    };
    const TONE = { allow: '#30d158', downgrade: '#ff9f0a', block: '#ff453a' };

    // Cost center meters
    const wrap = root.querySelector('.fo-centers');
    const meters = centers.map(c => {
      const el = h('div', 'fo-center');
      const small = h('small');
      const meter = h('span', 'fo-meter');
      const fill = h('i');
      meter.append(fill);
      el.append(h('b', '', c.name), small, meter);
      wrap.append(el);
      return { c, small, fill };
    });
    const paintMeters = () => meters.forEach(({ c, small, fill }) => {
      const { spent, proj } = project(c);
      small.textContent = `${usd(spent)} so far · ${usd(proj)} projected of ${usd(c.budget)}`;
      fill.style.setProperty('--v', (proj / c.budget).toFixed(3));
      fill.style.setProperty('--tone', TONE[decide(c, 'large')]);
    });

    // Chart: cumulative spend, forecast with its error band, and the budget
    function draw({ ctx, w, h: H }) {
      ctx.clearRect(0, 0, w, H);
      const total = Array.from({ length: TODAY }, (_, d) => centers.reduce((s, c) => s + c.daily[d], 0));
      const cum = [0];
      total.forEach(v => cum.push(cum[cum.length - 1] + v));
      const proj = centers.reduce((s, c) => s + project(c).proj, 0);
      const budget = centers.reduce((s, c) => s + c.budget, 0);
      const top = Math.max(proj * (1 + MAPE), budget) * 1.12;
      const L = 46, R = w - 16, T = 24, B = H - 28;
      const X = d => L + (d / DAYS) * (R - L), Y = v => B - (v / top) * (B - T);

      [0, top / 2].forEach(v => text(ctx, `$${Math.round(v / 1000)}K`, L - 8, Y(v) + 4, { size: 11, align: 'right', color: '#6e6e73' }));
      [[1, 'Day 1'], [TODAY, 'Today'], [DAYS, 'Day 30']].forEach(([d, s]) => text(ctx, s, X(d), H - 8, { size: 11, color: '#6e6e73' }));

      ctx.setLineDash([5, 6]);
      ctx.strokeStyle = '#ff453a';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(L, Y(budget)); ctx.lineTo(R, Y(budget)); ctx.stroke();
      ctx.setLineDash([]);
      text(ctx, `Budget ${usd(budget)}`, L + 4, Y(budget) - 7, { size: 11.5, align: 'left', color: '#ff6961', weight: 600 });

      ctx.fillStyle = rgba(C, 0.16);
      ctx.beginPath();
      ctx.moveTo(X(TODAY), Y(cum[TODAY]));
      ctx.lineTo(X(DAYS), Y(proj * (1 + MAPE)));
      ctx.lineTo(X(DAYS), Y(proj * (1 - MAPE)));
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = C;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      cum.forEach((v, d) => { if (d) ctx.lineTo(X(d), Y(v)); else ctx.moveTo(X(d), Y(v)); });
      ctx.stroke();
      ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(X(TODAY), Y(cum[TODAY])); ctx.lineTo(X(DAYS), Y(proj)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C;
      ctx.beginPath(); ctx.arc(X(TODAY), Y(cum[TODAY]), 4, 0, Math.PI * 2); ctx.fill();
      text(ctx, `Forecast ${usd(proj)} ± 4.16%`, R, Y(proj * (1 + MAPE)) - 10, { size: 11.5, align: 'right', color: '#f5f5f7', weight: 600 });
    }
    const box = canvas(root.querySelector('.fo-chart'), () => draw(box));
    paintMeters();

    // Usage stream: raw provider logs, normalized into one ledger row each
    const log = root.querySelector('.fo-log');
    const PROVIDERS = [
      { id: 'openai', price: { large: 10, small: 0.6 } },
      { id: 'anthropic', price: { large: 15, small: 1.25 } },
      { id: 'bedrock', price: { large: 3.5, small: 0.4 } }
    ];
    function usage() {
      const p = pick(PROVIDERS), c = pick(centers), size = Math.random() < 0.4 ? 'large' : 'small';
      const tokens = Math.round(rand(400, 6000));
      const cost = (tokens / 1e6) * p.price[size] * 40;
      c.daily[TODAY - 1] += cost;
      const li = h('li');
      li.append(h('span', `pv ${p.id}`, p.id), h('span', 'cc', `${size} · ${c.name} · ${tokens.toLocaleString('en-US')} tok`), h('span', 'usd', usd(cost)));
      log.append(li);
      while (log.children.length > 9) log.firstElementChild.remove();
    }
    for (let i = 0; i < 6; i++) usage();
    let timer = 0;
    const tick = () => { usage(); paintMeters(); draw(box); };
    if (!reduce) whenVisible(root, () => { if (!timer) timer = setInterval(tick, 900); }, () => { clearInterval(timer); timer = 0; }, '0px');

    // Policy endpoint
    const centerSeg = root.querySelector('[data-pick="center"]');
    const sizeButtons = [...root.querySelectorAll('[data-pick="size"] button')];
    const centerButtons = centers.map((c, i) => {
      const b = h('button', '', c.name);
      b.type = 'button';
      b.dataset.v = c.id;
      b.setAttribute('aria-pressed', String(i === 1));
      centerSeg.append(b);
      return b;
    });
    centerButtons.forEach(b => b.addEventListener('click', () => press(centerButtons, b)));
    sizeButtons.forEach(b => b.addEventListener('click', () => press(sizeButtons, b)));
    const resp = root.querySelector('.fo-resp code');
    root.querySelector('[data-act="check"]').addEventListener('click', () => {
      const c = centers.find(x => x.id === centerButtons.find(b => b.getAttribute('aria-pressed') === 'true').dataset.v);
      const size = sizeButtons.find(b => b.getAttribute('aria-pressed') === 'true').dataset.v;
      const { proj } = project(c);
      const d = decide(c, size), r = proj / c.budget;
      resp.textContent = '';
      const line = (k, v, cls) => {
        resp.append(`  "${k}": `);
        const s = h('span', cls || '', JSON.stringify(v));
        resp.append(s, ',\n');
      };
      resp.append('{\n');
      line('decision', d, d);
      line('cost_center', c.id);
      line('model', d === 'downgrade' ? 'small' : size);
      line('projected_month_end', usd(proj));
      line('budget', usd(c.budget));
      resp.append(`  "reason": ${JSON.stringify(r <= 1 ? 'projected to stay within budget' : `projected ${Math.round((r - 1) * 100)}% over budget`)}\n}`);
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
  const builders = { hwgateway, finopsai, gallery };
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
