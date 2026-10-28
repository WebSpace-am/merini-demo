/* MERINI core: language, shared chrome (header/footer/menu), motion helpers. */
(function () {
  const M = window.MERINI;
  const LANGS = ['hy', 'en', 'ru'];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  /* ---------- Language ---------- */
  const urlLang = new URLSearchParams(location.search).get('lang');
  M.lang = LANGS.includes(urlLang) ? urlLang : (LANGS.includes(store.get('merini-lang')) ? store.get('merini-lang') : 'hy');

  M.t = (key, vars) => {
    let s = (M.i18n[M.lang] && M.i18n[M.lang][key]) || M.i18n.en[key] || key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  };
  M.pick = obj => (obj && typeof obj === 'object') ? (obj[M.lang] || obj.en) : obj;

  M.price = n => n.toLocaleString('en-US').replace(/,/g, ' ') + ' ֏';

  M.renderers = [];
  M.onLang = fn => { M.renderers.push(fn); };

  M.applyI18n = (root = document) => {
    root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = M.t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        el.setAttribute(attr.trim(), M.t(key.trim()));
      });
    });
  };

  M.setLang = lang => {
    if (!LANGS.includes(lang) || lang === M.lang) return;
    M.lang = lang;
    store.set('merini-lang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-switch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    M.applyI18n();
    M.renderers.forEach(fn => fn());
    M.observeReveals();
  };

  /* ---------- Icons ---------- */
  const svg = (p, vb = '0 0 24 24') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  M.icons = {
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    left: svg('<path d="M15 6l-6 6 6 6"/>'),
    right: svg('<path d="M9 6l6 6-6 6"/>'),
    phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>'),
    pin: svg('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    whatsapp: svg('<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1120.5 12 8.5 8.5 0 018 19.4z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a5 5 0 01-2.7-2.7l.8-1-1-2z"/>'),
    instagram: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>'),
    facebook: svg('<path d="M14 21v-8h3l.5-3.5H14V7.6c0-1 .3-1.7 1.8-1.7h1.8V2.8A24 24 0 0015 2.6c-2.6 0-4.4 1.6-4.4 4.5v2.4H7.7V13h2.9v8"/>'),
    tiktok: svg('<path d="M14 3v11.5a3.5 3.5 0 11-3.5-3.5"/><path d="M14 3c.4 2.6 2.2 4.4 5 4.6"/>'),
    mark: '<svg class="brand-mark" viewBox="0 0 68 28" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M8 20V12a4 4 0 014-4h44a4 4 0 014 4v8"/><path d="M4 14a4 4 0 014 4v2h52v-2a4 4 0 018 0"/><path d="M4 14a3 3 0 00-1 2.3V22h62v-5.7A3 3 0 0064 14"/><path d="M10 22v3M58 22v3"/><path d="M34 8c-3-3-8-3-10 0M34 8c3-3 8-3 10 0"/></svg>'
  };

  /* ---------- Shared chrome ---------- */
  const page = document.body.dataset.page;
  const navItem = (href, key, id) => `<a href="${href}" data-i18n="${key}"${page === id ? ' aria-current="page"' : ''}>${M.t(key)}</a>`;
  const langButtons = () => LANGS.map(l => `<button type="button" data-lang="${l}" aria-pressed="${l === M.lang}" aria-label="${{ hy: 'Հայերեն', en: 'English', ru: 'Русский' }[l]}">${l.toUpperCase()}</button>`).join('');
  const brand = sub => `<a class="brand" href="index.html" aria-label="MERINI">${M.icons.mark}<span class="brand-word">MERINI</span>${sub ? '<span class="brand-sub">Furniture · Yerevan</span>' : ''}</a>`;

  function renderHeader() {
    const h = document.getElementById('site-header');
    if (!h) return;
    h.className = 'site-header' + (h.dataset.dark ? ' on-dark' : '');
    h.innerHTML = `
      <div class="container header-inner">
        <nav class="nav-primary" aria-label="Primary">
          ${navItem('collections.html', 'nav.collections', 'collections')}
          ${navItem('atelier.html', 'nav.atelier', 'atelier')}
          ${navItem('showroom.html', 'nav.showroom', 'showroom')}
        </nav>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">
          <span class="bars" aria-hidden="true"></span><span data-i18n="nav.menu">${M.t('nav.menu')}</span>
        </button>
        ${brand(true)}
        <div class="header-tools">
          <div class="lang-switch" role="group" aria-label="Language">${langButtons()}</div>
          <a class="header-cta" href="showroom.html#book" data-i18n="nav.book">${M.t('nav.book')}</a>
        </div>
      </div>`;

    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.id = 'mobile-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', M.t('nav.menu'));
    menu.innerHTML = `
      <div class="mobile-menu-top">
        ${brand(false)}
        <button class="menu-close link" type="button" data-i18n="nav.close">${M.t('nav.close')}</button>
      </div>
      <nav aria-label="Mobile">
        <a href="index.html">MERINI</a>
        ${navItem('collections.html', 'nav.collections', 'collections')}
        ${navItem('atelier.html', 'nav.atelier', 'atelier')}
        ${navItem('showroom.html', 'nav.showroom', 'showroom')}
      </nav>
      <div class="mobile-menu-foot">
        <a href="tel:${M.contact.phones[0].replace(/\s/g, '')}">${M.contact.phones[0]}</a>
        <a href="https://wa.me/${M.contact.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="${M.contact.instagram}" target="_blank" rel="noopener">Instagram · @merinifurniture.yvn</a>
      </div>`;
    document.body.appendChild(menu);
    wireMenu(h.querySelector('.menu-toggle'), menu);
  }

  function wireMenu(toggle, menu) {
    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      menu.classList.remove('is-closing');
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      setTimeout(() => menu.querySelector('.menu-close').focus(), 60);
    };
    const close = () => {
      menu.classList.add('is-closing');
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    toggle.addEventListener('click', open);
    menu.querySelector('.menu-close').addEventListener('click', close);
    menu.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = menu.querySelectorAll('a, button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function renderFooter() {
    const f = document.getElementById('site-footer');
    if (!f) return;
    const c = M.contact;
    f.className = 'site-footer';
    f.innerHTML = `
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            ${brand(true)}
            <p data-i18n="footer.tagline">${M.t('footer.tagline')}</p>
            <div class="socials">
              <a href="${c.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${M.icons.instagram}</a>
              <a href="${c.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${M.icons.facebook}</a>
              <a href="${c.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${M.icons.tiktok}</a>
              <a href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${M.icons.whatsapp}</a>
            </div>
          </div>
          <div class="footer-col">
            <h4 data-i18n="footer.explore">${M.t('footer.explore')}</h4>
            <ul>
              <li><a href="collections.html" data-i18n="nav.collections">${M.t('nav.collections')}</a></li>
              <li><a href="atelier.html" data-i18n="nav.atelier">${M.t('nav.atelier')}</a></li>
              <li><a href="showroom.html" data-i18n="nav.showroom">${M.t('nav.showroom')}</a></li>
              <li><a href="showroom.html#book" data-i18n="nav.book">${M.t('nav.book')}</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 data-i18n="footer.contact">${M.t('footer.contact')}</h4>
            <ul>
              ${c.phones.map(p => `<li><a class="num" href="tel:${p.replace(/\s/g, '')}">${p}</a></li>`).join('')}
              <li data-i18n="loc1.addr">${M.t('loc1.addr')}</li>
              <li><span data-i18n="visit.daily">${M.t('visit.daily')}</span> · <span class="num">${c.hours}</span></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 data-i18n="footer.follow">${M.t('footer.follow')}</h4>
            <ul>
              <li><a href="${c.instagram}" target="_blank" rel="noopener">Instagram</a></li>
              <li><a href="${c.facebook}" target="_blank" rel="noopener">Facebook</a></li>
              <li><a href="${c.tiktok}" target="_blank" rel="noopener">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-word" aria-hidden="true">MERINI</div>
        <div class="footer-bottom">
          <span>© 2026 MERINI Furniture · Yerevan</span>
          <span data-i18n="footer.concept">${M.t('footer.concept')}</span>
        </div>
      </div>`;
  }

  /* ---------- Floating contact button (every page) ---------- */
  function renderFab() {
    const c = M.contact;
    const fab = document.createElement('div');
    fab.className = 'fab';
    fab.innerHTML = `
      <div class="fab-menu" id="fab-menu" role="menu" aria-hidden="true">
        <a role="menuitem" tabindex="-1" href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener">${M.icons.whatsapp}<span>WhatsApp</span></a>
        <a role="menuitem" tabindex="-1" href="tel:${c.phones[0].replace(/\s/g, '')}">${M.icons.phone}<span><span data-i18n="fab.call">${M.t('fab.call')}</span> · <span class="num">${c.phones[0]}</span></span></a>
        <a role="menuitem" tabindex="-1" href="${c.instagram}" target="_blank" rel="noopener">${M.icons.instagram}<span>Instagram</span></a>
      </div>
      <button class="fab-btn" type="button" aria-expanded="false" aria-controls="fab-menu" aria-haspopup="menu">
        ${M.icons.whatsapp}<span class="fab-label" data-i18n="fab.label">${M.t('fab.label')}</span>
      </button>`;
    document.body.appendChild(fab);
    const btn = fab.querySelector('.fab-btn'), menu = fab.querySelector('.fab-menu');
    const items = () => menu.querySelectorAll('a');
    const set = open => {
      fab.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      items().forEach(a => { a.tabIndex = open ? 0 : -1; });
    };
    btn.addEventListener('click', () => {
      const open = !fab.classList.contains('is-open');
      set(open);
      if (open) setTimeout(() => items()[0].focus(), 40);
    });
    document.addEventListener('click', e => { if (!fab.contains(e.target)) set(false); });
    fab.addEventListener('keydown', e => {
      if (e.key === 'Escape') { set(false); btn.focus(); }
    });
  }

  /* ---------- Header behaviour: solid after scroll, hide on scroll down ---------- */
  function wireHeaderScroll() {
    const h = document.getElementById('site-header');
    if (!h) return;
    let lastY = window.scrollY, ticking = false;
    const update = () => {
      const y = window.scrollY;
      h.classList.toggle('is-scrolled', y > 12);
      const menuOpen = document.querySelector('.mobile-menu.is-open');
      if (!menuOpen) h.classList.toggle('is-hidden', y > 320 && y > lastY + 2);
      if (y < lastY - 2) h.classList.remove('is-hidden');
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Reveal on scroll ---------- */
  let io;
  M.observeReveals = () => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal, .img-reveal').forEach(el => el.classList.add('is-in'));
      return;
    }
    io = io || new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal:not(.is-in), .img-reveal:not(.is-in)').forEach(el => io.observe(el));
  };

  /* ---------- Horizontal rail: buttons, progress, mouse drag with momentum ---------- */
  M.wireRail = (rail, prev, next, bar) => {
    const step = () => (rail.firstElementChild ? rail.firstElementChild.getBoundingClientRect().width + 24 : 300);
    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const p = max > 0 ? rail.scrollLeft / max : 1;
      if (prev) prev.disabled = rail.scrollLeft < 4;
      if (next) next.disabled = rail.scrollLeft > max - 4;
      if (bar) bar.style.transform = `scaleX(${Math.max(0.12, Math.min(1, rail.clientWidth / rail.scrollWidth + p * (1 - rail.clientWidth / rail.scrollWidth)))})`;
    };
    prev && prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    next && next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
    rail.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync);
    sync();

    // Mouse drag: 1:1 tracking, then hand off release velocity to a decaying glide
    let down = false, moved = false, startX = 0, startLeft = 0, hist = [];
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft; hist = [{ x: e.clientX, t: performance.now() }];
    });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 8) { moved = true; rail.classList.add('is-dragging'); }
      if (moved) {
        rail.scrollLeft = startLeft - dx;
        hist.push({ x: e.clientX, t: performance.now() });
        if (hist.length > 5) hist.shift();
      }
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      if (!moved) return;
      const a = hist[0], b = hist[hist.length - 1];
      let v = b && a && b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0; // px per ms
      const glide = () => {
        if (Math.abs(v) < 0.02) { rail.classList.remove('is-dragging'); return; }
        rail.scrollLeft -= v * 16;
        v *= 0.94;
        requestAnimationFrame(glide);
      };
      requestAnimationFrame(glide);
    });
  };

  /* ---------- Toast ---------- */
  M.toast = msg => {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('is-visible'), 3600);
  };

  M.waLink = text => `https://wa.me/${M.contact.whatsapp}?text=${encodeURIComponent(text)}`;

  /* ---------- Boot ---------- */
  document.documentElement.classList.remove('no-js');
  document.documentElement.lang = M.lang;
  renderHeader();
  renderFooter();
  renderFab();
  M.applyI18n();
  document.addEventListener('click', e => {
    const b = e.target.closest('.lang-switch button');
    if (b) M.setLang(b.dataset.lang);
  });
  wireHeaderScroll();
  document.addEventListener('DOMContentLoaded', () => M.observeReveals());
})();
