import type { SiteData } from "@/lib/site-data";

/** Others — Section 07 (optional). Phase-01 SCAFFOLD. See docs/design.md §3.5 row 07. */
export function Others({ items }: { items: SiteData["others"]["items"] }) {
  return (
    <section
      id="others"
      data-section="07-others"
      data-section-index="7"
      className="grid"
      style={{ height: "auto", minHeight: "100svh", scrollSnapAlign: "start" }}
    >
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] py-24 md:px-[var(--grid-margin-desktop)]">
        <header>
          <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            SEC.07 · OTHERS // CREATIVE_WALL
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display-loaded)]">Memes &amp; Brainstorms</h2>
        </header>

        {items.length === 0 ? (
          <p className="mt-12 font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-ink-gray-700)]">
            // STATUS: optional section, populated last.
          </p>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item, idx) => (
              <li key={idx} className="aspect-square bg-[var(--color-ink-gray-300)]/30 p-4">
                <p className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
                  {item.type === "meme" ? "MEME" : "BRAINSTORM"}
                </p>
                <p className="mt-2 text-sm">{item.caption}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
