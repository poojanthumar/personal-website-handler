(() => {
  'use strict';
  const events = [...document.querySelectorAll('[data-event]')];
  if (!events.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = p => p * p * (3 - 2 * p);
  const phase = (p, from, to) => ease(clamp((p - from) / (to - from)));
  const transform = (node, value) => node?.setAttribute('transform', value);
  const part = (node, name) => node?.querySelector(`[data-part="${name}"]`);
  let pending = false;

  const rigs = events.map(event => {
    const rig = {
      event, kind: event.dataset.event,
      bride: event.querySelector('[data-character="bride"]'),
      groom: event.querySelector('[data-character="groom"]'),
      ring: part(event, 'ring'),
      petals: [...event.querySelectorAll('[data-petal]')],
      powder: [...event.querySelectorAll('[data-powder]')],
      brideGarland: part(event, 'bride-garland'),
      groomGarland: part(event, 'groom-garland'),
      flames: part(event, 'flames')
    };
    for (const name of ['bride', 'groom']) {
      const root = rig[name];
      rig[name] = {
        root, body: part(root, 'body'), head: part(root, 'head'), skirt: part(root, 'skirt'),
        left: part(root, 'left-arm'), right: part(root, 'right-arm'),
        leftFore: part(root, 'left-forearm'), rightFore: part(root, 'right-forearm'),
        legLeft: part(root, 'leg-left'), legRight: part(root, 'leg-right'), footRight: part(root, 'foot-right')
      };
    }
    return rig;
  });

  function arms(person, left, leftFore, right, rightFore) {
    transform(person.left, `translate(-34,-143) rotate(${left})`);
    transform(person.leftFore, `translate(0,60) rotate(${leftFore})`);
    transform(person.right, `translate(34,-143) rotate(${right})`);
    transform(person.rightFore, `translate(0,60) rotate(${rightFore})`);
  }

  function pose(rig, p) {
    const b = rig.bride, g = rig.groom;
    if (rig.kind === 'engagement') {
      const kneel = phase(p, .1, .62), offer = phase(p, .4, .8);
      transform(g.body, `translate(${-18 * kneel},${65 * kneel}) rotate(${-7 * kneel})`);
      g.legLeft?.setAttribute('d', `M${lerp(-17,-35,kneel)} ${65*kneel}L${lerp(-18,-63,kneel)} ${lerp(75,78,kneel)}L-20 145`);
      g.legRight?.setAttribute('d', `M${lerp(17,0,kneel)} ${65*kneel}L${lerp(20,30,kneel)} ${lerp(75,145,kneel)}L${lerp(22,72,kneel)} 145`);
      transform(g.footRight, `translate(${50*kneel},0)`);
      arms(g, 62 * offer, 46 * offer, -10, -25 * offer);
      arms(b, 8, -8, 30 * offer, -80 * offer);
      transform(b.head, `rotate(${8 * offer} 0 -195)`);
      const a = 62 * offer * Math.PI / 180, ab = 108 * offer * Math.PI / 180;
      const handX = -34 - Math.sin(a)*60 - Math.sin(ab)*56;
      const handY = -143 + Math.cos(a)*60 + Math.cos(ab)*56;
      const lean = -7 * kneel * Math.PI / 180;
      const ringX = 610 - 18*kneel + handX*Math.cos(lean) - handY*Math.sin(lean);
      const ringY = 475 + 65*kneel + handX*Math.sin(lean) + handY*Math.cos(lean);
      transform(rig.ring, `translate(${ringX},${ringY-12}) scale(${.7 + offer*.3})`);
      if (rig.ring) rig.ring.style.opacity = String(offer);
    } else if (rig.kind === 'sangeet') {
      const beat = p * Math.PI * 4, sway = Math.sin(beat), turn = Math.sin(p * Math.PI);
      transform(b.root, `translate(${414 + sway*28},${475 - Math.abs(sway)*10})`);
      transform(g.root, `translate(${610 + sway*22},${475 - Math.abs(sway)*7})`);
      transform(b.body, `rotate(${-sway*9} 0 0)`);
      transform(g.body, `rotate(${sway*7} 0 0)`);
      transform(b.skirt, `rotate(${sway*9}) scale(${1 + turn*.16},1)`);
      arms(b, 24 + sway*15, 30, -135 + sway*13, -35);
      arms(g, 138 + sway*12, 30, -25 - sway*20, -30);
      g.legLeft?.setAttribute('d', `M-17 0L${-18+sway*18} 75L${-20+sway*16} 145`);
      g.legRight?.setAttribute('d', `M17 0L${20-sway*16} 75L${22-sway*14} 145`);
    } else if (rig.kind === 'haldi') {
      const toss = phase(p, .1, .42), burst = phase(p, .3, .88);
      arms(b, -10, 10, -100*toss, -35*toss);
      arms(g, 100*toss, 35*toss, -10, -10);
      transform(b.body, `rotate(${-8*toss} 0 0)`);
      transform(g.body, `rotate(${8*toss} 0 0)`);
      rig.powder.forEach((cloud, i) => {
        const angle = -Math.PI + i / 15 * Math.PI;
        const spread = burst * (150 + i%4 * 60);
        transform(cloud, `translate(${Math.cos(angle)*spread},${Math.sin(angle)*spread - 70*burst}) scale(${.2 + burst*.8})`);
        cloud.setAttribute('cx', String(500 / (.2 + burst*.8)));
        cloud.setAttribute('cy', String(510 / (.2 + burst*.8)));
        cloud.style.opacity = String(Math.sin(burst*Math.PI) * .78);
      });
    } else if (rig.kind === 'wedding') {
      const lift = phase(p, .05, .4), lower = phase(p, .4, .78);
      const hands = lift * (1 - lower * .75);
      arms(b, 15, 12, -125*hands, -30*hands);
      arms(g, 125*hands, 30, -15, -12);
      for (const garland of [rig.brideGarland, rig.groomGarland]) {
        transform(garland, `translate(0,${-145 * (1 - lower)})`);
        if (garland) garland.style.opacity = String(lift);
      }
      transform(rig.flames, `translate(511,630) scale(${.94+Math.sin(p*36)*.08},${.8 + Math.abs(Math.sin(p*32))*.35}) translate(-511,-630)`);
    }
    rig.petals.forEach((petal, i) => {
      const release = rig.kind === 'wedding' ? phase(p,.52,.98) : p;
      const x = 75 + (i * 139) % 850 + Math.sin(release*6+i)*30;
      const y = -70 + ((release * 820 + i*61) % 830);
      transform(petal, `translate(${x},${y}) rotate(${release*260 + i*31} 10 10)`);
      petal.style.opacity = String(rig.kind === 'wedding' ? phase(p,.5,.7)*.8 : .55);
    });
  }

  function render() {
    pending = false;
    if (document.body.classList.contains('motion-paused') && !reduced.matches) return;
    rigs.forEach(rig => {
      const rect = rig.event.getBoundingClientRect();
      const top = innerWidth <= 650 ? 108 : 118;
      const travel = rect.height - (innerHeight - top);
      const progress = reduced.matches || travel < 100 ? .78 : clamp((top - rect.top) / travel);
      rig.event.style.setProperty('--progress', progress.toFixed(3));
      pose(rig, progress);
    });
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(render); } }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', schedule);
  document.addEventListener('wedding:motion', schedule);
  schedule();
})();
