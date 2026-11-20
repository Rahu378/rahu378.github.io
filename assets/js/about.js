/* About: the portrait drifts gently with the scroll. */
(() => {
  const portrait = document.getElementById('portrait');
  if (portrait && !window.Site.reduce) window.Site.scrub(portrait, p => portrait.style.setProperty('--py', p.toFixed(4)));
})();
