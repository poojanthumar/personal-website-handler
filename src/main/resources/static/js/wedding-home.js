(() => {
  const stage = document.querySelector('.envelope-stage');
  const envelope = document.querySelector('.envelope');
  const toggle = document.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [...document.querySelectorAll('.event')];
  const hero = document.querySelector('.invitation');
  const story = document.querySelector('.story');
  let paused = false, pending = false;
  const clamp = x => Math.max(0, Math.min(1, x));
  function render() {
    pending = false;
    if (paused || reduced.matches) return;
    const rect = stage.getBoundingClientRect();
    const p = clamp(-rect.top / Math.max(1, rect.height - innerHeight));
    stage.style.setProperty('--open', p);
    stage.style.setProperty('--seal', 1 - clamp(p / .18));
    stage.style.setProperty('--flap', `${-180 * clamp((p - .1) / .32)}deg`);
    stage.style.setProperty('--rise', `${-130 * clamp((p - .28) / .45)}px`);
    stage.style.setProperty('--zoom', 1 + clamp((p - .55) / .45) * .9);
    scenes.forEach(scene => {
      const r = scene.getBoundingClientRect();
      const progress = clamp((innerHeight - r.top) / (r.height + innerHeight));
      scene.style.setProperty('--scene', progress);
    });
    hero.style.setProperty('--hero', clamp(-hero.getBoundingClientRect().top / innerHeight));
    story.style.setProperty('--story', clamp((innerHeight - story.getBoundingClientRect().top) / innerHeight));
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(render); } }
  function preferences() {
    document.body.classList.toggle('motion-ready', !reduced.matches && !paused);
    document.body.classList.toggle('motion-paused', paused);
    toggle.hidden = reduced.matches;
    schedule();
  }
  envelope.addEventListener('click', () => {
    const end = stage.offsetTop + stage.offsetHeight - innerHeight;
    window.scrollTo({ top: reduced.matches || paused ? hero.offsetTop : end, behavior: reduced.matches ? 'instant' : 'smooth' });
  });
  document.querySelector('.replay').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced.matches ? 'instant' : 'smooth' });
    envelope.focus({ preventScroll: true });
  });
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Resume decorative motion' : 'Pause decorative motion');
    preferences();
  });
  stage.hidden = false;
  document.querySelector('.replay').hidden = false;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule);
  reduced.addEventListener('change', preferences);
  new ResizeObserver(schedule).observe(document.body);
  preferences();
  if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
})();
