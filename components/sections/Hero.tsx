import Image from "next/image";
import type { SiteData } from "@/lib/site-data";
import { HeroAnim } from "@/components/motion/HeroAnim";

/**
 * Hero — Section 01. Markup is server-rendered. HeroAnim is a client wrapper
 * that runs the mount-time reveal choreography on the [data-anim="*"] targets.
 */
export function Hero({ data }: { data: SiteData["hero"] }) {
  return (
    <section
      id="home"
      data-section="01-home"
      data-section-index="1"
      className="grid place-items-center"
    >
      <HeroAnim>
        <div className="mx-auto grid max-w-[var(--grid-max-width)] grid-cols-1 items-center gap-[var(--grid-gutter-mobile)] px-[var(--grid-margin-mobile)] pt-[calc(var(--topbar-h)+1rem)] md:grid-cols-12 md:gap-[var(--grid-gutter-desktop)] md:px-[var(--grid-margin-desktop)] md:pt-[var(--topbar-h)]">
          <div className="md:col-span-7">
            <p
              data-anim="hero-eyebrow"
              className="mb-6 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)]"
            >
              {data.eyebrow}
            </p>
            <h1
              data-anim="hero-title"
              className="font-[family-name:var(--font-display-loaded)]"
            >
              {data.title_line_1 && <span className="block">{data.title_line_1}</span>}
              <span className="block text-[var(--color-accent-red)]">{data.title_line_2}</span>
              {data.title_line_3 && <span className="block">{data.title_line_3}</span>}
            </h1>
            <p
              data-anim="hero-motto"
              className="mt-8 max-w-xl border-l border-[var(--color-accent-gold)] pl-6 italic text-[var(--color-fg-soft)]"
            >
              {data.motto}
            </p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <a
                href={data.cta_primary.href}
                role="button"
                data-magnetic
                data-anim="hero-cta"
                className="btn-primary px-8 py-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em]"
              >
                {data.cta_primary.label}
              </a>
              <a
                href={data.cta_secondary.href}
                role="button"
                data-magnetic
                data-anim="hero-cta"
                className="btn-ghost px-8 py-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em]"
              >
                {data.cta_secondary.label}
              </a>
            </div>
          </div>

          <div className="md:col-span-5">
            <div
              data-anim="hero-photo"
              className="relative grid h-48 w-full place-items-center md:aspect-[4/5] md:h-auto"
            >
              <Image
                src="/images/logo.svg"
                alt="Pangpuriye logo"
                width={400}
                height={500}
                unoptimized
                priority
                className="block h-[100%] w-[100%] object-contain scale-[1.4]"
              />
            </div>
          </div>
        </div>
      </HeroAnim>
    </section>
  );
}
