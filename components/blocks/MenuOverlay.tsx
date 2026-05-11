"use client";

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useMenu } from "./MenuProvider";
import { useLenis } from "@/components/motion/MotionProvider";
import { ThemeToggle } from "./ThemeToggle";
import type { SiteData } from "@/lib/site-data";

interface SectionLink {
  id: string;
  number: string;
  label: string;
}

const SECTIONS: SectionLink[] = [
  { id: "home", number: "01", label: "Home" },
  { id: "about", number: "02", label: "About" },
  { id: "members", number: "03", label: "Members" },
  { id: "gallery", number: "04", label: "Gallery" },
  { id: "recognition", number: "05", label: "Recognition" },
  { id: "clips", number: "06", label: "Clips" },
];

export function MenuOverlay({ footer }: { footer: SiteData["footer"] }) {
  const { open, setOpen } = useMenu();
  const lenis = useLenis();

  // Lock page scroll while overlay open (Lenis handles wheel; we also stop it explicitly)
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  const goTo = (sectionId: string) => {
    setOpen(false);
    // Defer scrollTo until overlay close anim finishes so SnapPaginator picks the right index
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el && lenis) {
        lenis.scrollTo(el, { duration: 1.4, lock: true });
      } else if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 280);
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={() => setOpen(false)} className="relative z-[200]">
        {/* Curtain backdrop */}
        <TransitionChild
          as={Fragment}
          enter="transition-opacity duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div aria-hidden className="fixed inset-0 bg-[var(--color-overlay-solid)]" />
        </TransitionChild>

        {/* Panel — wipes down from top */}
        <div className="fixed inset-0 overflow-y-auto">
          <TransitionChild
            as={Fragment}
            enter="transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)]"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
          >
            <DialogPanel className="relative flex min-h-full flex-col text-[var(--color-fg)]">
              {/* Top row — close + theme */}
              <header className="flex items-start justify-between px-[var(--grid-margin-mobile)] py-6 md:px-[var(--grid-margin-desktop)]">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg)] hover:text-[var(--color-accent-red)]"
                >
                  × Close
                </button>
                <ThemeToggle />
              </header>

              {/* Section list — big serif */}
              <nav
                aria-label="Sections"
                className="flex flex-1 flex-col justify-center px-[var(--grid-margin-mobile)] md:px-[var(--grid-margin-desktop)]"
              >
                <ul className="space-y-4 md:space-y-6">
                  {SECTIONS.map((s, i) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => goTo(s.id)}
                        className="group flex items-baseline gap-6 focus:outline-none focus-visible:text-[var(--color-accent-red)]"
                      >
                        <span className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)] transition-colors group-hover:text-[var(--color-accent-red)]">
                          {s.number}
                        </span>
                        <span className="font-[family-name:var(--font-display-loaded)] text-4xl font-bold leading-tight text-[var(--color-fg)] transition-all group-hover:translate-x-2 group-hover:text-[var(--color-accent-red)] md:text-6xl lg:text-7xl">
                          {s.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Bottom row — contacts */}
              <footer className="border-t border-[var(--color-hairline)] px-[var(--grid-margin-mobile)] py-6 md:px-[var(--grid-margin-desktop)]">
                <div className="flex flex-col gap-3 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)] md:flex-row md:items-center md:justify-between">
                  <a
                    href={`mailto:${footer.email}`}
                    className="transition-colors hover:text-[var(--color-accent-red)]"
                  >
                    {footer.email}
                  </a>
                  <nav aria-label="Social" className="flex flex-wrap gap-6">
                    <a
                      href={footer.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-[var(--color-accent-red)]"
                    >
                      GitHub
                    </a>
                    <a
                      href={footer.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-[var(--color-accent-red)]"
                    >
                      Instagram
                    </a>
                    <a
                      href={footer.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-[var(--color-accent-red)]"
                    >
                      YouTube
                    </a>
                  </nav>
                </div>
              </footer>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
