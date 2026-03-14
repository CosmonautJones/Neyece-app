import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// Neyece brand fonts — swap to Google Fonts (Fraunces + Nunito) in production
// when network is available. These variables are used in tailwind.config.ts
// and can be overridden by adding the Google Fonts imports.
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Neyece — Discover spots that match your vibe",
  description:
    "Neyece replaces generic search results with vibe-matched recommendations. Find spots that actually get you.",
  openGraph: {
    title: "Neyece — That's Neyece.",
    description: "Discover spots that match your vibe.",
    siteName: "Neyece",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
