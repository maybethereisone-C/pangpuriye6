import type { SiteData } from "@/lib/site-data";
import { RevealOnView } from "@/components/motion/RevealOnView";

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
      <RevealOnView>
        <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] py-24 md:px-[var(--grid-margin-desktop)]">
          <header>
            <p data-anim="reveal-eyebrow" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
              SEC.07 · OTHERS // CREATIVE_WALL
            </p>
            <h2 data-anim="reveal-title" className="mt-2 font-[family-name:var(--font-display-loaded)]">Memes &amp; Brainstorms</h2>
          </header>

          {items.length === 0 ? (
            <p className="mt-12 font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-fg-soft)]">
              // STATUS: optional section, populated last.
            </p>
          ) : (
            <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {items.map((item, idx) => (
                <li key={idx} data-anim="reveal-item" className="aspect-square border border-[var(--color-hairline)] bg-[var(--color-hairline)]/30 p-4 transition-colors hover:border-[var(--color-accent-red)]">
                  <p className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
                    {item.type === "meme" ? "MEME" : "BRAINSTORM"}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-fg-soft)]">{item.caption}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </RevealOnView>
    </section>
  );
}
