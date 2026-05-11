import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ThemeProvider, themeBootstrapScript } from "@/components/motion/ThemeProvider";
import { ParticleBackground } from "@/components/motion/ParticleBackground";
import { MagneticHover } from "@/components/motion/MagneticHover";
import { MenuProvider } from "@/components/blocks/MenuProvider";
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


export const metadata: Metadata = {
  metadataBase: new URL("https://pangpuriye6.vercel.app"),
  title: {
    default: "Pangpuriye — Super AI Engineer S6 L2",
    template: "%s · Pangpuriye",
  },
  description:
    "The digital yearbook of Pangpuriye — the cohort, the hackathons, and the models we shipped during Super AI Engineer Season 6 with AIAT.",
  keywords: ["AIAT", "Super AI Engineer", "Pangpuriye", "yearbook"],
  openGraph: {
    type: "website",
    title: "Pangpuriye — Cohort SS6 L2",
    description:
      "The digital yearbook of Pangpuriye — Super AI Engineer Season 6 with AIAT.",
    siteName: "Pangpuriye",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#140e0e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ParticleBackground />
          <MotionProvider>
            <MenuProvider>
              <MagneticHover />
              <main>{children}</main>
            </MenuProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
