(() => {
  'use strict';
  const dialog = document.querySelector('#event-placards');
  if (!dialog?.showModal) return;

  const root = document.documentElement;
  const theme = document.querySelector('meta[name="theme-color"]');
  const pageTheme = theme?.content;
  const strip = dialog.querySelector('[data-reel-strip]');
  const slides = [...strip.querySelectorAll('.reel-slide')];
  const dots = [...dialog.querySelectorAll('.reel-progress i')];
  const previous = dialog.querySelector('[data-reel-prev]');
  const next = dialog.querySelector('[data-reel-next]');
  const hint = dialog.querySelector('[data-reel-hint]');
  const finish = dialog.querySelector('[data-reel-finish]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const chromeByEvent = {
    engagement: '#eadbc3', mandvo: '#efd7b1', haldi: '#f1dce4', sangeet: '#151b3c', wedding: '#e9cec1'
  };
  const motionPaused = () => reduced.matches || document.body.classList.contains('motion-paused');
  let active = 0;
  let frame = 0;
  let returnFocus;
  let returnScroll = 0;

  function setActive(index) {
    const old = slides[active];
    const moveFocus = old !== slides[index] && old.contains(document.activeElement);
    old.classList.remove('is-celebrating');
    active = index;
    const last = active === slides.length - 1;
    slides.forEach((slide, i) => {
      slide.inert = i !== active;
      slide.classList.toggle('is-current', i === active);
      dots[i].classList.toggle('is-seen', i <= active);
    });
    hint.hidden = last;
    finish.hidden = !last;
    if (last && document.activeElement === next) {
      finish.querySelector('a').focus({ preventScroll: true });
    } else if (moveFocus || (active === 0 && document.activeElement === previous)) {
      strip.focus({ preventScroll: true });
    }
    previous.disabled = active === 0;
    next.disabled = last;
    const color = chromeByEvent[slides[active].dataset.event];
    root.style.setProperty('--event-chrome', color);
    if (theme) theme.content = color;
  }

  function scrollToSlide(index, smooth) {
    if (index < 0 || index >= slides.length) return;
    strip.scrollTo({ top: index * strip.clientHeight, behavior: smooth && !motionPaused() ? 'smooth' : 'auto' });
    if (!smooth || motionPaused()) setActive(index);
  }

  function openPlacards(button) {
    if (dialog.open) return;
    returnFocus = button;
    returnScroll = window.scrollY;
    root.classList.add('events-modal-open');
    dialog.showModal();
    scrollToSlide(Number(button.dataset.openEvent), false);
  }

  document.querySelectorAll('[data-open-event]').forEach(button => {
    button.hidden = false;
    const entry = button.closest('.timeline-entry');
    (entry || button).addEventListener('click', event => {
      if (button.contains(event.target) || !window.getSelection()?.toString()) openPlacards(button);
    });
  });
  dialog.querySelectorAll('[data-close-events]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    root.classList.remove('events-modal-open');
    root.style.removeProperty('--event-chrome');
    if (theme) theme.content = pageTheme;
    window.scrollTo({ top: returnScroll, behavior: 'instant' });
    returnFocus?.focus({ preventScroll: true });
  });

  previous.addEventListener('click', () => scrollToSlide(active - 1, true));
  next.addEventListener('click', () => scrollToSlide(active + 1, true));
  strip.addEventListener('scroll', () => {
    if (frame || !dialog.open) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const index = Math.min(slides.length - 1, Math.max(0, Math.round(strip.scrollTop / strip.clientHeight)));
      if (index !== active) setActive(index);
    });
  }, { passive: true });

  dialog.addEventListener('keydown', event => {
    const direction = { ArrowUp: -1, PageUp: -1, ArrowDown: 1, PageDown: 1 }[event.key];
    if (!direction || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    scrollToSlide(active + direction, true);
  });
  new ResizeObserver(() => {
    if (dialog.open) scrollToSlide(active, false);
  }).observe(strip);

  slides.forEach(slide => {
    slide.querySelector('[data-reel-effect]').addEventListener('click', () => {
      if (!motionPaused()) slide.classList.add('is-celebrating');
    });
    slide.addEventListener('animationend', event => {
      if (event.animationName === 'reel-glow') slide.classList.remove('is-celebrating');
    });
  });
  document.addEventListener('wedding:motion', () => {
    if (motionPaused()) slides[active].classList.remove('is-celebrating');
  });
})();
