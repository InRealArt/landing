'use client'

import { useState, useEffect } from "react";
import { faqTabs } from "@/data/faqTranslated";
import Header from "@/components/common/annexe/Header";
import TabFilter from "@/components/common/annexe/TabFilter";
import ContentGrid from "@/components/common/annexe/ContentGrid";
import { useLanguageStore } from '@/store/languageStore';
import { useDetailedFaqStore } from "@/store/useDetailedFaqStore";

export default function TranslatedFaq() {
  const [activeTab, setActiveTab] = useState(faqTabs[0]);
  const { t, language } = useLanguageStore();
  const { faqItems, isLoading, hasError, fetchDetailedFaqs } = useDetailedFaqStore();
  
  useEffect(() => {
    // Récupérer les FAQ traduites dans la langue actuelle
    fetchDetailedFaqs(language);
  }, [fetchDetailedFaqs, language]);
  
  const filteredItems = faqItems.filter(item => 
    item.categories?.includes(activeTab)
  );

  return (
    <div className="min-h-screen">
      <Header 
        title={t('faq.page.title')}
        description={t('faq.page.description')}
      />
      
      {isLoading ? (
        <div className="text-center py-10">{t('common.loading')}</div>
      ) : hasError ? (
        <div className="text-center py-10 text-red-500">{t('common.error')}</div>
      ) : (
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
      )}
    </div>
  );
} 