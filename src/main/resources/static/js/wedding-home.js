(() => {
  const entrance = document.querySelector('.entrance');
  const portal = document.querySelector('.portal');
  const button = document.querySelector('.motion-toggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 700px)');
  let paused = false;
  let scheduled = false;
  function render() {
    scheduled = false;
    if (paused || reduced.matches) return;
    const rect = entrance.getBoundingClientRect();
    const progress = mobile.matches
      ? -rect.top / Math.max(1, portal.offsetTop + portal.offsetHeight * .45)
      : -rect.top / Math.max(1, entrance.offsetHeight - window.innerHeight);
    entrance.style.setProperty('--open', Math.min(1, Math.max(0, progress)).toFixed(4));
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(render); }
  }
  function preferences() {
    document.body.classList.toggle('motion-ready', !reduced.matches);
    button.hidden = reduced.matches;
    schedule();
  }
  button.addEventListener('click', () => {
    paused = !paused;
    document.body.classList.toggle('motion-paused', paused);
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Resume motion' : 'Pause motion';
    schedule();
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', preferences);
  mobile.addEventListener('change', schedule);
  preferences();
})();
