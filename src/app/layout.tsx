import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/content/site";
import { themeScript } from "@/lib/theme-script";
import { Providers } from "@/components/layout/Providers";
import { Intro } from "@/components/layout/Intro";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { LazyFoxBot } from "@/components/foxbot/LazyFoxBot";

const display = localFont({
  src: [
    { path: "../fonts/sora-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/sora-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/sora-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
const body = localFont({
  src: [
    { path: "../fonts/instrument-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/instrument-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/instrument-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
const mono = localFont({
  src: [
    { path: "../fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | FoxByte" },
  description: site.description,
  applicationName: site.name,
  creator: site.name,
  publisher: site.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#141922" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Providers>
          <Intro />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <LazyFoxBot />
        </Providers>
      </body>
    </html>
  );
}
