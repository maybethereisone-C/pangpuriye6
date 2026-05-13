// js/member.js
// Fetches the cohort roster from the API, renders a 2-row × N-col carousel
// of circle cards, and shows a full member detail modal on click.

const member = (() => {

  const API_ORIGIN = 'http://pangpuriye:1323/api/v1/pangpuriye/member';
  const ROWS = 2;

  // In local dev the browser blocks cross-origin fetch with a preflight redirect.
  // corsproxy.io forwards the request (including custom headers) transparently.
  // On the real domain (pangpuriye.info) same-origin requests skip CORS entirely.
  const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);

  let allMembers = [];
  let pages      = [];
  let curPage    = 0;
  let curCols    = 4;

  // ── API ───────────────────────────────────────────────────────────────────

  function apiUrl(path = '') {
    const full = path ? `${API_ORIGIN}/${path}` : `${API_ORIGIN}?limit=99`;
    return isLocal ? `https://corsproxy.io/?${encodeURIComponent(full)}` : full;
  }

  async function fetchAll() {
    const url = apiUrl();
    console.log('[member] fetchAll → GET', url);
    const res = await fetch(url, {});
    console.log('[member] fetchAll response status:', res.status);
    if (!res.ok) throw new Error(`fetchAll HTTP ${res.status}`);
    const json = await res.json();
    console.log('[member] fetchAll raw JSON:', json);
    // Response shape: { data: [ {...}, ... ] }
    const raw = json.data ?? (Array.isArray(json) ? json : []);
    console.log('[member] fetchAll raw array length:', raw.length, '| first item:', raw[0]);
    const models = raw.map(toModel);
    console.log('[member] fetchAll models:', models);
    return models;
  }

  async function fetchOne(id) {
    const url = apiUrl(id);
    console.log('[member] fetchOne → GET', url);
    const res = await fetch(url, { headers: HEADERS });
    console.log('[member] fetchOne response status:', res.status);
    if (!res.ok) throw new Error(`fetchOne HTTP ${res.status}`);
    const json = await res.json();
    console.log('[member] fetchOne raw JSON:', json);
    // Response shape: { data: {...} }  or plain object
    const raw = json.data ?? json;
    const model = toModel(raw);
    console.log('[member] fetchOne model:', model);
    return model;
  }

  // ── data model ────────────────────────────────────────────────────────────
  // Normalises a raw API object into the shape the UI expects.

  function toModel(raw) {
    return {
      id:          raw.id         ?? raw._id        ?? '',
      aiat_id:     raw.aiat_id    ?? '',
      name:        raw.fullname   ?? '',
      nick:        raw.nickname   ?? '',
      slogan:      raw.slogan     ?? '',
      role:        raw.role       ?? '',
      interests:   Array.isArray(raw.interesting) ? raw.interesting : [],
      emails:      Array.isArray(raw.gmail)        ? raw.gmail       : [],
      phone:       raw.call       ?? '',
      photo:       raw.image      ?? '',
      video_links: Array.isArray(raw.video_links)  ? raw.video_links : [],
    };
  }

  // ── utilities ─────────────────────────────────────────────────────────────

  function initials(name = '') {
    return (name.trim().split(/\s+/).map(w => w[0] || '').slice(0, 2).join('').toUpperCase()) || '?';
  }

  function responsiveCols() {
    if (window.innerWidth >= 768) return 4;
    if (window.innerWidth >= 480) return 3;
    return 2;
  }

  function zeroPad(id) {
    return String(id).padStart(6, '0');
  }

  // ── circle card ───────────────────────────────────────────────────────────

  function makeCard(m) {
    const el = document.createElement('article');
    el.className = 'roster-card';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `View profile: ${m.name || 'Member'}`);

    const mid = zeroPad(m.id);

    el.innerHTML = `
      ${m.photo
        ? `<img class="roster-card__photo" src="${m.photo}" alt="${m.name}" loading="lazy"/>`
        : `<div class="roster-card__initials">${initials(m.name)}</div>`
      }
      <div class="roster-card__overlay"></div>
      <div class="roster-card__body">
        <p class="roster-card__id">${m.aiat_id || zeroPad(m.id)}</p>
        <p class="roster-card__name">${m.name || '—'}</p>
        ${m.nick  ? `<p class="roster-card__nick">"${m.nick}"</p>` : ''}
        ${m.role  ? `<p class="roster-card__role">${m.role}</p>`   : ''}
      </div>
    `;

    el.addEventListener('click', () => openDetail(m.id));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(m.id); }
    });

    return el;
  }

  // ── carousel builder ──────────────────────────────────────────────────────

  function buildCarousel(members) {
    const track = document.getElementById('roster-track');
    const dotsEl = document.getElementById('roster-dots');
    if (!track || !dotsEl) {
      console.error('[member] buildCarousel: missing #roster-track or #roster-dots');
      return;
    }

    curCols = responsiveCols();
    const perPage = curCols * ROWS;
    console.log('[member] buildCarousel — members:', members.length, '| cols:', curCols, '| perPage:', perPage);

    // Card width = (100% / cols) minus the gap that falls inside that fraction.
    // gap: 0.75rem mobile, 1rem desktop — use 1rem as a safe upper bound.
    const cardW = `calc(${(100 / curCols).toFixed(4)}% - ${(1 * (curCols - 1) / curCols).toFixed(4)}rem)`;

    // chunk into pages
    pages = [];
    for (let i = 0; i < members.length; i += perPage) {
      pages.push(members.slice(i, i + perPage));
    }

    // build page DOM
    track.innerHTML = '';
    pages.forEach(pageMembers => {
      const page = document.createElement('div');
      page.className = 'roster-page';
      page.style.setProperty('--roster-cols', String(curCols));
      pageMembers.forEach((m, idx) => {
        const card = makeCard(m);
        card.style.setProperty('--card-w', cardW);
        // column index drives the left→right stagger delay (75 ms per column)
        const col = idx % curCols;
        card.style.setProperty('--card-delay', `${col * 75}ms`);
        page.appendChild(card);
      });
      track.appendChild(page);
    });

    // build dots
    dotsEl.innerHTML = '';
    pages.forEach((_, pi) => {
      const btn = document.createElement('button');
      btn.className = 'roster-dot';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Page ${pi + 1}`);
      btn.addEventListener('click', () => goTo(pi));
      dotsEl.appendChild(btn);
    });

    goTo(0, false);
  }

  // ── navigation ────────────────────────────────────────────────────────────

  function goTo(p, animate = true) {
    const track = document.getElementById('roster-track');
    if (!track || p < 0 || p >= pages.length) return;

    curPage = p;

    track.style.transition = animate
      ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none';
    track.style.transform = `translateX(-${p * 100}%)`;

    // stagger animation: remove active from all pages, re-add to current
    // requestAnimationFrame pair forces a style recalc so the animation restarts
    const allPages = track.querySelectorAll('.roster-page');
    allPages.forEach(pg => pg.classList.remove('roster-page--active'));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (allPages[p]) allPages[p].classList.add('roster-page--active');
      });
    });

    document.querySelectorAll('.roster-dot').forEach((d, i) =>
      d.classList.toggle('is-active', i === p)
    );

    const prev = document.getElementById('roster-prev');
    const next = document.getElementById('roster-next');
    if (prev) prev.style.opacity = p === 0 ? '0.3' : '1';
    if (next) next.style.opacity = p === pages.length - 1 ? '0.3' : '1';
  }

  // ── modal ─────────────────────────────────────────────────────────────────

  function openDetail(id) {
    const modal = document.getElementById('member-modal');
    const panel = document.getElementById('modal-panel');
    if (!modal || !panel) return;

    panel.innerHTML = `
      <div class="modal-loading">
        <div class="modal-loading__spinner"></div>
        <p class="modal-loading__text">Loading…</p>
      </div>`;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    fetchOne(id)
      .then(m  => renderDetail(m, panel))
      .catch(() => {
        panel.innerHTML = `
          <div class="modal-loading">
            <p class="modal-loading__text" style="color:var(--accent)">Failed to load member.</p>
            <button class="modal-close" id="modal-close-btn">× CLOSE</button>
          </div>`;
        document.getElementById('modal-close-btn')?.addEventListener('click', closeDetail);
      });
  }

  function renderDetail(m, panel) {
    // m is already normalised by toModel()
    const id        = m.id;
    const name      = m.name  || '—';
    const nick      = m.nick;
    const slogan    = m.slogan;
    const role      = m.role  || '—';
    const interests = m.interests;
    const photo     = m.photo;
    const emails    = m.emails;
    const phone     = m.phone;

    const mid      = m.aiat_id || zeroPad(id);
    const tagHtml  = interests.map(t => `<span class="modal-tag">${t}</span>`).join('');
    const mailHtml = emails.map(e =>
      `<a class="modal-btn" href="mailto:${e}">EMAIL</a>`).join('');
    const callHtml = phone
      ? `<a class="modal-btn" href="tel:${phone}">CALL</a>`
      : '';

    panel.innerHTML = `
      <div class="modal-photo-side">
        ${photo
          ? `<img class="modal-photo" src="${photo}" alt="${name}"/>`
          : `<div class="modal-photo-placeholder">
               <span class="modal-photo-initials">${initials(name)}</span>
             </div>`
        }
        <p class="modal-mem-id">ID: ${mid}</p>
      </div>

      <div class="modal-info">
        <div class="modal-close-row">
          <button class="modal-close" id="modal-close-btn">× CLOSE</button>
        </div>

        <p class="modal-id-label">MEM.${mid}</p>
        <h3 class="modal-name">${name}</h3>
        ${nick    ? `<p class="modal-nick">"${nick}"</p>` : ''}
        ${slogan  ? `<p class="modal-slogan">${slogan}</p>` : ''}

        <hr class="modal-divider"/>

        <p class="modal-field-label">AI Skill</p>
        <p class="modal-skill">${role}</p>

        ${interests.length ? `
          <p class="modal-field-label">AI Interests</p>
          <div class="modal-tags">${tagHtml}</div>
        ` : ''}

        ${(emails.length || phone) ? `
          <div class="modal-actions">
            ${mailHtml}
            ${callHtml}
          </div>
        ` : ''}
      </div>
    `;

    document.getElementById('modal-close-btn')
      ?.addEventListener('click', closeDetail);
  }

  function closeDetail() {
    const modal = document.getElementById('member-modal');
    if (modal) modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // ── touch swipe ───────────────────────────────────────────────────────────

  function attachSwipe(el) {
    let startX = 0;
    el.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    el.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) dx < 0 ? goTo(curPage + 1) : goTo(curPage - 1);
    });
  }

  // ── responsive rebuild on resize ─────────────────────────────────────────

  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newCols = responsiveCols();
      if (newCols !== curCols && allMembers.length) {
        buildCarousel(allMembers);
      }
    }, 220);
  }

  // ── init ──────────────────────────────────────────────────────────────────

  async function init() {
    console.log('[member] init() called');

    const track = document.getElementById('roster-track');
    const countEl = document.getElementById('member-count');

    console.log('[member] #roster-track found:', !!track);
    console.log('[member] #member-count found:', !!countEl);

    if (!track) {
      console.error('[member] #roster-track not in DOM — fragment may not have loaded');
      return;
    }

    // wire nav buttons
    document.getElementById('roster-prev')
      ?.addEventListener('click', () => goTo(curPage - 1));
    document.getElementById('roster-next')
      ?.addEventListener('click', () => goTo(curPage + 1));

    // backdrop click closes modal
    document.getElementById('modal-backdrop')
      ?.addEventListener('click', closeDetail);

    // keyboard Escape closes modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDetail();
    });

    // touch swipe on carousel
    const outer = document.querySelector('.roster-outer');
    if (outer) attachSwipe(outer);

    // resize listener
    window.addEventListener('resize', onResize);

    // fetch roster
    try {
      const members = await fetchAll();
      allMembers = members;

      console.log('[member] total members loaded:', members.length);

      if (countEl) {
        countEl.textContent = members.length
          ? `// ${members.length} members in cohort`
          : '// no members returned';
      }

      if (members.length === 0) {
        console.warn('[member] fetchAll returned 0 members — check API response shape');
        return;
      }

      buildCarousel(members);
    } catch (err) {
      console.error('[member] init fetch failed:', err);
      if (countEl) countEl.textContent = '// failed to load roster';
    }
  }

  return { init };
})();
