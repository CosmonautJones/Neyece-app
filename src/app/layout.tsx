import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neyece — Discover spots that match your vibe",
  description:
    "Neyece replaces generic search results with vibe-matched recommendations. Find spots that actually get you.",
  openGraph: {
    title: "Neyece — That's Neyece.",
    description:
      "Discover spots that match your vibe. Not the crowd's. AI-powered local discovery for people with taste.",
    siteName: "Neyece",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neyece — That's Neyece.",
    description: "Discover spots that match your vibe.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
