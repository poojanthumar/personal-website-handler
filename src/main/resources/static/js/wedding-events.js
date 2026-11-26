(() => {
  'use strict';
  const track = document.querySelector('[data-event-track]');
  if (!track) return;
  const stage = track.querySelector('[data-event-stage]');
  const scenes = [...stage.querySelectorAll('.event-scene')];
  const jumps = [...stage.querySelectorAll('[data-event-jump]')];
  const next = stage.querySelector('[data-event-next]');
  const schedule = stage.querySelector('.event-schedule');
  const lastScene = scenes.length - 1;
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => value * value * (3 - 2 * value);
  const prefersStill = () => document.body.classList.contains('motion-paused');
  let active = 0;
  let frame = 0;

  function show(index) {
    if (active === index) return;
    const previous = scenes[active];
    const incoming = scenes[index];
    const restoreFocus = previous.contains(document.activeElement);
    previous.querySelector('.event-placard').open = false;
    previous.classList.remove('is-current');
    previous.inert = true;
    incoming.inert = false;
    incoming.classList.add('is-current');
    document.body.classList.toggle('event-night', incoming.id === 'sangeet');
    active = index;
    jumps.forEach(link => {
      if (link.hash === '#' + incoming.id) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    const last = index === lastScene;
    next.href = last ? '/rsvp' : '#' + scenes[index + 1].id;
    next.querySelector('[data-next-hint]').hidden = last;
    next.querySelector('[data-rsvp-hint]').hidden = !last;
    next.classList.toggle('leads-to-rsvp', last);
    if (restoreFocus) incoming.querySelector('h2').focus({ preventScroll: true });
  }

  function position() {
    const rect = track.getBoundingClientRect();
    return { offset: -rect.top, step: (rect.height - stage.offsetHeight) / lastScene };
  }

  function paintScene(scene, opacity, copy, pullback, pan) {
    scene.style.setProperty('--scene-alpha', opacity);
    scene.style.setProperty('--copy-alpha', copy);
    scene.style.setProperty('--scene-scale', 1.02 - pullback * .048);
    scene.style.setProperty('--scene-pan', (pan * 1.25) + '%');
  }

  function paint(progress) {
    const still = prefersStill();
    const index = Math.round(progress);
    const from = still ? index : Math.floor(progress);
    const to = Math.min(lastScene, from + 1);
    // Rest briefly on either side of each dissolve so each ceremony can be read.
    const amount = still ? 0 : smooth(clamp((progress - from - .13) / .74));
    const blending = from !== to && amount > 0;
    const pullback = Math.sin(Math.PI * amount);

    scenes.forEach((scene, index) => {
      scene.classList.toggle('is-base', index === from);
      scene.classList.toggle('is-overlay', blending && index === to);
    });
    paintScene(scenes[from], 1, 1 - smooth(clamp(amount / .48)), pullback, -pullback);
    if (blending) paintScene(scenes[to], amount, smooth(clamp((amount - .5) / .36)), pullback, pullback);

    stage.style.setProperty('--event-progress', (still ? index : progress) / lastScene);
    show(index);
  }

  function render() {
    frame = 0;
    const { offset, step } = position();
    if (step <= 0) return;
    paint(Math.min(lastScene, Math.max(0, offset / step)));
  }

  function queueRender() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function go(index, focus) {
    if (index < 0) return;
    const { offset, step } = position();
    window.scrollTo({ top: Math.min(document.documentElement.scrollHeight - innerHeight,
      window.scrollY - offset + step * index), behavior: 'instant' });
    paint(index);
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
  document.addEventListener('wedding:motion', queueRender);
  go(indexFromHash(location.hash), false);
  render();
})();
