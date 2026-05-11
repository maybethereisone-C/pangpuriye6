import type { SiteData } from "@/lib/site-data";
import { RevealOnView } from "@/components/motion/RevealOnView";

/** Clips — Section 06. */
export function Clips({ data }: { data: SiteData["clips"] }) {
  return (
    <section
      id="clips"
      data-section="06-clips"
      data-section-index="6"
      className="grid"
      style={{ height: "auto", minHeight: "100svh" }}
    >
     <RevealOnView>
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] pt-24 pb-24 md:px-[var(--grid-margin-tablet)] md:pt-32 lg:px-[var(--grid-margin-desktop)]">
        <header>
          <p data-anim="reveal-eyebrow" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            CLIPS
          </p>
          <h2 data-anim="reveal-title" className="mt-2 font-[family-name:var(--font-display-loaded)]">Videos</h2>
        </header>

        {data.featured.url !== "#" ? (
          <article className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
            <div data-anim="reveal-photo" className="group relative aspect-video cursor-pointer overflow-hidden bg-[var(--color-hairline)]/30 md:col-span-8">
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]" />
              <span className="absolute bottom-4 left-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-ink-cream)] mix-blend-difference">
                FEATURED · {data.featured.duration}
              </span>
            </div>
            <div className="md:col-span-4">
              <p data-anim="reveal-body" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
                {data.featured.topic.toUpperCase()} · {data.featured.date}
              </p>
              <h3 data-anim="reveal-body" className="mt-2 font-[family-name:var(--font-display-loaded)] text-2xl font-bold">
                {data.featured.title}
              </h3>
              <p data-anim="reveal-body" className="mt-3 font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-fg-soft)]">
                {data.featured.speaker}
              </p>
            </div>
          </article>
        ) : (
          <p className="mt-12 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            Clips drop after the showcase — check back then.
          </p>
        )}
      </div>
     </RevealOnView>
    </section>
  );
}
