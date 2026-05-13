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
      style={{ height: "auto", minHeight: "100svh", scrollSnapAlign: "start" }}
    >
     <RevealOnView>
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] py-24 md:px-[var(--grid-margin-desktop)]">
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
            {items.map((item, idx) => {
              const meta = item.date ?? item.category.map((category) => category.name).join(" / ");

              return (
                <li
                  key={item.id}
                  data-anim="reveal-item"
                  className={idx === 0 ? "md:col-span-8" : "md:col-span-4"}
                >
                  <figure>
                    <div data-anim="reveal-photo" className="aspect-[4/3] bg-[var(--color-ink-gray-300)]/30" />
                    <figcaption className="mt-3 font-[family-name:var(--font-mono-loaded)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-gray-700)]">
                      {meta ? `${item.title} · ${meta}` : item.title}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        )}
      </div>
     </RevealOnView>
    </section>
  );
}
