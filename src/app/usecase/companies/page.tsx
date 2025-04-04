'use client'

import Hero from "@/components/usecase/companies/Hero";
import Expert from "@/components/usecase/companies/Expert";
import Possibilities from "@/components/usecase/companies/Possibilities";

export default function CompaniesPage() {
  return (
    <main className="min-h-screen  text-white">
      <Hero />
      <Expert />
      <Possibilities />
    </main>
  );
} 