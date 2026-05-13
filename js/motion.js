import { qs, qsa } from "./utils.js";

const EASE = {
  out: "power3.out",
  expo: "expo.out",
};

const DURATION = {
  short: 0.5,
  medium: 0.8,
  long: 1.1,
};

function reduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function splitWords(el) {
  if (el.dataset.wordSplit === "done") {
    return qsa(":scope > span.word", el);
  }
  const text = el.textContent || "";
  el.textContent = "";
  const fragment = document.createDocumentFragment();
  const words = [];
  for (const token of text.split(/(\s+)/)) {
    if (!token.trim()) {
      fragment.appendChild(document.createTextNode(token));
      continue;
    }
    const span = document.createElement("span");
    span.className = "word";
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    span.textContent = token;
    fragment.appendChild(span);
    words.push(span);
  }
  el.appendChild(fragment);
  el.dataset.wordSplit = "done";
  return words;
}

export function initSmoothScroll() {
  if (reduceMotion()) return null;
  const Lenis = window.Lenis;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!Lenis) return null;

  const lenis = new Lenis({
    lerp: 0.06,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.9,
  });

  if (gsap) {
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
  } else {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  window.PangLenis = lenis;
  return lenis;
}

function revealRoot(root) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger || reduceMotion()) {
    qsa(".reveal", root).forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const eyebrow = qs("[data-anim='reveal-eyebrow']", root);
  const title = qs("[data-anim='reveal-title']", root);
  const bodies = qsa("[data-anim='reveal-body']", root);
  const items = qsa("[data-anim='reveal-item']", root);
  const photos = qsa("[data-anim='reveal-photo']", root);
  const titleWords = title ? splitWords(title) : [];

  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: -8 });
  if (titleWords.length) gsap.set(titleWords, { opacity: 0, y: 40 });
  if (bodies.length) gsap.set(bodies, { opacity: 0, y: 20 });
  if (items.length) gsap.set(items, { opacity: 0, y: 24 });
  if (photos.length) gsap.set(photos, { clipPath: "inset(0 100% 0 0)" });

  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
  if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: DURATION.short }, 0);
  if (titleWords.length) {
    tl.fromTo(titleWords, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: DURATION.medium, stagger: 0.04, ease: EASE.expo }, 0.1);
  }
  if (bodies.length) tl.fromTo(bodies, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: DURATION.medium, stagger: 0.08 }, 0.35);
  if (items.length) tl.fromTo(items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: DURATION.medium, stagger: 0.05 }, 0.45);
  if (photos.length) {
    tl.fromTo(photos, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: DURATION.long, stagger: 0.1, ease: "power3.inOut" }, 0.5);
  }

  ScrollTrigger.create({
    trigger: root,
    start: root.dataset.revealStart || "top 75%",
    end: root.dataset.revealEnd || "bottom 20%",
    animation: tl,
    toggleActions: "play none play reverse",
  });

  const journey = qs(".journey", root);
  if (journey) journeyReveal(journey, root);
}

function journeyReveal(journey, root) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  const spine = qs(".journey-spine", journey);
  const dots = qsa(".journey-dot", journey);
  const cards = qsa(".journey-card", journey);

  if (spine) gsap.set(spine, { scaleY: 0, transformOrigin: "top center" });
  if (dots.length) gsap.set(dots, { scale: 0, opacity: 0 });
  if (cards.length) {
    gsap.set(cards, { opacity: 0, x: (i) => (cards[i].classList.contains("is-left") ? -32 : 32) });
  }

  const tl = gsap.timeline();
  if (spine) tl.fromTo(spine, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 4 }, 0);
  dots.forEach((dot, i) => {
    tl.fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, ease: "back.out(2)", duration: 0.6 }, 0.2 + i * 0.9);
  });
  cards.forEach((card, i) => {
    const fromX = card.classList.contains("is-left") ? -32 : 32;
    tl.fromTo(card, { opacity: 0, x: fromX }, { opacity: 1, x: 0, ease: "power3.out", duration: 0.8 }, 0.2 + i * 0.9);
  });

  ScrollTrigger.create({
    trigger: root,
    start: "top 75%",
    end: "bottom 60%",
    animation: tl,
    scrub: 0.6,
  });
}

function heroReveal() {
  const gsap = window.gsap;
  if (!gsap || reduceMotion()) return;
  const root = qs("#home");
  if (!root) return;

  const eyebrow = qs("[data-anim='hero-eyebrow']", root);
  const title = qs("[data-anim='hero-title']", root);
  const motto = qs("[data-anim='hero-motto']", root);
  const ctas = qsa("[data-anim='hero-cta']", root);
  const photo = qs("[data-anim='hero-photo']", root);
  const words = title
    ? qsa(":scope > span", title).flatMap((line) => splitWords(line))
    : [];

  const tl = gsap.timeline({ defaults: { ease: EASE.out } });
  if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: DURATION.short }, 0);
  if (words.length) {
    tl.fromTo(
      words,
      { opacity: 0, y: 60, rotateX: -30 },
      { opacity: 1, y: 0, rotateX: 0, duration: DURATION.long, stagger: 0.04, ease: EASE.expo },
      0.15,
    );
  }
  if (motto) tl.fromTo(motto, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: DURATION.medium }, 0.55);
  if (ctas.length) tl.fromTo(ctas, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: DURATION.short, stagger: 0.08 }, 0.75);
  if (photo) {
    tl.fromTo(
      photo,
      { opacity: 0, scale: 0.92, filter: "blur(8px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: DURATION.long },
      0.9,
    );
  }
}

export function initGsapReveal(scope = document) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  if (scope === document) heroReveal();
  qsa("[data-reveal-scope]", scope).forEach(revealRoot);
  window.PangReveal = initGsapReveal;
  ScrollTrigger?.refresh();
}

export function initTopbar() {
  const topbar = qs("[data-topbar]");
  let lastY = window.scrollY;
  requestAnimationFrame(() => topbar.classList.add("is-mounted"));

  function update() {
    const y = window.scrollY;
    topbar.classList.toggle("is-solid", y > window.innerHeight * 0.45);
    if (y < 80) {
      topbar.classList.remove("is-hidden");
    } else if (y > lastY + 8) {
      topbar.classList.add("is-hidden");
    } else if (y < lastY - 8) {
      topbar.classList.remove("is-hidden");
    }
    lastY = y;
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

export function initProgress() {
  const bar = qs(".progress span");
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.transform = `scaleX(${pct / 100})`;
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

export function initMenu() {
  const menu = qs("[data-menu]");
  const openButtons = qsa("[data-open-menu]");
  const closeButtons = qsa("[data-close-menu]");

  function setOpen(open) {
    menu.hidden = !open;
    document.body.classList.toggle("modal-open", open);
  }

  openButtons.forEach((button) => button.addEventListener("click", () => setOpen(true)));
  closeButtons.forEach((button) => button.addEventListener("click", () => setOpen(false)));
  qsa("[data-menu-link]").forEach((button) => {
    button.addEventListener("click", () => {
      setOpen(false);
      const target = qs(`#${button.dataset.menuLink}`);
      if (!target) return;
      if (window.PangLenis) {
        window.PangLenis.scrollTo(target, { duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

export function initTheme() {
  const buttons = qsa("[data-theme]");
  const storageKey = "pangpuriye6-theme";
  const system = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  let theme = localStorage.getItem(storageKey) || "system";
  if (!["light", "dark", "system"].includes(theme)) theme = "system";

  function resolved() {
    return theme === "system" ? system() : theme;
  }

  function apply() {
    document.documentElement.classList.toggle("dark", resolved() === "dark");
  }

  function paint() {
    buttons.forEach((button) => {
      button.setAttribute("aria-checked", String(button.dataset.theme === theme));
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      theme = button.dataset.theme;
      localStorage.setItem(storageKey, theme);
      apply();
      paint();
    });
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (theme === "system") apply();
  });

  apply();
  paint();
}

export function initMemberCarousel() {
  const track = qs("[data-members-track]");
  if (!track) return;

  let raf = 0;
  let x = 0;
  let speed = 0;
  let hovering = false;
  let dragging = false;
  let dragged = false;
  let lastX = 0;
  let velocity = 0;
  let lastTime = 0;

  function tick() {
    if (!dragging) {
      const target = hovering ? 0 : 2;
      speed += (target - speed) * 0.05;
      x -= speed;
    }

    const half = track.scrollWidth / 2;
    if (half > 0) {
      if (x <= -half) x %= half;
      if (x > 0) x = (x % half) - half;
    }
    track.style.transform = `translateX(${x}px)`;
    raf = requestAnimationFrame(tick);
  }

  track.addEventListener("mouseenter", () => {
    hovering = true;
  });
  track.addEventListener("mouseleave", () => {
    hovering = false;
  });
  track.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    dragging = true;
    dragged = false;
    lastX = event.clientX;
    velocity = 0;
    lastTime = performance.now();
    hovering = true;
    track.classList.add("is-dragging");
  });
  document.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    if (Math.abs(dx) > 4) dragged = true;
    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 0) velocity = (dx / dt) * 16;
    lastX = event.clientX;
    lastTime = now;
    x += dx;
  });
  document.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    hovering = false;
    if (dragged) speed = -velocity;
    track.classList.remove("is-dragging");
  });
  qsa("[data-carousel]").forEach((button) => {
    button.addEventListener("click", () => {
      speed = button.dataset.carousel === "left" ? -30 : 30;
    });
  });

  raf = requestAnimationFrame(tick);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
}

export function initParticles() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = qs("#particles");
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let time = 0;
  let paused = false;
  let raf = 0;
  const mouse = { x: -9999, y: -9999 };
  const smoothMouse = { x: -9999, y: -9999 };
  let particles = [];

  function createParticles() {
    const count = Math.min(140, Math.round((width * height) / 14000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random() * 2.4,
      a: 0.35 + Math.random() * 0.4,
      seed: Math.random() * 1000,
    }));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function flow(x, y, t) {
    const a = Math.sin(x * 0.0035 + t * 0.0007) * Math.cos(y * 0.004 + t * 0.0005);
    const b = Math.cos(x * 0.007 - t * 0.0009) * Math.sin(y * 0.006 + t * 0.0008);
    return (a + b * 0.6) * Math.PI;
  }

  function draw() {
    if (paused) {
      raf = requestAnimationFrame(draw);
      return;
    }
    time += 1;
    const dark = document.documentElement.classList.contains("dark");
    const color = dark ? "238,217,185" : "193,18,31";

    if (mouse.x < -1000) {
      smoothMouse.x = -9999;
      smoothMouse.y = -9999;
    } else {
      if (smoothMouse.x < -1000) {
        smoothMouse.x = mouse.x;
        smoothMouse.y = mouse.y;
      }
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.1;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.1;
    }

    ctx.clearRect(0, 0, width, height);
    for (const point of particles) {
      const angle = flow(point.x + point.seed * 7, point.y + point.seed * 5, time + point.seed);
      point.vx += Math.cos(angle) * 0.06 + (Math.random() - 0.5) * 0.05;
      point.vy += Math.sin(angle) * 0.06 + (Math.random() - 0.5) * 0.05;

      const dx = point.x - smoothMouse.x;
      const dy = point.y - smoothMouse.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < 22500) {
        const dist = Math.max(Math.sqrt(dist2), 1);
        const force = 0.22 * (1 - dist2 / 22500);
        point.vx += (dx / dist) * force;
        point.vy += (dy / dist) * force;
      }

      const speed = Math.hypot(point.vx, point.vy);
      if (speed > 1.4) {
        point.vx = (point.vx / speed) * 1.4;
        point.vy = (point.vy / speed) * 1.4;
      }

      point.x += point.vx;
      point.y += point.vy;
      point.vx *= 0.97;
      point.vy *= 0.97;

      if (point.x < -10) point.x = width + 10;
      if (point.x > width + 10) point.x = -10;
      if (point.y < -10) point.y = height + 10;
      if (point.y > height + 10) point.y = -10;

      ctx.fillStyle = `rgba(${color}, ${point.a})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 13000) {
          ctx.strokeStyle = `rgba(${color}, ${0.28 * (1 - d2 / 13000)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });
  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
  });
  raf = requestAnimationFrame(draw);
}

export function initCursor() {
  const dot = qs("[data-cursor-dot]");
  const ring = qs("[data-cursor-ring]");
  if (!dot || !ring) return;
  if (window.matchMedia("(hover: none)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let raf = 0;
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  function paint() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
    raf = requestAnimationFrame(paint);
  }

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
  });

  raf = requestAnimationFrame(paint);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
}

export function initMagneticHover() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(hover: none)").matches) return;

  const pull = 0.18;
  const targets = new WeakMap();

  function closestTarget(raw) {
    return raw instanceof Element ? raw.closest("[data-magnetic]") : null;
  }

  document.addEventListener(
    "pointerenter",
    (event) => {
      const target = closestTarget(event.target);
      if (!target) return;
      targets.set(target, { rect: target.getBoundingClientRect() });
      target.style.transition = "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)";
    },
    true,
  );

  document.addEventListener(
    "pointermove",
    (event) => {
      const target = closestTarget(event.target);
      if (!target) return;
      let entry = targets.get(target);
      if (!entry) {
        entry = { rect: target.getBoundingClientRect() };
        targets.set(target, entry);
      }
      const cx = entry.rect.left + entry.rect.width / 2;
      const cy = entry.rect.top + entry.rect.height / 2;
      target.style.transform = `translate3d(${(event.clientX - cx) * pull}px, ${(event.clientY - cy) * pull}px, 0)`;
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerleave",
    (event) => {
      const target = closestTarget(event.target);
      if (!target) return;
      target.style.transition = "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)";
      target.style.transform = "translate3d(0, 0, 0)";
      target.addEventListener("transitionend", () => (target.style.transition = ""), { once: true });
    },
    true,
  );

  window.addEventListener("resize", () => {
    qsa("[data-magnetic]").forEach((target) => targets.delete(target));
  });
}
