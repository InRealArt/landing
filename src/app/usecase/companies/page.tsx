'use client'

import Hero from "@/components/usecase/companies/Hero";
import Expert from "@/components/companies/Expert";
import Possibilities from "@/components/companies/Possibilities";

export default function CompaniesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <Expert />
      <Possibilities />
    </main>
  );
} 