"use client";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";

const Particles = dynamic(() => import("@/components/Particles"), { ssr: false });

export default function Home() {
  return (
    <main>
      <Particles />
      <HeroSection />
      <HowItWorks />
    </main>
  );
}
