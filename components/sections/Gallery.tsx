import type { GalleryItem } from "@/lib/site-data";

/** Gallery — Section 04. Phase-01 SCAFFOLD. See docs/design.md §3.5 row 04. */
export function Gallery({ items }: { items: GalleryItem[] }) {
  return (
    <section
      id="gallery"
      data-section="04-gallery"
      data-section-index="4"
      className="grid"
      style={{ height: "auto", minHeight: "100svh", scrollSnapAlign: "start" }}
    >
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] py-24 md:px-[var(--grid-margin-desktop)]">
        <header>
          <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            SEC.04 · GALLERY // /records/pangpuriye/2026
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display-loaded)]">House Activities</h2>
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
                className={idx === 0 ? "md:col-span-8" : "md:col-span-4"}
              >
                <figure>
                  <div className="aspect-[4/3] bg-[var(--color-ink-gray-300)]/30" />
                  <figcaption className="mt-3 font-[family-name:var(--font-mono-loaded)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-gray-700)]">
                    {item.title} · {item.date}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
