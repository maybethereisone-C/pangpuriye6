import type { GalleryItem } from "@/lib/site-data";
import { RevealOnView } from "@/components/motion/RevealOnView";

/** Gallery — Section 04. */
export function Gallery({ items }: { items: GalleryItem[] }) {
  return (
    <section
      id="gallery"
      data-section="04-gallery"
      data-section-index="4"
      className="grid"
      style={{ height: "auto", minHeight: "100svh" }}
    >
     <RevealOnView>
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] pt-24 pb-24 md:px-[var(--grid-margin-desktop)] md:pt-32">
        <header>
          <p data-anim="reveal-eyebrow" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            SEC.04 · GALLERY // /records/pangpuriye/2026
          </p>
          <h2 data-anim="reveal-title" className="mt-2 font-[family-name:var(--font-display-loaded)]">House Activities</h2>
        </header>

        {items.length === 0 ? (
          <p className="mt-12 font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-ink-gray-700)]">
            // QUERY STATUS: empty — gallery items hydrate during Phase 04.
          </p>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
            {items.map((item, idx) => (
              <li
                key={item.id}
                data-anim="reveal-item"
                className={`group ${idx === 0 ? "md:col-span-8" : "md:col-span-4"}`}
              >
                <figure>
                  <div data-anim="reveal-photo" className="aspect-[4/3] overflow-hidden bg-[var(--color-hairline)]/30">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                  <figcaption className="mt-3 font-[family-name:var(--font-mono-loaded)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-soft)] transition-colors group-hover:text-[var(--color-fg)]">
                    {item.title} · {item.date}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
     </RevealOnView>
    </section>
  );
}
