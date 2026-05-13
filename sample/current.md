  ---
  Structure
  index.html          ← root entry; includes all fragments via data-fragment=""
  css/base.css        ← custom properties, reset, Space Grotesk + Space Mono fonts
  css/layout.css      ← .section (100vh), shared dot/constellation helpers
  css/navbar.css      ← fixed navbar + full-screen overlay menu
  css/hero.css        ← hero layout, title, buttons, panther visual
  css/member.css      ← member grid, card anatomy (photo, name, tags…)
  html/navbar.html    ← logo · "01/06" counter · MENU + overlay with all 6 nav links
  html/hero.html      ← section 01: title, panther SVG wireframe, deco constellation
  html/member.html    ← section 03: header + empty #member-grid (filled by JS)
  js/loader.js        ← fetch("html/*.html") → inject into [data-fragment]
  js/navbar.js        ← MENU open/close, Escape key, body scroll-lock
  js/counter.js       ← IntersectionObserver → updates "01/06" as sections scroll in
  js/member.js        ← ROSTER[] data → builds member cards with placeholder SVG
  js/main.js          ← await loadAllFragments() → navbar.init / counter.init / member.init