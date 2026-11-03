/* Home: the service-mesh hero, the scrubbed latency figure, the phone chat and the sideways project track. */
(() => {
  const { reduce, clamp, lerp, ease, scrub, whenVisible, canvas, loop } = window.Site;
  const $ = s => document.querySelector(s);

  if (reduce) document.querySelectorAll('svg').forEach(s => s.pauseAnimations && s.pauseAnimations());

  /* ---------- Hero ---------- */
  const hero = $('.hero');
  if (hero && !reduce) scrub(hero, (p, r) => hero.style.setProperty('--hp', clamp(-r.top / r.height).toFixed(4)));
  if ($('#mesh')) initMesh($('#mesh'));

  // A slowly turning model of fifteen services: a gateway, eight services and six data stores.
  function initMesh(c) {
    let run = null;
    const svc = ['auth', 'search', 'booking', 'payments', 'trips', 'ledger', 'profile', 'notify'];
    const data = ['redis', 'kafka', 'postgres', 'mongo', 's3', 'elastic'];
    const gateway = { name: 'gateway', tier: 0, x: 0, y: 0, z: 0, a: 0, links: [] };
    const services = svc.map((name, i) => {
      const a = (i / svc.length) * Math.PI * 2;
      return { name, tier: 1, a, x: Math.cos(a) * 1.05, y: Math.sin(i * 2.1) * 0.22, z: Math.sin(a) * 1.05, links: [] };
    });
    const stores = data.map((name, i) => {
      const a = (i / data.length) * Math.PI * 2 + 0.5;
      return { name, tier: 2, a, x: Math.cos(a) * 1.85, y: i % 2 ? 0.42 : -0.38, z: Math.sin(a) * 1.85 };
    });
    const nodes = [gateway, ...services, ...stores];
    const edges = [];
    const gap = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
    for (const s of services) {
      edges.push([gateway, s]);
      s.links = [...stores].sort((p, q) => gap(s.a, p.a) - gap(s.a, q.a)).slice(0, 2);
      for (const d of s.links) edges.push([s, d]);
    }
    const tint = { 0: '245,245,247', 1: '41,151,255', 2: '161,161,166' };

    const packets = [];
    const times = [];
    let spawnClock = 0, rot = 0.6, mx = 0, my = 0, tmx = 0, tmy = 0, readClock = 0;

    function spawn() {
      const s = services[(Math.random() * services.length) | 0];
      const d = s.links[(Math.random() * s.links.length) | 0];
      const hit = d.name === 'redis';
      packets.push({ route: [gateway, s, d, s, gateway], seg: 0, t: Math.random() * 0.2, speed: hit ? 2.7 : 1.55 + Math.random() * 0.5, hit, age: 0, trail: [] });
    }

    function step(dt) {
      spawnClock += dt;
      while (spawnClock > 110) { spawnClock -= 110; if (packets.length < 64) spawn(); }
      for (let i = packets.length - 1; i >= 0; i--) {
        const k = packets[i];
        k.age += dt;
        k.t += (dt / 1000) * k.speed;
        if (k.t >= 1) { k.t -= 1; k.seg++; }
        if (k.seg >= 4) {
          times.push(k.age);
          if (times.length > 40) times.shift();
          packets.splice(i, 1);
        }
      }
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
    }

    function project(x, y, z, cx, cy, R) {
      const a = rot + mx * 0.45;
      const ca = Math.cos(a), sa = Math.sin(a);
      const x1 = x * ca - z * sa, z1 = x * sa + z * ca;
      const t = 0.36 + my * 0.12;
      const ct = Math.cos(t), st = Math.sin(t);
      const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      const s = 4.2 / (4.2 + z2);
      return { x: cx + x1 * R * s, y: cy + y2 * R * s, s, z: z2 };
    }

    function draw() {
      const { ctx, w, h } = box;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.42, R = Math.min(w * (w < 600 ? 0.22 : 0.27), h * 0.42);
      for (const n of nodes) n.p = project(n.x, n.y, n.z, cx, cy, R);

      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const d = (a.p.s + b.p.s) / 2;
        ctx.strokeStyle = `rgba(255,255,255,${clamp(0.05 + (d - 0.75) * 0.32, 0.04, 0.22).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(a.p.x, a.p.y); ctx.lineTo(b.p.x, b.p.y); ctx.stroke();
      }

      for (const k of packets) {
        const a = k.route[k.seg], b = k.route[k.seg + 1];
        const e = ease(k.t);
        const q = project(lerp(a.x, b.x, e), lerp(a.y, b.y, e), lerp(a.z, b.z, e), cx, cy, R);
        k.trail.push(q);
        if (k.trail.length > 7) k.trail.shift();
        const col = k.hit ? '48,209,88' : k.seg >= 2 ? '245,245,247' : '41,151,255';
        for (let i = 1; i < k.trail.length; i++) {
          ctx.strokeStyle = `rgba(${col},${(i / k.trail.length) * 0.5})`;
          ctx.lineWidth = 2 * q.s;
          ctx.beginPath(); ctx.moveTo(k.trail[i - 1].x, k.trail[i - 1].y); ctx.lineTo(k.trail[i].x, k.trail[i].y); ctx.stroke();
        }
        ctx.fillStyle = `rgb(${col})`;
        ctx.beginPath(); ctx.arc(q.x, q.y, 2.3 * q.s, 0, Math.PI * 2); ctx.fill();
      }

      const order = nodes.slice().sort((a, b) => b.p.z - a.p.z);
      ctx.textAlign = 'center';
      for (const n of order) {
        const { x, y, s } = n.p;
        const r = (n.tier === 0 ? 17 : n.tier === 1 ? 9 : 11) * s;
        const col = n.name === 'redis' ? '48,209,88' : tint[n.tier];
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
        glow.addColorStop(0, `rgba(${col},${0.32 * s})`);
        glow.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2); ctx.fill();
        const body = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
        body.addColorStop(0, '#ffffff');
        body.addColorStop(1, `rgb(${col})`);
        ctx.fillStyle = body;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.font = `${n.tier === 0 ? 600 : 500} ${Math.round(11 + 2 * s)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        ctx.fillStyle = `rgba(245,245,247,${clamp((s - 0.72) * 1.6, 0.18, 0.85).toFixed(2)})`;
        ctx.fillText(n.name, x, y + r + 16 * s);
      }
    }

    const flight = $('#ro-flight'), avg = $('#ro-avg');
    function readout(dt) {
      readClock += dt;
      if (readClock < 450) return;
      readClock = 0;
      flight.textContent = packets.length;
      if (times.length > 8) avg.textContent = Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 0.056);
    }

    const box = canvas(c, () => { if (!run || !run.running) draw(); });

    if (reduce) {
      for (let i = 0; i < 40; i++) spawn();
      packets.forEach(k => { k.seg = (Math.random() * 4) | 0; k.t = Math.random(); });
      draw();
      return;
    }
    hero.addEventListener('pointermove', e => {
      tmx = (e.clientX / innerWidth - 0.5) * 2;
      tmy = (e.clientY / innerHeight - 0.5) * 2;
    });
    run = loop(dt => { rot += dt * 0.00012; step(dt); draw(); readout(dt); });
    whenVisible(c, run.start, run.stop, '0px');
  }

  /* ---------- Portrait reveal: grow, then step aside for the introduction ---------- */
  const meet = $('#meet');
  if (meet && !reduce) {
    const wide = matchMedia('(min-width: 821px)');
    scrub(meet, p => {
      if (!wide.matches) { meet.style.removeProperty('--a'); meet.style.removeProperty('--b'); return; }
      meet.style.setProperty('--a', ease(clamp(p / 0.42)).toFixed(4));
      meet.style.setProperty('--b', ease(clamp((p - 0.46) / 0.38)).toFixed(4));
    }, 'pin');
  }

  /* ---------- Latency, scrubbed by scroll ---------- */
  const lat = $('#latency');
  if (lat && !reduce) {
    const val = $('#lat-val'), fill = $('#lat-fill'), out = $('#lat-out');
    scrub(lat, p => {
      const t = ease(clamp((p - 0.1) / 0.6));
      const v = Math.round(lerp(450, 120, t));
      val.textContent = v;
      fill.style.setProperty('--s', (v / 450).toFixed(4));
      fill.style.setProperty('--hue', lerp(4, 135, t).toFixed(1));
      out.classList.toggle('on', p > 0.74);
    }, 'pin');
  }

  /* ---------- Phone chat ---------- */
  const phone = $('#phone');
  if (phone) {
    if (!reduce) scrub(phone.parentElement, p => phone.style.setProperty('--tp', ease(clamp(p / 0.45)).toFixed(4)));
    phoneChat($('#phone-body'), $('#ph-status'));
  }

  function phoneChat(body, status) {
    const card = '<div class="pm-card"><b>450 → 120ms</b><div class="pm-row">Before<span><i style="--w:1"></i></span></div><div class="pm-row">After<span><i class="fast" style="--w:.267"></i></span></div></div>';
    const script = [
      ['out', 'Hey Rahul 👋 What were you building at NextGen?'],
      ['in', 'Java 17 and Spring Boot microservices for a data management platform at JPMorgan Chase.'],
      ['out', 'Biggest win?'],
      ['in', 'Latency. Redis caching and better SQL took the average API response from 450ms to 120ms.'],
      ['card'],
      ['out', 'And releases?'],
      ['in', 'Jenkins and GitHub Actions pipelines to AWS. Manual deployment time dropped 80%.']
    ];
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const add = (cls, fill) => {
      const el = document.createElement('div');
      el.className = 'pm ' + cls;
      fill(el);
      body.append(el);
      return el;
    };
    const typing = on => {
      status.textContent = on ? 'Rahul is typing…' : 'Rahul, You';
      status.classList.toggle('typing', on);
    };

    if (reduce) {
      for (const [kind, text] of script) add(kind === 'out' ? 'out' : 'in', el => { if (kind === 'card') el.innerHTML = card; else el.textContent = text; });
      return;
    }

    let gen = 0, playing = false;
    async function play() {
      const my = ++gen;
      body.classList.remove('out-fade');
      body.textContent = '';
      typing(false);
      for (const [kind, text] of script) {
        if (kind === 'out') {
          await wait(900);
          if (my !== gen) return;
          add('out', el => { el.textContent = text; });
          continue;
        }
        await wait(450);
        if (my !== gen) return;
        typing(true);
        const dots = add('in typing', el => { el.innerHTML = '<i></i><i></i><i></i>'; });
        await wait(kind === 'card' ? 700 : 1200);
        dots.remove();
        typing(false);
        if (my !== gen) return;
        add('in', el => { if (kind === 'card') el.innerHTML = card; else el.textContent = text; });
      }
      await wait(3800);
      if (my !== gen) return;
      body.classList.add('out-fade');
      await wait(600);
      if (my === gen) play();
    }
    whenVisible(phone, () => { if (!playing) { playing = true; play(); } }, () => { playing = false; gen++; }, '0px');
  }

  /* ---------- Projects, moved sideways by vertical scroll ---------- */
  const hs = $('#work'), track = $('#hs-track');
  if (hs && track && !reduce) {
    const wide = matchMedia('(min-width: 821px)');
    let dist = 0;
    const size = () => {
      if (!wide.matches) { hs.style.removeProperty('--hs-h'); track.style.removeProperty('--hx'); return; }
      const last = track.lastElementChild;
      const pad = parseFloat(getComputedStyle(track).paddingLeft);
      dist = Math.max(0, last.offsetLeft + last.offsetWidth + pad - track.clientWidth);
      hs.style.setProperty('--hs-h', `${dist + innerHeight}px`);
    };
    size();
    addEventListener('resize', size);
    wide.addEventListener('change', size);
    scrub(hs, p => { if (wide.matches) track.style.setProperty('--hx', `${(-p * dist).toFixed(1)}px`); }, 'pin');
  }
})();
