"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMenu } from "./MenuProvider";

export function TopBar() {
  const [current, setCurrent] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { toggle } = useMenu();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[data-section]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = Number((entry.target as HTMLElement).dataset.sectionIndex);
            if (!Number.isNaN(idx)) setCurrent(idx);
          }
        }
      },
      { threshold: [0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setHidden(false);
      } else if (y > lastScrollY.current + 8) {
        setHidden(true);
      } else if (y < lastScrollY.current - 8) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHero = current === 1;

  return (
    <header
      className="fixed top-0 left-0 z-50 flex w-full flex-row items-center justify-between px-[var(--grid-margin-mobile)] py-3 md:py-4 md:px-[var(--grid-margin-desktop)]"
      style={{
        opacity: mounted ? 1 : 0,
        transform: `translateX(${!mounted ? "-24px" : "0"}) translateY(${hidden ? "-100%" : "0"})`,
        transition: "opacity 700ms cubic-bezier(0.65, 0, 0.35, 1), transform 400ms cubic-bezier(0.65, 0, 0.35, 1), background-color 500ms ease, border-color 500ms ease",
        transitionDelay: mounted ? "0ms" : "80ms",
        backdropFilter: "blur(6px) saturate(160%)",
        WebkitBackdropFilter: "blur(6px) saturate(160%)",
        backgroundColor: onHero ? "var(--topbar-bg-zero)" : "var(--topbar-bg)",
        borderBottom: "1px solid",
        borderColor: onHero ? "transparent" : "var(--topbar-border)",
      }}
    >
      <a
        href="#home"
        aria-label="Pangpuriye home"
        className="flex items-center gap-2"
      >
        <Image
          src="/images/logo2_red.svg"
          alt=""
          aria-hidden
          width={96}
          height={96}
          unoptimized
          priority
          className="block h-10 w-10 md:h-20 md:w-20"
        />
      </a>

      <button
        type="button"
        onClick={toggle}
        aria-label="Open menu"
        className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent-red)]"
      >
        Menu
      </button>
    </header>
  );
}
