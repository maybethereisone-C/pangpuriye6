"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useRef, useEffect, useState } from "react";
import type { Member } from "@/lib/site-data";

const NAME_MAX_PX = 48;
const NAME_MIN_PX = 12;

export function MemberDialog({
  member,
  open,
  onClose,
}: {
  member: Member | null;
  open: boolean;
  onClose: () => void;
}) {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const el = nameRef.current;
    if (!el || !open) return;

    const fit = () => {
      const max = Math.min(NAME_MAX_PX, Math.max(24, window.innerWidth * 0.08));
      el.style.fontSize = `${max}px`;
      let size = max;
      while ((el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) && size > NAME_MIN_PX) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
    };

    let raf1: number;
    let raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(fit);
    });
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      observer.disconnect();
    };
  }, [member?.fullname, open]);

  useEffect(() => {
    setImageFailed(false);
  }, [member?.image]);

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
            <DialogPanel className="relative grid w-full max-w-4xl grid-cols-1 gap-6 overflow-y-auto overflow-x-hidden border border-[var(--color-hairline)] bg-[var(--color-bg)] p-5 pt-12 sm:p-6 sm:pt-12 md:grid-cols-12 md:p-10" style={{ maxHeight: "90svh" }}>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close member detail"
                className="absolute top-4 right-4 z-10 bg-[var(--color-bg)]/80 backdrop-blur-sm p-1 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)] transition-colors hover:text-[var(--color-accent-red)] md:top-6 md:right-6 md:bg-transparent md:p-0"
              >
                × Close
              </button>

              {member && (
                <>
                  <div className="md:col-span-5">
                    <div className="relative mx-auto aspect-[4/5] w-full max-w-[260px] bg-[var(--color-hairline)]/30 sm:w-3/4 sm:max-w-[280px] md:w-full md:max-w-none">
                      {member.image && !imageFailed && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={member.image}
                          src={member.image}
                          alt={member.fullname}
                          onError={() => setImageFailed(true)}
                          className="object-cover"
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}
                      <span className="absolute -top-1 -left-1 h-3 w-3 border-t border-l border-[var(--color-accent-gold)]" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 border-t border-r border-[var(--color-accent-gold)]" />
                      <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-[var(--color-accent-gold)]" />
                      <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-[var(--color-accent-gold)]" />
                    </div>
                  </div>

                  <div className="min-w-0 flex flex-col gap-4 md:col-span-7">
                    <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
                      SPAI.{member.aiat_id}
                    </p>
                    <DialogTitle
                      ref={nameRef}
                      as="h2"
                      className="font-[family-name:var(--font-display-loaded)] font-bold text-[var(--color-fg)]"
                      style={{ fontSize: "clamp(24px, 8vw, 48px)", lineHeight: 1.2, overflowWrap: "anywhere", paddingBottom: "0.1em" }}
                    >
                      {member.fullname}
                    </DialogTitle>
                    <p className="font-[family-name:var(--font-mono-loaded)] text-sm italic text-[var(--color-fg-soft)]">
                      {member.nickname}
                    </p>
                    <p className="text-base italic leading-relaxed text-[var(--color-fg-soft)]">
                      {member.slogan}
                    </p>

                    {member.ai_skill && (
                      <div>
                        <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
                          AI Skill
                        </p>
                        <p className="mt-1 font-[family-name:var(--font-mono-loaded)] text-sm font-bold text-[var(--color-accent-red)]">
                          {member.ai_skill}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
                        AI Interests
                      </p>
                      <ul className="mt-1 flex flex-wrap gap-1.5">
                        {member.interesting.map((tag) => (
                          <li
                            key={tag}
                            className="border border-[var(--color-hairline)] px-2 py-0.5 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.1em] text-[var(--color-fg)]"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {member.other_skills && (
                      <div>
                        <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
                          Other
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-fg-soft)]">{member.other_skills}</p>
                      </div>
                    )}

                    <div className="mt-2 flex flex-col gap-4 border-t border-[var(--color-hairline)] pt-4">
                      <div className="flex flex-wrap gap-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg)]">
                        {member.gmail?.map((email, i) => (
                          <a
                            key={email}
                            href={`mailto:${email}`}
                            className="transition-colors hover:text-[var(--color-accent-red)]"
                          >
                            Email{member.gmail.length > 1 ? ` ${i + 1}` : ""}
                          </a>
                        ))}
                        {member.call && (
                          <a
                            href={`tel:${member.call.replace(/\s+/g, "")}`}
                            className="transition-colors hover:text-[var(--color-accent-red)]"
                          >
                            Call
                          </a>
                        )}
                        {member.github_url && (
                          <a
                            href={member.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-[var(--color-accent-red)]"
                          >
                            GitHub
                          </a>
                        )}
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-[var(--color-accent-red)]"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>

                      {member.video_links?.length > 0 && (
                        <div>
                          <p className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-soft)]">
                            Video Links
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {member.video_links.map((link, i) => (
                              <a
                                key={link}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-[var(--color-hairline)] px-3 py-1.5 font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.1em] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
                              >
                                {link.includes("youtube.com") || link.includes("youtu.be") ? "YouTube" : link.includes("tiktok.com") ? "TikTok" : `Video ${i + 1}`}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
