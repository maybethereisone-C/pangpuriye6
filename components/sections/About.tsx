import type { SiteData } from "@/lib/site-data";
import { RevealOnView } from "@/components/motion/RevealOnView";

/** About — Section 02. */
export function About({ data }: { data: SiteData["about"] }) {
  return (
    <section
      id="about"
      data-section="02-about"
      data-section-index="2"
      className="grid place-items-center"
    >
     <RevealOnView>
      <div className="mx-auto grid max-w-[var(--grid-max-width)] grid-cols-1 gap-[var(--grid-gutter-mobile)] px-[var(--grid-margin-mobile)] md:grid-cols-12 md:gap-[var(--grid-gutter-desktop)] md:px-[var(--grid-margin-desktop)]">
        <header className="md:col-span-12">
          <p data-anim="reveal-eyebrow" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            SEC.02 · ABOUT // {data.doc_id}
          </p>
          <h2 data-anim="reveal-title" className="mt-2 font-[family-name:var(--font-display-loaded)]">About Pangpuriye</h2>
        </header>

        <article className="md:col-span-7">
          <p className="text-[var(--text-lead)] leading-relaxed text-[var(--color-fg-soft)]">
            {data.dna_paragraph_1}
          </p>
          <p className="mt-6 leading-relaxed text-[var(--color-fg-soft)]">
            {data.dna_paragraph_2}
          </p>
          <p className="mt-12 max-w-md border-l border-[var(--color-accent-gold)] pl-6 italic text-[var(--color-fg)]">
            {data.motto}
          </p>
        </article>

        {/* House DNA cards: Logo / Symbol / Uniform */}
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
                <p className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-soft)]">
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
     </RevealOnView>
    </section>
  );
}
