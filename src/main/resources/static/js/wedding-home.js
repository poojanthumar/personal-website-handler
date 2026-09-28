(() => {
  const root = document.documentElement;
  const opening = document.querySelector(".opening");
  const letter = document.querySelector(".invitation-letter");
  const envelope = document.querySelector(".envelope-shell");
  const openButton = document.querySelector(".envelope-open");
  const skip = document.querySelector(".skip-envelope");
  const motion = document.querySelector("#motion");
  const note = document.querySelector(".scroll-note");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const sections = [
    ...document.querySelectorAll("main > section:not(.opening)"),
  ];
  let opened = false;
  let paused = reduced.matches;
  let pending = false;
  let liftTimer;
  const clamp = (value) => Math.max(0, Math.min(1, value));

  function render() {
    pending = false;
    const raw = clamp(
      -opening.getBoundingClientRect().top /
        Math.max(1, opening.offsetHeight - innerHeight),
    );
    const p = !opened ? 0 : paused ? 1 : raw;
    const startScale = Math.min(0.42, 360 / innerWidth);
    root.style.setProperty("--letter-progress", p);
    root.style.setProperty("--letter-scale", startScale + (1 - startScale) * p);
    root.style.setProperty(
      "--letter-y",
      `${opened ? -Math.min(110, innerHeight * 0.14) * (1 - p) : 70}px`,
    );
    root.style.setProperty("--letter-visible", opened ? 1 : 0);
    root.style.setProperty("--letter-layer", p > 0.12 ? 6 : 2);
    root.style.setProperty("--envelope-opacity", clamp(1 - p * 3));
    root.style.setProperty(
      "--envelope-visibility",
      p > 0.36 ? "hidden" : "visible",
    );
    root.style.setProperty("--opening", p);
    const story = document.querySelector(".story");
    root.style.setProperty(
      "--story",
      paused
        ? 1
        : clamp(
            -story.getBoundingClientRect().top /
              Math.max(1, story.offsetHeight - innerHeight),
          ),
    );
    note.textContent =
      p > 0.9 || paused
        ? "SCROLL TO EXPLORE ↓"
        : "SCROLL TO UNFOLD OUR STORY ↓";
    letter.inert = !opened;
  }
  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(render);
    }
  }
  function openInvitation(skipAnimation = false) {
    if (!opened) {
      opened = true;
      root.classList.add("invite-open", "invite-opening");
      document.body.classList.remove("invitation-closed");
      openButton.setAttribute("aria-expanded", "true");
      openButton.disabled = true;
      sections.forEach((section) => (section.inert = false));
      letter.inert = false;
      note.hidden = false;
      note.tabIndex = -1;
      note.focus({ preventScroll: true });
      clearTimeout(liftTimer);
      liftTimer = setTimeout(
        () => root.classList.remove("invite-opening"),
        1000,
      );
    }
    if (skipAnimation || paused) {
      root.classList.remove("invite-opening");
      root.classList.add("motion-paused");
      paused = true;
      motion.textContent = "Enable motion";
      motion.setAttribute("aria-pressed", "true");
    }
    skip.hidden = true;
    render();
  }
  function setMotion(value) {
    paused = value;
    if (opened) root.classList.toggle("motion-paused", paused);
    motion.setAttribute("aria-pressed", String(paused));
    motion.textContent = paused ? "Enable motion" : "Pause motion";
    schedule();
  }
  // A fresh invitation always starts at its envelope, including a reload.
  if (!location.hash || location.hash === "#home") {
    history.scrollRestoration = "manual";
    scrollTo({ top: 0, behavior: "instant" });
    addEventListener("pageshow", () => {
      if (!opened) scrollTo({ top: 0, behavior: "instant" });
    });
  }
  root.classList.add("motion-ready");
  document.body.classList.add("invitation-closed");
  sections.forEach((section) => (section.inert = true));
  letter.inert = true;
  envelope.hidden = false;
  skip.hidden = false;
  motion.hidden = false;
  openButton.addEventListener("click", () => openInvitation());
  skip.addEventListener("click", () => openInvitation(true));
  document
    .querySelector(".skip")
    .addEventListener("click", () => openInvitation(true));
  motion.addEventListener("click", () => setMotion(!paused));
  reduced.addEventListener("change", (event) => setMotion(event.matches));
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule, { passive: true });
  // Direct section links remain usable without replaying the opening.
  if (location.hash && location.hash !== "#home") openInvitation(true);
  render();

  document.querySelectorAll("[data-placard]").forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.placard);
    trigger.addEventListener("click", () => dialog.showModal());
    dialog
      .querySelector(".close-placard")
      .addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom)
      )
        dialog.close();
    });
    dialog.addEventListener("close", () =>
      trigger.focus({ preventScroll: true }),
    );
  });
})();
