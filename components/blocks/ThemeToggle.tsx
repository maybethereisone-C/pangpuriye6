"use client";

import { useTheme, type Theme } from "@/components/motion/ThemeProvider";

const ORDER: Theme[] = ["light", "dark", "system"];

const LABEL: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "Auto",
};

function Icon({ name }: { name: Theme }) {
  const stroke = "currentColor";
  if (name === "light") {
    return (
      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4" />
      </svg>
    );
  }
  if (name === "dark") {
    return (
      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    );
  }
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="13" rx="1.5" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="relative inline-flex items-center gap-0.5 rounded-full border p-1 font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.18em]"
      style={{ borderColor: "var(--color-hairline)" }}
    >
      {ORDER.map((t) => {
        const active = theme === t;
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${LABEL[t]} theme`}
            onClick={() => setTheme(t)}
            className="theme-pill relative flex h-7 items-center gap-1.5 rounded-full px-3 transition-colors duration-200"
          >
            <Icon name={t} />
            <span>{LABEL[t]}</span>
          </button>
        );
      })}
    </div>
  );
}
