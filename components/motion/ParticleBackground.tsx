"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Particle background — subtle floating specks behind content.
 *
 * Reference DNA: https://medium.com/hackernoon/playing-with-particles-part-2-9a4804091024
 *
 * Behavior:
 *   - Renders a fixed full-viewport <canvas> beneath all content (z below 0).
 *   - ~60 particles, slow drift, low alpha. Density scales with viewport area.
 *   - Color is theme-aware: red glow on light bg, warm cream on dark bg.
 *   - Cursor proximity nudges nearby particles outward (low-intensity).
 *   - Disabled under prefers-reduced-motion: reduce.
 *   - Pauses on document.hidden to save battery.
 *
 * Performance budget: ~0.3ms/frame on M-series, single requestAnimationFrame loop.
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

    const mouse = { x: -9999, y: -9999 };

    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
    }

    const COUNT = Math.min(80, Math.round((width * height) / 22000));
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: 0.6 + Math.random() * 1.6,
      a: 0.15 + Math.random() * 0.35,
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

    const draw = () => {
      if (paused) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Theme-aware color — surgical red dots (RGB) so theme reads "red house".
      const baseColor = resolved === "dark" ? "238, 217, 185" : "193, 18, 31";

      // 1) Update + draw particles
      for (const p of particles) {
        // Cursor push (low intensity)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 14400) {
          const f = 0.06 * (1 - dist2 / 14400);
          p.vx += (dx / Math.sqrt(dist2)) * f;
          p.vy += (dy / Math.sqrt(dist2)) * f;
        }
        // Drift
        p.x += p.vx;
        p.y += p.vy;
        // Drag toward zero velocity
        p.vx *= 0.985;
        p.vy *= 0.985;
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

      // 2) Connecting lines between near particles (sparse)
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 9000) {
            const alpha = 0.14 * (1 - d2 / 9000);
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
      style={{ mixBlendMode: "normal" }}
    />
  );
}
