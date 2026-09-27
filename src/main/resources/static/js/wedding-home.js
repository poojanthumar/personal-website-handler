(() => {
  const root = document.documentElement;
  const opening = document.querySelector(".opening");
  const story = document.querySelector(".story");
  const button = document.querySelector("#motion");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const note = document.querySelector(".scroll-note");
  let paused = reduced.matches;
  let pending = false;
  const clamp = (value) => Math.max(0, Math.min(1, value));

  function render() {
    pending = false;
    const progress = (element) =>
      clamp(
        -element.getBoundingClientRect().top /
          Math.max(1, element.offsetHeight - innerHeight),
      );
    const openingProgress = paused ? 1 : progress(opening);
    root.style.setProperty("--opening", paused ? 0 : openingProgress);
    root.style.setProperty("--doors", clamp(openingProgress / 0.65));
    root.style.setProperty("--invite-opacity", clamp(1 - openingProgress * 5));
    root.style.setProperty(
      "--invite-visibility",
      openingProgress > 0.2 ? "hidden" : "visible",
    );
    root.style.setProperty(
      "--title-opacity",
      clamp((openingProgress - 0.25) * 4),
    );
    root.style.setProperty("--story", paused ? 1 : progress(story));
    note.textContent =
      paused || openingProgress > 0.65
        ? "SCROLL TO EXPLORE ↓"
        : "SCROLL TO OPEN THE INVITATION ↓";
  }
  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(render);
    }
  }
  function setMotion(value) {
    // Preserve the viewer's place when collapsing or restoring sticky scenes.
    const anchor = [...document.querySelectorAll("main > section")].find(
      (section) => section.getBoundingClientRect().bottom > 90,
    );
    const before = anchor?.getBoundingClientRect().top;
    paused = value;
    root.classList.toggle("motion-paused", paused);
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused ? "Enable motion" : "Pause motion";
    note.textContent = paused
      ? "SCROLL TO EXPLORE ↓"
      : "SCROLL TO OPEN THE INVITATION ↓";
    if (anchor && before !== undefined && anchor !== opening) {
      window.scrollBy({
        top: anchor.getBoundingClientRect().top - before,
        behavior: "instant",
      });
    }
    schedule();
  }

  button.hidden = false;
  root.classList.add("motion-ready");
  button.addEventListener("click", () => setMotion(!paused));
  reduced.addEventListener("change", (event) => setMotion(event.matches));
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  setMotion(paused);
})();
