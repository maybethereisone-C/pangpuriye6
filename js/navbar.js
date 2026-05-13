// js/navbar.js
// Wires up the MENU open/close overlay.

const navbar = (() => {
  function init() {
    const openBtn  = document.getElementById('menu-open');
    const closeBtn = document.getElementById('menu-close');
    const overlay  = document.getElementById('nav-overlay');

    if (!openBtn || !overlay) return;

    function open() {
      overlay.classList.add('is-open');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      overlay.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);

    // close on overlay link click
    overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

    // close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }

  return { init };
})();
