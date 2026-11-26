(() => {
  'use strict';
  const track = document.querySelector('[data-event-track]');
  if (!track) return;
  const stage = track.querySelector('[data-event-stage]');
  const scenes = [...stage.querySelectorAll('.event-scene')];
  const jumps = [...stage.querySelectorAll('[data-event-jump]')];
  const next = stage.querySelector('[data-event-next]');
  const schedule = stage.querySelector('.event-schedule');
  const header = document.querySelector('.site-header');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const prefersStill = () => reduced.matches || document.body.classList.contains('motion-paused');
  let active = 0;
  let frame = 0;
  let cleanupTimer = 0;

  function clearTransition() {
    clearTimeout(cleanupTimer);
    delete stage.dataset.transition;
    scenes.forEach(scene => scene.classList.remove('is-leaving', 'is-entering'));
  }

  function show(index, animate) {
    if (active === index) return;
    const previous = scenes[active];
    const incoming = scenes[index];
    const restoreFocus = previous.contains(document.activeElement);
    clearTransition();
    previous.querySelector('.event-placard').open = false;
    previous.classList.remove('is-current');
    previous.inert = true;
    incoming.inert = false;
    incoming.classList.add('is-current');
    if (animate && !prefersStill()) {
      if (index === active + 1) stage.dataset.transition = incoming.id;
      previous.classList.add('is-leaving');
      incoming.classList.add('is-entering');
      cleanupTimer = setTimeout(clearTransition, 920);
    }
    active = index;
    jumps.forEach(link => {
      if (link.hash === '#' + incoming.id) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    const last = index === scenes.length - 1;
    next.href = last ? '/rsvp' : '#' + scenes[index + 1].id;
    next.querySelector('[data-next-hint]').hidden = last;
    next.querySelector('[data-rsvp-hint]').hidden = !last;
    next.classList.toggle('leads-to-rsvp', last);
    if (restoreFocus) incoming.querySelector('h2').focus({ preventScroll: true });
  }

  function position() {
    const rect = track.getBoundingClientRect();
    const distance = rect.height - stage.offsetHeight;
    return { offset: header.offsetHeight - rect.top, step: distance / (scenes.length - 1) };
  }

  function render() {
    frame = 0;
    const { offset, step } = position();
    if (step <= 0) return;
    const progress = Math.min(scenes.length - 1, Math.max(0, offset / step));
    const index = Math.round(progress);
    show(index, true);
    stage.style.setProperty('--scene-drift', prefersStill() ? '0px' : (progress - index) * -16 + 'px');
  }

  function queueRender() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function go(index, focus) {
    if (index < 0) return;
    const { offset, step } = position();
    window.scrollTo({ top: window.scrollY - offset + step * index, behavior: 'instant' });
    show(index, focus);
    if (focus) scenes[index].querySelector('h2').focus({ preventScroll: true });
    queueRender();
  }

  function indexFromHash(hash) {
    return scenes.findIndex(scene => '#' + scene.id === hash);
  }

  function activateLink(event) {
    const link = event.currentTarget;
    const index = indexFromHash(link.hash);
    if (index < 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    schedule.open = false;
    history.replaceState(history.state, '', link.hash);
    go(index, true);
  }

  track.classList.add('is-pinned');
  scenes.forEach((scene, index) => { scene.inert = index !== active; });
  jumps.forEach(link => link.addEventListener('click', activateLink));
  next.addEventListener('click', activateLink);
  const placards = scenes.map(scene => scene.querySelector('.event-placard'));
  schedule.addEventListener('toggle', () => {
    if (schedule.open) placards.forEach(placard => { placard.open = false; });
  });
  placards.forEach(placard => placard.addEventListener('toggle', () => {
    if (placard.open) schedule.open = false;
  }));
  stage.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const disclosure = stage.querySelector('details[open]');
    if (!disclosure) return;
    disclosure.open = false;
    disclosure.querySelector('summary').focus({ preventScroll: true });
  });
  window.addEventListener('hashchange', () => go(indexFromHash(location.hash), false));
  window.addEventListener('scroll', queueRender, { passive: true });
  window.addEventListener('resize', queueRender);
  document.addEventListener('wedding:motion', () => {
    if (prefersStill()) clearTransition();
    queueRender();
  });
  go(indexFromHash(location.hash), false);
  queueRender();
})();
