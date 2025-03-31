'use client'

import { useState } from "react";
import { faqItems, faqTabs } from "@/data/faq";
import Header from "@/components/common/annexe/Header";
import TabFilter from "@/components/common/annexe/TabFilter";
import ContentGrid from "@/components/common/annexe/ContentGrid";

export default function Faq() {
  const [activeTab, setActiveTab] = useState("NFT");
  
  const filteredItems = faqItems.filter(item => 
    item.categories?.includes(activeTab)
  );

  return (
    <div className="min-h-screen">
      <Header 
        title="FAQ"
        description="Retrouvez ici toute les FAQ pour vous donner ce dont vous avez besoin de savoir concernant notre plateforme, son fonctionnement et ce qu'elle peut vous offrir"
      />
      <TabFilter 
        activeTab={activeTab} 
        tabs={faqTabs} 
        setActiveTab={setActiveTab} 
      />
      <ContentGrid 
        items={filteredItems} 
      />
    </div>
  );
} 