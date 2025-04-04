'use client'

import Hero from "@/components/usecase/fractionate/Hero";
import HowItWorks from "@/components/usecase/fractionate/HowItWorks";
import Benefits from "@/components/usecase/fractionate/Benefits";

export default function FractionatePage() {
  return (
    <main className="min-h-screen text-white">
      <Hero />
      <HowItWorks />
      <Benefits />
    </main>
  );
} 