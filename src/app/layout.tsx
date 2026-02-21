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
      </head>
      <body>
        <div className="animated-bg" />
        {children}
      </body>
    </html>
  );
}
