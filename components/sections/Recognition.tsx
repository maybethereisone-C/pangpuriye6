import type { SiteData } from "@/lib/site-data";

/** Recognition — Section 05. Phase-01 SCAFFOLD. See docs/design.md §3.5 row 05. */
export function Recognition({ data }: { data: SiteData["recognition"] }) {
  return (
    <section
      id="recognition"
      data-section="05-recognition"
      data-section-index="5"
      className="grid"
      style={{ height: "auto", minHeight: "100svh", scrollSnapAlign: "start" }}
    >
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] py-24 md:px-[var(--grid-margin-desktop)]">
        <header>
          <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            SEC.05 · RECOGNITION // HALL_OF_FAME
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display-loaded)]">Recognition Archive</h2>
          <p className="mt-6 max-w-3xl text-[var(--text-body)] leading-relaxed text-[var(--color-ink-gray-700)]">
            {data.lead}
          </p>
        </header>

        {data.awards.length === 0 && data.milestones.length === 0 ? (
          <p className="mt-12 font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-ink-gray-700)]">
            // STATUS: awards + milestones hydrate during Phase 05.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12">
            <ul className="space-y-6 md:col-span-7">
              {data.awards.map((a) => (
                <li key={a.code} className="border border-[var(--color-ink-gray-300)] p-6">
                  <p className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
                    {a.code}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display-loaded)] text-2xl font-bold">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-[var(--color-ink-gray-700)]">{a.description}</p>
                </li>
              ))}
            </ul>
            <ol className="md:col-span-5">
              {data.milestones.map((m, idx) => (
                <li key={m.title} className="flex gap-4 border-b border-[var(--color-ink-gray-300)] py-4">
                  <span className="font-[family-name:var(--font-mono-loaded)] text-2xl font-bold text-[var(--color-accent-red)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-bold">{m.title}</p>
                    <p className="text-sm text-[var(--color-ink-gray-700)]">{m.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
