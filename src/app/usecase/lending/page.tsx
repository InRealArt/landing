'use client'

import Hero from "@/components/usecase/lending/Hero";
import Advantages from "@/components/usecase/lending/Advantages";
import Solutions from "@/components/usecase/lending/Solutions";
import Alternative from "@/components/usecase/lending/Alternative";
import ForWho from "@/components/usecase/lending/ForWho";

export default function LendingPage() {
  return (
    <main className="min-h-screen text-white">
      <Hero />
      <Advantages />
      <Solutions />
      <Alternative />
      <ForWho />
    </main>
  );
} 