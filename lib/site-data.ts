/**
 * Site data — placeholder content + types.
 *
 * The runtime fetcher lives in `lib/api.ts`. It reads the mode flag from
 * `public/api-config.json` and the backend URL from `process.env.NEXT_PUBLIC_API_BASE_URL`
 * (set in `.env.local`, gitignored). When mode === "live", it fetches; otherwise it
 * loads from `public/data/*.json` then falls back to the placeholders below.
 *
 * Member schema matches the AIAT Google Form cohort applicants fill in:
 *   - Required base fields are what the API actually returns.
 *   - Optional fields (fullname_en, ai_skill, github_url, etc.) are form-only — kept
 *     so the UI can render them when present, hidden when missing.
 */

export type AIInterest = "ml" | "nlp" | "cv" | "ethics" | "genai";

export interface Member {
  /** รหัสโครงการ — AIAT project ID, e.g. "600965" */
  aiat_id: string;
  /** ชื่อจริง + นามสกุล (TH) — Thai full name */
  fullname: string;
  /** ชื่อจริง + นามสกุล (EN) — English full name (form-only, optional in API) */
  fullname_en?: string;
  /** ชื่อเล่น (TH) — Thai nickname */
  nickname: string;
  /** ชื่อเล่น (EN) — English nickname (form-only) */
  nickname_en?: string;
  /** คติประจำตัว — personal motto */
  slogan: string;
  /** ความถนัดด้าน AI — single primary AI strength (form-only, e.g. "Agentic AI") */
  ai_skill?: string;
  /** ความสนใจด้าน AI — up to 5 broad interest tags */
  interesting: AIInterest[];
  /** สกิลด้านอื่น — non-AI skills, free text (form-only) */
  other_skills?: string;
  /** Profile photo URL — null when unset */
  image: string | null;
  /** อีเมล — email addresses (first is primary) */
  gmail: string[];
  /** เบอร์โทร — phone number with country code */
  call: string | null;
  /** ลิงค์คลิปวิดีโอเข้า Level 2 — application intro video URLs */
  video_links: string[];
  /** ลิงค์ Github (form-only) */
  github_url?: string;
  /** ลิงค์ LinkedIn (form-only) */
  linkedin_url?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  date: string;
}

export interface Award {
  code: string;
  title: string;
  description: string;
  recipient?: string;
  tags?: string[];
  metric?: { label: string; value: string };
}

export interface Clip {
  topic: "llm" | "cv" | "rl" | "mlops" | "ethics" | "data";
  title: string;
  speaker: string;
  date: string;
  duration: string;
  url: string;
  thumbnail: string;
}

export interface SiteData {
  hero: {
    eyebrow: string;
    title_line_1: string;
    title_line_2: string;
    title_line_3: string;
    motto: string;
    cta_primary: { label: string; href: string };
    cta_secondary: { label: string; href: string };
  };
  about: {
    motto: string;
    dna_paragraph_1: string;
    dna_paragraph_2: string;
    logo: string;
    house_symbol: string;
    uniform_image: string;
    uniform_name: string;
    uniform_desc: string;
    doc_id: string;
    sys_rev: string;
  };
  members: Member[];
  red_wall: { quote: string; attribution: string };
  gallery: GalleryItem[];
  recognition: {
    lead: string;
    awards: Award[];
    milestones: { title: string; description: string }[];
  };
  clips: {
    featured: Clip;
    list: Clip[];
  };
  others: {
    enabled: boolean;
    items: { type: "meme" | "brainstorm"; image: string; caption: string }[];
  };
  footer: {
    email: string;
    phone: string;
    github: string;
    instagram: string;
    youtube: string;
  };
}

/**
 * Default-shown ONE mock member when no API data + no JSON template.
 * Once the live API returns members OR public/data/members.json has entries,
 * this mock is hidden — see lib/api.ts for the fallback chain.
 */
export const placeholderSiteData: SiteData = {
  hero: {
    eyebrow: "SS6 · DIGITAL YEARBOOK · 2026",
    title_line_1: "",
    title_line_2: "Pangpuriye",
    title_line_3: "Cohort.",
    motto: "United by code, forged in fire.",
    cta_primary: { label: "Enter Yearbook", href: "#about" },
    cta_secondary: { label: "About", href: "#about" },
  },
  about: {
    motto: "House motto goes here — replace with the line your team picks.",
    dna_paragraph_1:
      "Pangpuriye in one paragraph — who joined, what brought them together, what kind of AI engineers they're training to become through Super AI Engineer Season 6 with AIAT.",
    dna_paragraph_2:
      "How the house works day to day — weekly hackathons, blended online + onsite learning, peer review, real industry challenges from partner organisations.",
    logo: "/images/placeholder-logo.svg",
    house_symbol: "/images/placeholder-symbol.svg",
    uniform_image: "/images/placeholder-uniform.svg",
    uniform_name: "House Uniform Name",
    uniform_desc: "Describe what the house wears for hackathons, demos, graduation.",
    doc_id: "PANG-A-001",
    sys_rev: "SS6",
  },
  members: [
    {
      aiat_id: "000000",
      fullname: "First Last",
      fullname_en: undefined,
      nickname: "Nick",
      nickname_en: undefined,
      slogan: "Member motto goes here — replace with the real line.",
      ai_skill: "Agentic AI",
      interesting: ["ml", "genai"],
      other_skills: "Video editing, running",
      image: null,
      gmail: ["placeholder@example.com"],
      call: "+66 000 000 0000",
      video_links: [],
      github_url: undefined,
      linkedin_url: undefined,
    },
  ],
  red_wall: {
    quote: "We forged this house in code.",
    attribution: "Pangpuriye, 2026",
  },
  gallery: [],
  recognition: {
    lead: "What Pangpuriye won, where the cohort's work was recognised, and the milestones we shipped during Super AI Engineer Season 6.",
    awards: [],
    milestones: [],
  },
  clips: {
    featured: {
      topic: "llm",
      title: "Lorem Featured Clip Title",
      speaker: "Lorem Speaker · Pangpuriye",
      date: "2026-MM-DD",
      duration: "--:--",
      url: "#",
      thumbnail: "/images/placeholder-clip.svg",
    },
    list: [],
  },
  others: { enabled: false, items: [] },
  footer: {
    email: "hello@pangpuriye.example",
    phone: "+66",
    github: "https://github.com/maybethereisone-C/pangpuriye6",
    instagram: "https://www.instagram.com/pangpuriye.venator/",
    youtube: "#",
  },
};
