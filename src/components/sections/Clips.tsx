"use client";

import { useState } from "react";
import type { SiteData, Member } from "@/lib/site-data";
import { RevealOnView } from "@/components/motion/RevealOnView";

interface VideoEntry {
  url: string;
  memberName: string;
  memberNickname: string;
  type: "youtube" | "tiktok" | "external";
  youtubeId?: string;
}

function getYouTubeId(url: string): string | null {
  // Support standard, embed, shorts, and mobile URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function isTikTok(url: string): boolean {
  return url.includes("tiktok.com");
}

function extractVideos(members: Member[]): VideoEntry[] {
  const videos: VideoEntry[] = [];
  for (const m of members) {
    if (!m.video_links) continue;
    for (const url of m.video_links) {
      const ytId = getYouTubeId(url);
      if (ytId) {
        videos.push({ url, memberName: m.fullname, memberNickname: m.nickname, type: "youtube", youtubeId: ytId });
      } else if (isTikTok(url)) {
        videos.push({ url, memberName: m.fullname, memberNickname: m.nickname, type: "tiktok" });
      } else if (url && url !== "#") {
        videos.push({ url, memberName: m.fullname, memberNickname: m.nickname, type: "external" });
      }
    }
  }
  const rank: Record<VideoEntry["type"], number> = {
    youtube: 0,
    tiktok: 1,
    external: 2,
  };
  return videos.sort((a, b) => rank[a.type] - rank[b.type]);
}

function VideoCard({ video, isFeatured = false }: { video: VideoEntry; isFeatured?: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      data-anim="reveal-item"
      className={`group relative flex flex-col border border-[var(--color-hairline)] bg-[var(--color-bg)] transition-all duration-300 hover:border-[var(--color-accent-red)] ${
        isFeatured ? "md:col-span-8" : "md:col-span-4"
      }`}
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        {video.type === "youtube" && video.youtubeId ? (
          playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              title={`${video.memberName} intro`}
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 w-full h-full cursor-pointer group/play"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/play:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/play:bg-black/30 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-red)] shadow-lg transition-transform group-hover/play:scale-110">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )
        ) : (
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--color-ink-charcoal)] transition-colors hover:bg-black"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-accent-red)] transition-transform hover:scale-110">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-cream)]">
              {video.type === "tiktok" ? "Watch TikTok" : "Watch External"} ↗
            </span>
          </a>
        )}
      </div>

      <div className="p-4 border-t border-[var(--color-hairline)]">
        <p className="font-[family-name:var(--font-mono-loaded)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
          {isFeatured ? "FEATURED · " : ""}{video.type === "youtube" ? "YouTube" : video.type === "tiktok" ? "TikTok" : "External"}
        </p>
        <h3 className={`mt-1 font-[family-name:var(--font-display-loaded)] font-bold leading-tight text-[var(--color-fg)] ${isFeatured ? "text-xl" : "text-sm"}`}>
          {video.memberName}
        </h3>
        <p className={`mt-0.5 font-[family-name:var(--font-mono-loaded)] text-[var(--color-fg-soft)] ${isFeatured ? "text-sm" : "text-[10px]"}`}>
          {video.memberNickname}
        </p>
      </div>
    </div>
  );
}

/** Clips — Section 06. Now repurposed as "Member Intro" videos. */
export function Clips({ data, members = [] }: { data: SiteData["clips"]; members?: Member[] }) {
  const videos = extractVideos(members);

  return (
    <section
      id="clips"
      data-section="06-clips"
      data-section-index="6"
      className="grid"
      style={{ height: "auto", minHeight: "100svh" }}
    >
     <RevealOnView>
      <div className="mx-auto w-full max-w-[var(--grid-max-width)] px-[var(--grid-margin-mobile)] pt-24 pb-24 md:px-[var(--grid-margin-tablet)] md:pt-32 lg:px-[var(--grid-margin-desktop)]">
        <header>
          <p data-anim="reveal-eyebrow" className="font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent-red)]">
            MEMBER INTRO
          </p>
          <h2 data-anim="reveal-title" className="mt-2 font-[family-name:var(--font-display-loaded)]">Intro Videos</h2>
        </header>

        {videos.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
            {videos.map((video, idx) => (
              <VideoCard
                key={`${video.memberName}-${idx}`}
                video={video}
                isFeatured={idx === 0}
              />
            ))}
          </div>
        ) : (
          <p className="mt-12 font-[family-name:var(--font-mono-loaded)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            Member intros drop soon — check back then.
          </p>
        )}
      </div>
     </RevealOnView>
    </section>
  );
}
