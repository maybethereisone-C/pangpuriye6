"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMenu } from "./MenuProvider";

export function TopBar({ total }: { total: number }) {
  const [current, setCurrent] = useState(1);
  const [mounted, setMounted] = useState(false);
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

  return (
    <header
      className="fixed top-0 left-0 z-50 flex w-full flex-row items-center justify-between px-[var(--grid-margin-mobile)] py-3 md:py-4 md:px-[var(--grid-margin-desktop)]"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateX(0)" : "translateX(-24px)",
        transition: "opacity 700ms cubic-bezier(0.65, 0, 0.35, 1), transform 700ms cubic-bezier(0.65, 0, 0.35, 1)",
        transitionDelay: "80ms",
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
          className="block h-10 w-10 md:h-14 md:w-14"
        />
      </a>

      <div className="flex items-center gap-4">
        <span className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg)]">
          {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={toggle}
          aria-label="Open menu"
          className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent-red)]"
        >
          Menu
        </button>
      </div>
    </header>
  );
}
