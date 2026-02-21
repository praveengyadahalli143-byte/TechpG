import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="animated-bg" />
        {children}
      </body>
    </html>
  );
}
