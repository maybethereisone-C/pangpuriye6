import type { Member } from "@/lib/site-data";

const INTEREST_LABEL: Record<Member["interesting"][number], string> = {
  ml: "Machine Learning",
  nlp: "NLP",
  cv: "Computer Vision",
  ethics: "AI Ethics",
  genai: "Generative AI",
};

/** Members — Section 03. Phase-01 SCAFFOLD. See docs/design.md §3.5 row 03. */
export function Members({ members }: { members: Member[] }) {
  return (
    <section
      id="members"
      data-section="03-members"
      data-section-index="3"
      className="grid"
      style={{ height: "auto", minHeight: "100svh", scrollSnapAlign: "start" }}
    >
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] py-24 md:px-[var(--grid-margin-desktop)]">
        <header>
          <p className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            SEC.03 · MEMBERS // PANGPURIYE_ROSTER_v1
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display-loaded)]">Cohort Roster</h2>
          <p className="mt-2 font-[family-name:var(--font-mono-loaded)] text-sm text-[var(--color-ink-gray-700)]">
            {members.length} members
          </p>
        </header>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {members.map((m) => (
            <li
              key={m.aiat_id}
              data-magnetic
              className="group border border-[var(--color-ink-gray-300)] bg-[var(--color-ink-cream)] transition-colors hover:border-[var(--color-accent-red)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-ink-gray-300)] px-3 py-2 font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em]">
                <span>ID: {m.aiat_id}</span>
                <span className="text-[var(--color-accent-red)]">ACTIVE</span>
              </div>
              <div className="aspect-[4/5] bg-[var(--color-ink-gray-300)]/30" />
              <div className="space-y-2 p-4">
                <h3 className="font-[family-name:var(--font-display-loaded)] text-xl font-bold">
                  {m.fullname}
                </h3>
                <p className="font-[family-name:var(--font-mono-loaded)] text-xs text-[var(--color-ink-gray-700)]">
                  &ldquo;{m.nickname}&rdquo;
                </p>
                <p className="text-sm italic text-[var(--color-ink-gray-700)]">{m.slogan}</p>
                <ul className="flex flex-wrap gap-1.5 pt-2">
                  {m.interesting.map((tag) => (
                    <li
                      key={tag}
                      className="border border-[var(--color-ink-gray-300)] px-2 py-0.5 font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.1em]"
                    >
                      {INTEREST_LABEL[tag]}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
