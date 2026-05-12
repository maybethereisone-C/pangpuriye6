"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Member } from "@/lib/site-data";
import { MemberDialog } from "@/components/blocks/MemberDialog";
import { RevealOnView } from "@/components/motion/RevealOnView";

const CARD_NAME_MAX_PX = 20;
const CARD_NAME_MIN_PX = 13;

/** Members — Section 03. */
export function Members({ members }: { members: Member[] }) {
  const [selected, setSelected] = useState<Member | null>(null);

  const looped = [...members, ...members];

  const trackRef = useRef<HTMLUListElement>(null);
  const rafRef = useRef<number>(0);
  const xRef = useRef(0);
  const speedRef = useRef(0);
  const hovering = useRef(false);

  // Drag state — document-level so pointer capture doesn't block card clicks
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const dragLastX = useRef(0);
  const dragVelocity = useRef(0);
  const dragLastTime = useRef(0);

  const settings = useRef({ speed: 2, lerp: 0.05 });
  settings.current = { speed: 2, lerp: 0.05 };

  const handleManualScroll = (direction: "left" | "right") => {
    const kick = 30;
    speedRef.current = direction === "left" ? -kick : kick;
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // RAF — skips auto-scroll while drag is active
    function tick() {
      if (!isDragging.current) {
        const target = hovering.current ? 0 : settings.current.speed;
        speedRef.current += (target - speedRef.current) * settings.current.lerp;
        xRef.current -= speedRef.current;
      }

      const halfWidth = el!.scrollWidth / 2;
      if (xRef.current <= -halfWidth) {
        xRef.current = xRef.current % halfWidth;
      } else if (xRef.current > 0) {
        xRef.current = (xRef.current % halfWidth) - halfWidth;
      }

      el!.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    // Document-level handlers so pointer capture never blocks card click events
    function onPointerMove(e: PointerEvent) {
      if (!isDragging.current) return;
      const dx = e.clientX - dragLastX.current;
      // 4px threshold distinguishes drag from click
      if (!hasDragged.current && Math.abs(e.clientX - (dragLastX.current - dx + dx)) < 4) {
        if (Math.abs(dx) < 4) return;
      }
      hasDragged.current = true;
      const now = performance.now();
      const dt = now - dragLastTime.current;
      if (dt > 0) dragVelocity.current = (dx / dt) * 16;
      dragLastX.current = e.clientX;
      dragLastTime.current = now;
      xRef.current += dx;
    }

    function onPointerUp() {
      if (!isDragging.current) return;
      isDragging.current = false;
      hovering.current = false;
      if (hasDragged.current) speedRef.current = -dragVelocity.current;
      el!.style.cursor = "grab";
    }

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <section
      id="members"
      data-section="03-members"
      data-section-index="3"
      className="grid relative"
      style={{ height: "auto", minHeight: "100svh" }}
    >
      <RevealOnView>
        <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] pt-24 pb-8 md:px-[var(--grid-margin-tablet)] md:pt-32 lg:px-[var(--grid-margin-desktop)]">
          <header>
            <p data-anim="reveal-eyebrow" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
              MEMBERS
            </p>
            <h2 data-anim="reveal-title" className="mt-2 font-[family-name:var(--font-display-loaded)]">Cohort Roster</h2>
            <p data-anim="reveal-body" className="mt-2 font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-fg-soft)]">
              {members.length} members
            </p>
          </header>
        </div>
      </RevealOnView>

      {/* z-[45]: below navbar (z-50), above scroll arrows (z-40) */}
      <div
        className="relative z-[45] pb-24 pointer-events-none"
        style={{
          overflow: "hidden",
          paddingTop: "2rem",
          marginTop: "-2rem",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <ul
          ref={trackRef}
          className="pointer-events-auto"
          style={{
            display: "flex",
            gap: "1.5rem",
            width: "max-content",
            willChange: "transform",
            cursor: "grab",
            userSelect: "none",
            touchAction: "pan-y",
          }}
          onPointerDown={(e) => {
            // Only primary button (mouse left) or touch
            if (e.button !== 0 && e.pointerType === "mouse") return;
            isDragging.current = true;
            hasDragged.current = false;
            dragLastX.current = e.clientX;
            dragVelocity.current = 0;
            dragLastTime.current = performance.now();
            hovering.current = true;
            e.currentTarget.style.cursor = "grabbing";
          }}
          aria-label="Member cards"
        >
          {looped.map((m, i) => (
            <MemberCard
              key={`${m.aiat_id}-${i}`}
              member={m}
              onOpen={() => !hasDragged.current && setSelected(m)}
              hovering={hovering}
              priority={i < 4}
            />
          ))}
        </ul>
      </div>

      {/* Scroll controls */}
      <div className="absolute bottom-4 right-4 z-40 flex gap-2 md:bottom-8 md:right-8">
        <button
          onClick={() => handleManualScroll("left")}
          className="grid h-12 w-12 place-items-center border border-[var(--color-hairline)] bg-[var(--color-bg)] text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button
          onClick={() => handleManualScroll("right")}
          className="grid h-12 w-12 place-items-center border border-[var(--color-hairline)] bg-[var(--color-bg)] text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

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
  onOpen,
  hovering,
  priority,
}: {
  member: Member;
  onOpen: () => void;
  hovering: React.MutableRefObject<boolean>;
  priority?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = m.image && !imageFailed ? m.image : null;

  return (
    <li
      data-anim="reveal-item"
      className="group relative flex flex-col border border-[var(--color-hairline)] bg-[var(--color-bg)] transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[var(--color-accent-red)] hover:shadow-xl"
      style={{ width: "280px", flexShrink: 0 }}
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open detail for ${m.fullname}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">Open member detail</span>
      </button>

      <div className="flex items-center justify-end border-b border-[var(--color-hairline)] px-3 py-2 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em]">
        <span className="text-[var(--color-accent-red)]">
          {m.role?.toLowerCase() === "chairman"
            ? "CAPTAIN"
            : m.role?.toLowerCase() === "vice-chairman"
              ? "VICE"
              : "MEMBER"}
        </span>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-hairline)]/30">
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={m.fullname}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onError={() => setImageFailed(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <AutoFitCardName name={m.fullname} />

        <p className="font-[family-name:var(--font-mono-loaded)] text-xs text-[var(--color-fg-soft)]">
          {m.nickname}
        </p>

        <p className="text-sm italic leading-snug text-[var(--color-fg-soft)]">{m.slogan}</p>

        {m.ai_skill && (
          <div>
            <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
              AI Skill
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-mono-loaded)] text-xs font-bold text-[var(--color-accent-red)]">
              {m.ai_skill}
            </p>
          </div>
        )}

        <div>
          <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
            AI Interests
          </p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {m.interesting.map((tag) => (
              <li
                key={tag}
                className="border border-[var(--color-hairline)] px-2 py-0.5 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.1em]"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {m.other_skills && (
          <p className="font-[family-name:var(--font-mono-loaded)] text-xs leading-snug text-[var(--color-fg-soft)]">
            <span className="text-xs uppercase tracking-[0.18em]">Other </span>
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

function AutoFitCardName({ name }: { name: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      el.style.fontSize = `${CARD_NAME_MAX_PX}px`;
      let size = CARD_NAME_MAX_PX;
      while ((el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) && size > CARD_NAME_MIN_PX) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [name]);

  return (
    <h3
      ref={ref}
      className="font-[family-name:var(--font-display-loaded)] font-bold leading-tight text-[var(--color-fg)]"
      style={{
        fontSize: `${CARD_NAME_MAX_PX}px`,
        minHeight: "3rem",
        overflow: "hidden",
        overflowWrap: "anywhere",
      }}
    >
      {name}
    </h3>
  );
}

type IconName = "mail" | "phone" | "play" | "github" | "linkedin";

function ContactIcon({ href, label, icon, external }: {
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
