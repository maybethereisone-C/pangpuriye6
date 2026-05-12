/**
 * Data fetcher — Server-side, used by Server Components.
 *
 * Behavior:
 *   1. Reads `public/api-config.json` mode flag at request time.
 *   2. If mode === "live" AND NEXT_PUBLIC_API_BASE_URL is set, fetches from backend.
 *      On any failure (network, 4xx, 5xx, malformed response), logs and falls back to placeholder JSON.
 *   3. If mode === "placeholder" or no base URL, reads from `public/data/<key>.json`.
 *   4. Final fallback: in-memory placeholder from `lib/site-data.ts`.
 */

import {
  placeholderSiteData,
  type Member,
  type GalleryItem,
  type Category,
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
    categories: string;
  };
}

interface RespWrapper<T> {
  code: string;
  message: string;
  data: T;
}

type ApiMember = Partial<Member> & {
  id?: string;
  role?: string | null;
};

type ApiGalleryItem = Omit<Partial<GalleryItem>, "category"> & {
  category?: Category[];
};

function titleCaseWords(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function normalizeUrl(value: string): string | null {
  const url = value.trim();
  if (!url || url === "#") return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^www\./i.test(url)) return `https://${url}`;
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(url)) return `https://${url}`;
  return null;
}

function isMockMember(member: Member): boolean {
  const fields = [member.aiat_id, member.fullname, member.nickname, member.slogan].map((value) => value.toLowerCase().trim());
  return (
    !/^\d{6}$/.test(member.aiat_id) ||
    fields.includes("fullname") ||
    fields.includes("nickname") ||
    fields.includes("slogan") ||
    member.aiat_id === "000000"
  );
}

function isMockGalleryItem(item: GalleryItem): boolean {
  return item.images.length === 0;
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
    endpoints: { members: "/member", gallery: "/media/gallery", categories: "/media/category" },
  };
}

function getBaseUrl(): string | null {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || null;
}

function getAuthHeaders(): Record<string, string> {
  const h = process.env.API_AUTH_HEADER;
  const v = process.env.API_AUTH_VALUE;
  return h && v ? { [h]: v } : {};
}

function buildUrl(baseUrl: string, endpoint: string, query?: string): string {
  const base = baseUrl.replace(/\/+$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}${query ?? ""}`;
}

function normalizeMember(member: ApiMember): Member {
  return {
    id: member.id,
    aiat_id: member.aiat_id ?? "",
    role: member.role ?? null,
    fullname: titleCaseWords(member.fullname ?? ""),
    fullname_en: member.fullname_en,
    nickname: titleCaseWords(member.nickname ?? ""),
    nickname_en: member.nickname_en,
    slogan: member.slogan ?? "",
    ai_skill: member.ai_skill,
    interesting: Array.isArray(member.interesting) ? member.interesting : [],
    other_skills: member.other_skills,
    image: member.image ?? null,
    gmail: Array.isArray(member.gmail) ? member.gmail : [],
    call: member.call ?? null,
    video_links: Array.isArray(member.video_links)
      ? member.video_links.map(normalizeUrl).filter((url): url is string => Boolean(url))
      : [],
    github_url: member.github_url,
    linkedin_url: member.linkedin_url,
  };
}

function normalizeGalleryItem(item: ApiGalleryItem): GalleryItem {
  const category = Array.isArray(item.category) ? item.category : undefined;
  const category_ids = Array.isArray(item.category_ids)
    ? item.category_ids
    : category?.map((cat) => cat.id).filter(Boolean);
  const rawTitle = (item.title ?? "").trim();
  const rawDescription = (item.description ?? "").trim();

  return {
    id: item.id ?? "",
    title: rawTitle,
    description: rawDescription,
    images: Array.isArray(item.images) ? item.images : [],
    date: item.date ?? "",
    category,
    category_ids,
    video_links: Array.isArray(item.video_links)
      ? item.video_links.map(normalizeUrl).filter((url): url is string => Boolean(url))
      : [],
  };
}

function normalizeCategory(category: Partial<Category>): Category {
  return {
    id: category.id ?? "",
    name: titleCaseWords(category.name ?? ""),
    description: category.description ?? "",
  };
}

async function liveFetch<T>(url: string, headers: Record<string, string>): Promise<T | null> {
  try {
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) {
      console.warn(`[api] ${url} HTTP ${res.status}`);
      return null;
    }
    const body = await res.json() as RespWrapper<T> | { items: T } | T;
    if (body && typeof body === "object" && "data" in body) {
      const wrapped = body as RespWrapper<T>;
      if (wrapped.code && wrapped.code !== "0") {
        console.warn(`[api] ${url} code ${wrapped.code}: ${wrapped.message}`);
        return null;
      }
      return wrapped.data;
    }
    return body as T;
  } catch (err) {
    console.warn(`[api] liveFetch ${url}:`, err);
    return null;
  }
}

export async function getMembers(): Promise<Member[]> {
  const cfg = await loadConfig();
  const baseUrl = getBaseUrl();

  if (cfg.mode === "live" && baseUrl) {
    const live = await liveFetch<ApiMember[]>(buildUrl(baseUrl, cfg.endpoints.members, "?limit=999"), getAuthHeaders());
    if (live && live.length > 0) return live.map(normalizeMember).filter((member) => !isMockMember(member));
    console.warn("[api] members live fetch empty");
    return [];
  }

  const fromJson = await readPublicJson<Member[]>("data/members.json");
  if (fromJson && fromJson.length > 0) return fromJson.map(normalizeMember).filter((member) => !isMockMember(member));

  return placeholderSiteData.members;
}

export async function getCategories(): Promise<Category[]> {
  const cfg = await loadConfig();
  const baseUrl = getBaseUrl();

  if (cfg.mode === "live" && baseUrl) {
    const live = await liveFetch<Partial<Category>[]>(buildUrl(baseUrl, cfg.endpoints.categories), getAuthHeaders());
    if (live && live.length > 0) return live.map(normalizeCategory);
    console.warn("[api] categories live fetch empty");
    return [];
  }

  const fromJson = await readPublicJson<Category[]>("data/categories.json");
  if (fromJson) return fromJson.map(normalizeCategory);

  return placeholderSiteData.categories;
}

export async function getGallery(): Promise<GalleryItem[]> {
  const cfg = await loadConfig();
  const baseUrl = getBaseUrl();

  if (cfg.mode === "live" && baseUrl) {
    const live = await liveFetch<ApiGalleryItem[]>(buildUrl(baseUrl, cfg.endpoints.gallery, "?limit=100"), getAuthHeaders());
    if (live && live.length > 0) return live.map(normalizeGalleryItem).filter((item) => !isMockGalleryItem(item));
    console.warn("[api] gallery live fetch empty");
    return [];
  }

  const fromJson = await readPublicJson<GalleryItem[]>("data/gallery.json");
  if (fromJson) return fromJson.map(normalizeGalleryItem).filter((item) => !isMockGalleryItem(item));

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

export async function getSiteData(): Promise<SiteData> {
  const [hero, about, members, redWall, categories, gallery, recognition, clips] = await Promise.all([
    getHero(),
    getAbout(),
    getMembers(),
    getRedWall(),
    getCategories(),
    getGallery(),
    getRecognition(),
    getClips(),
  ]);
  return {
    hero,
    about,
    members,
    red_wall: redWall,
    categories,
    gallery,
    recognition,
    clips,
    others: placeholderSiteData.others,
    footer: placeholderSiteData.footer,
  };
}

export type { Member, GalleryItem, Category, Award, Clip, SiteData };
