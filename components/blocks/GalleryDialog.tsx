"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import type { GalleryItem } from "@/lib/site-data";

const FALLBACK_PLACEHOLDERS = [
  "/images/placeholders/01-red.svg",
  "/images/placeholders/14-navy.svg",
  "/images/placeholders/09-forest.svg",
  "/images/placeholders/18-purple.svg",
  "/images/placeholders/05-gold.svg",
];

export function GalleryDialog({
  item,
  open,
  onClose,
}: {
  item: GalleryItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [errIdx, setErrIdx] = useState<Set<number>>(new Set());

  const images = item?.images ?? [];
  const hasMany = images.length > 1;

  const prev = useCallback(() => setImgIdx((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1)), [images.length]);
  const next = useCallback(() => setImgIdx((i) => (i + 1) % Math.max(images.length, 1)), [images.length]);

  // Keyboard arrow nav
  useEffect(() => {
    if (!open || !hasMany) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hasMany, prev, next]);

  // Reset on item change
  useEffect(() => { setImgIdx(0); setErrIdx(new Set()); }, [item]);

  const getSrc = (idx: number) => {
    const src = images[idx];
    if (!src || errIdx.has(idx)) {
      const seed = (item ? item.id.charCodeAt(item.id.length - 1) : 0) + idx;
      return FALLBACK_PLACEHOLDERS[seed % FALLBACK_PLACEHOLDERS.length];
    }
    return src;
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[210]">
        <TransitionChild
          as={Fragment}
          enter="transition-opacity duration-200 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div aria-hidden className="fixed inset-0 bg-[var(--color-overlay-scrim)] backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4 md:p-12">
          <TransitionChild
            as={Fragment}
            enter="transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all duration-200 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <DialogPanel
              className="relative w-full max-w-5xl overflow-y-auto border border-[var(--color-hairline)] bg-[var(--color-bg)]"
              style={{ maxHeight: "90svh" }}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close gallery"
                className="group absolute top-4 right-4 z-10 flex items-center gap-1.5 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)] transition-colors hover:text-[var(--color-accent-red)]"
              >
                <span className="inline-block transition-transform duration-500 group-hover:rotate-[360deg]">×</span>
                <span>Close</span>
              </button>

              {item && (
                <>
                  {/* Main image */}
                  <div className="relative aspect-[16/9] bg-[var(--color-hairline)]/30">
                    <Image
                      key={getSrc(imgIdx)}
                      src={getSrc(imgIdx)}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
                      priority
                      onError={() => setErrIdx((s) => new Set([...s, imgIdx]))}
                    />

                    {/* Prev / Next */}
                    {hasMany && (
                      <>
                        <button
                          type="button"
                          onClick={prev}
                          aria-label="Previous image"
                          className="absolute left-4 top-1/2 -translate-y-1/2 border border-[var(--color-hairline)] bg-[var(--color-bg)]/80 px-3 py-2 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] backdrop-blur-sm transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={next}
                          aria-label="Next image"
                          className="absolute right-4 top-1/2 -translate-y-1/2 border border-[var(--color-hairline)] bg-[var(--color-bg)]/80 px-3 py-2 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] backdrop-blur-sm transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
                        >
                          →
                        </button>
                        <span className="absolute bottom-4 right-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-ink-cream)] mix-blend-difference">
                          {String(imgIdx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Thumbnail strip */}
                  {hasMany && (
                    <div className="flex gap-2 overflow-x-auto border-b border-[var(--color-hairline)] p-3">
                      {images.map((src, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setImgIdx(i)}
                          aria-label={`View image ${i + 1}`}
                          className="relative shrink-0 aspect-video w-20 overflow-hidden border transition-colors"
                          style={{ borderColor: i === imgIdx ? "var(--color-accent-red)" : "var(--color-hairline)" }}
                        >
                          <Image
                            key={getSrc(i)}
                            src={getSrc(i)}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="80px"
                            onError={() => setErrIdx((s) => new Set([...s, i]))}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-6 md:p-8">
                    <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
                      {item.date}
                    </p>
                    <DialogTitle
                      as="h2"
                      className="mt-2 font-[family-name:var(--font-display-loaded)] text-2xl font-bold text-[var(--color-fg)] md:text-3xl"
                    >
                      {item.title}
                    </DialogTitle>
                    <p className="mt-3 leading-relaxed text-[var(--color-fg-soft)]">{item.description}</p>
                  </div>

                  {/* ID footer */}
                  <div className="border-t border-[var(--color-hairline)] px-6 py-3 md:px-8">
                    <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)]">
                      GAL.{item.id}
                    </p>
                  </div>
                </>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
