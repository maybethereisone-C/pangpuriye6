/**
 * Data fetcher — Server-side, used by Server Components.
 *
 * Behavior:
 *   1. Reads `public/api-config.json` mode flag at request time.
 *   2. If mode === "live" AND NEXT_PUBLIC_API_BASE_URL is set, fetches from backend.
 *      On any failure (network, 4xx, 5xx, malformed response), logs and falls back to placeholder JSON.
 *   3. If mode === "placeholder" or no base URL, reads from `public/data/<key>.json`.
 *   4. Final fallback: in-memory placeholder from `lib/site-data.ts`.
 *
 * NEVER throws to the caller — Server Components calling this always get a valid
 * shape. Failure modes degrade gracefully so a broken backend doesn't 500 the site.
 *
 * Caching: Next.js Cache Components-ready. The placeholder JSON files have ETag
 * via the static asset pipeline; live fetches use `next: { revalidate: 300 }` so
 * we re-pull every 5 minutes max.
 */

import {
  placeholderSiteData,
  type Member,
  type GalleryItem,
  type Award,
  type Clip,
  type SiteData,
} from "@/lib/site-data";
import path from "node:path";
import { readFile } from "node:fs/promises";

interface ApiConfig {
  mode: "placeholder" | "live";
  endpoints: {
    members: string;
    gallery: string;
  };
}

interface RespWrapper<T> {
  code: string;
  message: string;
  data: T;
}

/** Raw shape returned by /member endpoint before normalization. */
interface RawApiMember {
  id: string;
  aiat_id: string;
  fullname: string;
  nickname: string;
  slogan: string;
  interesting: string[];
  video_links: string[];
  gmail: string[] | null;
  call: string;
  image: string;
  role?: string;
}

const URL_RE = /^https?:\/\//;

/** Capitalizes the first letter of every word in a string. */
function capitalizeWords(s: string): string {
  return s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function normalizeVideoLink(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (URL_RE.test(s)) return s;
  if (s.startsWith("www.")) return `https://${s}`;
  return null;
}

function normalizeApiMember(raw: RawApiMember): Member | null {
  // Filter test/placeholder rows the API still returns
  if (raw.aiat_id === "aiat_id" || raw.fullname === "fullname") return null;

  const interesting = raw.interesting
    .flatMap((item) => item.split("-n"))
    .map((s) => s.trim())
    .filter(Boolean);

  const video_links = raw.video_links
    .map(normalizeVideoLink)
    .filter((v): v is string => v !== null);

  return {
    aiat_id: raw.aiat_id,
    fullname: capitalizeWords(raw.fullname),
    nickname: capitalizeWords(raw.nickname),
    slogan: raw.slogan,
    interesting,
    video_links,
    gmail: raw.gmail ?? [],
    call: raw.call || null,
    image: raw.image || null,
    role: raw.role,
  };
}

async function readPublicJson<T>(filename: string): Promise<T | null> {
  try {
    const filePath = path.join(process.cwd(), "public", filename);
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return (parsed.data ?? parsed) as T;
  } catch (err) {
    console.warn(`[api] failed to read public/${filename}:`, err);
    return null;
  }
}

async function loadConfig(): Promise<ApiConfig> {
  const cfg = await readPublicJson<ApiConfig>("api-config.json");
  if (cfg && typeof cfg === "object" && "mode" in cfg) {
    return cfg as ApiConfig;
  }
  return {
    mode: "placeholder",
    endpoints: { members: "/member", gallery: "/gallery" },
  };
}

function getBaseUrl(): string | null {
  const url = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  return url || null;
}

function getAuthHeaders(): Record<string, string> {
  const headerName = process.env.API_AUTH_HEADER;
  const headerValue = process.env.API_AUTH_VALUE;
  if (headerName && headerValue) return { [headerName]: headerValue };
  return {};
}

async function liveFetch<T>(url: string, headers: Record<string, string>): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.warn(`[api] ${url} returned HTTP ${res.status}`);
      return null;
    }
    const body = (await res.json()) as RespWrapper<T> | { items: T } | T;
    if (typeof body === "object" && body !== null) {
      if ("data" in body) return (body as RespWrapper<T>).data;
      if ("items" in body) return (body as { items: T }).items;
    }
    return body as T;
  } catch (err) {
    console.warn(`[api] live fetch ${url} threw:`, err);
    return null;
  }
}

export async function getMembers(): Promise<Member[]> {
  const cfg = await loadConfig();
  const baseUrl = getBaseUrl();

  if (cfg.mode === "live" && baseUrl) {
    const raw = await liveFetch<RawApiMember[]>(`${baseUrl}${cfg.endpoints.members}?limit=999`, getAuthHeaders());
    if (raw && raw.length > 0) {
      const normalized = raw.map(normalizeApiMember).filter((m): m is Member => m !== null);
      if (normalized.length > 0) return normalized;
    }
    console.warn("[api] members live fetch empty/failed — falling back to placeholder");
  }

  const fromJson = await readPublicJson<Member[]>("data/members.json");
  if (fromJson && fromJson.length > 0) return fromJson;

  return placeholderSiteData.members;
}

export async function getGallery(): Promise<GalleryItem[]> {
  const cfg = await loadConfig();
  const baseUrl = getBaseUrl();

  if (cfg.mode === "live" && baseUrl) {
    const live = await liveFetch<GalleryItem[]>(`${baseUrl}${cfg.endpoints.gallery}`, getAuthHeaders());
    if (live && live.length > 0) return live;
    console.warn("[api] gallery live fetch empty/failed — falling back to placeholder");
  }

  const fromJson = await readPublicJson<GalleryItem[]>("data/gallery.json");
  if (fromJson) return fromJson;

  return placeholderSiteData.gallery;
}

export async function getClips(): Promise<SiteData["clips"]> {
  const fromJson = await readPublicJson<SiteData["clips"]>("data/clips.json");
  if (fromJson) return fromJson;
  return placeholderSiteData.clips;
}

export async function getRecognition(): Promise<SiteData["recognition"]> {
  const fromJson = await readPublicJson<SiteData["recognition"]>("data/recognition.json");
  if (fromJson) return fromJson;
  return placeholderSiteData.recognition;
}

export async function getAbout(): Promise<SiteData["about"]> {
  const fromJson = await readPublicJson<SiteData["about"]>("data/about.json");
  if (fromJson) return fromJson;
  return placeholderSiteData.about;
}

export async function getHero(): Promise<SiteData["hero"]> {
  const fromJson = await readPublicJson<SiteData["hero"]>("data/hero.json");
  if (fromJson) return fromJson;
  return placeholderSiteData.hero;
}

export async function getRedWall(): Promise<SiteData["red_wall"]> {
  const fromJson = await readPublicJson<SiteData["red_wall"]>("data/red-wall.json");
  if (fromJson) return fromJson;
  return placeholderSiteData.red_wall;
}

/**
 * One-shot load — fetches everything in parallel. Use this in a Server Component
 * that needs the full SiteData shape.
 */
export async function getSiteData(): Promise<SiteData> {
  const [hero, about, members, redWall, gallery, recognition, clips] = await Promise.all([
    getHero(),
    getAbout(),
    getMembers(),
    getRedWall(),
    getGallery(),
    getRecognition(),
    getClips(),
  ]);
  return {
    hero,
    about,
    members,
    red_wall: redWall,
    gallery,
    recognition,
    clips,
    others: placeholderSiteData.others,
    footer: placeholderSiteData.footer,
  };
}

export type { Member, GalleryItem, Award, Clip, SiteData };
