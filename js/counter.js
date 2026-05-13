// js/counter.js
// Watches sections with [data-section-index] and updates the
// navbar counter (#nav-current) as they scroll into view.

const counter = (() => {
  function init() {
    const display = document.getElementById('nav-current');
    if (!display) return;

    const sections = document.querySelectorAll('[data-section-index]');
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = entry.target.dataset.sectionIndex;
            display.textContent = String(idx).padStart(2, '0');
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((s) => io.observe(s));
  }

  return { init };
})();
