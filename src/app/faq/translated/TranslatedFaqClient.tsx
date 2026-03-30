'use client'

import { useState, useMemo } from "react";
import Header from "@/components/common/annexe/Header";
import TabFilter from "@/components/common/annexe/TabFilter";
import ContentGrid from "@/components/common/annexe/ContentGrid";
import { useLanguageStore } from '@/store/languageStore';
import { GlobalDetailedFaqData } from "@/actions/detailedFaqActions";

interface TranslatedFaqClientProps {
  initialData: GlobalDetailedFaqData;
}

export default function TranslatedFaqClient({ initialData }: TranslatedFaqClientProps) {
  const { t, language } = useLanguageStore();
  
  // Traduire les headers
  const faqTabs = useMemo(() => {
    return initialData.headers.map(header => 
      header.translations[language.toLowerCase()] || header.name
    );
  }, [initialData.headers, language]);

  const [activeTab, setActiveTab] = useState(faqTabs[0] || "");

  // Traduire les items
  const faqItems = useMemo(() => {
    const lang = language.toLowerCase();
    return initialData.items.map(item => {
      const question = item.translations.question?.[lang] || item.question;
      const answer = item.translations.answer?.[lang] || item.answer;
      
      const header = initialData.headers.find(h => h.id === item.detailedFaqId);
      const category = header 
        ? (header.translations[lang] || header.name)
        : "";

      return {
        title: question,
        content: answer,
        categories: [category]
      };
    });
  }, [initialData, language]);

  const filteredItems = useMemo(() => {
    return faqItems.filter(item => 
      item.categories?.includes(activeTab)
    );
  }, [faqItems, activeTab]);

  return (
    <div className="min-h-screen">
      <Header 
        title={t('faq.page.title')}
        description={t('faq.page.description')}
      />
      
      <>
        <TabFilter 
          activeTab={activeTab} 
          tabs={faqTabs} 
          setActiveTab={setActiveTab} 
        />
        {filteredItems.length > 0 ? (
          <ContentGrid 
            items={filteredItems} 
          />
        ) : (
          <div className="text-center py-10">
            {t('faq.noItems')}
          </div>
        )}
      </>
    </div>
  );
}
