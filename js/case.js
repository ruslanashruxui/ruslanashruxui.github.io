/* case pages: quiet reveal, sticky bar, parallax wall, ink dot */
(() => {
  const doc = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(el => io.observe(el));
  // stagger children of grids
  $$('[data-stagger]').forEach(g => [...g.children].forEach((c, i) => {
    c.classList.add('rv'); c.style.setProperty('--d', (i * 0.07).toFixed(2) + 's'); io.observe(c);
  }));

  // bar becomes solid after hero
  const bar = document.querySelector('.bar');
  const onScroll = () => bar && bar.classList.toggle('solid', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // screens wall: scale the 1440×900 Figma stage to cover the block (columns drift in CSS)
  const fitWalls = () => $$('.wall, .lwall').forEach(w => {
    const H = w.classList.contains('lwall') ? 760 : 900;
    const k = Math.max(w.clientWidth / 1440, w.clientHeight / H);
    w.style.setProperty('--k', k.toFixed(4));
  });
  const fitBoxes = () => $$('.fit').forEach(el => {
    const w = (matchMedia('(max-width:860px)').matches && +el.dataset.wm) || +el.dataset.w || 1440;
    el.style.setProperty('--k', (el.parentElement.clientWidth / w).toFixed(4));
  });
  fitWalls(); fitBoxes();
  // strip centre: on phones the five-state strip scrolls sideways — start in the middle
  $$('.strip-scroll').forEach(s => { if (s.scrollWidth > s.clientWidth + 4) s.scrollLeft = (s.scrollWidth - s.clientWidth) / 2; });
  window.addEventListener('resize', () => { fitWalls(); fitBoxes(); }, { passive: true });

  // pause looping animations while off screen
  const loopIO = new IntersectionObserver(es => es.forEach(e =>
    e.target.style.setProperty('--play', e.isIntersecting ? 'running' : 'paused')), { rootMargin: '100px' });
  $$('.wall, .wfui, .strip, .hero, .combo, .lwall, .bflow, .lpaths, .sitemap, .slides').forEach(el => loopIO.observe(el));

  // ink dot on click
  if (window.matchMedia('(pointer: fine)').matches) {
    const layer = document.createElement('div');
    layer.className = 'ink'; layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    window.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      const drops = [{ dx: 0, dy: 0, r: 7 + Math.random() * 3 }];
      if (!reduce) for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
        const a = Math.random() * Math.PI * 2, d = 9 + Math.random() * 7;
        drops.push({ dx: Math.cos(a) * d, dy: Math.sin(a) * d, r: 1.5 + Math.random() * 2 });
      }
      drops.forEach((p, i) => {
        const el = document.createElement('i');
        el.style.left = (e.clientX - 2 + p.dx) + 'px';
        el.style.top = (e.clientY + 2 + p.dy) + 'px';
        el.style.width = el.style.height = (p.r * 2) + 'px';
        el.style.animationDelay = (i ? 40 + i * 20 : 0) + 'ms';
        layer.appendChild(el);
        setTimeout(() => el.remove(), 1900);
      });
    }, { passive: true });
  }
})();
/* ---------- GoatCounter analytics ---------- */
(function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://ruslana.goatcounter.com/count');
  document.head.appendChild(s);
})();
