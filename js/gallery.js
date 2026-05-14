// js/gallery.js
// SEC.05 · Gallery // Moments
// Fetches categories and gallery items from the API.
// Renders a focus carousel: side items are circles sliced from the viewport
// edges; the centre item is the full portrait card.

const gallery = (() => {

  const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);
  const ORIGIN  = isLocal ? 'http://localhost:1323' : '';

  const CAT_URL = `${ORIGIN}/api/v1/pangpuriye/media/category`;
  const GAL_URL = `${ORIGIN}/api/v1/pangpuriye/media/gallery`;

  // One palette per card slot (cycles by item index).
  // Each entry colours the card bg gradient, accent border/tags, and glow.
  const PALETTES = [
    { from: '#2a0808', accent: '#c8291e' }, // crimson
    { from: '#251808', accent: '#d4a373' }, // gold
    { from: '#06161e', accent: '#5ab4c8' }, // teal
    { from: '#130826', accent: '#9a72d0' }, // violet
    { from: '#1e1006', accent: '#d48c3a' }, // amber
    { from: '#061a10', accent: '#4ab888' }, // emerald
  ];

  let categories  = [];
  let items       = [];
  let activeCatId = null; // null = all
  let curIdx      = 0;

  // ── API ───────────────────────────────────────────────────────────────────

  async function fetchCategories() {
    const res = await fetch(CAT_URL);
    if (!res.ok) throw new Error(`categories HTTP ${res.status}`);
    const json = await res.json();
    return (json.data ?? []).map(c => ({ id: c.id, name: c.name }));
  }

  async function fetchItems(catIds = []) {
    let url = `${GAL_URL}?limit=50`;
    catIds.forEach(id => { url += `&category_id=${encodeURIComponent(id)}`; });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`gallery HTTP ${res.status}`);
    const json = await res.json();
    return json.data ?? [];
  }

  // ── category filter tabs ──────────────────────────────────────────────────

  function renderCats() {
    const el = document.getElementById('gallery-cats');
    if (!el) return;
    el.innerHTML = '';

    const makeBtn = (label, catId) => {
      const btn = document.createElement('button');
      btn.className = 'gallery-cat' + (catId === activeCatId ? ' is-active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => selectCat(catId, btn));
      return btn;
    };

    el.appendChild(makeBtn('ALL', null));
    categories.forEach(c => el.appendChild(makeBtn(c.name.toUpperCase(), c.id)));
  }

  async function selectCat(catId, btn) {
    if (catId === activeCatId) return;
    activeCatId = catId;

    document.querySelectorAll('.gallery-cat').forEach(b => b.classList.remove('is-active'));
    btn?.classList.add('is-active');

    setStatus('// loading…');
    try {
      items  = await fetchItems(catId ? [catId] : []);
      curIdx = 0;
      renderCarousel();
      setStatus(items.length ? `// ${items.length} moments captured` : '// no moments found');
    } catch (e) {
      console.error('[gallery] selectCat failed:', e);
      setStatus('// failed to load');
    }
  }

  // ── carousel ──────────────────────────────────────────────────────────────

  function renderCarousel() {
    renderDots();
    renderCards();
    syncArrows();
  }

  function renderDots() {
    const dotsEl = document.getElementById('gallery-dots');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    items.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'gallery-dot' + (i === curIdx ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Item ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(btn);
    });
  }

  function renderCards() {
    const track = document.getElementById('gallery-track');
    if (!track) return;

    if (items.length === 0) {
      track.innerHTML = '<div class="gallery-empty">// no moments found</div>';
      return;
    }

    track.innerHTML = '';

    const total = items.length;
    const prevIdx = (curIdx - 1 + total) % total;
    const nextIdx = (curIdx + 1) % total;

    // Build the three visible slots
    const slots = [];
    if (total >= 2) slots.push({ item: items[prevIdx], idx: prevIdx, role: 'prev' });
    slots.push({ item: items[curIdx], idx: curIdx, role: 'active' });
    if (total >= 3) slots.push({ item: items[nextIdx], idx: nextIdx, role: 'next' });

    slots.forEach(({ item, idx, role }) => {
      track.appendChild(makeCard(item, idx, role));
    });

    // Sync dots
    document.querySelectorAll('.gallery-dot').forEach((d, i) =>
      d.classList.toggle('is-active', i === curIdx)
    );
  }

  function makeCard(item, idx, role) {
    const palette = PALETTES[idx % PALETTES.length];
    const el      = document.createElement('article');
    el.className  = `gallery-card gallery-card--${role}`;
    el.style.setProperty('--card-from',   palette.from);
    el.style.setProperty('--card-accent', palette.accent);

    const images = Array.isArray(item.images) ? item.images : [];
    const cover  = images[0] ?? '';
    const cats   = (item.category ?? [])
      .map(c => `<span class="gallery-card__cat">${c.name}</span>`)
      .join('');

    if (role === 'active') {
      el.innerHTML = `
        <div class="gallery-card__img-wrap">
          ${cover
            ? `<img src="${cover}" alt="${item.title || 'Gallery'}" loading="lazy"/>`
            : `<div class="gallery-card__img-placeholder"></div>`
          }
          ${images.length > 1 ? `<span class="gallery-card__count">+${images.length - 1}</span>` : ''}
        </div>
        <div class="gallery-card__body">
          ${cats ? `<div class="gallery-card__cats">${cats}</div>` : ''}
          <p class="gallery-card__title">${item.title || '—'}</p>
          ${item.description ? `<p class="gallery-card__desc">${item.description}</p>` : ''}
        </div>
      `;
    } else {
      // Circle side card — image only
      el.innerHTML = cover
        ? `<img src="${cover}" alt="${item.title || 'Gallery'}" loading="lazy"/>`
        : `<div class="gallery-card__img-placeholder"></div>`;

      el.addEventListener('click', () => goTo(role === 'prev' ? curIdx - 1 : curIdx + 1));
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', `View: ${item.title || 'Gallery item'}`);
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goTo(role === 'prev' ? curIdx - 1 : curIdx + 1);
        }
      });
    }

    return el;
  }

  function goTo(n) {
    const total = items.length;
    if (total <= 1) return;
    curIdx = ((n % total) + total) % total;
    renderCards();
    syncArrows();
    document.querySelectorAll('.gallery-dot').forEach((d, i) =>
      d.classList.toggle('is-active', i === curIdx)
    );
  }

  function syncArrows() {
    const opacity = items.length <= 1 ? '0.25' : '1';
    document.getElementById('gallery-prev')?.style.setProperty('opacity', opacity);
    document.getElementById('gallery-next')?.style.setProperty('opacity', opacity);
  }

  // ── touch swipe ───────────────────────────────────────────────────────────

  function attachSwipe(el) {
    let startX = 0;
    el.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    el.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) goTo(curIdx + (dx < 0 ? 1 : -1));
    });
  }

  // ── helpers ───────────────────────────────────────────────────────────────

  function setStatus(msg) {
    const el = document.getElementById('gallery-status');
    if (el) el.textContent = msg;
  }

  // ── init ──────────────────────────────────────────────────────────────────

  async function init() {
    const track = document.getElementById('gallery-track');
    if (!track) return;

    // Wire arrows
    document.getElementById('gallery-prev')
      ?.addEventListener('click', () => goTo(curIdx - 1));
    document.getElementById('gallery-next')
      ?.addEventListener('click', () => goTo(curIdx + 1));

    // Touch swipe on viewport
    const viewport = document.querySelector('.gallery-viewport');
    if (viewport) attachSwipe(viewport);

    // Keyboard navigation on stage
    document.querySelector('.gallery-stage')
      ?.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  goTo(curIdx - 1);
        if (e.key === 'ArrowRight') goTo(curIdx + 1);
      });

    setStatus('// loading archive…');

    try {
      [categories, items] = await Promise.all([
        fetchCategories(),
        fetchItems(),
      ]);

      console.log('[gallery] categories:', categories.length, '| items:', items.length);

      renderCats();
      curIdx = 0;
      renderCarousel();
      setStatus(items.length
        ? `// ${items.length} moments captured`
        : '// no moments yet');
    } catch (err) {
      console.error('[gallery] init failed:', err);
      setStatus('// failed to load archive');
    }
  }

  return { init };
})();
