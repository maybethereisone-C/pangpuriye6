import type { SiteData } from "@/lib/site-data";
import { RevealOnView } from "@/components/motion/RevealOnView";

/** Red Wall — transition slide between Members and Gallery. Sole exception to Sniper rule. */
export function RedWall({ data }: { data: SiteData["red_wall"] }) {
  return (
    <section
      data-section="tr-red-wall"
      data-section-index="3"
      className="grid place-items-center bg-[var(--color-accent-red)] text-[var(--color-ink-cream)]"
    >
     <RevealOnView start="top 90%">
      <div className="mx-auto max-w-3xl px-[var(--grid-margin-mobile)] text-center md:px-[var(--grid-margin-desktop)]">
        <p data-anim="reveal-title" className="font-[family-name:var(--font-display-loaded)] text-3xl leading-tight font-bold md:text-5xl lg:text-7xl">
          &ldquo;{data.quote}&rdquo;
        </p>
        <p data-anim="reveal-body" className="mt-8 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.3em]">
          — {data.attribution}
        </p>
      </div>
     </RevealOnView>
    </section>
  );
}
