'use client';
import { Plus, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { EXTERNAL_URLS } from '@/constants/constants';

interface QuestionProps {
  question: string;
  answer: string;
}

const Question = ({ question, answer }: QuestionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguageStore();

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div
      className="w-full py-8 border-b border-[var(--border-light)] flex flex-col cursor-pointer group"
      data-anim="faq-question"
      onClick={toggleIsOpen}
    >
      <div className="flex justify-between items-start gap-6">
        <h3 className="serif italic text-xl lg:text-2xl font-light text-[var(--ink-black)] leading-snug flex-1 group-hover:text-[var(--gold-accent)] transition-colors duration-300">
          {question}
        </h3>
        <span
          className={`shrink-0 mt-1 text-[var(--ink-black)] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        >
          <Plus size={16} strokeWidth={1} />
        </span>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="mt-6 mb-4 text-[13px] text-[var(--gray-text)] leading-loose">
            {answer}
          </p>

          {/* Calendly CTA */}
          <div className="mt-6 mb-2 flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gray-text)]">
              {t('faqPerPage.haveQuestions')}
            </p>
            <a
              href={EXTERNAL_URLS.CALENDLY_MEETING}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta !inline-flex items-center gap-2 !mt-0 w-fit"
              data-umami-event="calendly-faq-click"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[0.6rem] uppercase tracking-[0.25em]">{t('buttons.contactUs')}</span>
              <Phone size={11} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;