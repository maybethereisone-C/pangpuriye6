import type { SiteData } from "@/lib/site-data";

/**
 * Hero — Section 01.
 *
 * Phase-01 SCAFFOLD only. Real visuals locked in Phase 02 (Stitch),
 * coded in Phase 03 with scroll-snap shell + Lenis + GSAP reveals.
 * See docs/design.md §3.5 row 01 for the slide brief.
 */
export function Hero({ data }: { data: SiteData["hero"] }) {
  return (
    <section
      id="home"
      data-section="01-home"
      data-section-index="1"
      className="grid place-items-center"
    >
      <div className="mx-auto grid max-w-[var(--grid-max-width)] grid-cols-1 items-center gap-[var(--grid-gutter-mobile)] px-[var(--grid-margin-mobile)] md:grid-cols-12 md:gap-[var(--grid-gutter-desktop)] md:px-[var(--grid-margin-desktop)]">
        <div className="md:col-span-7">
          <p className="mb-6 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-ink-gray-700)]">
            {data.eyebrow}
          </p>
          <h1 className="font-[family-name:var(--font-display-loaded)]">
            {data.title_line_1 && <span className="block">{data.title_line_1}</span>}
            <span className="block text-[var(--color-accent-red)]">{data.title_line_2}</span>
            {data.title_line_3 && <span className="block">{data.title_line_3}</span>}
          </h1>
          <p className="mt-8 max-w-xl border-l border-[var(--color-accent-gold)] pl-6 italic text-[var(--color-ink-gray-700)]">
            {data.motto}
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a
              href={data.cta_primary.href}
              data-magnetic
              className="bg-[var(--color-ink-charcoal)] px-8 py-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-ink-cream)] transition-colors hover:bg-[var(--color-accent-red)]"
            >
              {data.cta_primary.label}
            </a>
            <a
              href={data.cta_secondary.href}
              data-magnetic
              className="border border-[var(--color-ink-charcoal)] px-8 py-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-ink-charcoal)] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
            >
              {data.cta_secondary.label}
            </a>
          </div>
        </div>

        <div className="md:col-span-5">
          {/* photo-frame placeholder — Phase 03: real photo + corner crop marks + caption */}
          <div className="relative aspect-[4/5] w-full border border-[var(--color-ink-gray-300)] bg-[var(--color-ink-gray-300)]/20">
            <span className="absolute -top-1 -left-1 h-3 w-3 border-t border-l border-[var(--color-accent-gold)]" />
            <span className="absolute -top-1 -right-1 h-3 w-3 border-t border-r border-[var(--color-accent-gold)]" />
            <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-[var(--color-accent-gold)]" />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-[var(--color-accent-gold)]" />
          </div>
          <p className="mt-3 font-[family-name:var(--font-mono-loaded)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-gray-700)]">
            FIG.01 · COHORT_PRIME · 2026.05
          </p>
        </div>
      </div>
    </section>
  );
}
