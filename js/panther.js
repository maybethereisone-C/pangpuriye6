// js/panther.js
// Canvas-driven endless running-panther animation.
// Node coordinates are traced 1:1 from sample/mainchar.png (1200×630 draw-space).

const panther = (() => {

  // ── skeleton (draw-space: 1200 × 630) ──────────────────────────────────
  //   0 = tail tip   |  1 = tail-root / back-body
  //   2,3 = rear-leg tips (animated – REAR phase)
  //   4   = rear-leg upper pivot
  //   5,6 = belly / spine mid
  //   7,9 = front-leg tips (animated – FRONT phase, opposite to rear)
  //   8   = spine right
  //  10   = neck junction
  //  11-17 = head cluster
  const BASE = [
    [  45, 155],  //  0  tail tip
    [ 186, 385],  //  1  back-body / tail-root
    [ 307, 495],  //  2  rear-leg lower-left   ← REAR
    [ 381, 490],  //  3  rear-leg lower-right  ← REAR
    [ 381, 420],  //  4  rear-leg upper pivot
    [ 469, 462],  //  5  belly mid
    [ 556, 390],  //  6  spine mid
    [ 666, 519],  //  7  front-leg lower       ← FRONT
    [ 770, 403],  //  8  spine right
    [ 779, 507],  //  9  front-right lower     ← FRONT
    [ 958, 323],  // 10  neck junction
    [ 981, 180],  // 11  head upper-left
    [1013,  95],  // 12  ear tip
    [1080, 174],  // 13  head upper-right
    [1155, 250],  // 14  head right
    [1165, 173],  // 15  head top-right
    [1155, 338],  // 16  head lower-right (nose)
    [1068, 338],  // 17  head lower / chin
  ];

  const EDGES = [
    [0, 1], [0, 2],               // tail lines
    [1, 2], [1, 4],               // body-left
    [2, 3], [3, 4], [2, 4],       // rear leg triangle
    [3, 5], [4, 5],               // connect to belly
    [4, 6], [5, 6],               // belly → spine
    [5, 7], [6, 7],               // spine → front leg
    [6, 8], [7, 8],               // spine right section
    [7, 9],                       // front-right paw
    [8, 10],                      // spine → neck (long)
    [10, 11], [10, 17],           // neck → head
    [11, 12],                     // ear line
    [11, 13], [12, 13],           // head-top triangle
    [13, 14], [14, 15], [13, 15], // head-right cluster
    [14, 16], [16, 17],           // jaw line
    [11, 17],                     // head internal diagonal
  ];

  // Large accent nodes (bigger dot + stronger glow)
  const BIG_NODES = new Set([0, 4, 6, 8, 10, 11, 14, 17]);

  // Ambient scatter dots (fixed, faint)
  const SCATTER = [[400, 470], [548, 292], [1175, 428], [80, 492]];

  // ── animation constants ─────────────────────────────────────────────────
  const CYCLE    = 0.058;   // radians per frame  (~60 fps → ~1.8 s/cycle)
  const LEG_Y    = 52;      // vertical leg amplitude (draw-space px)
  const LEG_X    = 26;      // horizontal stride amplitude
  const BODY_Y   = 11;      // spine vertical bob
  const TAIL_Y   = 38;      // tail-tip vertical swing
  const HEAD_Y   = 7;       // head nod

  // ── state ───────────────────────────────────────────────────────────────
  let canvas, ctx, raf;
  let t = 0;

  // ── per-frame node computation ──────────────────────────────────────────
  function computeNodes() {
    const n = BASE.map(p => [p[0], p[1]]); // deep copy

    // 1. spine / body bob — affects ALL nodes so the whole body rises/falls
    const bob = Math.sin(t * 2) * BODY_Y;
    for (let i = 0; i < n.length; i++) n[i][1] += bob;

    // 2. tail tip oscillates independently (larger, slower arc)
    n[0][1] += Math.sin(t * 0.85) * TAIL_Y - bob;
    n[0][0] += Math.cos(t * 0.85) * (TAIL_Y * 0.4);

    // 3. rear leg tips (2, 3) — phase 0
    const rY = Math.sin(t)          * LEG_Y;
    const rX = Math.cos(t)          * LEG_X;
    n[2][1] += rY - bob;   n[2][0] += rX;
    n[3][1] += rY * 0.85 - bob;  n[3][0] += rX * 0.7;

    // 4. front leg tips (7, 9) — phase π (opposite)
    const fY = Math.sin(t + Math.PI) * LEG_Y;
    const fX = Math.cos(t + Math.PI) * LEG_X;
    n[7][1] += fY - bob;   n[7][0] += fX;
    n[9][1] += fY * 0.85 - bob;  n[9][0] += fX * 0.7;

    // 5. head nod (subtle)
    const headShift = Math.sin(t * 2 + 0.4) * HEAD_Y;
    for (let i = 10; i <= 17; i++) n[i][1] += headShift - bob;

    return n;
  }

  // ── draw one frame ───────────────────────────────────────────────────────
  function draw() {
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // fit 1200×630 draw-space into the actual canvas, centred
    const DRAW_W = 1200, DRAW_H = 630;
    const scale  = Math.min(W / DRAW_W, H / DRAW_H);
    const ox     = (W - DRAW_W * scale) / 2;
    const oy     = (H - DRAW_H * scale) / 2;

    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);

    const nodes = computeNodes();

    // ── edges ──────────────────────────────────────────────────────────────
    ctx.strokeStyle = '#c8291e';
    ctx.lineWidth   = 2;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    // subtle red glow on lines
    ctx.shadowColor  = 'rgba(200,41,30,0.45)';
    ctx.shadowBlur   = 8;

    EDGES.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(nodes[a][0], nodes[a][1]);
      ctx.lineTo(nodes[b][0], nodes[b][1]);
      ctx.stroke();
    });

    // ── node dots ──────────────────────────────────────────────────────────
    nodes.forEach(([x, y], i) => {
      const big = BIG_NODES.has(i);
      const r   = big ? 7 : 4.5;

      // pulsing glow for big nodes
      ctx.shadowColor = 'rgba(200,41,30,0.7)';
      ctx.shadowBlur  = big ? 14 + Math.sin(t * 3 + i) * 6 : 6;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#c8291e';
      ctx.fill();
    });

    // ── scatter dots ──────────────────────────────────────────────────────
    ctx.shadowBlur  = 0;
    ctx.fillStyle   = 'rgba(200,41,30,0.32)';
    SCATTER.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    t   += CYCLE;
    raf  = requestAnimationFrame(draw);
  }

  // ── canvas sizing ────────────────────────────────────────────────────────
  // Canvas is now in document flow inside .hero__visual-wrap (not absolute).
  // Width comes from CSS (100% of the grid column); height is derived here
  // to maintain the 1200:630 aspect ratio of the draw-space.
  function resize() {
    const w = canvas.offsetWidth || canvas.parentElement.offsetWidth || 480;
    const h = Math.round(w * (630 / 1200));
    if (canvas.width === w && canvas.height === h) return; // nothing changed
    canvas.width        = w;
    canvas.height       = h;
    canvas.style.height = h + 'px';
  }

  // ── public ───────────────────────────────────────────────────────────────
  function init() {
    canvas = document.getElementById('panther-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Use ResizeObserver when available for precise column-width tracking
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => resize());
      ro.observe(canvas.parentElement || canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    resize();
    raf = requestAnimationFrame(draw);
  }

  function destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  }

  return { init, destroy };
})();
