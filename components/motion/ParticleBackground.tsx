"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * ParticleBackground — animated flow-field of specks behind content.
 *
 * Reference DNA: https://medium.com/hackernoon/playing-with-particles-part-2-9a4804091024
 *
 * Behavior (livable + visible):
 *   - Higher particle count + larger radius so the field reads against bg
 *   - Pseudo-Perlin flow field: particles follow a slowly-rotating noise field
 *     producing organic curving paths (claude.com / lusion.co coded)
 *   - Cursor proximity push (low intensity, kept from v1)
 *   - Connecting lines between near particles (sparse)
 *   - Theme-aware color: surgical red on light bg, warm cream on dark bg
 *   - Disabled under prefers-reduced-motion
 *   - Pauses on document.hidden (battery)
 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolved } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;
    let paused = false;
    let t = 0;

    const mouse = { x: -9999, y: -9999 };

    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      seed: number;
    }

    // Density scales with viewport area; cap for perf.
    const COUNT = Math.min(140, Math.round((width * height) / 14000));
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1.0 + Math.random() * 2.4,
      a: 0.35 + Math.random() * 0.4,
      seed: Math.random() * 1000,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      paused = document.hidden;
    };

    // Pseudo-noise flow field — simple multi-octave sine soup. Fast enough.
    const flow = (x: number, y: number, time: number): number => {
      const a = Math.sin(x * 0.0035 + time * 0.0007) * Math.cos(y * 0.004 + time * 0.0005);
      const b = Math.cos(x * 0.007 - time * 0.0009) * Math.sin(y * 0.006 + time * 0.0008);
      return (a + b * 0.6) * Math.PI;
    };

    const draw = () => {
      if (paused) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      t += 1;

      ctx.clearRect(0, 0, width, height);

      // Theme-aware color — RED house theme reads through.
      const baseColor = resolved === "dark" ? "238, 217, 185" : "193, 18, 31";

      // 1) Update + draw particles
      for (const p of particles) {
        // Flow field — each particle samples a seed-shifted position so
        // particles in the same spatial region see different vectors.
        // This breaks attractor coherence and prevents long-term convergence.
        const angle = flow(p.x + p.seed * 7, p.y + p.seed * 5, t + p.seed);
        const flowF = 0.06;
        p.vx += Math.cos(angle) * flowF;
        p.vy += Math.sin(angle) * flowF;

        // Thermal noise — small random impulse prevents particles stalling
        // at flow field fixed points over long sessions.
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;

        // Cursor push
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 22500) {
          const dist = Math.sqrt(dist2);
          const f = 0.22 * (1 - dist2 / 22500);
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
        }

        // Speed cap
        const sp = Math.hypot(p.vx, p.vy);
        const cap = 1.4;
        if (sp > cap) {
          p.vx = (p.vx / sp) * cap;
          p.vy = (p.vy / sp) * cap;
        }

        // Drift + drag (0.97 instead of 0.96 — less aggressive energy removal)
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.fillStyle = `rgba(${baseColor}, ${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2) Connecting lines between near particles
      ctx.lineWidth = 0.6;
      const linkDist2 = 13000;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist2) {
            const alpha = 0.28 * (1 - d2 / linkDist2);
            ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [resolved]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
