'use client'

import { useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { useTranslation } from '@/hooks/useTranslation';
import FaqAnimations from "@/components/faq/FaqAnimations";
import { GlobalDetailedFaqData } from "@/actions/detailedFaqActions";

interface FaqClientProps {
  initialData: GlobalDetailedFaqData;
}

export default function FaqClient({ initialData }: FaqClientProps) {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Traduire les headers
  const faqTabs = useMemo(() => {
    return initialData.headers.map(header => 
      header.translations[language.toLowerCase()] || header.name
    );
  }, [initialData.headers, language]);

  // Traduire les items et filtrer par catégorie active
  const filteredItems = useMemo(() => {
    const lang = language.toLowerCase();
    
    // 1. Traduire tous les items et leur assigner leur catégorie traduite
    const translatedItems = initialData.items.map(item => {
      const question = item.translations.question?.[lang] || item.question;
      const answer = item.translations.answer?.[lang] || item.answer;
      
      // Trouver le header correspondant pour avoir sa catégorie traduite
      const header = initialData.headers.find(h => h.id === item.detailedFaqId);
      const category = header 
        ? (header.translations[lang] || header.name)
        : "";

      return {
        title: question,
        content: answer,
        category: category
      };
    });

    // 2. Filtrer par catégorie active
    return translatedItems.filter(item => item.category === activeTab);
  }, [initialData, language, activeTab]);

  useEffect(() => {
    if (faqTabs.length > 0 && !activeTab) {
      setActiveTab(faqTabs[0]);
    }
  }, [faqTabs, activeTab]);

  const handleToggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  // Reset open accordion when tab changes
  useEffect(() => {
    setOpenIndex(null);
  }, [activeTab]);

  // Re-animate rows on tab change
  useEffect(() => {
    if (!activeTab) return;
    const rows = gsap.utils.toArray<HTMLElement>('[data-anim="faq-row"]');
    if (!rows.length) return;
    gsap.fromTo(rows,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'cubic-bezier(0.19, 1, 0.22, 1)', stagger: 0.05 }
    );
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-canvas-white">
      <FaqAnimations />

      {/* ── Hero ── */}
      <section className="max-w-screen-2xl mx-auto px-10 pt-headerSize pb-12 border-b border-border-light mb-16">
        <p className="section-number mb-6" data-anim="faq-hero-label">
          {t('faq.page.title')}
        </p>
        <h1 className="serif text-4xl md:text-5xl leading-none tracking-tight text-ink-black mb-10" data-anim="faq-hero-title">
          Questions{' '}
          <em className="italic text-gold-accent not-italic">fréquentes</em>
        </h1>
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400 max-w-md" data-anim="faq-hero-desc">
          {t('faq.page.description')}
        </p>
      </section>

      {/* ── Onglets catégories ── */}
      {faqTabs.length > 0 && (
        <section className="max-w-screen-2xl mx-auto px-10 mb-0">
          <div className="flex flex-wrap gap-2 pb-6 border-b border-border-light">
            {faqTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  'text-xs uppercase tracking-[0.25em] px-5 py-2.5 border transition-colors duration-200',
                  activeTab === tab
                    ? 'border-ink-black bg-ink-black text-white'
                    : 'border-border-light bg-transparent text-ink-black hover:border-ink-black',
                ].join(' ')}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Liste accordéon ── */}
      <section className="max-w-screen-2xl mx-auto px-10 pb-24">
        {filteredItems.length > 0 ? (
          <dl>
            {filteredItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border-b border-border-light" data-anim="faq-row">
                  <dt>
                    <button
                      onClick={() => handleToggle(index)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                    >
                      <span className="serif italic text-lg md:text-xl text-ink-black group-hover:text-gold-accent transition-colors duration-200">
                        {item.title}
                      </span>
                      <span
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-ink-black transition-transform duration-300"
                        style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                        aria-hidden="true"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <line x1="7" y1="0" x2="7" y2="14" stroke="currentColor" strokeWidth="1" />
                          <line x1="0" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      </span>
                    </button>
                  </dt>
                  <dd
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: isOpen ? '600px' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p className="text-sm text-gray-500 leading-loose pb-6 max-w-2xl">
                      {item.content}
                    </p>
                  </dd>
                </div>
              );
            })}
          </dl>
        ) : (
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400 py-16">
            —
          </p>
        )}
      </section>
    </div>
  );
}
