/* Skills: every skill traced to the roles, projects and certifications that use it. */
(() => {
  const R = window.RESUME;
  const { reduce } = window.Site;
  if (!R) return;

  const h = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  const sources = [
    ...R.roles.map(r => ({ type: 'Experience', name: `${r.title}, ${r.company}`, short: r.company.replace(' IT Solutions', '').replace(' Technology', ''), href: 'experience.html', uses: r.uses, bullets: r.bullets, color: r.color })),
    ...R.projects.map(p => ({ type: 'Project', name: p.full || p.name, short: p.short || p.name, href: `projects.html#${p.id}`, uses: p.uses, bullets: p.bullets, color: p.color === '#ffd60a' ? '#b38f00' : p.color })),
    ...R.credentials.map(c => ({ type: 'Certification', name: c.name, short: c.id === 'aws-cert' ? 'AWS cert' : 'ML cert', href: 'about.html', uses: c.uses, bullets: [c.by], color: '#6e6e73' }))
  ];
  const ALIAS = {
    'REST APIs': ['rest api', 'api'], Microservices: ['microservice', 'services'], 'Gemini 2.5': ['gemini'],
    'Machine Learning': ['machine learning'], 'AWS Bedrock': ['bedrock'], GraphQL: ['graphql'], SQL: ['sql']
  };
  const line = (bullets, skill) => {
    const terms = [skill, skill.replace(/^AWS /, ''), ...(ALIAS[skill] || [])].map(t => t.toLowerCase());
    return bullets.find(b => terms.some(t => b.toLowerCase().includes(t))) || bullets[0];
  };
  const evidence = skill => sources.filter(s => s.uses.includes(skill)).map(s => ({ ...s, line: line(s.bullets, skill) }));

  /* ---------- Explorer ---------- */
  const groupsEl = document.getElementById('groups');
  const panel = document.getElementById('evidence');
  const narrow = matchMedia('(max-width: 900px)');
  let current = null;

  function show(skill, btn) {
    current = skill;
    groupsEl.querySelectorAll('.sk').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    const ev = evidence(skill);
    panel.textContent = '';
    panel.append(h('p', 'ev-skill', skill));
    panel.append(h('p', 'ev-count', ev.length
      ? `Used in ${ev.length} ${ev.length === 1 ? 'place' : 'places'} on my résumé.`
      : 'Listed on my résumé. Not yet part of a featured role or project.'));
    if (ev.length) {
      const ul = h('ul', 'ev-list');
      ul.setAttribute('role', 'list');
      ev.forEach((s, i) => {
        const li = h('li', 'ev-item');
        li.style.setProperty('--i', i);
        const a = h('a');
        a.href = s.href;
        a.style.setProperty('--c', s.color);
        a.append(h('span', 'ev-type', s.type), h('span', 'ev-name', s.name), h('span', 'ev-line', s.line));
        li.append(a);
        ul.append(li);
      });
      panel.append(ul);
    }
    if (narrow.matches) {
      btn.closest('.group').after(panel);
      panel.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  R.skills.forEach(g => {
    const sec = h('div', 'group reveal');
    sec.append(h('h2', '', g.group));
    const ul = h('ul', 'chips');
    ul.setAttribute('role', 'list');
    g.items.forEach(skill => {
      const n = evidence(skill).length;
      const li = h('li');
      const b = h('button', `sk${n ? '' : ' quiet'}`, skill);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      if (n) {
        const badge = h('span', 'n', String(n));
        badge.setAttribute('aria-label', `${n} ${n === 1 ? 'place' : 'places'}`);
        b.append(badge);
      }
      b.addEventListener('click', () => show(skill, b));
      li.append(b);
      ul.append(li);
    });
    sec.append(ul);
    groupsEl.append(sec);
  });
  groupsEl.setAttribute('data-stagger', '');
  groupsEl.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.setProperty('--i', i);
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { el.classList.add('in'); o.disconnect(); } }).observe(el);
  });
  const first = [...groupsEl.querySelectorAll('.sk')].find(b => b.firstChild.textContent === 'Java');
  if (first && !narrow.matches) show('Java', first);
  narrow.addEventListener('change', e => { if (!e.matches) groupsEl.after(panel); });

  /* ---------- Reach chart ---------- */
  const bars = document.getElementById('bars');
  const counts = new Map();
  const add = (skill, s) => { if (!counts.has(skill)) counts.set(skill, new Set()); counts.get(skill).add(s); };
  for (const s of sources) {
    for (const u of s.uses) {
      if (u.startsWith('AWS')) add('AWS', s);
      else add(u, s);
    }
  }
  const top = [...counts.entries()]
    .map(([skill, set]) => ({ skill, list: [...set] }))
    .sort((a, b) => b.list.length - a.list.length || a.skill.localeCompare(b.skill))
    .slice(0, 12);
  const max = top[0].list.length;
  top.forEach((t, i) => {
    const li = h('li');
    li.style.setProperty('--i', i);
    const lbl = h('span', 'lbl');
    lbl.append(h('b', '', t.skill), h('small', '', t.list.map(s => s.short).join(', ')));
    const track = h('span', 'track');
    const fill = h('span', 'fill');
    fill.style.setProperty('--v', (t.list.length / max).toFixed(3));
    track.append(fill);
    li.append(lbl, track, h('span', 'n', String(t.list.length)));
    bars.append(li);
  });
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { bars.classList.add('in'); o.disconnect(); } }, { threshold: 0.2 }).observe(bars);

  /* ---------- Story ---------- */
  const steps = [...document.querySelectorAll('.step')];
  const layers = [...document.querySelectorAll('.layers li')];
  const setLayer = n => {
    steps.forEach(s => s.classList.toggle('on', +s.dataset.l === n));
    layers.forEach(l => {
      const i = +l.dataset.l;
      l.classList.toggle('on', i === n);
      l.classList.toggle('past', i < n);
    });
  };
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) setLayer(+e.target.dataset.l);
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => io.observe(s));
  setLayer(0);
})();
