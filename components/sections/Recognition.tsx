import type { SiteData } from "@/lib/site-data";
import { RevealOnView } from "@/components/motion/RevealOnView";

/** Recognition — Section 05. */
export function Recognition({ data }: { data: SiteData["recognition"] }) {
  return (
    <section
      id="recognition"
      data-section="05-recognition"
      data-section-index="5"
      className="grid"
      style={{ height: "auto", minHeight: "100svh" }}
    >
     <RevealOnView>
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] pt-24 pb-24 md:px-[var(--grid-margin-desktop)] md:pt-32">
        <header>
          <p data-anim="reveal-eyebrow" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            RECOGNITION
          </p>
          <h2 data-anim="reveal-title" className="mt-2 font-[family-name:var(--font-display-loaded)]">Recognition Archive</h2>
          <p data-anim="reveal-body" data-drop-cap className="mt-6 max-w-3xl text-[var(--text-body)] leading-relaxed text-[var(--color-fg-soft)]">
            {data.lead}
          </p>
        </header>

        {data.awards.length === 0 && data.milestones.length === 0 && (
          <p className="mt-12 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            Awards &amp; milestones drop at the showcase — check back then.
          </p>
        )}

        {(data.awards.length > 0 || data.milestones.length > 0) && (
          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12">
            <ul className="space-y-6 md:col-span-7">
              {data.awards.map((a) => (
                <li key={a.code} data-anim="reveal-item" className="border border-[var(--color-hairline)] p-6 transition-colors hover:border-[var(--color-accent-red)]">
                  <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
                    {a.code}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display-loaded)] text-2xl font-bold">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-[var(--color-fg-soft)]">{a.description}</p>
                </li>
              ))}
            </ul>
            <ol className="md:col-span-5">
              {data.milestones.map((m, idx) => (
                <li key={m.title} data-anim="reveal-item" className="flex gap-4 border-b border-[var(--color-hairline)] py-4 transition-colors hover:border-[var(--color-accent-red)]/40">
                  <span className="font-[family-name:var(--font-mono-loaded)] text-2xl font-bold text-[var(--color-accent-red)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-bold">{m.title}</p>
                    <p className="text-sm text-[var(--color-fg-soft)]">{m.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

     </RevealOnView>
    </section>
  );
}
