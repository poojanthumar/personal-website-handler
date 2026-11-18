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
    document.querySelectorAll('[data-current-language]').forEach(node => node.textContent = {en:'EN',hi:'हिं',gu:'ગુ'}[next]);
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
      toggle.replaceChildren();
      const icon = document.createElement('img'); icon.className = 'sf-icon'; icon.alt = '';
      icon.src = '/images/wedding/sf/' + (motionPaused ? 'play.fill' : 'pause.fill') + '.png';
      toggle.append(icon);
    }
    document.dispatchEvent(new Event('wedding:motion'));
    requestRender();
  }
  toggle?.addEventListener('click', () => { motionPaused = !motionPaused; updateMotionPreference(); });
  reduced.addEventListener('change', updateMotionPreference);
  document.addEventListener('wedding:language', updateMotionPreference);

  const cover = document.querySelector('.invite-cover');
  const content = document.querySelector('#site-content');
  let openingTimer;
  function finishOpening() {
    if (!cover || !content) return;
    window.clearTimeout(openingTimer);
    content.hidden = false;
    content.inert = false;
    cover.hidden = true;
    document.body.classList.remove('invite-in-motion');
    sessionStorage.setItem('weddingCurtainOpened', 'true');
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else { window.scrollTo({ top: 0, behavior: 'instant' }); document.querySelector('#invitation')?.focus({ preventScroll:true }); }
    requestRender(); paintScratchers();
  }
  function openCover(instant = false) {
    if (!cover || !content || cover.classList.contains('is-illuminated')) return;
    if (instant || reduced.matches) { finishOpening(); return; }
    content.hidden = false;
    content.inert = true;
    window.scrollTo({ top:0, behavior:'instant' });
    document.body.classList.add('invite-in-motion');
    cover.classList.add('is-illuminated');
    window.setTimeout(() => cover.classList.add('is-opening'), 950);
    openingTimer = window.setTimeout(finishOpening, 3550);
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches && cover?.classList.contains('is-illuminated')) finishOpening();
  });
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
    let done = false, drawing = false, previous = null;
    const emblem = new Image(); emblem.src = '/images/wedding/sf/' + (card.dataset.scratch === 'date' ? 'calendar' : 'mappin.and.ellipse') + '.png';
    emblem.onload = () => paint();
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
      shine.addColorStop(0, '#edd3da'); shine.addColorStop(.5, '#f5e5e8'); shine.addColorStop(1, '#dfbac6');
      ctx.fillStyle = shine; ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#b58c5066'; ctx.lineWidth = 1;
      ctx.strokeRect(12, 12, width - 24, height - 24);
      for (let x = 22; x < width; x += 28) for (let y = 24; y < height; y += 30) {
        ctx.beginPath(); ctx.arc(x, y, .7, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = '#fcf8f3'; ctx.beginPath(); ctx.arc(width/2, height/2-26, 32, 0, Math.PI*2); ctx.fill();
      if (emblem.complete && emblem.naturalWidth) ctx.drawImage(emblem, width/2-12, height/2-38, 24, 24);
      ctx.fillStyle = '#703e50'; ctx.textAlign = 'center';
      ctx.font = '500 12px sans-serif';
      ctx.fillText(locale?.text('scratchPrompt', language) || 'SCRATCH TO REVEAL', width / 2, height / 2 + 37);

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
      const next = point(event); erase(previous, next); previous = next;
    });
    canvas.addEventListener('pointerup', () => {
      drawing = false;
      if (done) return;
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0, samples = 0;
      for (let i = 3; i < pixels.length; i += 64) { samples++; if (pixels[i] < 100) clear++; }
      if (clear / samples > .3) reveal();
    });
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
  if (cover && content && ((sessionStorage.getItem('weddingCurtainOpened') === 'true' && !new URLSearchParams(location.search).has('intro')) || location.hash)) finishOpening();
  const languageDialog = document.querySelector('.language-dialog');
  let closingLanguage = false;
  const languageDone = (skip = false) => {
    if (closingLanguage || !languageDialog?.open) return;
    closingLanguage = true;
    languageDialog.classList.add('is-leaving');
    const leave = () => {
      languageDialog.close(); languageDialog.classList.remove('is-leaving'); closingLanguage = false;
      if (cover && !cover.hidden) openCover(skip);
      else document.querySelector('[data-language-popup]')?.focus();
    };
    if (reduced.matches) leave(); else window.setTimeout(leave, 380);
  };
  document.querySelectorAll('[data-language-popup]').forEach(button => button.addEventListener('click', () => languageDialog?.showModal()));
  document.querySelectorAll('[data-language-done]').forEach(button => button.addEventListener('click', () => languageDone(button.classList.contains('language-close'))));
  languageDialog?.addEventListener('cancel', event => { event.preventDefault(); languageDone(true); });
  if (cover && !cover.hidden) languageDialog?.showModal();
  updateMotionPreference();
})();
