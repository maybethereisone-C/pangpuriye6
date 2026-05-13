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

type RawMember = Partial<Omit<Member, "interesting" | "gmail" | "video_links">> & {
  interesting?: unknown;
  gmail?: unknown;
  video_links?: unknown;
};

type RawGalleryItem = Partial<Omit<GalleryItem, "category" | "images">> & {
  category?: unknown;
  images?: unknown;
};

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
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? null;
}

function joinUrl(baseUrl: string, endpoint: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
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

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => asStringArray(item));
  }

  if (typeof value !== "string") return [];

  return value
    .split(/\r?\n|\\n|-n/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function normalizeMember(raw: RawMember, index: number): Member | null {
  const aiatId = asOptionalString(raw.aiat_id) ?? asOptionalString(raw.id);
  if (!aiatId) return null;

  return {
    id: asOptionalString(raw.id),
    aiat_id: aiatId,
    role: asOptionalString(raw.role),
    fullname: asOptionalString(raw.fullname) ?? `Member ${index + 1}`,
    fullname_en: asOptionalString(raw.fullname_en),
    nickname: asOptionalString(raw.nickname) ?? "-",
    nickname_en: asOptionalString(raw.nickname_en),
    slogan: asOptionalString(raw.slogan) ?? "",
    ai_skill: asOptionalString(raw.ai_skill),
    interesting: asStringArray(raw.interesting),
    other_skills: asOptionalString(raw.other_skills),
    image: asOptionalString(raw.image) ?? null,
    gmail: asStringArray(raw.gmail),
    call: asOptionalString(raw.call) ?? null,
    video_links: asStringArray(raw.video_links),
    github_url: asOptionalString(raw.github_url),
    linkedin_url: asOptionalString(raw.linkedin_url),
  };
}

function normalizeMembers(rawMembers: RawMember[]): Member[] {
  return rawMembers
    .map((member, index) => normalizeMember(member, index))
    .filter((member): member is Member => member !== null);
}

function normalizeGalleryCategory(value: unknown): GalleryItem["category"][number] | null {
  if (typeof value !== "object" || value === null) return null;

  const record = value as Record<string, unknown>;
  const id = asOptionalString(record.id);
  const name = asOptionalString(record.name);
  if (!id || !name) return null;

  return {
    id,
    name,
    description: asOptionalString(record.description) ?? "",
  };
}

function normalizeGalleryItem(raw: RawGalleryItem, index: number): GalleryItem | null {
  const id = asOptionalString(raw.id);
  if (!id) return null;

  return {
    id,
    category: Array.isArray(raw.category)
      ? raw.category
          .map((item) => normalizeGalleryCategory(item))
          .filter((item): item is GalleryItem["category"][number] => item !== null)
      : [],
    title: asOptionalString(raw.title) ?? `Gallery ${index + 1}`,
    description: asOptionalString(raw.description) ?? "",
    images: asStringArray(raw.images),
    date: asOptionalString(raw.date),
  };
}

function normalizeGalleryItems(rawItems: RawGalleryItem[]): GalleryItem[] {
  return rawItems
    .map((item, index) => normalizeGalleryItem(item, index))
    .filter((item): item is GalleryItem => item !== null);
}

export async function getMembers(): Promise<Member[]> {
  const cfg = await loadConfig();
  const baseUrl = getBaseUrl();

  if (cfg.mode === "live" && baseUrl) {
    const live = await liveFetch<RawMember[]>(joinUrl(baseUrl, cfg.endpoints.members), getAuthHeaders());
    const normalized = live ? normalizeMembers(live) : [];
    if (normalized.length > 0) return normalized;
    console.warn("[api] members live fetch empty/failed — falling back to placeholder");
  }

  const fromJson = await readPublicJson<RawMember[]>("data/members.json");
  const normalized = fromJson ? normalizeMembers(fromJson) : [];
  if (normalized.length > 0) return normalized;

  return placeholderSiteData.members;
}

export async function getGallery(): Promise<GalleryItem[]> {
  const cfg = await loadConfig();
  const baseUrl = getBaseUrl();

  if (cfg.mode === "live" && baseUrl) {
    const live = await liveFetch<RawGalleryItem[]>(joinUrl(baseUrl, cfg.endpoints.gallery), getAuthHeaders());
    const normalized = live ? normalizeGalleryItems(live) : [];
    if (normalized.length > 0) return normalized;
    console.warn("[api] gallery live fetch empty/failed — falling back to placeholder");
  }

  const fromJson = await readPublicJson<RawGalleryItem[]>("data/gallery.json");
  const normalized = fromJson ? normalizeGalleryItems(fromJson) : [];
  if (normalized.length > 0) return normalized;

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
