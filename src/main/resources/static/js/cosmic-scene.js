/* Abstract particles interpolate between four compositions; no time-driven render loop. */
(() => {
    const canvas = document.querySelector('.cosmic-canvas');
    const context = canvas?.getContext('2d');
    if (!context) return;
    const particles = Array.from({ length: 760 }, (_, i) => ({
        seed: ((i * 16807 + 97) % 2147483647) / 2147483647,
        angle: i * 2.399963229728653,
        radius: Math.sqrt((i + .5) / 760),
        size: .65 + (i % 7) * .2
    }));
    let width = 0, height = 0;
    const mix = (a, b, t) => a + (b - a) * t;
    function position(p, index, stage) {
        const mobile = width <= 600;
        const size = Math.min(width * (mobile ? .63 : .34), height * .49);
        const a = p.angle;
        const r = p.radius;
        if (stage === 0) {
            // A luminous globe, with its near and far layers projected into depth.
            const z = 1 - 2 * (index + .5) / particles.length;
            const ring = Math.sqrt(1 - z * z);
            return [width * (mobile ? .61 : .76) + Math.cos(a) * ring * size,
                height * (mobile ? .72 : .48) + (Math.sin(a) * ring * .56 + z * .55) * size];
        }
        if (stage === 1) {
            // The globe unravels into a broad ribbon across the page.
            const t = index / particles.length;
            return [width * (.08 + .84 * t), height * (.48 + .23 * Math.sin(t * Math.PI * 3)) + Math.sin(a) * r * 55];
        }
        if (stage === 2) {
            // Three inclined orbital rings collect around the interests.
            const ring = .6 + (index % 3) * .18;
            return [width * .5 + Math.cos(a) * size * ring,
                height * .52 + Math.sin(a) * size * ring * .43 + Math.cos(a) * (index % 3 - 1) * size * .28];
        }
        // Warm, expanding arcs arrive beside the invitation to connect.
        return [width * (mobile ? .58 : .24) + Math.cos(a) * size * r,
            height * .45 + Math.sin(a) * size * r * .65];
    }
    window.portfolioCosmos = {
        resize() {
            width = innerWidth; height = innerHeight;
            const ratio = Math.min(devicePixelRatio || 1, 1.5);
            canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        },
        render(progress, disabled) {
            if (!width) this.resize();
            canvas.dataset.scene = progress.toFixed(3);
            context.clearRect(0, 0, width, height);
            if (disabled) return;
            const stage = Math.min(2, Math.floor(progress));
            const linear = progress - stage;
            const t = linear * linear * (3 - 2 * linear);
            const hues = [192, 278, 212, 28];
            const hue = mix(hues[stage], hues[stage + 1], t);
            const glow = context.createRadialGradient(width * .65, height * .5, 0, width * .6, height * .5, width * .55);
            glow.addColorStop(0, `hsla(${hue},85%,55%,.13)`); glow.addColorStop(1, 'transparent');
            context.fillStyle = glow; context.fillRect(0, 0, width, height);
            particles.forEach((p, index) => {
                const from = position(p, index, stage), to = position(p, index, stage + 1);
                const x = mix(from[0], to[0], t), y = mix(from[1], to[1], t);
                context.beginPath();
                context.arc(x, y, p.size * (index % 23 === 0 ? 1.8 : 1), 0, Math.PI * 2);
                context.fillStyle = `hsla(${hue + (index % 5) * 12},85%,${65 + index % 25}%,${.22 + (index % 9) * .055})`;
                context.fill();
            });
        }
    };
})();
