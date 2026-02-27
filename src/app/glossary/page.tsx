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
    <>
      <div className="min-h-screen">
        <Header 
          titleKey="glossary.title"
          descriptionKey="glossary.description"
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
    </>
  );
} 