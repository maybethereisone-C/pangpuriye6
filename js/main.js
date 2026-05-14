// js/main.js
// App bootstrap — runs after all scripts are loaded.
// 1. Injects all html/* fragments into their mount points.
// 2. Initialises feature modules once the DOM is ready.

(async () => {
  await window.loadAllFragments();

  navbar.init();
  counter.init();
  member.init();
  logoEffect.init();
  gallery.init();
})();
