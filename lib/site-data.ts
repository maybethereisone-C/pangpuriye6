/**
 * Site data — placeholder content + types.
 *
 * The runtime fetcher lives in `lib/api.ts`. It reads the mode flag from
 * `public/api-config.json` and the backend URL from `process.env.NEXT_PUBLIC_API_BASE_URL`
 * (set in `.env.local`, gitignored). When mode === "live", it fetches; otherwise it
 * loads from `public/data/*.json` then falls back to the placeholders below.
 */

export type AIInterest = "ml" | "nlp" | "cv" | "ethics" | "genai";

export interface Member {
  aiat_id: string;
  fullname: string;
  nickname: string;
  slogan: string;
  interesting: AIInterest[];
  image: string | null;
  gmail: string[];
  call: string | null;
  video_links: string[];
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

export const placeholderSiteData: SiteData = {
  hero: {
    eyebrow: "SS6 · LEVEL 2 · DIGITAL YEARBOOK · 2026",
    title_line_1: "House",
    title_line_2: "Pangpuriye",
    title_line_3: "Cohort.",
    motto: "United by code, forged in fire.",
    cta_primary: { label: "Enter Yearbook", href: "#about" },
    cta_secondary: { label: "About the House", href: "#about" },
  },
  about: {
    motto: "House motto goes here — replace with the line your team picks.",
    dna_paragraph_1:
      "House Pangpuriye in one paragraph — who joined, what brought them together, what kind of AI engineers they're training to become through Super AI Engineer Season 6 with AIAT.",
    dna_paragraph_2:
      "How the house works day to day — weekly hackathons, blended online + onsite learning, peer review, real industry challenges from partner organisations.",
    logo: "/images/placeholder-logo.svg",
    house_symbol: "/images/placeholder-symbol.svg",
    uniform_image: "/images/placeholder-uniform.svg",
    uniform_name: "House Uniform Name",
    uniform_desc: "Describe what the house wears for hackathons, demos, graduation.",
    doc_id: "PANG-A-001",
    sys_rev: "SS6.L2",
  },
  members: Array.from({ length: 6 }, (_, i) => ({
    aiat_id: `AIAT-${String(i + 1).padStart(3, "0")}`,
    fullname: `Lorem Ipsum ${["One", "Two", "Three", "Four", "Five", "Six"][i]}`,
    nickname: "Nickname",
    slogan: "Lorem ipsum dolor sit amet — replace with member's slogan.",
    interesting: [
      ["ml", "genai"],
      ["nlp", "ethics"],
      ["cv", "ml"],
      ["genai", "ethics"],
      ["ml", "nlp"],
      ["cv", "genai"],
    ][i] as AIInterest[],
    image: null,
    gmail: ["placeholder@example.com"],
    call: "+66",
    video_links: [],
  })),
  red_wall: {
    quote: "We forged this house in code.",
    attribution: "Pangpuriye, 2026",
  },
  gallery: [],
  recognition: {
    lead: "What House Pangpuriye won, where the cohort's work was recognised, and the milestones we shipped during Super AI Engineer Season 6.",
    awards: [],
    milestones: [],
  },
  clips: {
    featured: {
      topic: "llm",
      title: "Lorem Featured Clip Title",
      speaker: "Lorem Speaker · House Pangpuriye",
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
    github: "https://github.com/PLACEHOLDER/pangpuriye6",
    instagram: "#",
    youtube: "#",
  },
};
