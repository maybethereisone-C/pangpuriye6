"use client";

import { useEffect, useState, useMemo } from "react";
import type { GalleryItem, Category } from "@/lib/site-data";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { GalleryDialog } from "@/components/blocks/GalleryDialog";

function GalleryThumb({ item }: { item: GalleryItem }) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const available = item.images.filter((_, imageIdx) => !failed.has(imageIdx));
  const src = available[idx % Math.max(available.length, 1)];

  if (!src) {
    return (
      <ImageUnavailable label="API image unavailable" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt={item.title}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      onError={() => {
        const originalIdx = item.images.indexOf(src);
        setFailed((current) => new Set([...current, originalIdx]));
        setIdx(0);
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}

function CategoryPreview({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const available = images.filter((_, imageIdx) => !failed.has(imageIdx));
  const src = available[idx % Math.max(available.length, 1)];

  useEffect(() => {
    if (available.length <= 1) return;
    const id = window.setInterval(() => {
      setIdx((current) => (current + 1) % available.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [available.length]);

  if (!src) return <ImageUnavailable label="No loadable API image" />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt=""
      className="object-cover blur-[2px] transition-opacity duration-700"
      onError={() => {
        const originalIdx = images.indexOf(src);
        setFailed((current) => new Set([...current, originalIdx]));
        setIdx(0);
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}

function collectCategoryImages(items: GalleryItem[]): string[] {
  return [...new Set(items.flatMap((item) => item.images))];
}

function ImageUnavailable({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[var(--color-ink-charcoal)]">
      <span className="px-4 text-center font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-soft)]">
        {label}
      </span>
    </div>
  );
}

/** Gallery — Section 04. */
export function Gallery({ items, categories }: { items: GalleryItem[]; categories: Category[] }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, GalleryItem[]>();
    for (const item of items) {
      for (const categoryId of item.category_ids ?? []) {
        const current = map.get(categoryId) ?? [];
        current.push(item);
        map.set(categoryId, current);
      }
    }
    return map;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedCategoryId) return [];
    return itemsByCategory.get(selectedCategoryId) ?? [];
  }, [itemsByCategory, selectedCategoryId]);

  const activeCategory = useMemo(() =>
    categories?.find(c => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const visibleCategories = useMemo(() => {
    const withItems = categories.filter((cat) => (itemsByCategory.get(cat.id)?.length ?? 0) > 0);
    return withItems.length > 0 ? withItems : categories;
  }, [categories, itemsByCategory]);

  return (
    <section
      id="gallery"
      data-section="04-gallery"
      data-section-index="4"
      className="grid"
      style={{ height: "auto", minHeight: "100svh" }}
    >
      <RevealOnView>
        <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] pt-24 pb-24 md:px-[var(--grid-margin-tablet)] md:pt-32 lg:px-[var(--grid-margin-desktop)]">
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p data-anim="reveal-eyebrow" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
                GALLERY
              </p>
              <h2 data-anim="reveal-title" className="mt-2 font-[family-name:var(--font-display-loaded)]">
                {selectedCategoryId ? activeCategory?.name : "House Activities"}
              </h2>
            </div>
            {selectedCategoryId && (
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)] transition-colors hover:text-[var(--color-accent-red)]"
              >
                ← Back to categories
              </button>
            )}
          </header>

          {!selectedCategoryId && visibleCategories.length > 0 ? (
            /* Category Selection Grid */
            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleCategories.map((cat, idx) => (
                <li key={cat.id} data-anim="reveal-item">
                  <button
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className="group relative flex h-64 w-full flex-col items-center justify-center border border-[var(--color-hairline)] bg-[var(--color-bg)] transition-all hover:border-[var(--color-accent-red)] hover:shadow-xl"
                  >
                    <div className="absolute inset-0 opacity-20 grayscale transition-all group-hover:opacity-35 group-hover:grayscale-0">
                      <CategoryPreview images={collectCategoryImages(itemsByCategory.get(cat.id) ?? [])} />
                    </div>
                    <div className="relative z-10 text-center px-6">
                      <span className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-red)]">
                        Category {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 font-[family-name:var(--font-display-loaded)] text-2xl font-bold">
                        {cat.name}
                      </h3>
                      <p className="mt-2 font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.1em] text-[var(--color-fg-soft)] opacity-0 transition-opacity group-hover:opacity-100">
                        {itemsByCategory.get(cat.id)?.length ?? 0} items
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : !selectedCategoryId ? (
            <p className="mt-12 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
              No production gallery photos yet.
            </p>
          ) : (
            /* Items Grid */
            <div className="mt-12">
              <p className="font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-fg-soft)] max-w-2xl">
                {activeCategory?.description}
              </p>

              {filteredItems.length > 0 ? (
                <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
                  {filteredItems.map((item, idx) => (
                    <li
                      key={item.id}
                      data-anim="reveal-item"
                      className={`group ${idx % 3 === 0 ? "md:col-span-8" : "md:col-span-4"}`}
                    >
                      <button
                        type="button"
                        className="w-full cursor-pointer text-left"
                        onClick={() => setSelectedItem(item)}
                        onKeyDown={(e) => e.key === "Enter" && setSelectedItem(item)}
                        aria-label={`View gallery: ${item.title}`}
                      >
                      <figure>
                        <div data-anim="reveal-photo" className="relative aspect-[4/3] overflow-hidden bg-[var(--color-hairline)]/30">
                          <GalleryThumb item={item} />
                          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-ink-charcoal)]/0 transition-colors duration-300 group-hover:bg-[var(--color-ink-charcoal)]/20">
                            <span className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-ink-cream)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              View
                            </span>
                          </div>
                        </div>
                        <figcaption className="mt-3 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)] transition-colors group-hover:text-[var(--color-fg)]">
                          {item.date ? `${item.title} · ${item.date}` : item.title}
                        </figcaption>
                      </figure>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-24 text-center">
                  <p className="font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-fg-soft)]">
                    No items found for this category.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </RevealOnView>

      <GalleryDialog
        item={selectedItem}
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
