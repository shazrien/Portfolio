/* script.js — UI interactivity only. All page content lives in the HTML files. */
const root = document.documentElement;
const saved = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
root.setAttribute('data-theme', saved);

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  // Theme toggle
  const tt = document.getElementById('themeToggle');
  if (tt) tt.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Toast helper
  const toast = document.getElementById('toast');
  const showToast = msg => {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
  };

  // Project category filter
  const fbtns = document.querySelectorAll('.filter-btn');
  fbtns.forEach(b => b.addEventListener('click', () => {
    fbtns.forEach(x => x.classList.remove('active')); b.classList.add('active');
    const f = b.dataset.filter;
    document.querySelectorAll('#projectGrid .project-card').forEach(c =>
      c.classList.toggle('hide', f !== 'all' && c.dataset.category !== f));
  }));

  // Accordions
  document.querySelectorAll('.acc-btn').forEach(btn => btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.nextElementSibling.hidden = open;
  }));

  // Lightbox
  const modal = document.getElementById('lightbox'), big = document.getElementById('lightboxImg');
  if (modal) {
    document.querySelectorAll('[data-lightbox]').forEach(img => img.addEventListener('click', () => {
      big.src = img.dataset.lightbox || img.src; big.alt = img.alt; modal.classList.add('open');
    }));
    const close = () => modal.classList.remove('open');
    modal.addEventListener('click', e => { if (e.target !== big) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // Copy email
  const copy = document.getElementById('copyEmail');
  if (copy) copy.addEventListener('click', async () => {
    const email = document.getElementById('emailText').textContent.trim();
    try { await navigator.clipboard.writeText(email); showToast('Email copied to clipboard!'); }
    catch { showToast('Copy failed — please copy it manually.'); }
  });

  // Contact form validation
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const rules = {
      name: v => v.trim().length >= 2 || 'Please enter your name (min 2 characters).',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
      subject: v => v.trim().length >= 3 || 'Please enter a subject.',
      message: v => v.trim().length >= 10 || 'Message must be at least 10 characters.'
    };
    let ok = true;
    Object.keys(rules).forEach(id => {
      const input = form.elements[id], field = input.closest('.field');
      const r = rules[id](input.value);
      field.classList.toggle('invalid', r !== true);
      field.querySelector('.error').textContent = r === true ? '' : r;
      if (r !== true) ok = false;
    });
    const msg = document.getElementById('formSuccess');
    msg.classList.toggle('show', ok);
    if (ok) { form.reset(); msg.focus(); }
  });
});
