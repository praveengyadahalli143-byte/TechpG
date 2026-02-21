"use client";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";

const Particles = dynamic(() => import("@/components/Particles"), { ssr: false });

export default function Home() {
  return (
    <main>
      <Particles />
      <HeroSection />
    </main>
  );
}
