import type { NextConfig } from "next";

// Allow-list remote image hosts from env. Set NEXT_PUBLIC_API_HOSTNAME in .env.local
// (or leave unset to disable remote image loading until the backend host is known).
const apiHost = process.env.NEXT_PUBLIC_API_HOSTNAME;

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: apiHost
      ? [{ protocol: "https", hostname: apiHost, pathname: "/**" }]
      : [],
  },
  experimental: {
    optimizePackageImports: ["gsap", "lenis"],
  },
};

export default nextConfig;
