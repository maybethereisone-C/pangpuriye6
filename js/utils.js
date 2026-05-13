export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}

export function icon(name) {
  const attrs =
    'aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
  const fillAttrs = 'aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"';
  const icons = {
    mail: `<svg ${attrs}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></svg>`,
    phone: `<svg ${attrs}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>`,
    play: `<svg ${attrs}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>`,
    github: `<svg ${fillAttrs}><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.84c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.35 4.7-4.58 4.94.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>`,
    linkedin: `<svg ${fillAttrs}><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h4v1.7c.7-1.1 2.1-2 4-2 3 0 5 2 5 5.5V21h-4v-6c0-1.5-.5-2.5-2-2.5s-2.5 1-2.5 2.5V21H9V9Z"/></svg>`,
  };
  return icons[name] || "";
}

export function youtubeId(url = "") {
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
}

export function setModalOpen(modal, open) {
  modal.hidden = !open;
  modal.classList.toggle("is-open", open);
  document.body.classList.toggle("modal-open", open);
}
