'use client'

import Hero from "@/components/usecase/leasing/Hero";
import Advantages from "@/components/usecase/leasing/Advantages";
import Benefits from "@/components/usecase/leasing/Benefits";
import SliderSection from "@/components/usecase/leasing/SliderSection";
import Investment from "@/components/usecase/leasing/Investment";
import Expert from "@/components/usecase/companies/Expert";

export default function LeasingPage() {
  return (
    <main className="min-h-screen  text-white">
      <Hero />
      <Advantages />
      <Benefits />
      <SliderSection />
      <Expert />
      <Investment />
    </main>
  );
} 