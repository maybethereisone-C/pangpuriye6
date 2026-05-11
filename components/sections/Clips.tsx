import type { SiteData } from "@/lib/site-data";

/** Clips — Section 06. Phase-01 SCAFFOLD. See docs/design.md §3.5 row 06. */
export function Clips({ data }: { data: SiteData["clips"] }) {
  return (
    <section
      id="clips"
      data-section="06-clips"
      data-section-index="6"
      className="grid"
      style={{ height: "auto", minHeight: "100svh", scrollSnapAlign: "start" }}
    >
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] py-24 md:px-[var(--grid-margin-desktop)]">
        <header>
          <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            SEC.06 · CLIPS // KB.LOG · VIDEO_ARCHIVE
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display-loaded)]">Knowledge Clips</h2>
        </header>

        <article className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="relative aspect-video bg-[var(--color-ink-gray-300)]/30 md:col-span-8">
            <span className="absolute bottom-4 left-4 font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-cream)] mix-blend-difference">
              FEATURED · {data.featured.duration}
            </span>
          </div>
          <div className="md:col-span-4">
            <p className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
              {data.featured.topic.toUpperCase()} · {data.featured.date}
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-display-loaded)] text-2xl font-bold">
              {data.featured.title}
            </h3>
            <p className="mt-3 font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-ink-gray-700)]">
              {data.featured.speaker}
            </p>
          </div>
        </article>

        {data.list.length === 0 && (
          <p className="mt-12 font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-ink-gray-700)]">
            // STATUS: secondary clips hydrate during Phase 05.
          </p>
        )}
      </div>
    </section>
  );
}
