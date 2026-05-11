import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-display-loaded",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-mono-loaded",
});

// PP Supply Mono — Pangram trial. License risk accepted (decisions/log.md 2026-05-10).
// Trial pack only ships Regular + Ultralight in OTF. No Bold variant available without purchase.
const ppSupplyMono = localFont({
  src: [
    {
      path: "../public/fonts/PPSupplyMono-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/PPSupplyMono-Ultralight.otf",
      weight: "200",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-mono-accent-loaded",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pangpuriye6.vercel.app"),
  title: {
    default: "House Pangpuriye — Super AI Engineer S6 L2",
    template: "%s · House Pangpuriye",
  },
  description:
    "The digital yearbook of House Pangpuriye — the cohort, the hackathons, and the models we shipped during Super AI Engineer Season 6 with AIAT.",
  keywords: ["AIAT", "Super AI Engineer", "House Pangpuriye", "yearbook"],
  openGraph: {
    type: "website",
    title: "House Pangpuriye — Cohort SS6 L2",
    description:
      "The digital yearbook of House Pangpuriye — Super AI Engineer Season 6 with AIAT.",
    siteName: "House Pangpuriye",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#c1121f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${ppSupplyMono.variable}`}
    >
      <body>
        <MotionProvider>
          <main>{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}
