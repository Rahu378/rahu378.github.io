/* Contact: copy the address, and turn the visitor's choices into a mailto: link. Nothing is sent from the page. */
(() => {
  const R = window.RESUME;
  const email = (R && R.email) || 'rahulchidipudi@outlook.com';

  const copy = document.getElementById('copy');
  const copied = document.getElementById('copied');
  if (copy) {
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copy.dataset.copy);
        copied.textContent = 'Copied to your clipboard.';
      } catch {
        copied.textContent = 'Select the address above to copy it.';
      }
      setTimeout(() => { copied.textContent = ''; }, 2600);
    });
  }

  const form = document.getElementById('compose');
  const preview = document.getElementById('preview');
  if (!form) return;
  const build = () => {
    const data = new FormData(form);
    const topic = String(data.get('topic') || 'Hello').trim();
    const name = String(data.get('name') || '').trim().slice(0, 80);
    const note = String(data.get('note') || '').trim().slice(0, 1500);
    const subject = name ? `${topic}, from ${name}` : topic;
    const body = `Hi Rahul,\n\n${note || ''}\n\n${name ? `${name}\n` : ''}`.replace(/\n{3,}$/, '\n');
    return { subject, href: `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
  };
  const update = () => { preview.textContent = `Subject: ${build().subject}`; };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', e => {
    e.preventDefault();
    location.href = build().href;
  });
  update();
})();
