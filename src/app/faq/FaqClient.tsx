'use client'

import { useState, useEffect } from "react";
import { useLanguageStore } from '@/store/languageStore';
import { useDetailedFaqStore } from "@/store/useDetailedFaqStore";

export default function FaqClient() {
  const { t, language } = useLanguageStore();
  const { faqItems, faqTabs, isLoading, hasError, fetchDetailedFaqs } = useDetailedFaqStore();
  const [activeTab, setActiveTab] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchDetailedFaqs(language);
  }, [fetchDetailedFaqs, language]);

  useEffect(() => {
    if (faqTabs.length > 0 && !activeTab) {
      setActiveTab(faqTabs[0]);
    }
  }, [faqTabs, activeTab]);

  const filteredItems = faqItems.filter(item =>
    item.categories?.includes(activeTab)
  );

  const handleToggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  // Reset open accordion when tab changes
  useEffect(() => {
    setOpenIndex(null);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-canvas-white">

      {/* ── Hero ── */}
      <section className="max-w-screen-2xl mx-auto px-10 pt-headerSize pb-12 border-b border-border-light mb-16">
        <p className="section-number mb-6">
          {t('faq.page.title')}
        </p>
        <h1 className="serif text-4xl md:text-5xl leading-none tracking-tight text-ink-black mb-10">
          Questions{' '}
          <em className="italic text-gold-accent not-italic">fréquentes</em>
        </h1>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 max-w-md">
          {t('faq.page.description')}
        </p>
      </section>

      {/* ── États chargement / erreur ── */}
      {isLoading ? (
        <section className="max-w-screen-2xl mx-auto px-10 py-20">
          <div className="flex flex-col gap-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-soft-gray animate-pulse"
                style={{ opacity: 1 - i * 0.12 }}
              />
            ))}
          </div>
        </section>
      ) : hasError ? (
        <section className="max-w-screen-2xl mx-auto px-10 py-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400">
            {t('common.error')}
          </p>
        </section>
      ) : (
        <>
          {/* ── Onglets catégories ── */}
          {faqTabs.length > 0 && (
            <section className="max-w-screen-2xl mx-auto px-10 mb-0">
              <div className="flex flex-wrap gap-2 pb-6 border-b border-border-light">
                {faqTabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={[
                      'text-[9px] uppercase tracking-[0.25em] px-5 py-2.5 border transition-colors duration-200',
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
                    <div key={index} className="border-b border-border-light">
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
                        <p className="text-[13px] text-gray-500 leading-loose pb-6 max-w-2xl">
                          {item.content}
                        </p>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            ) : (
              <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 py-16">
                —
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
