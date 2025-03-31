'use client'

import { useState } from "react";
import { glossaryItems, glossaryTabs } from "@/data/glossary";
import Header from "@/components/common/annexe/Header";
import TabFilter from "@/components/common/annexe/TabFilter";
import ContentGrid from "@/components/common/annexe/ContentGrid";

export default function Glossary() {
  const [activeTab, setActiveTab] = useState("Blockchain");
  
  const filteredItems = glossaryItems.filter(item => 
    item.categories?.includes(activeTab)
  );

  return (
    <div className="min-h-screen">
      <Header 
        title="Glossaire"
        description="Retrouvez ici tous les termes techniques utilisés dans l'univers de la blockchain, des NFTs et de l'art digital pour mieux comprendre notre écosystème"
      />
      <TabFilter 
        activeTab={activeTab} 
        tabs={glossaryTabs} 
        setActiveTab={setActiveTab} 
      />
      <ContentGrid 
        items={filteredItems} 
      />
    </div>
  );
} 