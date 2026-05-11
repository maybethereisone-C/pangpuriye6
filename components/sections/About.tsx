import type { SiteData } from "@/lib/site-data";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { JourneyTimeline } from "@/components/motion/JourneyTimeline";


/** About — Section 02. */
export function About({ data }: { data: SiteData["about"] }) {
  return (
    <section
      id="about"
      data-section="02-about"
      data-section-index="2"
      className="grid place-content-center"
      style={{ height: "auto", minHeight: "100svh" }}
    >
      <RevealOnView>
        <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] py-20 md:px-[var(--grid-margin-desktop)] md:py-24">

          {/* — Original layout: text + DNA cards — */}
          <div className="grid grid-cols-1 gap-[var(--grid-gutter-mobile)] md:grid-cols-12 md:gap-[var(--grid-gutter-desktop)] md:items-center">
            <div className="md:col-span-7">
              <header>
                <h2 data-anim="reveal-title" className="font-[family-name:var(--font-display-loaded)]">About Pangpuriye</h2>
              </header>

              <article className="mt-6">
                <p data-drop-cap className="text-[var(--text-lead)] leading-relaxed text-[var(--color-fg-soft)]">
                  {data.dna_paragraph_1}
                </p>
                <p className="mt-6 leading-relaxed text-[var(--color-fg-soft)]">
                  {data.dna_paragraph_2}
                </p>
                <p className="mt-12 max-w-md border-l border-[var(--color-accent-gold)] pl-6 italic text-[var(--color-fg)]">
                  {data.motto}
                </p>
              </article>
            </div>

            <aside className="md:col-span-5">
              <ul className="grid grid-cols-2 gap-4">
                {[
                  { label: "ASSET: LOGO", title: "House Logo" },
                  { label: "ASSET: SYMBOL", title: "House Symbol" },
                  { label: "ASSET: UNIFORM", title: data.uniform_name },
                  { label: "DOC: SYS_REV", title: data.sys_rev },
                ].map((card) => (
                  <li
                    key={card.label}
                    data-anim="reveal-item"
                    className="aspect-square border border-[var(--color-hairline)] p-4 transition-colors hover:border-[var(--color-accent-red)]"
                  >
                    <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)]">
                      {card.label}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display-loaded)] text-base font-bold">
                      {card.title}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <JourneyTimeline />

          {/* — Mission & Vision — */}
          <div className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div data-anim="reveal-item" className="relative overflow-hidden border-l-4 border-[var(--color-accent-red)] p-8" style={{ background: "var(--color-bg)" }}>
              <span className="absolute top-4 right-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-gold)]">M / 01</span>
              <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">Our Mission</p>
              <h4 className="mt-3 font-[family-name:var(--font-display-loaded)] text-2xl font-bold text-[var(--color-fg)]">Innovate &amp; Solve</h4>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-soft)]">
                Build AI systems that address real problems — not demos that live only in notebooks.
              </p>
            </div>

            <div data-anim="reveal-item" className="relative overflow-hidden border-l-4 border-[var(--color-accent-gold)] p-8" style={{ background: "var(--color-fg)", color: "var(--color-bg)" }}>
              <span className="absolute top-4 right-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-gold)]">V / 02</span>
              <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-gold)]">Our Vision</p>
              <h4 className="mt-3 font-[family-name:var(--font-display-loaded)] text-2xl font-bold">Lasting Legacy</h4>
              <p className="mt-3 text-sm leading-relaxed opacity-75">
                A house that engineers remember — because what we shipped actually mattered.
              </p>
            </div>
          </div>

        </div>
      </RevealOnView>
    </section>
  );
}
