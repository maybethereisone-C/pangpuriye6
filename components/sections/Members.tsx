"use client";

import { useState } from "react";
import type { Member } from "@/lib/site-data";
import { PLACEHOLDER_MEMBER_ID } from "@/lib/site-data";
import { MemberDialog } from "@/components/blocks/MemberDialog";
import { RevealOnView } from "@/components/motion/RevealOnView";

const INTEREST_LABEL: Record<Member["interesting"][number], string> = {
  ml: "Machine Learning",
  nlp: "NLP",
  cv: "Computer Vision",
  ethics: "AI Ethics",
  genai: "Generative AI",
};

/** Members — Section 03. */
export function Members({ members }: { members: Member[] }) {
  const isMock = members.length === 1 && members[0]?.aiat_id === PLACEHOLDER_MEMBER_ID;
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <section
      id="members"
      data-section="03-members"
      data-section-index="3"
      className="grid"
      style={{ height: "auto", minHeight: "100svh" }}
    >
     <RevealOnView>
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] pt-24 pb-24 md:px-[var(--grid-margin-desktop)] md:pt-32">
        <header>
          <p data-anim="reveal-eyebrow" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            MEMBERS
          </p>
          <h2 data-anim="reveal-title" className="mt-2 font-[family-name:var(--font-display-loaded)]">Cohort Roster</h2>
          <p data-anim="reveal-body" className="mt-2 font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-fg-soft)]">
            {members.length} members
          </p>
        </header>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {members.map((m) => (
            <MemberCard
              key={m.aiat_id}
              member={m}
              isMock={isMock}
              onOpen={() => setSelected(m)}
            />
          ))}
        </ul>
      </div>
     </RevealOnView>

      <MemberDialog
        member={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

function MemberCard({
  member: m,
  isMock,
  onOpen,
}: {
  member: Member;
  isMock: boolean;
  onOpen: () => void;
}) {
  return (
    <li
      data-magnetic
      data-anim="reveal-item"
      className="group relative flex flex-col border border-[var(--color-hairline)] bg-[var(--color-bg)] transition-colors hover:border-[var(--color-accent-red)]"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open detail for ${m.fullname}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">Open member detail</span>
      </button>

      <div className="flex items-center justify-end border-b border-[var(--color-hairline)] px-3 py-2 font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em]">
        <span
          className={
            isMock ? "text-[var(--color-fg-soft)]" : "text-[var(--color-accent-red)]"
          }
        >
          {isMock ? "MOCK" : "ACTIVE"}
        </span>
      </div>

      <div className="aspect-[4/5] bg-[var(--color-hairline)]/30" />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-[family-name:var(--font-display-loaded)] text-xl font-bold leading-tight">
          {m.fullname}
        </h3>

        <p className="font-[family-name:var(--font-mono-loaded)] text-xs text-[var(--color-fg-soft)]">
          &ldquo;{m.nickname}&rdquo;
        </p>

        <p className="text-sm italic leading-snug text-[var(--color-fg-soft)]">{m.slogan}</p>

        {m.ai_skill && (
          <div>
            <p className="font-[family-name:var(--font-mono-loaded)] text-[9px] uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
              AI Skill
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-mono-loaded)] text-xs font-bold text-[var(--color-accent-red)]">
              {m.ai_skill}
            </p>
          </div>
        )}

        <div>
          <p className="font-[family-name:var(--font-mono-loaded)] text-[9px] uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
            AI Interests
          </p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {m.interesting.map((tag) => (
              <li
                key={tag}
                className="border border-[var(--color-hairline)] px-2 py-0.5 font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.1em]"
              >
                {INTEREST_LABEL[tag]}
              </li>
            ))}
          </ul>
        </div>

        {m.other_skills && (
          <p className="font-[family-name:var(--font-mono-loaded)] text-[11px] leading-snug text-[var(--color-fg-soft)]">
            <span className="text-[9px] uppercase tracking-[0.18em]">Other </span>
            {m.other_skills}
          </p>
        )}

        <div className="relative z-20 mt-auto flex flex-wrap items-center gap-2 border-t border-[var(--color-hairline)] pt-3">
          {m.gmail[0] && <ContactIcon href={`mailto:${m.gmail[0]}`} label="Email" icon="mail" />}
          {m.call && <ContactIcon href={`tel:${m.call.replace(/\s+/g, "")}`} label="Call" icon="phone" />}
          {m.video_links[0] && <ContactIcon href={m.video_links[0]} label="Intro video" icon="play" external />}
          {m.github_url && <ContactIcon href={m.github_url} label="GitHub" icon="github" external />}
          {m.linkedin_url && <ContactIcon href={m.linkedin_url} label="LinkedIn" icon="linkedin" external />}
        </div>
      </div>
    </li>
  );
}

type IconName = "mail" | "phone" | "play" | "github" | "linkedin";

function ContactIcon({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon: IconName;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={(e) => e.stopPropagation()}
      className="grid h-8 w-8 place-items-center border border-[var(--color-hairline)] text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
    >
      <Icon name={icon} />
    </a>
  );
}

function Icon({ name }: { name: IconName }) {
  switch (name) {
    case "mail":
      return (
        <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "phone":
      return (
        <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "play":
      return (
        <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="m10 9 5 3-5 3z" fill="currentColor" />
        </svg>
      );
    case "github":
      return (
        <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.84c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.35 4.7-4.58 4.94.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h4v1.7c.7-1.1 2.1-2 4-2 3 0 5 2 5 5.5V21h-4v-6c0-1.5-.5-2.5-2-2.5s-2.5 1-2.5 2.5V21H9V9Z" />
        </svg>
      );
  }
}
