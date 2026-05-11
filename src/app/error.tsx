"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      data-section
      className="grid place-items-center px-[var(--grid-margin-mobile)] md:px-[var(--grid-margin-desktop)]"
    >
      <div className="text-center max-w-md">
        <p className="font-mono text-[var(--text-eyebrow)] tracking-widest uppercase text-[var(--color-accent-red)] mb-4">
          ERR · SYSTEM
        </p>
        <h2 className="mb-6 text-[var(--color-fg)]">Something went wrong.</h2>
        <p className="text-[var(--color-fg-soft)] text-[var(--text-body)] mb-8">
          The yearbook hit an unexpected error. Try again or come back later.
        </p>
        <button
          onClick={reset}
          className="btn-primary px-8 py-3 text-sm tracking-wide uppercase font-medium"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
