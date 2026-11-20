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
      name: 'NextGen IT Solutions',
      short: 'NextGen',
      org: 'NextGen IT Solutions · Ashburn, VA',
      preview: 'Rahul: Hallucination stayed under 3%.',
      summary: 'An enterprise conversational knowledge assistant over policies and SOPs: RAG on Azure OpenAI, a LangGraph agent, Entra ID security, guardrails and an evaluation gate.',
      script: [
        { t: 'date', text: 'February 2026' },
        { t: 'sys', text: 'Rahul joined as Software Engineer – AI & ML · Ashburn, VA' },
        { t: 'q', text: 'Hey Rahul 👋 What were you building at NextGen?' },
        { t: 'a', text: 'An enterprise conversational knowledge assistant over policies and SOPs, built with compliance, legal and advisory teams. It replaced manual document search with plain-language Q&A.' },
        { t: 'q', text: 'How does it find the right answer?' },
        { t: 'a', text: 'RAG on Azure OpenAI with hybrid retrieval, BM25 plus vectors. A LangGraph agent decides when to retrieve, which source to query, and when to iterate.' },
        { t: 'a', card: { type: 'pipeline', title: 'Every question', stages: ['Plan', 'Retrieve', 'Ground', 'Answer'], note: 'Fewer multi-document failures than top-k' } },
        { t: 'q', text: 'How do you stop it making things up?' },
        { t: 'a', text: 'Confidence scoring and structured refusal. Hallucination on out-of-scope questions stayed under 3% in quarterly audits, and every response is logged for audit.' },
        { t: 'a', card: { type: 'stat', value: '<3%', label: 'hallucination on out-of-scope questions' } }
      ],
      replies: [
        { q: 'Who can see which documents?', a: [
          { text: 'Microsoft Entra ID handles it: app registrations, OAuth 2.0 tokens and role-based access, so people only retrieve documents they are authorized to see.' }
        ] },
        { q: 'How do you test prompt changes?', a: [
          { text: 'An evaluation harness in Ragas and LangSmith with a 500+ query golden set. It runs as a blocking GitHub Actions gate on every prompt and model change, so regressions get caught before production.' },
          { card: { type: 'pipeline', title: 'Every prompt or model change', stages: ['Change', 'Evaluate', 'Gate', 'Ship'], note: '500+ query golden set' } }
        ] },
        { q: 'What about cost?', a: [
          { text: 'Cost-aware routing: simple lookups take a lightweight path, and only complex questions escalate to full agent reasoning. Per-query inference cost went down while task-completion SLOs held.' }
        ] },
        { q: 'How did you work with the business?', a: [
          { text: 'I led weekly demos, Responsible AI reviews and technical readouts for the business and compliance stakeholders.' }
        ] }
      ]
    }),
    fromRole('appworks', {
      name: 'Appworks',
      short: 'Appworks',
      org: 'Appworks · McAllen, TX (hybrid)',
      preview: 'Rahul: p99 under 80 ms on ECS.',
      summary: 'FastAPI services on AWS Lambda for a regulated transaction pipeline, an LLM ticket-routing proof of concept, and a fraud-scoring API on ECS.',
      script: [
        { t: 'date', text: 'February 2025' },
        { t: 'sys', text: 'Rahul joined as Associate Software Engineer – Generative AI · McAllen, TX (hybrid)' },
        { t: 'q', text: 'What did you work on at Appworks?' },
        { t: 'a', text: 'REST APIs in FastAPI wired to AWS Lambda, automating event-driven data workflows in a regulated transaction-processing pipeline. PostgreSQL was the system of record.' },
        { t: 'q', text: 'Any generative AI?' },
        { t: 'a', text: 'An LLM proof of concept that auto-classifies and routes support tickets. I designed the prompts and parsed the structured JSON output into routing logic for the operations teams.' },
        { t: 'q', text: 'Anything performance-critical?' },
        { t: 'a', text: 'A containerized fraud-scoring API, auto-scaled on ECS for peak transaction windows.' },
        { t: 'a', card: { type: 'stat', value: 'p99 < 80ms', label: 'fraud-scoring API latency' } }
      ],
      replies: [
        { q: 'How did you handle bad data?', a: [
          { text: 'I rebuilt a data-transformation integration with strict input validation, so malformed records were flagged instead of silently dropped.' },
          { text: 'New pytest coverage on two services caught a validation defect before it reached downstream systems.' }
        ] },
        { q: 'Which stack?', a: [
          { text: 'Python, FastAPI, AWS Lambda, PostgreSQL, Docker, ECS and pytest, with Jira and Agile/Scrum.' }
        ] }
      ]
    }),
    fromRole('dxc', {
      name: 'DXC Technology',
      short: 'DXC',
      org: 'DXC Technology · Bangalore, India',
      preview: 'Rahul: Automated a manual vendor import.',
      summary: 'Backend services and integrations in Java and Python for retail and logistics clients, Python ingestion pipelines, an AWS migration and SQL tuning.',
      script: [
        { t: 'date', text: 'May 2022' },
        { t: 'sys', text: 'Rahul joined as Software Engineer Intern · Bangalore, India' },
        { t: 'q', text: 'What was the internship?' },
        { t: 'a', text: 'Backend services and integrations in Java and Python for high-volume transactional workflows, for retail and logistics clients across several regions.' },
        { t: 'q', text: 'Anything you automated?' },
        { t: 'a', text: 'A manual vendor CSV import. I built scheduled Python pipelines that synced third-party data into internal systems, so analysts no longer had to do it by hand.' },
        { t: 'a', card: { type: 'stat', value: '5+', label: 'full SDLC client cycles delivered' } }
      ],
      replies: [
        { q: 'Any cloud work?', a: [
          { text: 'I migrated legacy on-premises modules to AWS (EC2, S3, RDS): environment configuration, provisioning and post-migration validation.' }
        ] },
        { q: 'And databases?', a: [
          { text: 'I optimized SQL queries and stored procedures with better indexing, which cut report execution time on large datasets.' }
        ] },
        { q: 'How long was it?', a: [{ text: 'Eight months, May to December 2022.' }] }
      ]
    })
  ];

  // Free-text questions: first match wins, so the more specific patterns come first.
  const KB = [
    { k: /hallucinat|guardrail|refus|responsible|governance|\bsafe|trust|audit/i, a: [
      { text: 'Confidence scoring and structured refusal kept hallucination on out-of-scope questions under 3% in quarterly audits at NextGen. Every response is logged, and I led the Responsible AI reviews.' },
      { card: { type: 'stat', value: '<3%', label: 'hallucination on out-of-scope questions' } }
    ] },
    { k: /\beval|ragas|langsmith|\btest|golden|regression|quality|\bci\b|\bgate/i, a: [
      { text: 'A 500+ query golden set in Ragas and LangSmith runs as a blocking GitHub Actions gate on every prompt and model change, catching regressions before production.' },
      { card: { type: 'pipeline', title: 'Every prompt or model change', stages: ['Change', 'Evaluate', 'Gate', 'Ship'], note: '500+ query golden set' } }
    ] },
    { k: /\brag\b|retriev|bm25|vector|hybrid|search|pinecone|pgvector|faiss|ground/i, a: [
      { text: 'Hybrid retrieval, BM25 plus vectors, grounding Azure OpenAI in the organization’s own policies and SOPs. A LangGraph agent decides when to retrieve, which source to query and when to iterate, which cut multi-document answer failures against the old top-k baseline.' }
    ] },
    { k: /agent|langgraph|langchain|\badk\b|tool.?call/i, a: [
      { text: 'At NextGen, a multi-step LangGraph agent plans retrieval for the knowledge assistant. In The Gallery, Gemini 2.5 Flash runs through Google ADK to direct a live F1 feed.' },
      { card: { type: 'link', title: 'The Gallery', desc: 'Watch the race director work', href: 'projects.html#gallery' } }
    ] },
    { k: /entra|oauth|\bauth|security|secure|access|identity|permission/i, a: [
      { text: 'Microsoft Entra ID: app registrations, OAuth 2.0 tokens and role-based access, so users only retrieve documents they are authorized to see. I have also secured Power Platform custom connectors the same way.' }
    ] },
    { k: /cost|cheap|routing|budget|finops|billing|invoice|spend/i, a: [
      { text: 'At NextGen, cost-aware routing sends simple lookups down a lightweight path and escalates only complex questions to full agent reasoning.' },
      { text: 'FinOpsAI goes further: it attributes LLM spend to cost centers, forecasts the month-end invoice at 4.16% MAPE, and tells a gateway to allow, downgrade or block a call.' },
      { card: { type: 'link', title: 'FinOpsAI', desc: 'Try the policy endpoint', href: 'projects.html#finopsai' } }
    ] },
    { k: /power ?(platform|automate|apps)|dataverse|copilot|pl-?[29]00|low.?code|connector/i, a: [
      { text: 'Hands-on with Microsoft Copilot Studio, Power Automate and Dataverse, including custom connectors secured with Microsoft Entra ID and OAuth 2.0. I hold Microsoft’s PL-900 and PL-200 Power Platform certifications.' }
    ] },
    { k: /gpu|cuda|triton|kernel|metal|mlx|pytorch|inference|roofline|throughput|tok\/s/i, a: [
      { text: 'In Hardware-Aware Gateway I wrote fused RMSNorm and SwiGLU kernels in Triton and Metal: up to 5.75× over eager PyTorch at prefill on a Tesla T4.' },
      { text: 'Roofline analysis showed decode was dispatch-bound, so CUDA-graph capture beat a new kernel: 1.72× decode throughput, 28.0 to 48.1 tok/s, with identical tokens.' },
      { card: { type: 'link', title: 'Hardware-Aware Gateway', desc: 'See the decode model', href: 'projects.html#hwgateway' } }
    ] },
    { k: /gemini|\bf1\b|formula|gallery|race|tts|commentary/i, a: [
      { text: 'The Gallery pairs a 10 Hz telemetry scorer with Gemini 2.5 Flash via Google ADK. It caught 50% of live passes against a 1.8% baseline, at $0.0026 per decision, with Gemini multi-speaker TTS commentary on top.' },
      { card: { type: 'link', title: 'The Gallery', desc: 'Watch the race director work', href: 'projects.html#gallery' } }
    ] },
    { k: /azure|\baks\b|openai|foundry/i, a: [
      { text: 'Production experience on Microsoft Azure: Azure OpenAI, AI Foundry and AKS, with Microsoft Entra ID for security.' }
    ] },
    { k: /\baws\b|lambda|\becs\b|bedrock|textract|cloud|\bec2\b|\bs3\b|\brds\b/i, a: [
      { text: 'AWS Lambda and ECS at Appworks, an on-premises to AWS migration (EC2, S3, RDS) at DXC, and Bedrock usage logs in FinOpsAI. I’m also an AWS Certified Developer.' }
    ] },
    { k: /fraud|latenc|p99|fast|perform/i, a: [
      { text: 'At Appworks I deployed a containerized fraud-scoring API with p99 latency under 80 ms, auto-scaled on ECS for peak transaction windows.' }
    ] },
    { k: /python|fastapi|\bjava\b|\bsql\b|postgres|mysql|language/i, a: [
      { text: 'Python and FastAPI day to day, Java from my DXC work, and SQL on PostgreSQL and MySQL, including tuning queries and stored procedures.' }
    ] },
    { k: /degree|stud(y|ied)|universit|rowan|college|school|educat|scholar|b\.?tech/i, a: [
      { text: 'A Bachelor of Technology in Computer Science from Rowan University, December 2024, on a merit-based International Credit Transfer Scholarship.' }
    ] },
    { k: /certif/i, a: [
      { text: 'Microsoft Certified: Power Platform (PL-900 and PL-200), AWS Certified Developer, Hugging Face Agents, IBM Generative AI, IBM Design Thinking, and the Machine Learning Specialization from Stanford and DeepLearning.AI.' }
    ] },
    { k: /salary|\bpay\b|compensation|visa|sponsor|relocat|remote|notice period/i, a: [
      { text: 'Happy to talk about that directly. Email me at rahul.r24.c@gmail.com.' }
    ] },
    { k: /\bhire|hiring|availab|\bjob\b|open to|interview|opportunit/i, a: [
      { text: 'Glad you asked. The quickest way to talk about a role is email: rahul.r24.c@gmail.com.' },
      { card: { type: 'link', title: 'Contact', desc: 'Email, phone, LinkedIn and GitHub', href: 'contact.html' } }
    ] },
    { k: /contact|email|phone|reach|\bcall\b|github|linkedin|r[ée]sum[ée]|\bcv\b/i, a: [
      { text: 'Email rahul.r24.c@gmail.com, call (856) 526-9115, connect at linkedin.com/in/rahulchidipudi, or find my code at github.com/Rahu378. My résumé is at rahu378.github.io/resume.' }
    ] },
    { k: /^(hi|hey|hello|yo|hola|sup)\b|how are you/i, a: [
      { text: 'Hi! Ask me about RAG, agents, guardrails, evaluation, Azure, or the GPU kernels.' }
    ] },
    { k: /thank|thx|\bcool\b|great|nice|awesome/i, a: [
      { text: 'Thanks for reading! The projects page has a live model of each project I mentioned.' }
    ] }
  ];
  const FALLBACK = [{ text: 'I’d rather answer that one properly than guess. Email me at rahul.r24.c@gmail.com and I’ll reply.' }];

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
    } else if (c.type === 'pipeline') {
      const p = h('div', 'c-pipe');
      c.stages.forEach((s, i) => { const e = h('span', '', s); e.style.setProperty('--i', i); p.append(e); });
      box.append(h('span', 'c-title', c.title), p, h('span', 'c-note', c.note));
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
    if (/stack|tech|tools?\b|framework/i.test(q) && c.uses) return [{ text: `At ${c.short}: ${c.uses.join(', ')}.` }];
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
