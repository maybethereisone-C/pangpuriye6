// js/loader.js
// Fetches html/<name>.html fragments and injects them into
// every [data-fragment="<name>"] mount point in the DOM.

async function loadFragment(name) {
  const res = await fetch(`html/${name}.html`);
  if (!res.ok) throw new Error(`Fragment not found: html/${name}.html (${res.status})`);
  const markup = await res.text();
  document.querySelectorAll(`[data-fragment="${name}"]`).forEach((el) => {
    el.innerHTML = markup;
  });
}

async function loadAllFragments() {
  const mounts = document.querySelectorAll('[data-fragment]');
  const names  = [...new Set([...mounts].map((el) => el.dataset.fragment))];
  await Promise.all(names.map(loadFragment));
}

window.loadAllFragments = loadAllFragments;
