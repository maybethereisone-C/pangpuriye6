"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/site-data";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { GalleryDialog } from "@/components/blocks/GalleryDialog";

const FALLBACK = [
  "/images/placeholders/01-red.svg",
  "/images/placeholders/14-navy.svg",
  "/images/placeholders/09-forest.svg",
  "/images/placeholders/18-purple.svg",
  "/images/placeholders/05-gold.svg",
];

function GalleryThumb({ item, idx }: { item: GalleryItem; idx: number }) {
  const [err, setErr] = useState(false);
  const src = (!item.images[0] || err) ? FALLBACK[idx % FALLBACK.length] : item.images[0];
  return (
    <Image
      key={src}
      src={src}
      alt={item.title}
      fill
      unoptimized
      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      sizes="(max-width: 768px) 100vw, 66vw"
      onError={() => setErr(true)}
    />
  );
}

/** Gallery — Section 04. */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <section
      id="gallery"
      data-section="04-gallery"
      data-section-index="4"
      className="grid"
      style={{ height: "auto", minHeight: "100svh" }}
    >
      <RevealOnView>
        <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] pt-24 pb-24 md:px-[var(--grid-margin-desktop)] md:pt-32">
          <header>
            <p data-anim="reveal-eyebrow" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
              GALLERY
            </p>
            <h2 data-anim="reveal-title" className="mt-2 font-[family-name:var(--font-display-loaded)]">House Activities</h2>
          </header>

          {items.length > 0 && (
            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
              {items.map((item, idx) => (
                <li
                  key={item.id}
                  data-anim="reveal-item"
                  className={`group cursor-pointer ${idx === 0 ? "md:col-span-8" : "md:col-span-4"}`}
                  onClick={() => setSelected(item)}
                >
                  <figure>
                    <div data-anim="reveal-photo" className="relative aspect-[4/3] overflow-hidden bg-[var(--color-hairline)]/30">
                      <GalleryThumb item={item} idx={idx} />
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-ink-charcoal)]/0 transition-colors duration-300 group-hover:bg-[var(--color-ink-charcoal)]/20">
                        <span className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-cream)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          View
                        </span>
                      </div>
                    </div>
                    <figcaption className="mt-3 font-[family-name:var(--font-mono-loaded)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-soft)] transition-colors group-hover:text-[var(--color-fg)]">
                      {item.title} · {item.date}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          )}
        </div>
      </RevealOnView>

      <GalleryDialog
        item={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
