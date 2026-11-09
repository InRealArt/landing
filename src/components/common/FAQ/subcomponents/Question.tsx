'use client';
import { Plus, Phone } from 'lucide-react';
import React, { useId, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { EXTERNAL_URLS } from '@/constants/constants';

interface QuestionProps {
  question: string;
  answer: string;
}

const Question = ({ question, answer }: QuestionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const panelId = useId();

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div
      className="w-full border-b border-[var(--border-light)] flex flex-col group"
      data-anim="faq-question"
    >
      <h3 className="m-0 font-normal">
        <button
          type="button"
          onClick={toggleIsOpen}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full py-5 md:py-8 flex justify-between gap-4 md:gap-6 min-h-[48px] items-center md:items-start text-left cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--gold-accent)]"
        >
          <span className="serif italic text-lg sm:text-xl lg:text-2xl font-light break-words min-w-0 text-[var(--text)] leading-snug flex-1 group-hover:text-[var(--gold-accent)] transition-colors duration-300">
            {question}
          </span>
          <span
            className={`shrink-0 md:mt-1 text-[var(--text)] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'rotate-45' : 'rotate-0'}`}
            aria-hidden="true"
          >
            <Plus size={16} strokeWidth={1} />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        inert={!isOpen}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="mb-4 text-sm text-[var(--gray-text)] leading-relaxed md:leading-loose">
            {answer}
          </p>

          {/* Calendly CTA */}
          <div className="mt-4 md:mt-6 mb-5 md:mb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <p className="text-xs uppercase tracking-[0.15em] sm:tracking-[0.3em] text-[var(--gray-text)]">
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