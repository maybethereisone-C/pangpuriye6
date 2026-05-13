# Project Structure — HTML / CSS / JS

## Concept

A component-based static web project where `index.html` acts as the single entry point. HTML fragments, JavaScript modules, and CSS stylesheets each live in their own directory. `index.html` stitches everything together by injecting fragments at runtime and loading all scripts and styles.

---

## Directory Layout

```
/
├── index.html              ← entry point; loads all CSS & JS, mounts fragments
├── css/
│   ├── base.css            ← reset, variables, typography
│   ├── layout.css          ← grid, flex containers, page structure
│   └── <component>.css     ← per-component styles (e.g. navbar.css, card.css)
├── html/
│   └── <fragment_name>.html  ← reusable HTML snippets injected by JS
│       e.g. navbar.html
│            hero.html
│            footer.html
└── js/
    └── <function_name>.js  ← one file per responsibility / component
        e.g. loader.js      (fetches & injects HTML fragments)
             navbar.js      (navbar behaviour)
             gallery.js     (gallery logic)
             main.js        (app bootstrap, called last)
```

---

## index.html

`index.html` sits at the root. It:
1. Links every CSS file in `css/`.
2. Declares empty mount-point elements with `data-fragment` attributes.
3. Loads every JS file at the bottom of `<body>` in dependency order.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App</title>

  <!-- all stylesheets -->
  <link rel="stylesheet" href="css/base.css" />
  <link rel="stylesheet" href="css/layout.css" />
  <link rel="stylesheet" href="css/navbar.css" />
  <link rel="stylesheet" href="css/hero.css" />
  <link rel="stylesheet" href="css/footer.css" />
</head>
<body>

  <!-- mount points — fragments are injected here by loader.js -->
  <div data-fragment="navbar"></div>
  <main>
    <div data-fragment="hero"></div>
    <div data-fragment="gallery"></div>
  </main>
  <div data-fragment="footer"></div>

  <!-- scripts — loader first, feature modules next, bootstrap last -->
  <script src="js/loader.js"></script>
  <script src="js/navbar.js"></script>
  <script src="js/gallery.js"></script>
  <script src="js/main.js"></script>

</body>
</html>
```

---

## html/<fragment_name>.html

Each fragment is a self-contained HTML snippet — no `<html>`, `<head>`, or `<body>` wrapper.

```
html/
├── navbar.html
├── hero.html
├── gallery.html
└── footer.html
```

Example — `html/navbar.html`:
```html
<nav class="navbar">
  <a class="navbar__logo" href="/">Brand</a>
  <ul class="navbar__links">
    <li><a href="#hero">Home</a></li>
    <li><a href="#gallery">Gallery</a></li>
  </ul>
</nav>
```

---

## js/<function_name>.js

Each file owns one responsibility. The filename matches the feature or function it exposes.

```
js/
├── loader.js      ← core: fetches html/* fragments and injects them into mount points
├── navbar.js      ← handles mobile toggle, active-link highlighting
├── gallery.js     ← renders gallery items, handles lightbox
└── main.js        ← bootstraps the app after all fragments are loaded
```

### loader.js — fragment injection engine

```js
// js/loader.js
async function loadFragment(name) {
  const response = await fetch(`html/${name}.html`);
  const html = await response.text();
  document.querySelectorAll(`[data-fragment="${name}"]`).forEach((el) => {
    el.innerHTML = html;
  });
}

async function loadAllFragments() {
  const mounts = document.querySelectorAll('[data-fragment]');
  const names = [...new Set([...mounts].map((el) => el.dataset.fragment))];
  await Promise.all(names.map(loadFragment));
}

// expose so main.js can await it
window.loadAllFragments = loadAllFragments;
```

### main.js — app bootstrap

```js
// js/main.js
(async () => {
  await window.loadAllFragments();  // inject all html/* fragments
  navbar.init();                    // wire up navbar behaviour
  gallery.init();                   // wire up gallery behaviour
})();
```

### Feature module shape

Each feature module exposes an `init()` that runs after fragments are in the DOM.

```js
// js/gallery.js
const gallery = (() => {
  function render(items) { /* ... */ }
  function init() { /* query DOM, attach events, fetch data */ }
  return { init };
})();
```

---

## css/<component>.css

One stylesheet per visual concern. `base.css` is always first.

```
css/
├── base.css       ← custom properties (--color-*, --spacing-*), reset, body font
├── layout.css     ← page-level grid / flex structure
├── navbar.css     ← .navbar, .navbar__logo, .navbar__links
├── hero.css       ← .hero, .hero__title
├── gallery.css    ← .gallery, .gallery__item
└── footer.css     ← .footer
```

---

## Rules

| Rule | Reason |
|------|--------|
| One JS file per feature/function | Easy to locate, test, and replace independently |
| Fragments have no wrapper tags | `innerHTML` injection works without extra nesting |
| `loader.js` loaded first | All other scripts depend on `loadAllFragments` being available |
| `main.js` loaded last | It calls `init()` on modules that must already be defined |
| CSS loaded in `<head>` | Prevents flash of unstyled content |
| Filenames match their content | `gallery.js` owns gallery logic; `gallery.html` is the gallery fragment |
