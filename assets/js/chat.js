/* Experience: one messenger-style chat per role. Each replays what was shipped; visitors can ask follow-ups,
   answered from a small keyword table built only from the résumé. Nothing typed leaves the page. */
(() => {
  const R = window.RESUME;
  const { reduce } = window.Site;
  const $ = id => document.getElementById(id);
  const app = $('wa');
  if (!app || !R) return;

  const role = Object.fromEntries(R.roles.map(r => [r.id, r]));
  const fromRole = (id, extra) => {
    const r = role[id];
    return {
      id, title: r.title, place: r.place, dates: `${r.start} – ${r.end}`, kind: r.kind, mono: r.mono, color: r.color,
      uses: r.uses, bullets: r.bullets, when: r.end, status: 'Rahul, You', ...extra
    };
  };

  const CHATS = [
    fromRole('nextgen', {
      name: 'NextGen · JPMorgan Chase',
      short: 'NextGen',
      org: 'NextGen IT Solutions · Client: JPMorgan Chase',
      preview: 'Rahul: Manual deployment time dropped 80%.',
      summary: 'Java 17 and Spring Boot microservices for a data management platform at JPMorgan Chase, plus the caching, CI/CD and monitoring around them.',
      script: [
        { t: 'date', text: 'February 2026' },
        { t: 'sys', text: 'Rahul joined as Full Stack Software Engineer · Client: JPMorgan Chase · Ashburn, VA' },
        { t: 'q', text: 'Hey Rahul 👋 What were you building at NextGen?' },
        { t: 'a', text: 'Java 17 and Spring Boot microservices for a data management platform, on the JPMorgan Chase engagement.' },
        { t: 'a', card: { type: 'stat', value: '+30%', label: 'data processing efficiency' } },
        { t: 'q', text: 'What are you proudest of there?' },
        { t: 'a', text: 'Latency. The average API response time was 450ms.' },
        { t: 'a', text: 'I added Redis caching and optimized the complex SQL queries behind it. Now it averages 120ms.' },
        { t: 'a', card: { type: 'compare', title: 'Average API response', before: 450, after: 120, unit: 'ms' } },
        { t: 'q', text: 'How did releases work?' },
        { t: 'a', text: 'I built CI/CD pipelines in Jenkins and GitHub Actions that deploy to AWS: EC2, S3 and RDS.' },
        { t: 'a', card: { type: 'pipeline', title: 'Every merge', stages: ['Commit', 'Build', 'Test', 'Deploy'], note: '−80% manual deployment time' } }
      ],
      replies: [
        { q: 'What did you monitor?', a: [
          { text: 'Prometheus and Grafana across 15+ microservices.' },
          { text: 'We caught issues earlier, and downtime fell by 15%.' },
          { card: { type: 'monitor', note: '−15% downtime' } }
        ] },
        { q: 'How did the team work?', a: [
          { text: 'Agile sprints, side by side with product managers and other engineers, turning requirements into features that landed on schedule.' }
        ] },
        { q: 'Which stack, exactly?', a: [
          { text: 'Java 17, Spring Boot, Redis, SQL, Jenkins, GitHub Actions, AWS (EC2, S3, RDS), Prometheus and Grafana.' }
        ] }
      ]
    }),
    fromRole('appworks', {
      name: 'Appworks',
      short: 'Appworks',
      org: 'Appworks',
      preview: 'Rahul: Post-release defect density fell 15%.',
      summary: 'Modular Java and Python back-end services for core business apps, third-party REST integrations, and an on-prem to AWS migration.',
      script: [
        { t: 'date', text: 'February 2025' },
        { t: 'sys', text: 'Rahul joined as Associate Software Engineer · McAllen, TX' },
        { t: 'q', text: 'What did you work on at Appworks?' },
        { t: 'a', text: 'Modular back-end services in Java and Python for the company’s core business apps, including third-party REST API integrations.' },
        { t: 'q', text: 'How did you keep quality up?' },
        { t: 'a', text: 'I led code reviews and unit testing against secure-coding standards.' },
        { t: 'a', card: { type: 'stat', value: '−15%', label: 'post-release defect density' } }
      ],
      replies: [
        { q: 'Any cloud work?', a: [
          { text: 'Yes. I helped migrate on-premise applications to AWS (EC2 and S3), containerized the services, and drafted the first infrastructure-as-code templates.' }
        ] },
        { q: 'Which stack?', a: [
          { text: 'Java, Python, REST APIs, Docker, and AWS EC2 and S3.' }
        ] }
      ]
    }),
    fromRole('dxc', {
      name: 'DXC Technology',
      short: 'DXC',
      org: 'DXC Technology',
      preview: 'Rahul: Resolved 50+ defects with QA.',
      summary: 'Features for a customer-facing web portal in Java, Spring MVC and JavaScript, plus MySQL query tuning.',
      script: [
        { t: 'date', text: 'May 2022' },
        { t: 'sys', text: 'Rahul joined as Software Engineer Intern · Hyderabad, India' },
        { t: 'q', text: 'What was the internship?' },
        { t: 'a', text: 'Building features for a customer-facing web portal in Java, Spring MVC and JavaScript, and optimizing its MySQL queries.' },
        { t: 'q', text: 'Anything measurable?' },
        { t: 'a', text: 'I worked with QA to resolve 50+ defects, which made the portal more stable and easier to use.' },
        { t: 'a', card: { type: 'stat', value: '50+', label: 'defects resolved with QA' } }
      ],
      replies: [
        { q: 'How long was it?', a: [{ text: 'Six months, May to October 2022.' }] },
        { q: 'Which stack?', a: [{ text: 'Java, Spring MVC, JavaScript and MySQL.' }] }
      ]
    }),
    {
      id: 'acm',
      name: 'Rowan ACM',
      short: 'Rowan ACM',
      org: 'Rowan University ACM chapter',
      title: 'Tech Coordinator',
      place: 'Rowan University',
      kind: 'Leadership',
      mono: 'ACM',
      color: '#a142f4',
      when: 'Dec 2024',
      status: 'Rahul, You',
      preview: 'Rahul: 6 hackathons, 12 tech talks, $15K raised.',
      summary: 'As ACM Tech Coordinator I organized hackathons and tech talks and raised the sponsorship money to run them.',
      bullets: ['ACM Tech Coordinator: organized 6 hackathons and 12 tech talks for ~300 students; secured $15K in sponsorships.'],
      script: [
        { t: 'date', text: 'Rowan University' },
        { t: 'sys', text: 'Rahul served as the ACM chapter’s Tech Coordinator' },
        { t: 'q', text: 'What did the ACM chapter look like with you running tech?' },
        { t: 'a', text: 'I organized 6 hackathons and 12 tech talks for about 300 students.' },
        { t: 'a', text: 'And secured $15K in sponsorships to make them happen.' },
        { t: 'a', card: { type: 'grid', items: [['6', 'hackathons'], ['12', 'tech talks'], ['~300', 'students'], ['$15K', 'sponsorships']] } }
      ],
      replies: [
        { q: 'What did you study?', a: [
          { text: 'A B.S. in Computer Science, finished December 2024, on a merit-based International Credit Transfer Scholarship.' },
          { text: 'Coursework included data structures and algorithms, distributed systems, operating systems, and AI & ML.' }
        ] },
        { q: 'Any awards?', a: [
          { text: '4th of 68 teams at the iNeuron.ai Tech-A-Thon, and 7th of 40 at the Great India Hackathon.' },
          { card: { type: 'link', title: 'About Rahul', desc: 'Education, certifications and awards', href: 'about.html' } }
        ] },
        { q: 'Certifications?', a: [
          { text: 'AWS Certified Developer – Associate, and the Machine Learning Specialization from Stanford Online and DeepLearning.AI.' }
        ] }
      ]
    }
  ];

  // Free-text questions: first match wins, so the more specific patterns come first.
  const KB = [
    { k: /latenc|redis|cach|response time|faster|slow|perf|\bsql\b|quer|optimi/i, a: [
      { text: 'At JPMorgan Chase, through NextGen, average API response time was 450ms. Redis caching and rewritten complex SQL queries brought it to 120ms.' },
      { card: { type: 'compare', title: 'Average API response', before: 450, after: 120, unit: 'ms' } }
    ] },
    { k: /ci\s*\/?\s*cd|jenkins|github actions|deploy|pipeline|release/i, a: [
      { text: 'I built Jenkins and GitHub Actions pipelines that deploy to AWS (EC2, S3, RDS). Manual deployment time dropped by 80%.' },
      { card: { type: 'pipeline', title: 'Every merge', stages: ['Commit', 'Build', 'Test', 'Deploy'], note: '−80% manual deployment time' } }
    ] },
    { k: /monitor|prometheus|grafana|downtime|observab|alert|dashboard/i, a: [
      { text: 'Prometheus and Grafana across 15+ microservices at JPMorgan Chase: issues surfaced earlier and downtime fell 15%.' },
      { text: 'ShadowDB has Grafana dashboards too, comparing primary and shadow query performance. They surfaced 12+ regressions.' }
    ] },
    { k: /\baws\b|cloud|ec2|\bs3\b|\brds\b|lambda|dynamo|cloudwatch|bedrock/i, a: [
      { text: 'AWS runs through my work: CI/CD into EC2, S3 and RDS at JPMorgan Chase, an on-prem to AWS migration at Appworks, and an AWS Bedrock agent in FinSight.' },
      { text: 'I’m also an AWS Certified Developer.' }
    ] },
    { k: /kafka|event|saga|stream|messag/i, a: [
      { text: 'Kafka is in two of my projects. StayFinder runs a Kafka-based saga that releases held dates when a payment fails, and ShadowDB’s stack pairs it with Netty.' },
      { card: { type: 'link', title: 'StayFinder', desc: 'Watch the saga run, step by step', href: 'projects.html#stayfinder' } }
    ] },
    { k: /test|junit|mockito|coverage|\bqa\b|quality|bug|defect/i, a: [
      { text: 'My API gateway project has 150+ edge-case contract tests at 92% coverage, and Mockito isolation exposed 3 race conditions.' },
      { text: 'At Appworks, code reviews and unit testing cut post-release defect density by 15%. At DXC I resolved 50+ defects with QA.' }
    ] },
    { k: /\bai\b|\bml\b|machine learning|llm|gemini|spring ai|agent/i, a: [
      { text: 'Three AI builds: FinSight, an AWS Bedrock compliance agent; The Gallery, where Gemini 2.5 Flash directs a live F1 feed; and AI itineraries in Trip Planner through Spring AI.' },
      { text: 'I also completed the Machine Learning Specialization from Stanford Online and DeepLearning.AI.' }
    ] },
    { k: /graphql|dataloader|kotlin/i, a: [
      { text: 'Trip Planner is a Kotlin and Spring for GraphQL API. DataLoader batching cut database calls per query from 40+ to 3.' }
    ] },
    { k: /python|fastapi/i, a: [
      { text: 'Python for back-end services at Appworks, and FastAPI in FinSight and The Gallery.' }
    ] },
    { k: /react|redux|front.?end|javascript|typescript|\bui\b|\bcss\b|\bhtml/i, a: [
      { text: 'On the front end I work with React, Redux, JavaScript and TypeScript. At DXC I built portal features in JavaScript on top of Spring MVC.' }
    ] },
    { k: /\bjava\b|spring|microservice|back.?end/i, a: [
      { text: 'Java is home: Java 8, 11 and 17, with Spring Boot, Spring MVC, Spring Security and JPA/Hibernate. At JPMorgan Chase I built Java 17 and Spring Boot microservices for a data management platform.' }
    ] },
    { k: /degree|stud(y|ied)|universit|rowan|college|school|course|gpa|educat|scholar/i, a: [
      { text: 'B.S. in Computer Science from Rowan University, December 2024, on a merit-based International Credit Transfer Scholarship.' }
    ] },
    { k: /certif/i, a: [
      { text: 'AWS Certified Developer, and the Machine Learning Specialization from Stanford Online and DeepLearning.AI.' }
    ] },
    { k: /award|hackathon|\bwon\b|\bwin|competition|\brank/i, a: [
      { text: '4th of 68 teams at the iNeuron.ai Tech-A-Thon and 7th of 40 at the Great India Hackathon. At Rowan I organized 6 hackathons myself.' }
    ] },
    { k: /salary|\bpay\b|compensation|visa|sponsor|relocat|remote|notice period/i, a: [
      { text: 'Happy to talk about that directly. Email me at rahulchidipudi@outlook.com.' }
    ] },
    { k: /\bhire|hiring|availab|\bjob\b|open to|interview|opportunit/i, a: [
      { text: 'Glad you asked. The quickest way to talk about a role is email: rahulchidipudi@outlook.com.' },
      { card: { type: 'link', title: 'Contact', desc: 'Email, phone and GitHub', href: 'contact.html' } }
    ] },
    { k: /contact|email|phone|reach|\bcall\b|github|linkedin|r[ée]sum[ée]|\bcv\b/i, a: [
      { text: 'Email rahulchidipudi@outlook.com, call +1 (856) 526-9115, find my code at github.com/Rahu378, or connect at linkedin.com/in/rahulchidipudi. My résumé is at rahu378.github.io/resume.' }
    ] },
    { k: /^(hi|hey|hello|yo|hola|sup)\b|how are you/i, a: [
      { text: 'Hi! Ask me about latency, CI/CD, AWS, Kafka, testing or the AI projects.' }
    ] },
    { k: /thank|thx|\bcool\b|great|nice|awesome/i, a: [
      { text: 'Thanks for reading! The projects page has a live model of everything I mentioned.' }
    ] }
  ];
  const FALLBACK = [{ text: 'I’d rather answer that one properly than guess. Email me at rahulchidipudi@outlook.com and I’ll reply.' }];

  /* ---------- Elements and state ---------- */
  const list = $('wa-list'), body = $('wa-body'), quick = $('wa-quick'), form = $('wa-form'), input = $('wa-input'), send = $('wa-send');
  const head = $('wa-head'), empty = $('wa-empty'), av = $('wa-av'), nameEl = $('wa-name'), statusEl = $('wa-status');
  const info = $('wa-info'), infoBody = $('wa-info-body'), infoBtn = $('wa-info-btn'), who = $('wa-who');
  const unreadEl = $('wa-unread'), search = $('wa-q'), filters = $('wa-filters');
  const S = { chat: null, gen: 0, busy: false, filter: 'All', q: '' };
  CHATS.forEach(c => Object.assign(c, { log: [], pos: 0, clock: 0, used: [], typing: false, lastSide: null, unread: c.script.filter(m => m.t === 'a').length }));

  const h = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  const clockText = c => {
    const m = 41 + c.clock;
    return `${9 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')} AM`;
  };

  /* ---------- Rendering ---------- */
  function ticks(state) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 16 11');
    svg.setAttribute('aria-hidden', 'true');
    for (const d of ['M1 6 4.3 9.3 10.6 1.4', 'M7.2 8.2 8.4 9.3 14.8 1.4']) {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', 'currentColor');
      p.setAttribute('stroke-width', '1.6');
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-linejoin', 'round');
      svg.append(p);
    }
    setTicks(svg, state);
    return svg;
  }
  function setTicks(svg, state) {
    svg.lastChild.style.display = state === 'sent' ? 'none' : '';
    svg.classList.toggle('read', state === 'read');
  }

  function card(c) {
    const box = h('div', 'c');
    if (c.type === 'stat') {
      box.classList.add('c-stat');
      box.append(h('b', '', c.value), h('span', '', c.label));
    } else if (c.type === 'compare') {
      box.append(h('span', 'c-title', c.title));
      for (const [label, v, cls] of [['Before', c.before, 'slow'], ['After', c.after, 'fast']]) {
        const row = h('div', 'c-row');
        const track = h('span', 'c-track');
        const bar = h('i', cls);
        bar.style.setProperty('--w', (v / c.before).toFixed(3));
        track.append(bar);
        row.append(h('span', '', label), track, h('b', '', `${v}${c.unit}`));
        box.append(row);
      }
      box.append(h('span', 'c-note', `${(c.before / c.after).toFixed(2)}× faster`));
    } else if (c.type === 'pipeline') {
      const p = h('div', 'c-pipe');
      c.stages.forEach((s, i) => { const e = h('span', '', s); e.style.setProperty('--i', i); p.append(e); });
      box.append(h('span', 'c-title', c.title), p, h('span', 'c-note', c.note));
    } else if (c.type === 'monitor') {
      const g = h('div', 'c-mon');
      for (let i = 0; i < 15; i++) g.append(h('i', i === 9 ? 'warn' : ''));
      box.append(h('span', 'c-title', '15+ microservices, watched'), g, h('span', 'c-note', c.note));
    } else if (c.type === 'grid') {
      const g = h('div', 'c-grid');
      for (const [v, l] of c.items) { const d = h('div'); d.append(h('b', '', v), h('span', '', l)); g.append(d); }
      box.append(g);
    } else if (c.type === 'link') {
      const a = h('a', 'c-link');
      a.href = c.href;
      a.append(h('b', '', c.title), h('span', '', c.desc), h('small', '', c.href.replace('.html', '').replace('#', ' · ')));
      box.append(a);
    }
    return box;
  }

  function msgEl(m, grouped, animate) {
    if (m.t === 'date' || m.t === 'sys') {
      const e = h('div', m.t === 'date' ? 'm-date' : 'm-sys', m.text);
      if (animate) e.classList.add('m-enter');
      return e;
    }
    const out = m.t === 'q';
    const wrap = h('div', `m ${out ? 'm-out' : 'm-in'}${grouped ? '' : ' tail'}${animate ? ' m-enter' : ''}`);
    const b = h('div', 'm-b');
    if (!out && !grouped) b.append(h('span', 'm-name', 'Rahul'));
    if (m.card) { b.classList.add('has-card'); b.append(card(m.card)); }
    if (m.text) {
      b.append(h('span', 'm-t', m.text));
      if (!m.card) b.append(h('span', 'm-pad'));
    }
    const meta = h('span', 'm-meta');
    meta.append(h('time', '', m.time));
    if (out) meta.append(ticks(m.tick || 'read'));
    b.append(meta);
    wrap.append(b);
    return wrap;
  }

  function push(c, m, animate) {
    const side = m.t === 'q' || m.t === 'a' ? m.t : null;
    const grouped = side !== null && side === c.lastSide;
    c.lastSide = side;
    if (!m.time) m.time = clockText(c);
    const node = msgEl(m, grouped, animate);
    body.append(node);
    if (!m.logged) { m.logged = true; c.log.push(m); }
    scrollDown(animate);
    return node;
  }

  function scrollDown(smooth) {
    body.scrollTo({ top: body.scrollHeight, behavior: smooth && !reduce ? 'smooth' : 'auto' });
  }

  function renderLog(c) {
    body.textContent = '';
    c.lastSide = null;
    for (const m of c.log) push(c, m, false);
  }

  /* ---------- Conversation flow ---------- */
  function typing(c, on) {
    c.typing = on;
    if (c === S.chat) {
      statusEl.textContent = on ? 'Rahul is typing…' : c.status;
      statusEl.classList.toggle('typing', on);
    }
    const prev = c.row && c.row.querySelector('.wa-prev');
    if (prev) { prev.textContent = on ? 'typing…' : c.preview; prev.classList.toggle('typing', on); }
  }

  function sendOut(c, text) {
    c.clock++;
    const m = { t: 'q', text, tick: 'sent' };
    const node = push(c, m, true);
    const svg = node.querySelector('.m-meta svg');
    setTimeout(() => setTicks(svg, 'delivered'), reduce ? 0 : 380);
    m.tick = 'read';
  }

  async function rahulSays(c, items, my) {
    for (const item of items) {
      await wait(380);
      if (my !== S.gen) return false;
      body.querySelectorAll('.m-meta svg').forEach(s => setTicks(s, 'read'));
      typing(c, true);
      const dots = h('div', `m m-in${c.lastSide === 'a' ? '' : ' tail'} m-enter`);
      const bubble = h('div', 'm-b m-typing');
      bubble.append(h('i'), h('i'), h('i'));
      dots.append(bubble);
      body.append(dots);
      scrollDown(true);
      await wait(Math.min(1700, 520 + (item.text ? item.text.length * 11 : 700)));
      dots.remove();
      if (my !== S.gen) return false;
      typing(c, false);
      push(c, { ...item, t: 'a' }, true);
    }
    return true;
  }

  async function play(c) {
    const my = ++S.gen;
    while (c.pos < c.script.length) {
      const m = c.script[c.pos];
      if (m.t === 'a') {
        if (!(await rahulSays(c, [m], my))) return;
      } else {
        await wait(m.t === 'q' ? 900 : 450);
        if (my !== S.gen) return;
        if (m.t === 'q') sendOut(c, m.text);
        else push(c, { ...m }, true);
      }
      c.pos++;
    }
    showQuick(c);
  }

  function similar(a, b) {
    const n = s => s.toLowerCase().replace(/[^a-z ]/g, '').trim();
    return n(a) === n(b);
  }

  function answer(c, q) {
    const own = c.replies.find(r => similar(r.q, q));
    if (own) { if (!c.used.includes(own.q)) c.used.push(own.q); return own.a; }
    if (/stack|tech|tools?\b|languages?|framework/i.test(q) && c.uses) return [{ text: `At ${c.short}: ${c.uses.join(', ')}.` }];
    if (/what did you|work(ed)? on|responsib|do there|day.to.day/i.test(q)) return [{ text: c.summary }];
    const hit = KB.find(k => k.k.test(q));
    return hit ? hit.a : FALLBACK;
  }

  function setBusy(on) {
    S.busy = on;
    send.disabled = on;
    quick.querySelectorAll('button').forEach(b => { b.disabled = on; });
  }

  async function ask(c, text, items) {
    if (S.busy) return;
    setBusy(true);
    quick.hidden = true;
    if (items && !c.used.includes(text)) c.used.push(text);
    sendOut(c, text);
    const my = ++S.gen;
    const ok = await rahulSays(c, items || answer(c, text), my);
    if (my === S.gen || !ok) setBusy(false);
    if (!ok) return;
    if (c.pos < c.script.length) play(c);
    else showQuick(c);
  }

  function showQuick(c) {
    quick.textContent = '';
    const left = c.replies.filter(r => !c.used.includes(r.q));
    left.forEach((r, i) => {
      const b = h('button', '', r.q);
      b.type = 'button';
      b.style.setProperty('--i', i);
      b.addEventListener('click', () => ask(c, r.q, r.a));
      quick.append(b);
    });
    if (!left.length) {
      const next = CHATS[(CHATS.indexOf(c) + 1) % CHATS.length];
      const b = h('button', '', `Next chat: ${next.short}`);
      b.type = 'button';
      b.addEventListener('click', () => open(next));
      const a = h('a', '', 'See the projects');
      a.href = 'projects.html';
      a.style.setProperty('--i', 1);
      quick.append(b, a);
    }
    quick.hidden = false;
  }

  /* ---------- Chat list ---------- */
  const haystack = c => [c.name, c.title, c.org, c.preview, ...c.script.map(m => m.text || ''), ...c.replies.map(r => r.q)].join(' ').toLowerCase();

  function renderList() {
    list.textContent = '';
    const q = S.q.toLowerCase();
    const shown = CHATS.filter(c => (S.filter === 'All' || c.kind === S.filter) && (!q || haystack(c).includes(q)));
    for (const c of shown) {
      const li = h('li');
      const b = h('button', `wa-row${c.unread ? ' unread' : ''}`);
      b.type = 'button';
      if (c === S.chat) b.setAttribute('aria-current', 'true');
      b.setAttribute('aria-label', `${c.name}, ${c.title}${c.unread ? `, ${c.unread} unread` : ''}`);
      const a = h('span', 'wa-av', c.mono);
      a.style.background = c.color;
      const prev = h('span', `wa-prev${c.typing ? ' typing' : ''}`, c.typing ? 'typing…' : c.preview);
      b.append(a, h('b', '', c.name), h('time', '', c.when), prev, c.unread ? h('span', 'wa-badge', String(c.unread)) : h('span'));
      b.addEventListener('click', () => open(c));
      c.row = b;
      li.append(b);
      list.append(li);
    }
    if (!shown.length) list.append(h('li', 'wa-none', 'No chats match.'));
    const n = CHATS.filter(c => c.unread).length;
    unreadEl.textContent = n ? `${n} unread` : '';
  }

  function stopAll() {
    S.gen++;
    setBusy(false);
    CHATS.forEach(x => { if (x.typing) typing(x, false); });
  }

  function open(c) {
    stopAll();
    S.chat = c;
    c.unread = 0;
    renderList();
    empty.hidden = true;
    head.hidden = false;
    body.hidden = false;
    form.hidden = false;
    av.textContent = c.mono;
    av.style.background = c.color;
    nameEl.textContent = c.name;
    statusEl.textContent = c.status;
    statusEl.classList.remove('typing');
    input.placeholder = `Ask about ${c.short}`;
    app.classList.add('thread');
    quick.hidden = true;
    quick.textContent = '';
    renderLog(c);
    if (!info.hidden) fillInfo(c);
    if (c.pos < c.script.length) play(c);
    else showQuick(c);
  }

  /* ---------- Role details ---------- */
  function fillInfo(c) {
    infoBody.textContent = '';
    const a = h('span', 'wa-av wi-av', c.mono);
    a.style.background = c.color;
    infoBody.append(a, h('p', 'wi-name', c.title), h('p', 'wi-sub', c.org));
    const facts = h('div', 'wi-facts');
    for (const [k, v] of [['Where', c.place], ['When', c.dates], ['Type', c.kind]]) {
      if (!v) continue;
      const row = h('div');
      row.append(h('span', '', k), h('b', '', v));
      facts.append(row);
    }
    const sec = (title, child) => { const s = h('div', 'wi-sec'); s.append(h('h3', '', title), child); infoBody.append(s); };
    sec('At a glance', facts);
    const ul = h('ul');
    c.bullets.forEach(t => ul.append(h('li', '', t)));
    sec('What shipped', ul);
    if (c.uses) {
      const chips = h('div', 'wi-chips');
      c.uses.forEach(t => chips.append(h('span', '', t)));
      sec('Stack', chips);
    }
  }
  function setInfo(open) {
    info.hidden = !open;
    app.classList.toggle('has-info', open);
    [infoBtn, who].forEach(b => b.setAttribute('aria-expanded', String(open)));
    if (open) { fillInfo(S.chat); $('wa-info-close').focus(); }
  }
  infoBtn.addEventListener('click', () => setInfo(info.hidden));
  who.addEventListener('click', () => setInfo(info.hidden));
  $('wa-info-close').addEventListener('click', () => { setInfo(false); infoBtn.focus(); });
  app.addEventListener('keydown', e => { if (e.key === 'Escape' && !info.hidden) { setInfo(false); infoBtn.focus(); } });

  /* ---------- Events ---------- */
  $('wa-back').addEventListener('click', () => {
    stopAll();
    setInfo(false);
    app.classList.remove('thread');
    if (S.chat && S.chat.row) S.chat.row.focus();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim().slice(0, 200);
    if (!q || !S.chat || S.busy) return;
    input.value = '';
    ask(S.chat, q, null);
  });
  search.addEventListener('input', () => { S.q = search.value.trim(); renderList(); });
  filters.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    S.filter = b.dataset.f;
    filters.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderList();
  });

  renderList();

  // On wide screens the first chat opens and starts replaying once the app is mostly in view.
  const wide = matchMedia('(min-width: 821px)');
  const starter = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    starter.disconnect();
    if (wide.matches && !S.chat) open(CHATS[0]);
  }, { threshold: 0.45 });
  starter.observe(app);
})();
