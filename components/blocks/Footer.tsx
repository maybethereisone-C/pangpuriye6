import type { SiteData } from "@/lib/site-data";

export function Footer({ data }: { data: SiteData["footer"] }) {
  return (
    <footer className="border-t border-[var(--color-hairline)] px-[var(--grid-margin-mobile)] py-12 md:px-[var(--grid-margin-desktop)]">
      <div className="mx-auto flex max-w-[var(--grid-max-width)] flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <span className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em]">
          © 2026 Pangpuriye · Super AI Engineer S6 · AIAT
        </span>
        <nav
          aria-label="Contacts"
          className="flex flex-wrap gap-6 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em]"
        >
          <a href={`mailto:${data.email}`} className="transition-colors hover:text-[var(--color-accent-red)]">Email</a>
          <a href={data.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--color-accent-red)]">
            GitHub
          </a>
          <a href={data.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--color-accent-red)]">
            Instagram
          </a>
          <a href={data.youtube} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--color-accent-red)]">
            YouTube
          </a>
        </nav>
      </div>
    </footer>
  );
}
