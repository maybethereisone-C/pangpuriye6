// js/logo-effect.js
// AI-power-line canvas effect that surrounds the Pangpuriye logo.
//
// Effects layered bottom → top:
//   1. Radial halo  — soft pink+green gradient glow
//   2. Scanning beam — rotating radar sweep (green)
//   3. Orbital arcs  — 4 partial ellipses rotating at different speeds (pink/green)
//   4. Neural field  — 40 particles with proximity connection lines (pink/green)
//   5. HUD brackets  — corner brackets tracing the logo boundary (green)

const logoEffect = (() => {

  // ── palette ─────────────────────────────────────────────────────────────
  // Pink:  #f472b6  |  Green: #4ade80
  // Both chosen to contrast with the crimson logo on the dark bg.
  const PINK  = [244, 114, 182];
  const GREEN = [ 74, 222, 128];
  const rgba  = ([r, g, b], a) => `rgba(${r},${g},${b},${+a.toFixed(3)})`;

  // ── canvas / context ─────────────────────────────────────────────────────
  let canvas, ctx, raf;
  let W = 1, H = 1;
  let t = 0;

  // ── orbits ───────────────────────────────────────────────────────────────
  // rx/ry are fractions of W/2 and H/2 respectively.
  // Equal fractions → 2:1 ellipse on screen (matches logo aspect ratio).
  const ORBITS = [
    { rx: 0.90, ry: 0.90, rot: 0,             drot:  0.0070, color: GREEN, arc: 1.50, lw: 1.5 },
    { rx: 0.99, ry: 0.99, rot: Math.PI,       drot: -0.0090, color: PINK,  arc: 1.00, lw: 1.2 },
    { rx: 0.78, ry: 0.78, rot: Math.PI / 3,   drot:  0.0130, color: PINK,  arc: 0.70, lw: 0.8 },
    { rx: 1.08, ry: 1.08, rot: Math.PI * 1.5, drot: -0.0045, color: GREEN, arc: 0.55, lw: 0.7 },
  ];

  // ── neural particles ──────────────────────────────────────────────────────
  const N_PARTS = 42;
  const PARTS = Array.from({ length: N_PARTS }, (_, i) => ({
    a:   (i / N_PARTS) * Math.PI * 2,                        // angle
    r:   0.25 + Math.random() * 0.55,                        // radial fraction
    da:  (0.0008 + Math.random() * 0.003) * (Math.random() < 0.5 ? 1 : -1),
    c:   Math.random() < 0.5 ? PINK : GREEN,
    sz:  0.7 + Math.random() * 2.2,
    ph:  Math.random() * Math.PI * 2,                        // blink phase
  }));

  // ── scanning beam angle ──────────────────────────────────────────────────
  let scan = 0;

  // ── resize ────────────────────────────────────────────────────────────────
  function resize() {
    const b = canvas.getBoundingClientRect();
    W = canvas.width  = b.width  || 2;
    H = canvas.height = b.height || 2;
  }

  // ── main draw loop ────────────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, W, H);

    const cx = W * 0.5;
    const cy = H * 0.5;
    const R  = Math.min(W, H) * 0.5;   // base radius in canvas px

    // ── 1. radial halo ──────────────────────────────────────────────────────
    const halo = ctx.createRadialGradient(cx, cy, R * 0.05, cx, cy, R * 0.95);
    halo.addColorStop(0,    rgba(PINK,  0.10));
    halo.addColorStop(0.45, rgba(GREEN, 0.06));
    halo.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    // ── 2. scanning beam ────────────────────────────────────────────────────
    scan += 0.009;
    const beamR = R * 0.92;
    const bx = cx + Math.cos(scan) * beamR;
    const by = cy + Math.sin(scan) * beamR;

    // sweep wedge trail
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, beamR, scan - 0.50, scan);
    ctx.closePath();
    ctx.fillStyle = rgba(GREEN, 0.05);
    ctx.fill();
    ctx.restore();

    // beam line with gradient
    const bGrad = ctx.createLinearGradient(cx, cy, bx, by);
    bGrad.addColorStop(0,    rgba(GREEN, 0.70));
    bGrad.addColorStop(0.55, rgba(GREEN, 0.22));
    bGrad.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(bx, by);
    ctx.strokeStyle = bGrad;
    ctx.lineWidth   = 1.5;
    ctx.shadowColor = rgba(GREEN, 0.55);
    ctx.shadowBlur  = 7;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    // ── 3. orbital arcs ──────────────────────────────────────────────────────
    ORBITS.forEach(o => {
      o.rot += o.drot;

      const rx = o.rx * W * 0.5;
      const ry = o.ry * H * 0.5;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(o.rot);

      // draw arc in segments with fading opacity (bright tail → transparent head)
      const STEPS = 14;
      for (let s = 0; s < STEPS; s++) {
        const f0    = (s / STEPS) * o.arc;
        const f1    = ((s + 1) / STEPS) * o.arc;
        const alpha = ((s + 1) / STEPS) * 0.62;
        const lw    = o.lw * (0.4 + 0.6 * (s / STEPS));

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, f0, f1);
        ctx.strokeStyle = rgba(o.color, alpha);
        ctx.lineWidth   = lw;
        ctx.stroke();
      }

      // bright leading dot at arc tip
      const lx = Math.cos(o.arc) * rx;
      const ly = Math.sin(o.arc) * ry;
      ctx.shadowColor = rgba(o.color, 0.95);
      ctx.shadowBlur  = 16;
      ctx.beginPath();
      ctx.arc(lx, ly, o.lw * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = rgba(o.color, 1.0);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    });

    // ── 4. neural field ──────────────────────────────────────────────────────
    // compute positions
    const pts = PARTS.map(p => {
      p.a += p.da;
      return {
        x:  cx + Math.cos(p.a) * p.r * R,
        y:  cy + Math.sin(p.a) * p.r * R,
        c:  p.c,
        sz: p.sz,
        al: 0.28 + 0.38 * Math.sin(t * 0.035 + p.ph),
      };
    });

    // connection lines between close particles
    const LINK_R = R * 0.34;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_R) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = rgba(pts[i].c, (1 - d / LINK_R) * 0.16);
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    // particle dots
    pts.forEach(p => {
      ctx.shadowColor = rgba(p.c, p.al);
      ctx.shadowBlur  = p.sz * 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
      ctx.fillStyle = rgba(p.c, p.al + 0.18);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // ── 5. HUD corner brackets ────────────────────────────────────────────────
    // Logo occupies the centre 80% of frame width.
    // With frame aspect 2:1 the logo fills ~88% of frame height.
    // Brackets hug those bounds with a tiny inset.
    const bx0 = W * 0.11,  by0 = H * 0.08;
    const bx1 = W * 0.89,  by1 = H * 0.92;
    const bs  = Math.min(W, H) * 0.10;
    const ba  = 0.18 + 0.14 * Math.sin(t * 0.04);

    ctx.strokeStyle = rgba(GREEN, ba);
    ctx.lineWidth   = 1;

    [
      [bx0, by0,  1,  1],
      [bx1, by0, -1,  1],
      [bx0, by1,  1, -1],
      [bx1, by1, -1, -1],
    ].forEach(([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x + sx * bs, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + sy * bs);
      ctx.stroke();
    });

    // ── tick labels on two corners (top-right, bottom-left) ─────────────────
    ctx.fillStyle   = rgba(GREEN, ba * 0.8);
    ctx.font        = `${Math.max(9, W * 0.022)}px monospace`;
    ctx.textAlign   = 'right';
    ctx.fillText('SYS.ACTIVE', bx1 - 2, by0 + bs * 0.7);
    ctx.textAlign   = 'left';
    ctx.fillText('COHORT_PRIME', bx0 + 2, by1 - bs * 0.25);

    t++;
    raf = requestAnimationFrame(draw);
  }

  // ── public ────────────────────────────────────────────────────────────────
  function init() {
    canvas = document.getElementById('logo-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(resize).observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();
    raf = requestAnimationFrame(draw);
  }

  function destroy() { cancelAnimationFrame(raf); }

  return { init, destroy };
})();
