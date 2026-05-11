"use client";

import { useTheme, type Theme } from "@/components/motion/ThemeProvider";

const ORDER: Theme[] = ["light", "dark", "system"];

const LABEL: Record<Theme, string> = {
  light: "LIGHT",
  dark: "DARK",
  system: "SYSTEM",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em]">
      <span className="text-[var(--color-fg-soft)]">Theme</span>
      <div className="flex divide-x divide-[var(--color-hairline)] border border-[var(--color-hairline)]">
        {ORDER.map((t) => {
          const active = theme === t;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={active}
              onClick={() => setTheme(t)}
              className={
                active
                  ? "bg-[var(--color-fg)] px-3 py-1.5 text-[var(--color-bg)]"
                  : "px-3 py-1.5 text-[var(--color-fg-soft)] transition-colors hover:text-[var(--color-accent-red)]"
              }
            >
              {LABEL[t]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
