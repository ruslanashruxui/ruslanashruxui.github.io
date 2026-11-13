/* ruslana shurubura — quiet paper motion */
(() => {
  const doc = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');
  if (!reduce) doc.classList.add('anim');

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  const on = el => el && el.classList.add('on');

  /* ---------- sticky header: paper background once the page scrolls ---------- */
  const nav = $('.nav');
  if (nav) {
    const small = window.matchMedia('(max-width: 860px)');
    let lastY = window.scrollY, ticking = false;
    const stick = () => {
      const y = window.scrollY;
      nav.classList.toggle('is-stuck', y > 8);
      // phones: hide the header while scrolling down, bring it back on any scroll up
      if (small.matches && Math.abs(y - lastY) > 6) {
        nav.classList.toggle('is-hidden', y > lastY && y > 140);
        lastY = y;
      } else if (!small.matches) nav.classList.remove('is-hidden');
      ticking = false;
    };
    stick();
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(stick); } }, { passive: true });
    // a tap on a menu link scrolls down — keep the header out of the way, it returns on scroll up
    $$('.nav a[href^="#"]').forEach(a => a.addEventListener('click', () => { lastY = window.scrollY; }));
  }

  /* ---------- path lengths for hand-drawn strokes ---------- */
  $$('.draw path').forEach(p => {
    try { p.parentNode.parentNode.style.setProperty('--len', Math.ceil(p.getTotalLength() + 2)); } catch (e) {}
  });

  /* ---------- typewriter ---------- */
  function prepType(el) {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...n.textContent].forEach(ch => {
            const s = document.createElement('span');
            s.className = 'type-ch'; s.textContent = ch; s.setAttribute('aria-hidden', 'true');
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.matches('svg')) walk(n);
      });
    };
    walk(el);
    return $$('.type-ch', el);
  }
  async function type(el, speed = 62) {
    const chars = el._chars || (el._chars = prepType(el));
    if (reduce) { chars.forEach(on); return; }
    const caret = document.createElement('span');
    caret.className = 'caret'; caret.setAttribute('aria-hidden', 'true');
    for (const c of chars) {
      on(c); c.after(caret);
      const ch = c.textContent;
      await wait(ch === ' ' ? speed * 1.6 : ch === '.' || ch === ',' ? speed * 3 : speed * (0.6 + Math.random() * 0.8));
    }
    await wait(500); caret.remove();
  }
  // pre-split so nothing flashes before it is typed
  if (!reduce) $$('[data-type]').forEach(el => { el._chars = prepType(el); });

  /* ---------- run a sequence when a block enters the viewport ---------- */
  function when(el, fn, threshold = 0.3) {
    if (!el) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { io.disconnect(); fn(); }
    }), { threshold });
    io.observe(el);
  }

  /* HERO: type → circle → lead → signature → note → buttons */
  const hero = $('.hero');
  (async () => {
    await wait(350);
    await type($('.hero h1'), 70);
    on($('.hero .calm'));
    await wait(700);
    on($('.hero .lead'));
    await wait(450);
    on($('.hero .sign'));
    await wait(900);
    on($('.hero__note'));
    await wait(250);
    on($('.hero__btns'));
  })();

  /* APPROACH: notebook slides in, ticks one by one */
  const nb = $('.notebook');
  $$('.approach .fade').forEach(el => when(el, () => on(el), 0.4));
  when(nb, async () => {
    on(nb);
    await wait(900);
    for (const b of $$('.box', nb)) { on(b); await wait(480); }
    on($('.fav', nb));
  }, 0.25);

  /* CASES: polaroid develops, window pops, handwriting appears */
  $$('.case').forEach(sec => {
    when(sec, async () => {
      const pol = $('.polaroid', sec);
      on(pol);
      // Safari leaves seams on rotated, filtered images: drop the "develop" effect once it has played
      setTimeout(() => pol && pol.classList.remove('develop'), reduce ? 0 : 3800);
      $$('.case-text .fade', sec).forEach(on);
      await wait(1100);
      on($('.win', sec));
      await wait(450);
      for (const l of $$('.win .write', sec)) { on(l); await wait(800); }
    }, 0.3);
  });

  /* ABOUT */
  const about = $('.about');
  when(about, async () => {
    const pol = $('.polaroid', about);
    on(pol);
    setTimeout(() => pol && pol.classList.remove('develop'), reduce ? 0 : 3800);
    $$('.fade', about).forEach(on);
  }, 0.3);

  /* CONTACT: window pops, heading typed, "a new page." written */
  const contact = $('.contact');
  when(contact, async () => {
    on($('.contact .fade'));
    on($('.mail'));
    await wait(650);
    await type($('.mail [data-type]'), 75);
    on($('.mail .new'));
    await wait(900);
    $$('.mail .fade').forEach(on);
  }, 0.35);

  /* ---------- letter board (split-flap) ---------- */
  const board = $('.board');
  if (board) {
    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const DESK = ['AUWHKIIRRCCBCANILFCYCWBZMGRZBI','JCOJIMIYSODLYVWCHPWPFVWZKUCAIT','FPZGOHSPLDMDAMRESEARCHLZEGIAZT','TWEWDMYJUBNNHEKNGZLKRRBUCKPEST','PZCATOEYFFSWITEFLGAMCRDHMVCJHE','KVPUGFRWAGEUGWUDIDECISIONOIYSE','DCLAWFRIGZPRJSYJOISWZIPRRJOYZA','SKTDFTFLMNRFKWREITTNCUTABRGYDY','NTNJODZKGVAAKCGCUSYGNASIDGEEIG','OLHUBFMSGEPHNMBTYNKDANCALMIJEB','EVJIPINFHJCGBBNJDRBYODKDYHABAL','MSJZUFCGSILOWDWJIGHIZEPNOIKZSD','BKYPVOSDDLDFRPPMWHYUTECVZCJHSE','RPPEZAYTHGEECNODPTWZGACMFLOWZO','LVGBYIHEETTOROSBUVYESKRNANFLEU','OPARIHGMHHNACBDCPHJBHVECJMJYWF'];
    const WORDS_DESK = [['RESEARCH',2,14],['DECISION',5,17],['CALM',9,22],['WHY',12,16],['FLOW',13,24]];
    const rnd = () => ABC[Math.floor(Math.random() * 26)];
    let cells = [], words = [], cols = 0, rows = 0, mode = '';

    function build() {
      const mobile = window.innerWidth <= 860;
      const m = mobile ? 'm' : 'd';
      if (m === mode) return; mode = m;
      let grid, wl;
      if (!mobile) { cols = 30; rows = 16; grid = DESK.map(r => r.split('')); wl = WORDS_DESK; }
      else {
        cols = 11; rows = 13;
        grid = Array.from({ length: rows }, () => Array.from({ length: cols }, rnd));
        wl = [['RESEARCH',1,2],['DECISION',4,0],['CALM',7,5],['WHY',9,1],['FLOW',11,6]];
        wl.forEach(([w, r, c]) => [...w].forEach((ch, i) => { grid[r][c + i] = ch; }));
      }
      board.style.setProperty('--cols', cols);
      board.innerHTML = '';
      cells = [];
      grid.forEach((row, r) => row.forEach((ch, c) => {
        const s = document.createElement('span');
        s.textContent = ch; s.dataset.final = ch;
        board.appendChild(s); cells.push(s);
      }));
      words = wl.map(([w, r, c]) => [...w].map((_, i) => cells[r * cols + c + i]));
      if (board._done) words.flat().forEach(s => s.classList.add('hl'));
    }
    build();
    window.addEventListener('resize', () => { const was = mode; build(); if (was !== mode && !reduce) board._done && 0; });

    function flap(list, maxMs = 900, stagger = 0) {
      return new Promise(res => {
        const t0 = performance.now();
        const plan = list.map((s, i) => ({ s, end: t0 + stagger * i + 250 + Math.random() * maxMs }));
        const tick = now => {
          let left = 0;
          plan.forEach(p => {
            if (p.done) return;
            if (now >= p.end) { p.s.textContent = p.s.dataset.final; p.done = true; }
            else { left++; if (Math.random() < 0.55) p.s.textContent = rnd(); }
          });
          left ? setTimeout(() => requestAnimationFrame(tick), 55) : res();
        };
        requestAnimationFrame(tick);
      });
    }

    let visible = false;
    new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; }), { threshold: 0.1 }).observe(board);

    when(board, async () => {
      if (reduce) { board._done = true; words.flat().forEach(s => s.classList.add('hl')); return; }
      // shuffle the whole board, settling column by column
      const byCol = [...cells].sort((a, b) => (cells.indexOf(a) % cols) - (cells.indexOf(b) % cols));
      await flap(byCol, 700, 4);
      await wait(250);
      for (const w of words) {
        for (const s of w) { s.classList.add('hl'); await wait(55); }
        await wait(380);
      }
      board._done = true;
      // quiet idle: every few seconds a word re-flips and a few letters flutter
      let wi = 0;
      setInterval(async () => {
        if (!visible || document.hidden) return;
        const w = words[wi++ % words.length];
        const noise = cells.filter(c => !c.classList.contains('hl')).sort(() => Math.random() - .5).slice(0, 8);
        flap(noise, 500);
        w.forEach(s => s.classList.remove('hl'));
        await flap(w, 350, 40);
        for (const s of w) { s.classList.add('hl'); await wait(45); }
      }, 3800);
    }, 0.35);
  }

  /* ---------- ink dot on click ---------- */
  const fine = window.matchMedia('(pointer: fine)').matches;
  if (fine) {
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

  /* ---------- stub links (contacts, CV) ---------- */
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let tt;
  $$('[data-stub]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    toast.textContent = a.dataset.stub || 'coming soon ✎';
    toast.classList.add('on'); clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove('on'), 2200);
  }));
})();
/* ---------- GoatCounter analytics ---------- */
(function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://ruslana.goatcounter.com/count');
  document.head.appendChild(s);
})();
