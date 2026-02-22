import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "TechpG | Project Registration Portal",
  description: "Register for mini and major projects with our AI-powered chat-based registration system. Get matched with the perfect project for your skills.",
  keywords: "project registration, mini project, major project, student projects, tech projects",
  openGraph: {
    title: "TechpG | Project Registration Portal",
    description: "Register for mini and major projects with our AI-powered chat-based registration system.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Preconnect to Spline CDN so 3D scene loads on first visit */}
        <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
      </head>
      <body suppressHydrationWarning>
        <div className="animated-bg" />
        {children}
      </body>
    </html>
  );
}
