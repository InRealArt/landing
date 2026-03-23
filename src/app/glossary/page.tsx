'use client'

import { useState, useEffect } from "react";
import gsap from "gsap";
import { glossaryItems, glossaryTabs } from "@/data/glossary";
import Header from "@/components/common/annexe/Header";
import TabFilter from "@/components/common/annexe/TabFilter";
import ContentGrid from "@/components/common/annexe/ContentGrid";
import GlossaryAnimations from "@/components/glossary/GlossaryAnimations";

export default function Glossary() {
  const [activeTab, setActiveTab] = useState("Blockchain");

  const filteredItems = glossaryItems.filter(item =>
    item.categories?.includes(activeTab)
  );

  // Re-animate cards on tab change
  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-anim="glossary-card"]')
    if (!cards.length) return
    gsap.fromTo(cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'cubic-bezier(0.19, 1, 0.22, 1)', stagger: 0.06 }
    )
  }, [activeTab])

  return (
    <div className="min-h-screen bg-[var(--canvas-bg)]">
      <GlossaryAnimations />
      <Header
        titleKey="glossary.title"
        descriptionKey="glossary.description"
      />
      <div className="max-w-screen-2xl mx-auto px-10 mb-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gray-text)]">
          {filteredItems.length} terme{filteredItems.length > 1 ? 's' : ''} — {activeTab}
        </p>
      </div>
      <TabFilter
        activeTab={activeTab}
        tabs={glossaryTabs}
        setActiveTab={setActiveTab}
      />
      <ContentGrid items={filteredItems} />
    </div>
  );
}