(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionButton = document.querySelector('.motion-toggle');
    let paused = false;
    try { paused = sessionStorage.getItem('portfolio-motion-paused') === 'true'; } catch { /* Storage is optional. */ }
    const motionOff = () => paused || reducedMotion.matches;
    let renderJourney = () => {};
    const updateMotion = () => {
        document.body.classList.toggle('motion-paused', motionOff());
        if (motionButton) {
            motionButton.setAttribute('aria-pressed', String(motionOff()));
            motionButton.disabled = reducedMotion.matches;
            motionButton.textContent = reducedMotion.matches ? 'Reduced motion' : paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
        }
        renderJourney();
    };
    if (motionButton) {
        motionButton.hidden = false;
        motionButton.addEventListener('click', () => {
            paused = !paused;
            try { sessionStorage.setItem('portfolio-motion-paused', String(paused)); } catch { /* Storage is optional. */ }
            updateMotion();
        });
    }
    reducedMotion.addEventListener('change', updateMotion);
    updateMotion();

    const interests = {
        build: ['01 / Build', 'From an idea to something real.', 'Software is a place to turn curiosity into something useful. Explore the work and the systems behind it.', 'Explore my work', '/work'],
        play: ['02 / Play', 'Room for a little play.', 'A different kind of challenge, a shared adventure, or a good game. What have you been playing?', 'Talk games', '/#contact'],
        wander: ['03 / Wander', 'Take the scenic route.', 'Sometimes curiosity is a reason to step away from the screen. Have a place or a story worth sharing?', 'Share a story', '/#contact'],
        wonder: ['04 / Wonder', 'Start with “what if?”', 'An unexpected idea or a question without an obvious answer. There’s always something else to explore.', 'Start a conversation', '/#contact']
    };
    const constellation = document.querySelector('.constellation');
    const choices = [...document.querySelectorAll('[data-interest]')];
    const conversationIcon = document.querySelector('.conversation-action .ui-icon');
    const workIcon = document.querySelector('#interest-link .ui-icon');
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
        link.classList.toggle('conversation-action', key !== 'build');
        link.replaceChildren(document.createTextNode(label + ' '), (key === 'build' ? workIcon : conversationIcon).cloneNode(true));
    }));

    // A document-space rail keeps the craft in the outer gutter, away from text and controls.
    // Native scroll position is the only timeline; scrolling backwards reverses every scene.
    const rail = document.querySelector('.journey-rail');
    if (rail) {
        const main = document.querySelector('.journey-main');
        const hero = document.querySelector('.hero');
        const contact = document.querySelector('#contact');
        const track = rail.querySelector('.journey-track');
        const base = rail.querySelector('.journey-base');
        const drawn = rail.querySelector('.journey-drawn');
        const craft = rail.querySelector('.journey-craft');
        const dock = rail.querySelector('.journey-dock');
        const stars = hero.querySelector('.stars');
        const scene = hero.querySelector('.orbit-scene');
        const reveals = [...document.querySelectorAll('[data-reveal]')];
        const assembly = document.querySelector('.assembly-stage');
        const tiles = [...document.querySelectorAll('.assembly-tile')];
        const firstName = document.querySelector('.name-first');
        const lastName = document.querySelector('.name-last');
        const connectionPaths = [...document.querySelectorAll('.connections path')];
        const connectionLengths = connectionPaths.map(path => path.getTotalLength());
        connectionPaths.forEach((path, index) => path.style.strokeDasharray = String(connectionLengths[index]));
        const layoutTop = element => {
            let top = 0;
            for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
            return top;
        };
        let assemblyTop = 0, aboutTop = 0, exploreTop = 0, contactTop = 0;
        const clamp = value => Math.max(0, Math.min(1, value));
        let length = 0, end = 0, start = 0, mainTop = 0, pending = false;
        let revealPositions = [], constellationTop = 0;
        const measure = () => {
            mainTop = layoutTop(main);
            start = Math.min(hero.offsetHeight * 0.55, 440);
            contactTop = layoutTop(contact);
            end = contactTop - mainTop + 95;
            const height = main.offsetHeight;
            const width = rail.clientWidth;
            const x = width / 2, swing = width * 0.3;
            const step = (end - start) / 3;
            let d = `M ${x} ${start}`;
            for (let i = 0; i < 3; i++) {
                const sign = i % 2 ? -1 : 1;
                d += ` C ${x + swing * sign} ${start + step * (i + 0.3)}, ${x - swing * sign} ${start + step * (i + 0.7)}, ${x} ${start + step * (i + 1)}`;
            }
            track.setAttribute('viewBox', `0 0 ${width} ${height}`);
            base.setAttribute('d', d);
            drawn.setAttribute('d', d);
            length = base.getTotalLength();
            drawn.style.strokeDasharray = String(length);
            dock.style.transform = `translate(${x - 12}px, ${end - 12}px)`;
            revealPositions = reveals.map(layoutTop);
            constellationTop = layoutTop(constellation);
            assemblyTop = layoutTop(assembly);
            aboutTop = layoutTop(document.querySelector('#about'));
            exploreTop = layoutTop(document.querySelector('#explore'));
            window.portfolioCosmos?.resize();
            renderJourney();
        };
        renderJourney = () => {
            pending = false;
            if (!length) return;
            const off = motionOff();
            const progress = off ? 1 : clamp(scrollY / Math.max(1, mainTop + end - innerHeight * 0.56));
            rail.dataset.progress = progress.toFixed(4);
            const point = base.getPointAtLength(length * progress);
            const next = base.getPointAtLength(Math.min(length, length * progress + 2));
            const angle = progress >= 1 ? 45 : Math.atan2(next.y - point.y, next.x - point.x) * 180 / Math.PI + 45;
            craft.style.transform = `translate(${point.x - 15}px, ${point.y - 15}px) rotate(${angle}deg)`;
            drawn.style.strokeDashoffset = String(length * (1 - progress));
            document.body.classList.toggle('journey-arrived', progress > 0.98);
            const depth = off ? 0 : Math.min(scrollY, hero.offsetHeight);
            stars.style.transform = `translateY(${depth * 0.18}px)`;
            scene.style.transform = `translateY(${depth * (innerWidth <= 600 ? 0.035 : 0.09)}px)`;
            const departure = off ? 0 : clamp(scrollY / (hero.offsetHeight * .8));
            firstName.style.transform = `translate3d(${-departure * 60}px, ${-departure * 75}px, 0) scale(${1 - departure * .12})`;
            lastName.style.transform = `translate3d(${departure * 80}px, ${-departure * 25}px, 0) scale(${1 - departure * .06})`;
            reveals.forEach((el, index) => {
                const visible = off ? 1 : clamp((scrollY + innerHeight * .94 - revealPositions[index]) / (innerHeight * .43));
                const remaining = 1 - visible;
                const side = el.classList.contains('about-heading') ? -1 : el.classList.contains('contact-form') ? 1 : 0;
                const distance = innerWidth <= 600 ? 25 : 75;
                el.style.opacity = String(.65 + visible * .35);
                el.style.transform = `translate3d(${side * remaining * distance}px, ${remaining * 70}px, 0) scale(${1 - remaining * .035})`;
            });
            tiles.forEach((el, index) => {
                const placed = off ? 1 : clamp((scrollY + innerHeight * .95 - assemblyTop - index * 45) / (innerHeight * .55));
                const remain = 1 - placed;
                const x = (index - 1.5) * (innerWidth <= 600 ? 27 : 125) * remain;
                const y = (index % 2 ? -120 : 150) * remain;
                el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${(index - 1.5) * 22 * remain}deg) rotateY(${(index % 2 ? 35 : -35) * remain}deg) scale(${.66 + placed * .34})`;
            });
            choices.forEach((el, index) => {
                const assembled = off ? 1 : clamp((scrollY + innerHeight * .92 - constellationTop - index * 22) / (innerHeight * .4));
                const remain = 1 - assembled;
                const spread = innerWidth <= 600 ? 24 : 115;
                el.style.transform = `translate(${(index % 2 ? 1 : -1) * remain * spread}px, ${remain * (innerWidth <= 600 ? 45 : index < 2 ? -65 : 80)}px) rotate(${(index % 2 ? 18 : -18) * remain}deg) scale(${.7 + assembled * .3})`;
                connectionPaths[index].style.strokeDashoffset = String(connectionLengths[index] * remain);
            });
            const anchors = [0, Math.max(1, aboutTop - innerHeight * .35), exploreTop - innerHeight * .35, contactTop - innerHeight * .35];
            let cosmicProgress = 3;
            for (let stage = 0; stage < 3; stage++) {
                if (scrollY <= anchors[stage + 1]) {
                    cosmicProgress = stage + clamp((scrollY - anchors[stage]) / Math.max(1, anchors[stage + 1] - anchors[stage]));
                    break;
                }
            }
            window.portfolioCosmos?.render(off ? 0 : cosmicProgress, off);

        };
        addEventListener('scroll', () => {
            if (!pending) { pending = true; requestAnimationFrame(renderJourney); }
        }, { passive: true });
        addEventListener('resize', measure);
        addEventListener('pageshow', measure);
        new ResizeObserver(measure).observe(main);
        measure();
        document.body.classList.add('journey-ready');
    }

    const form = document.querySelector('.contact-form form');
    if (form) {
        const submit = form.querySelector('button[type="submit"]');
        const label = submit.querySelector('.submit-label');
        let submitting = false;
        const restore = () => { submitting = false; submit.disabled = false; label.textContent = 'Send message'; };
        form.addEventListener('submit', event => {
            if (submitting) { event.preventDefault(); return; }
            submitting = true;
            submit.disabled = true;
            label.textContent = 'Sending…';
        });
        addEventListener('pageshow', restore);
    }
    const feedback = document.querySelector('.contact-feedback');
    if (feedback) {
        feedback.scrollIntoView({ block: 'center', behavior: 'instant' });
        feedback.focus({ preventScroll: true });
    }
})();
