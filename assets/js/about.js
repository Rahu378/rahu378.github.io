/* About: the portrait drifts with the scroll, and each hackathon's field is drawn as dots,
   four to a column, with the teams ahead dark and mine in blue. */
(() => {
  const portrait = document.getElementById('portrait');
  if (portrait && !window.Site.reduce) window.Site.scrub(portrait, p => portrait.style.setProperty('--py', p.toFixed(4)));

  document.querySelectorAll('.dots').forEach(el => {
    const total = +el.dataset.total, rank = +el.dataset.rank;
    el.style.gridTemplateColumns = `repeat(${Math.ceil(total / 4)}, minmax(0, 1fr))`;
    for (let i = 1; i <= total; i++) {
      const d = document.createElement('i');
      d.style.setProperty('--i', i);
      if (i === rank) d.className = 'me';
      else if (i < rank) d.className = 'ahead';
      el.append(d);
    }
  });
})();
