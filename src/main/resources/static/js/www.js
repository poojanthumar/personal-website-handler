(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionButton = document.querySelector('.motion-toggle');
    let paused = reducedMotion.matches;
    const updateMotion = () => {
        document.body.classList.toggle('motion-paused', paused);
        motionButton.setAttribute('aria-pressed', String(paused));
        motionButton.disabled = reducedMotion.matches;
        motionButton.textContent = reducedMotion.matches ? 'Reduced motion' : paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
    };
    motionButton.hidden = false;
    motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
    reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updateMotion(); });
    updateMotion();

    const interests = {
        build: ['01 / Build', 'From an idea to something real.', 'Software is a place to turn curiosity into something useful. Explore the work and the systems behind it.', 'Explore my work', '#work'],
        play: ['02 / Play', 'Room for a little play.', 'A different kind of challenge, a shared adventure, or a good game. What have you been playing?', 'Talk games', '#contact'],
        wander: ['03 / Wander', 'Take the scenic route.', 'Sometimes curiosity is a reason to step away from the screen. Have a place or a story worth sharing?', 'Share a story', '#contact'],
        wonder: ['04 / Wonder', 'Start with “what if?”', 'An unexpected idea or a question without an obvious answer. There’s always something else to explore.', 'Start a conversation', '#contact']
    };
    const constellation = document.querySelector('.constellation');
    const choices = [...document.querySelectorAll('[data-interest]')];
    choices.forEach(button => button.addEventListener('click', () => {
        const key = button.dataset.interest;
        const [kicker, title, description, label, href] = interests[key];
        constellation.dataset.active = key;
        choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
        document.getElementById('interest-kicker').textContent = kicker;
        document.getElementById('interest-title').textContent = title;
        document.getElementById('interest-description').textContent = description;
        const link = document.getElementById('interest-link');
        link.href = href;
        link.replaceChildren(document.createTextNode(label + ' '));
        const arrow = document.createElement('span');
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '↗';
        link.append(arrow);
    }));
    const feedback = document.querySelector('.contact-feedback');
    if (feedback) {
        feedback.scrollIntoView({ block: 'center', behavior: 'instant' });
        feedback.focus({ preventScroll: true });
    }
})();
