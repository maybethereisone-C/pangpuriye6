import {
  placeholderSiteData,
  type Member,
  type GalleryItem,
  type Award,
  type Clip,
  type SiteData,
} from "@/lib/site-data";

import membersData     from "../../public/data/members.json";
import galleryData     from "../../public/data/gallery.json";
import clipsData       from "../../public/data/clips.json";
import recognitionData from "../../public/data/recognition.json";
import aboutData       from "../../public/data/about.json";
import heroData        from "../../public/data/hero.json";
import redWallData     from "../../public/data/red-wall.json";

export async function getMembers(): Promise<Member[]> {
  const data = membersData.data as unknown as Member[];
  return data?.length ? data : placeholderSiteData.members;
}

export async function getGallery(): Promise<GalleryItem[]> {
  const data = galleryData.data as unknown as GalleryItem[];
  return data?.length ? data : placeholderSiteData.gallery;
}

export async function getClips(): Promise<SiteData["clips"]> {
  return (clipsData.data as unknown as SiteData["clips"]) ?? placeholderSiteData.clips;
}

export async function getRecognition(): Promise<SiteData["recognition"]> {
  return (recognitionData.data as unknown as SiteData["recognition"]) ?? placeholderSiteData.recognition;
}

export async function getAbout(): Promise<SiteData["about"]> {
  return (aboutData.data as unknown as SiteData["about"]) ?? placeholderSiteData.about;
}

export async function getHero(): Promise<SiteData["hero"]> {
  return (heroData.data as unknown as SiteData["hero"]) ?? placeholderSiteData.hero;
}

export async function getRedWall(): Promise<SiteData["red_wall"]> {
  return (redWallData.data as unknown as SiteData["red_wall"]) ?? placeholderSiteData.red_wall;
}

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
