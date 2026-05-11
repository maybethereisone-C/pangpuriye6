import Link from "next/link";

export default function NotFound() {
  return (
    <section
      data-section
      className="grid place-items-center px-[var(--grid-margin-mobile)] md:px-[var(--grid-margin-desktop)]"
    >
      <div className="text-center max-w-md">
        <p className="font-mono text-[var(--text-eyebrow)] tracking-widest uppercase text-[var(--color-accent-red)] mb-4">
          404 · NOT FOUND
        </p>
        <h2 className="mb-6 text-[var(--color-fg)]">Page not found.</h2>
        <p className="text-[var(--color-fg-soft)] text-[var(--text-body)] mb-8">
          This page doesn&apos;t exist in the yearbook.
        </p>
        <Link
          href="/"
          className="btn-primary px-8 py-3 text-sm tracking-wide uppercase font-medium inline-block"
        >
          Back to yearbook
        </Link>
      </div>
    </section>
  );
}
