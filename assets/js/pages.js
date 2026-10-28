/* Page renderers. Each re-runs on language change via MERINI.onLang. */
(function () {
  const M = window.MERINI;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const page = document.body.dataset.page;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const byId = id => M.products.find(p => p.id === id);
  const catName = id => M.pick((M.categories.find(c => c.id === id) || {}).name);
  const defaultFinish = { onda: 'boucle', terra: 'chestnut', lusso: 'oat', grigio: 'dove', bordeaux: 'wine', alba: 'boucle',
    noce: 'taupe', grafite: 'graphite', bianco: 'ivory', champagne: 'ivory', rovere: 'oak' };

  const priceHtml = p => {
    if (p.from) return `<small>${M.t('price.from')}</small>${M.price(p.price)}`;
    if (p.oldPrice) return `<s>${M.price(p.oldPrice)}</s>${M.price(p.price)}`;
    return M.price(p.price);
  };
  const tagHtml = p => p.tag ? `<span class="tag${p.tag === 'offer' ? ' tag--offer' : ''}">${M.t('tag.' + p.tag)}</span>` : '';

  const card = (p, i = 0) => `
    <a class="p-card reveal" data-delay="${i % 3}" href="product.html?id=${p.id}">
      <div class="frame ratio-45">${tagHtml(p)}<img src="${p.img}" alt="${p.name} — ${M.pick(p.type)}" loading="lazy" width="500" height="625"></div>
      <div class="p-meta">
        <div class="p-row"><h3 class="p-name">${p.name}</h3><span class="p-price">${priceHtml(p)}</span></div>
        <p class="p-type">${M.pick(p.type)}</p>
      </div>
    </a>`;

  /* Yerevan is UTC+4 all year */
  const yerevanNow = () => { const d = new Date(); return new Date(d.getTime() + (d.getTimezoneOffset() + 240) * 60000); };
  const isOpen = () => { const h = yerevanNow().getHours(); return h >= 10 && h < 20; };
  const statusHtml = () => `<span class="hours"><i class="dot${isOpen() ? '' : ' closed'}"></i><span>${M.t(isOpen() ? 'visit.open' : 'visit.closed')} · <span class="num">${M.contact.hours}</span></span></span>`;

  /* Smoothly count a number displayed in an element (ease-out) */
  const tweenNumber = (el, to, fmt) => {
    const from = Number(el.dataset.value || to);
    el.dataset.value = to;
    if (reduceMotion || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 420;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round((from + (to - from) * e) / 1000) * 1000);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ======================= HOME ======================= */
  function heroSlideshow() {
    const hero = $('#hero');
    if (!hero) return;
    const SLIDE_MS = 6500;
    /* Placeholder hero photography (Unsplash License, free to use) until MERINI
       supplies its own high-resolution shoots. Captions point to collections,
       not individual products, because these are not MERINI pieces.
       pos = framing on landscape / portrait screens. */
    const slides = [
      { cat: 'sofas',    img: 'assets/hero/hero-sofa.jpg',    pos: ['50% 62%', '42% 50%'] },
      { cat: 'living',   img: 'assets/hero/hero-living.jpg',  pos: ['50% 58%', '30% 50%'] },
      { cat: 'kitchens', img: 'assets/hero/hero-kitchen.jpg', pos: ['50% 50%', '38% 50%'] },
      { cat: 'bedroom',  img: 'assets/hero/hero-bedroom.jpg', pos: ['50% 60%', '30% 50%'] }
    ];
    const wrap = $('#hero-slides'), dots = $('#hero-dots'), caption = $('#hero-caption');
    let index = 0, timer = null, paused = false;
    hero.style.setProperty('--slide-ms', SLIDE_MS + 'ms');

    wrap.innerHTML = slides.map((s, i) =>
      `<figure class="hero-slide${i === 0 ? ' is-active' : ''}" aria-hidden="${i !== 0}"><img src="${s.img}" style="--pos:${s.pos[0]};--pos-m:${s.pos[1]}" alt=""${i ? '' : ' fetchpriority="high"'}></figure>`).join('');

    const renderDots = () => {
      dots.innerHTML = slides.map((s, i) =>
        `<button type="button" class="hero-dot" role="tab" aria-selected="${i === index}" aria-label="${M.t('hero.slide')} ${i + 1}: ${catName(s.cat)}"><span>${String(i + 1).padStart(2, '0')}</span><i></i></button>`).join('');
    };
    const renderCaption = () => {
      const s = slides[index];
      $('#hero-name').textContent = catName(s.cat);
      $('#hero-type').textContent = M.t('hero.sub.' + s.cat);
      $('#hero-link').href = `collections.html?cat=${s.cat}`;
    };

    const go = (next, user) => {
      next = (next + slides.length) % slides.length;
      if (next === index) return;
      const figs = $$('.hero-slide', wrap);
      figs[index].classList.remove('is-active'); figs[index].setAttribute('aria-hidden', 'true');
      figs[next].classList.add('is-active'); figs[next].setAttribute('aria-hidden', 'false');
      index = next;
      // Text crossfade with a touch of blur so the two captions read as one change
      caption.classList.add('is-swapping');
      setTimeout(() => { renderCaption(); caption.classList.remove('is-swapping'); }, reduceMotion ? 0 : 240);
      renderDots();
      schedule(user);
    };
    const schedule = () => {
      clearTimeout(timer);
      if (reduceMotion || paused) return;
      timer = setTimeout(() => go(index + 1), SLIDE_MS);
    };
    const setPaused = v => { paused = v; hero.classList.toggle('is-paused', v); v ? clearTimeout(timer) : schedule(); };

    dots.addEventListener('click', e => {
      const b = e.target.closest('.hero-dot');
      if (b) go($$('.hero-dot', dots).indexOf(b), true);
    });
    // Horizontal swipe on touch; vertical stays native scroll
    let sx = 0, sy = 0;
    hero.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
    hero.addEventListener('pointerup', e => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1), true);
    });
    hero.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') go(index + 1, true);
      if (e.key === 'ArrowLeft') go(index - 1, true);
    });
    // Stop the clock when the hero is off-screen or the tab is hidden
    document.addEventListener('visibilitychange', () => setPaused(document.hidden));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => setPaused(!en.isIntersecting), { threshold: 0.25 }).observe(hero);
    }
    $('#hero-down').addEventListener('click', () => {
      $('#after-hero').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    renderDots(); renderCaption(); schedule();
    M.onLang(() => { renderDots(); renderCaption(); });
  }

  /* Manifesto: words light up with scroll over a background film */
  function manifesto() {
    const sec = $('#after-hero'), title = $('#mf-title');
    if (!sec || !title) return;
    let words = [];

    const split = () => {
      const text = title.textContent.trim();
      title.innerHTML = text.split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
      words = $$('.w', title);
    };

    // Runs straight from the scroll event (one rect read, opacity/transform writes only),
    // so it never waits on animation frames that a browser may throttle.
    const update = () => {
      const vh = window.innerHeight, r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      if (r.top < vh * 0.85) sec.classList.add('is-in');
      // Follows the headline itself: 0 as it enters near the bottom of the screen,
      // 1 once it has travelled up to the top third, so the reveal happens in view
      const tt = title.getBoundingClientRect().top;
      const t = Math.min(1, Math.max(0, (vh * 0.9 - tt) / (vh * 0.65)));
      const n = words.length;
      words.forEach((w, i) => {
        const k = Math.min(1, Math.max(0, t * (n + 2) - i));
        w.style.opacity = (0.22 + 0.78 * k).toFixed(3);
      });
      // Parallax moves things, so it respects reduced motion; the word reveal above
      // is opacity only and stays on for everyone.
      // A slow drift on the film for depth; skipped for reduced motion
      if (reduceMotion || !bg) return;
      const centre = (r.top + r.height / 2 - vh / 2) / vh;
      bg.style.transform = `translate3d(0, ${(centre * -60).toFixed(1)}px, 0)`;
    };

    /* Background film: always pausable; pauses itself off-screen; remembers the choice */
    const video = $('#mf-video'), toggle = $('#mf-toggle'), bg = $('.mf-bg', sec);
    let userPaused = false;
    try { userPaused = localStorage.getItem('merini-video') === 'paused'; } catch (e) { /* private mode */ }
    const syncToggle = () => {
      const paused = video.paused;
      toggle.classList.toggle('is-paused', paused);
      const label = $('span', toggle);
      label.dataset.i18n = paused ? 'video.play' : 'video.pause';
      label.textContent = M.t(label.dataset.i18n);
    };
    const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    if (video && toggle) {
      if (userPaused) video.pause();
      video.addEventListener('play', syncToggle);
      video.addEventListener('pause', syncToggle);
      toggle.addEventListener('click', () => {
        userPaused = !video.paused;
        userPaused ? video.pause() : play();
        try { localStorage.setItem('merini-video', userPaused ? 'paused' : 'playing'); } catch (e) { /* ignore */ }
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => {
          if (!e.isIntersecting) video.pause();
          else if (!userPaused) play();
        }, { threshold: 0.1 }).observe(sec);
      }
      syncToggle();
    }

    split();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { sec.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.15 });
      io.observe(sec);
    } else sec.classList.add('is-in');
    // applyI18n replaces the title text on language change; split it again
    M.onLang(() => { split(); update(); });
  }

  function home() {
    heroSlideshow();
    manifesto();
    const catGrid = $('#cat-grid');
    const renderCats = () => {
      catGrid.innerHTML = M.categories.map((c, i) => {
        const n = M.products.filter(p => p.cat === c.id).length;
        return `<a class="cat-card reveal" data-delay="${i % 3}" href="collections.html?cat=${c.id}">
          <div class="frame"><img src="${c.img}" alt="" loading="lazy"></div>
          <div class="cat-label"><h3>${M.pick(c.name)}</h3><span>${n} ${M.t('col.pieces')}</span></div>
        </a>`;
      }).join('');
    };

    // Featured pieces are chosen so no photo repeats elsewhere on the home page
    const rail = $('#featured');
    const featured = ['terra', 'grigio', 'lusso'].map(byId);
    const renderRail = () => { rail.innerHTML = featured.map((p, i) => card(p, i)).join(''); };

    const renderVisit = () => { $$('[data-status]').forEach(el => { el.innerHTML = statusHtml(); }); };

    renderCats(); renderRail(); renderVisit();
    M.onLang(() => { renderCats(); renderRail(); renderVisit(); renderCfg(); });

    /* --- Sofa configurator --- */
    const SHAPES = {
      straight: { img: 'assets/sofa-bordeaux.jpg', base: 330000 },
      corner:   { img: 'assets/sofa-lusso.jpg',    base: 450000 },
      curved:   { img: 'assets/sofa-curve.jpg',    base: 500000 },
      modular:  { img: 'assets/sofa-chestnut.jpg', base: 560000 }
    };
    const FABRIC_K = { boucle: 1.08, oat: 1, dove: 1, chestnut: 1.05, wine: 1.1, navy: 1.1 };
    const state = { shape: 'corner', fabric: 'oat', seats: 4 };
    const stage = $('#cfg-stage');
    const shapeGroup = $('#cfg-shape');
    const fabricGroup = $('#cfg-fabric');
    const seats = $('#cfg-seats');
    const total = $('#cfg-price');

    const calc = () => {
      const raw = (SHAPES[state.shape].base + (state.seats - 3) * 55000) * FABRIC_K[state.fabric];
      return Math.round(raw / 5000) * 5000;
    };
    const fabric = () => M.finishes.upholstery.find(f => f.id === state.fabric);

    function renderCfg() {
      shapeGroup.innerHTML = Object.keys(SHAPES).map(k =>
        `<button type="button" role="radio" aria-checked="${k === state.shape}" data-shape="${k}">${M.t('cfg.shape.' + k)}</button>`).join('');
      fabricGroup.innerHTML = M.finishes.upholstery.map(f =>
        `<button type="button" class="swatch" role="radio" aria-checked="${f.id === state.fabric}" data-fabric="${f.id}" style="background:${f.hex}" aria-label="${M.pick(f.name)}" title="${M.pick(f.name)}"></button>`).join('');
      updateCfg(false);
    }
    function updateCfg(animateImage) {
      $('#cfg-fabric-name').textContent = M.pick(fabric().name);
      $('#cfg-seats-out').textContent = state.seats;
      $('#cfg-disc i').style.backgroundColor = fabric().hex;
      $('#cfg-disc-name').textContent = M.pick(fabric().name);
      tweenNumber(total, calc(), M.price);
      const imgs = $$('img', stage);
      const want = SHAPES[state.shape].img;
      const current = imgs.find(i => !i.classList.contains('is-out'));
      if (current && current.getAttribute('src') !== want) {
        const other = imgs.find(i => i !== current);
        other.src = want;
        if (animateImage) {
          requestAnimationFrame(() => { current.classList.add('is-out'); other.classList.remove('is-out'); });
        } else { current.classList.add('is-out'); other.classList.remove('is-out'); }
      }
      $('#cfg-send').href = M.waLink(M.t('cfg.wa', {
        shape: M.t('cfg.shape.' + state.shape).toLowerCase(), fabric: M.pick(fabric().name), seats: state.seats, price: M.price(calc())
      }));
    }
    const radioKeys = (group, attr, key) => {
      group.addEventListener('click', e => {
        const b = e.target.closest('[' + attr + ']');
        if (!b) return;
        state[key] = b.getAttribute(attr);
        $$('[' + attr + ']', group).forEach(x => x.setAttribute('aria-checked', String(x === b)));
        updateCfg(true);
      });
      group.addEventListener('keydown', e => {
        if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
        const items = $$('[' + attr + ']', group);
        const i = items.findIndex(x => x.getAttribute('aria-checked') === 'true');
        const n = items[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length];
        n.focus(); n.click(); e.preventDefault();
      });
    };
    radioKeys(shapeGroup, 'data-shape', 'shape');
    radioKeys(fabricGroup, 'data-fabric', 'fabric');
    seats.addEventListener('input', () => { state.seats = Number(seats.value); updateCfg(false); });
    renderCfg();
  }

  /* ======================= COLLECTIONS ======================= */
  function collections() {
    const params = new URLSearchParams(location.search);
    let cat = M.categories.some(c => c.id === params.get('cat')) ? params.get('cat') : 'all';
    let sort = 'featured';
    const grid = $('#p-grid');
    const chips = $('#chips');
    const sortSel = $('#sort');

    const renderChips = () => {
      const all = [{ id: 'all', label: M.t('list.all'), n: M.products.length }]
        .concat(M.categories.map(c => ({ id: c.id, label: M.pick(c.name), n: M.products.filter(p => p.cat === c.id).length })));
      chips.innerHTML = all.map(c => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === cat}">${c.label}<sup class="num">${c.n}</sup></button>`).join('');
      sortSel.innerHTML = ['featured', 'asc', 'desc'].map(s => `<option value="${s}"${s === sort ? ' selected' : ''}>${M.t('list.sort.' + s)}</option>`).join('');
    };

    const list = () => {
      let l = M.products.filter(p => cat === 'all' || p.cat === cat);
      if (sort === 'asc') l = l.slice().sort((a, b) => a.price - b.price);
      if (sort === 'desc') l = l.slice().sort((a, b) => b.price - a.price);
      return l;
    };

    const draw = () => {
      const l = list();
      $('#result-count').textContent = `${l.length} ${M.t('col.pieces')}`;
      grid.innerHTML = l.length ? l.map((p, i) => card(p, i)).join('') : `<p class="muted">${M.t('list.empty')}</p>`;
      M.observeReveals();
    };

    const swap = () => {
      if (reduceMotion) { draw(); return; }
      grid.classList.add('is-leaving');
      setTimeout(() => {
        draw();
        grid.classList.remove('is-leaving');
        // Stagger the incoming cards (40ms apart)
        $$('.p-card', grid).forEach((el, i) => {
          el.classList.add('is-in', 'enter');
          el.style.transitionDelay = `${i * 40}ms`;
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('enter')));
          setTimeout(() => { el.style.transitionDelay = ''; }, 600 + i * 40);
        });
      }, 170);
    };

    chips.addEventListener('click', e => {
      const b = e.target.closest('[data-cat]');
      if (!b || b.dataset.cat === cat) return;
      cat = b.dataset.cat;
      $$('[data-cat]', chips).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const u = new URL(location.href);
      cat === 'all' ? u.searchParams.delete('cat') : u.searchParams.set('cat', cat);
      history.replaceState(null, '', u);
      swap();
    });
    sortSel.addEventListener('change', () => { sort = sortSel.value; swap(); });

    renderChips(); draw();
    M.onLang(() => { renderChips(); draw(); });
  }

  /* ======================= PRODUCT ======================= */
  function product() {
    const p = byId(new URLSearchParams(location.search).get('id')) || M.products[0];
    const finishes = M.finishes[p.finish];
    const sizes = M.sizes[p.cat] || null;
    const state = { finish: defaultFinish[p.id] || finishes[0].id, size: sizes ? sizes[0].id : null, view: 0 };
    const root = $('#pd');

    const total = () => p.price + (sizes ? sizes.find(s => s.id === state.size).add : 0);
    const finishObj = () => finishes.find(f => f.id === state.finish);
    const sizeObj = () => sizes && sizes.find(s => s.id === state.size);
    const optsText = () => [M.pick(finishObj().name), sizeObj() ? M.pick(sizeObj().name) : null].filter(Boolean).join(', ');
    const priceLine = () => p.from
      ? `<small>${M.t('price.from')}</small>${M.price(total())}`
      : `${M.price(total())}${p.oldPrice ? `<s>${M.price(p.oldPrice + (sizeObj() ? sizeObj().add : 0))}</s>` : ''}`;

    function render() {
      document.title = `${p.name} — ${M.pick(p.type)} | MERINI`;
      const related = M.products.filter(x => x.id !== p.id && x.cat === p.cat)
        .concat(M.products.filter(x => x.id !== p.id && x.cat !== p.cat)).slice(0, 3);
      root.innerHTML = `
        <div class="container">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="collections.html">${M.t('pd.back')}</a><span aria-hidden="true">/</span>
            <a href="collections.html?cat=${p.cat}">${catName(p.cat)}</a><span aria-hidden="true">/</span>
            <span aria-current="page">${p.name}</span>
          </nav>
          <div class="pd-grid">
            <div class="gallery">
              <div class="thumbs" role="group" aria-label="${p.name}">
                ${[0, 1, 2].map(v => `<button type="button" class="thumb view-${v}" data-view="${v}" aria-pressed="${v === state.view}" aria-label="${p.name} ${v + 1}/3"><img src="${p.img}" alt=""></button>`).join('')}
              </div>
              <div class="stage view-${state.view} reveal" id="stage">${tagHtml(p)}<img src="${p.img}" alt="${p.name} — ${M.pick(p.type)}" width="500" height="625"></div>
            </div>

            <aside class="pd-panel">
              <div class="pd-title">
                <span class="eyebrow">${catName(p.cat)}</span>
                <h1 class="display">${p.name}</h1>
                <p class="lead" style="font-size:1.05rem">${M.pick(p.type)}</p>
                <p class="pd-credit">${M.t('pd.credit')}</p>
              </div>
              <div class="pd-price">
                <span class="price" id="pd-price">${priceLine()}</span>
                <p>${p.from ? M.t('pd.measure') : M.t('pd.lead')}</p>
              </div>
              <div>
                <span class="field-label">${M.t('pd.finish')}<output id="finish-name">${M.pick(finishObj().name)}</output></span>
                <div class="swatches" id="finishes" role="radiogroup" aria-label="${M.t('pd.finish')}">
                  ${finishes.map(f => `<button type="button" class="swatch" role="radio" data-finish="${f.id}" aria-checked="${f.id === state.finish}" style="background:${f.hex}" aria-label="${M.pick(f.name)}" title="${M.pick(f.name)}"></button>`).join('')}
                </div>
              </div>
              ${sizes ? `<div>
                <span class="field-label">${M.t('pd.size')}</span>
                <div class="segmented" id="sizes" role="radiogroup" aria-label="${M.t('pd.size')}">
                  ${sizes.map(s => `<button type="button" role="radio" data-size="${s.id}" aria-checked="${s.id === state.size}">${M.pick(s.name)}</button>`).join('')}
                </div>
              </div>` : ''}
              <div class="pd-actions" id="pd-actions">
                <a class="btn" id="ask" target="_blank" rel="noopener" href="#">${M.icons.whatsapp}<span>${M.t('pd.ask')}</span></a>
                <a class="btn btn--ghost" href="showroom.html#book">${M.t('pd.book')}</a>
                <div class="pd-call"><a href="tel:${M.contact.phones[0].replace(/\s/g, '')}">${M.t('pd.call')} · <span class="num">${M.contact.phones[0]}</span></a></div>
              </div>
              <div class="accordion">
                ${[1, 2, 3].map(i => `<details${i === 1 ? ' open' : ''}><summary>${M.t('pd.acc' + i + '.t')}<i aria-hidden="true"></i></summary><div class="acc-body">${M.t('pd.acc' + i + '.d')}</div></details>`).join('')}
              </div>
            </aside>
          </div>

          <section class="pd-story">
            <div class="reveal">
              <span class="eyebrow">MERINI Atelier</span>
              <blockquote style="margin-top:24px">${M.pick(p.desc)}</blockquote>
            </div>
            <dl class="spec reveal" data-delay="1">
              <div><dt>${M.t('pd.spec.cat')}</dt><dd>${catName(p.cat)}</dd></div>
              <div><dt>${M.t('pd.dims')}</dt><dd class="num">${M.pick(p.dims)}</dd></div>
              <div><dt>${M.t('pd.spec.finishes')}</dt><dd>${finishes.length}</dd></div>
              <div><dt>${M.t('pd.spec.lead')}</dt><dd>${M.t('pd.lead')}</dd></div>
              <div><dt>${M.t('pd.spec.origin')}</dt><dd>${M.t('pd.origin')}</dd></div>
              <div><dt>${M.t('pd.spec.service')}</dt><dd>${M.t('pd.service')}</dd></div>
            </dl>
          </section>

          <section class="section" style="padding-bottom:0">
            <div class="section-head"><div><span class="eyebrow">${M.t('pd.related')}</span></div>
              <a class="link" href="collections.html">${M.t('feat.all')} ${M.icons.arrow}</a></div>
            <div class="p-grid" style="padding:0">${related.map((r, i) => card(r, i)).join('')}</div>
          </section>
        </div>
        <div class="pd-sticky" id="pd-sticky">
          <span class="p-price" id="sticky-price">${priceHtml({ ...p, price: total() })}</span>
          <a class="btn" id="ask-sticky" target="_blank" rel="noopener" href="#">${M.icons.whatsapp}<span>${M.t('pd.ask')}</span></a>
        </div>`;
      wire();
      updateLinks();
      M.observeReveals();
    }

    function updateLinks() {
      const href = M.waLink(M.t('pd.wa', { name: `${p.name}, ${M.pick(p.type).toLowerCase()}`, opts: optsText() }));
      $('#ask').href = href; $('#ask-sticky').href = href;
      $('#pd-price').innerHTML = priceLine();
      $('#sticky-price').innerHTML = priceHtml({ ...p, price: total() });
      $('#finish-name').textContent = M.pick(finishObj().name);
    }

    function wire() {
      $('.thumbs', root).addEventListener('click', e => {
        const b = e.target.closest('[data-view]');
        if (!b) return;
        state.view = Number(b.dataset.view);
        $$('[data-view]', root).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        $('#stage').className = `stage view-${state.view} reveal is-in`;
      });
      $('#finishes').addEventListener('click', e => {
        const b = e.target.closest('[data-finish]');
        if (!b) return;
        state.finish = b.dataset.finish;
        $$('[data-finish]', root).forEach(x => x.setAttribute('aria-checked', String(x === b)));
        updateLinks();
      });
      const sz = $('#sizes');
      sz && sz.addEventListener('click', e => {
        const b = e.target.closest('[data-size]');
        if (!b) return;
        state.size = b.dataset.size;
        $$('[data-size]', root).forEach(x => x.setAttribute('aria-checked', String(x === b)));
        updateLinks();
      });
      // Mobile: show the sticky enquiry bar once the main buttons scroll out of view
      const sticky = $('#pd-sticky');
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => {
          sticky.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0);
        }).observe($('#pd-actions'));
      }
    }

    render();
    M.onLang(render);
  }

  /* ======================= ATELIER ======================= */
  function atelier() {
    // Count-up stats
    const stats = $$('[data-count]');
    const fmt = (n, el) => el.dataset.suffix ? (n / 1000).toFixed(1).replace('.0', '') + el.dataset.suffix : String(n);
    if ('IntersectionObserver' in window && !reduceMotion) {
      stats.forEach(el => { el.textContent = fmt(0, el); });
      const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target, to = Number(el.dataset.count), t0 = performance.now();
        const step = now => {
          const k = Math.min(1, (now - t0) / 1400), v = 1 - Math.pow(1 - k, 4);
          el.textContent = fmt(Math.round(to * v / (el.dataset.suffix ? 100 : 1)) * (el.dataset.suffix ? 100 : 1), el);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }), { threshold: 0.4 });
      stats.forEach(el => io.observe(el));
    } else stats.forEach(el => { el.textContent = fmt(Number(el.dataset.count), el); });

    // Materials library
    let family = 'upholstery', sel = 'boucle';
    const tabs = $('#lib-tabs'), grid = $('#lib-grid'), prev = $('#lib-preview');
    const draw = () => {
      tabs.innerHTML = ['upholstery', 'cabinetry'].map(f =>
        `<button type="button" role="tab" aria-selected="${f === family}" data-family="${f}">${M.t('at.tab.' + f)}</button>`).join('');
      grid.innerHTML = M.finishes[family].map(f =>
        `<button type="button" class="lib-item" data-id="${f.id}" aria-pressed="${f.id === sel}"><i style="background:${f.hex}"></i><span>${M.pick(f.name)}</span></button>`).join('');
      const f = M.finishes[family].find(x => x.id === sel);
      prev.style.backgroundColor = f.hex;
      $('figcaption', prev).textContent = M.pick(f.name);
    };
    tabs.addEventListener('click', e => {
      const b = e.target.closest('[data-family]');
      if (!b) return;
      family = b.dataset.family; sel = M.finishes[family][0].id; draw();
    });
    grid.addEventListener('click', e => {
      const b = e.target.closest('[data-id]');
      if (!b) return;
      sel = b.dataset.id; draw();
    });
    draw();
    M.onLang(draw);
  }

  /* ======================= SHOWROOM ======================= */
  function showroom() {
    // Spelled out: Intl has no Armenian weekday data in some browsers
    const DAYS = {
      hy: ['Երկուշաբթի', 'Երեքշաբթի', 'Չորեքշաբթի', 'Հինգշաբթի', 'Ուրբաթ', 'Շաբաթ', 'Կիրակի'],
      en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      ru: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
    };
    const drawHours = () => {
      const today = (yerevanNow().getDay() + 6) % 7; // Monday = 0
      const rows = DAYS[M.lang].map((name, i) =>
        `<tr${i === today ? ' class="today"' : ''}><td>${name}</td><td>${M.contact.hours}</td></tr>`).join('');
      $$('.hours-table tbody').forEach(tb => { tb.innerHTML = rows; });
      $$('[data-status]').forEach(el => { el.innerHTML = statusHtml(); });
      const interest = $('#f-interest');
      const v = interest.value;
      interest.innerHTML = `<option value="">${M.t('sr.f.any')}</option>` + M.categories.map(c => `<option value="${c.id}">${M.pick(c.name)}</option>`).join('');
      interest.value = v;
    };
    drawHours();
    M.onLang(drawHours);

    const dateInput = $('#f-date');
    dateInput.min = new Date().toISOString().slice(0, 10);

    const form = $('#book-form');
    const rules = {
      'f-name': v => v.trim().length >= 2 || 'sr.f.errName',
      'f-phone': v => v.replace(/\D/g, '').length >= 8 || 'sr.f.errPhone'
    };
    const check = id => {
      const input = $('#' + id), field = input.closest('.field');
      const r = rules[id](input.value);
      field.classList.toggle('has-error', r !== true);
      input.setAttribute('aria-invalid', String(r !== true));
      $('.err', field).textContent = r === true ? '' : M.t(r);
      return r === true;
    };
    Object.keys(rules).forEach(id => {
      const el = $('#' + id);
      el.addEventListener('blur', () => { if (el.value) check(id); });
      el.addEventListener('input', () => { if (el.closest('.field').classList.contains('has-error')) check(id); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const bad = Object.keys(rules).filter(id => !check(id));
      if (bad.length) { $('#' + bad[0]).focus(); return; }
      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      btn.querySelector('span').textContent = M.t('sr.f.sending');
      // Demo: no network request is made
      setTimeout(() => {
        form.hidden = true;
        const ok = $('#form-success');
        ok.classList.add('is-visible');
        ok.focus();
      }, 700);
    });
  }

  ({ home, collections, product, atelier, showroom })[page]?.();
})();
