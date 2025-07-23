'use client'

import { useState } from "react";
import { glossaryItems, glossaryTabs } from "@/data/glossary";
import Header from "@/components/common/annexe/Header";
import TabFilter from "@/components/common/annexe/TabFilter";
import ContentGrid from "@/components/common/annexe/ContentGrid";
import { generateCollectionJsonLd } from '@/utils/metadata'

export default function Glossary() {
  const [activeTab, setActiveTab] = useState("Blockchain");
  
  const filteredItems = glossaryItems.filter(item => 
    item.categories?.includes(activeTab)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: generateCollectionJsonLd(
            'Glossaire InRealArt',
            'Collection de termes et définitions sur l\'art tokenisé, la blockchain et les NFTs',
            filteredItems.map(item => ({
              name: item.title,
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/glossary#${item.title.toLowerCase().replace(/\s+/g, '-')}`
            }))
          )
        }}
      />
      
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
    </>
  );
} 