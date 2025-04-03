'use client'

import { useState } from "react";
import { faqItems, faqTabs } from "@/data/faq";
import Header from "@/components/common/annexe/Header";
import TabFilter from "@/components/common/annexe/TabFilter";
import ContentGrid from "@/components/common/annexe/ContentGrid";
import { useLanguageStore } from '@/store/languageStore';

export default function Faq() {
  const [activeTab, setActiveTab] = useState("NFT");
  const { t } = useLanguageStore();
  
  const filteredItems = faqItems.filter(item => 
    item.categories?.includes(activeTab)
  );

  return (
    <div className="min-h-screen">
      <Header 
        title={t('faq.page.title')}
        description={t('faq.page.description')}
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