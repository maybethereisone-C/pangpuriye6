"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import type { Member } from "@/lib/site-data";

const INTEREST_LABEL: Record<Member["interesting"][number], string> = {
  ml: "Machine Learning",
  nlp: "NLP",
  cv: "Computer Vision",
  ethics: "AI Ethics",
  genai: "Generative AI",
};

export function MemberDialog({
  member,
  open,
  onClose,
}: {
  member: Member | null;
  open: boolean;
  onClose: () => void;
}) {
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
          <div aria-hidden className="fixed inset-0 bg-[var(--color-fg)]/60 backdrop-blur-sm" />
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
            <DialogPanel className="relative grid w-full max-w-4xl grid-cols-1 gap-6 border border-[var(--color-hairline)] bg-[var(--color-bg)] p-6 md:grid-cols-12 md:p-10">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close member detail"
                className="absolute top-4 right-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)] transition-colors hover:text-[var(--color-accent-red)]"
              >
                × Close
              </button>

              {member && (
                <>
                  <div className="md:col-span-5">
                    <div className="relative aspect-[4/5] bg-[var(--color-hairline)]/30">
                      <span className="absolute -top-1 -left-1 h-3 w-3 border-t border-l border-[var(--color-accent-gold)]" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 border-t border-r border-[var(--color-accent-gold)]" />
                      <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-[var(--color-accent-gold)]" />
                      <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-[var(--color-accent-gold)]" />
                    </div>
                    <p className="mt-3 font-[family-name:var(--font-mono-loaded)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-soft)]">
                      ID: {member.aiat_id}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 md:col-span-7">
                    <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
                      MEM.{member.aiat_id}
                    </p>
                    <DialogTitle
                      as="h2"
                      className="font-[family-name:var(--font-display-loaded)] text-3xl font-bold leading-tight text-[var(--color-fg)] md:text-5xl"
                    >
                      {member.fullname}
                    </DialogTitle>
                    <p className="font-[family-name:var(--font-mono-loaded)] text-sm italic text-[var(--color-fg-soft)]">
                      &ldquo;{member.nickname}&rdquo;
                    </p>
                    <p className="text-base italic leading-relaxed text-[var(--color-fg-soft)]">
                      {member.slogan}
                    </p>

                    {member.ai_skill && (
                      <div>
                        <p className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
                          AI Skill
                        </p>
                        <p className="mt-1 font-[family-name:var(--font-mono-loaded)] text-sm font-bold text-[var(--color-accent-red)]">
                          {member.ai_skill}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
                        AI Interests
                      </p>
                      <ul className="mt-1 flex flex-wrap gap-1.5">
                        {member.interesting.map((tag) => (
                          <li
                            key={tag}
                            className="border border-[var(--color-hairline)] px-2 py-0.5 font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.1em] text-[var(--color-fg)]"
                          >
                            {INTEREST_LABEL[tag]}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {member.other_skills && (
                      <div>
                        <p className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
                          Other
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-fg-soft)]">{member.other_skills}</p>
                      </div>
                    )}

                    <div className="mt-2 flex flex-wrap gap-3 border-t border-[var(--color-hairline)] pt-4 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg)]">
                      {member.gmail[0] && (
                        <a
                          href={`mailto:${member.gmail[0]}`}
                          className="transition-colors hover:text-[var(--color-accent-red)]"
                        >
                          Email
                        </a>
                      )}
                      {member.call && (
                        <a
                          href={`tel:${member.call.replace(/\s+/g, "")}`}
                          className="transition-colors hover:text-[var(--color-accent-red)]"
                        >
                          Call
                        </a>
                      )}
                      {member.video_links[0] && (
                        <a
                          href={member.video_links[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-[var(--color-accent-red)]"
                        >
                          Intro Video
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
