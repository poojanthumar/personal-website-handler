(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const locale = window.WeddingI18n;
  const clamp = value => Math.max(0, Math.min(1, value));
  const select = document.querySelector('#language-select');
  let language = localStorage.getItem('weddingLanguage') || 'en';
  let motionPaused = false;
  let framePending = false;

  function setLanguage(next) {
    if (!['en', 'hi', 'gu'].includes(next)) return;
    language = next;
    localStorage.setItem('weddingLanguage', next);
    document.documentElement.lang = next;
    if (select) select.value = next;
    document.querySelectorAll('[data-language-choice]').forEach(button => {
      button.classList.toggle('is-selected', button.dataset.languageChoice === next);
      button.setAttribute('aria-pressed', String(button.dataset.languageChoice === next));
    });
    locale?.translate(next);
    document.dispatchEvent(new CustomEvent('wedding:language', { detail: { language: next } }));
  }
  setLanguage(language);
  select?.addEventListener('change', event => setLanguage(event.target.value));
  document.querySelectorAll('[data-language-choice]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.languageChoice)));

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  menu?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(link => {
    if (link.pathname === location.pathname) link.classList.add('is-active');
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menu?.setAttribute('aria-expanded', 'false');
    });
  });

  const toggle = document.querySelector('.motion-toggle');
  function updateMotionPreference() {
    document.body.classList.toggle('motion-paused', motionPaused || reduced.matches);
    if (toggle) {
      toggle.hidden = reduced.matches;
      toggle.setAttribute('aria-pressed', String(motionPaused));
      toggle.setAttribute('aria-label', locale?.text(motionPaused ? 'resumeMotion' : 'pauseMotion', language) || (motionPaused ? 'Resume motion' : 'Pause motion'));
      toggle.textContent = motionPaused ? '▷' : 'Ⅱ';
    }
    document.dispatchEvent(new Event('wedding:motion'));
    requestRender();
  }
  toggle?.addEventListener('click', () => { motionPaused = !motionPaused; updateMotionPreference(); });
  reduced.addEventListener('change', updateMotionPreference);
  document.addEventListener('wedding:language', updateMotionPreference);

  const cover = document.querySelector('.invite-cover');
  const content = document.querySelector('#site-content');
  function finishOpening() {
    if (!cover || !content) return;
    content.hidden = false;
    cover.hidden = true;
    cover.classList.remove('is-opening');
    sessionStorage.setItem('weddingOpened', 'true');
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    requestRender();
    paintScratchers();
  }
  function openCover(instant = false) {
    if (!cover || !content || cover.classList.contains('is-opening')) return;
    if (instant || reduced.matches) { finishOpening(); return; }
    cover.classList.add('is-opening');
    window.setTimeout(finishOpening, 740);
  }
  const sections = [...document.querySelectorAll('.motion-section')];
  function renderHomeMotion() {
    framePending = false;
    if (motionPaused || reduced.matches) return;
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const progress = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      section.style.setProperty('--section-progress', progress.toFixed(3));
    }
  }
  function requestRender() {
    if (!framePending) { framePending = true; requestAnimationFrame(renderHomeMotion); }
  }
  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender, { passive: true });
  requestRender();
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: .13 }) : null;
  document.querySelectorAll('.reveal-on-scroll').forEach(node => revealObserver ? revealObserver.observe(node) : node.classList.add('is-visible'));

  const scratchers = [];
  function paintScratchers() { scratchers.forEach(paint => paint()); }
  document.querySelectorAll('[data-scratch]').forEach(card => {
    const canvas = card.querySelector('canvas');
    const button = card.querySelector('.scratch-button');
    const ctx = canvas?.getContext('2d');
    if (!ctx) { if (canvas) canvas.hidden = true; return; }
    let done = false, drawing = false, previous = null, cleared = 0;
    let width = 0, height = 0;
    const reveal = () => {
      done = true;
      card.classList.add('is-revealed');
      button.setAttribute('aria-expanded', 'true');
      button.textContent = locale?.text('revealed', language) || 'Revealed';
    };
    function paint() {
      if (done) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      width = bounds.width; height = bounds.height;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const shine = ctx.createLinearGradient(0, 0, width, height);
      shine.addColorStop(0, '#c7a371'); shine.addColorStop(.5, '#f0deb5'); shine.addColorStop(1, '#b88b56');
      ctx.fillStyle = shine; ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#ffffff70'; ctx.lineWidth = 1;
      for (let x = 16; x < width; x += 26) for (let y = 16; y < height; y += 26) { ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = '#684a31'; ctx.textAlign = 'center'; ctx.font = 'italic 34px Georgia';
      ctx.fillText('✦', width / 2, height / 2 - 42);
      ctx.font = '600 14px sans-serif';
      ctx.fillText(locale?.text('scratchPrompt', language) || 'SCRATCH TO REVEAL', width / 2, height / 2 + 5);
    }
    function point(event) { const box = canvas.getBoundingClientRect(); return { x: event.clientX - box.left, y: event.clientY - box.top }; }
    function erase(a, b) {
      ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 42;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    canvas.addEventListener('pointerdown', event => {
      if (done) return;
      drawing = true; previous = point(event); canvas.setPointerCapture(event.pointerId);
      erase(previous, { x: previous.x + 1, y: previous.y + 1 });
    });
    canvas.addEventListener('pointermove', event => {
      if (!drawing || done) return;
      const next = point(event); erase(previous, next); previous = next; cleared++;
      if (cleared > 18) reveal();
    });
    canvas.addEventListener('pointerup', () => { drawing = false; });
    canvas.addEventListener('pointercancel', () => { drawing = false; });
    button.addEventListener('click', reveal);
    new ResizeObserver(paint).observe(canvas);
    scratchers.push(paint);
  });

  const dialog = document.querySelector('.rsvp-dialog');
  document.querySelectorAll('[data-rsvp-trigger]').forEach(link => link.addEventListener('click', event => {
    if (!dialog?.showModal) return;
    event.preventDefault(); dialog.showModal();
  }));
  dialog?.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  document.querySelectorAll('[data-response-form]').forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity() || form.dataset.sending === 'true') return;
      const button = form.querySelector('[data-response-submit]');
      const status = form.querySelector('.form-status');
      form.dataset.sending = 'true'; button.disabled = true;
      status.textContent = locale.text('saving', language);
      try {
        const response = await fetch(form.action, { method: 'POST', credentials: 'same-origin',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)) });
        if (!response.ok) {
          status.textContent = locale.text(response.status === 429 ? 'rateLimited' : 'submitError', language);
          button.disabled = false;
        } else {
          status.textContent = locale.text(form.dataset.responseForm === 'rsvp' ? 'rsvpSaved' : 'blessingSaved', language);
          form.reset();
        }
      } catch {
        status.textContent = locale.text('networkError', language); button.disabled = false;
      } finally { form.dataset.sending = 'false'; }
    });
  });
  if (cover && content) {
    if (sessionStorage.getItem('weddingOpened') === 'true' || location.hash) finishOpening();
    cover.querySelector('[data-open-cover]')?.addEventListener('click', () => openCover());
    cover.querySelector('[data-skip-cover]')?.addEventListener('click', () => openCover(true));
  }
  updateMotionPreference();
})();
