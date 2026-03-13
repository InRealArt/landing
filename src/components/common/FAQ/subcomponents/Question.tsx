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
      className="w-full py-6 pr-6 border-b border-borderColor flex flex-col cursor-pointer"
      onClick={toggleIsOpen}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg lg:text-xl serif italic font-light text-textColor">
          {question}
        </h3>
        <Plus
          className={`shrink-0 text-textColor transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        />
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="my-4 text-sm text-textColor">
            {answer}
          </p>

          {/* Section Calendly */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-textColor">
              {t('faqPerPage.haveQuestions')}
            </p>
            <a
              href={EXTERNAL_URLS.CALENDLY_MEETING}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta inline-flex items-center gap-2 !mt-0 w-fit"
              data-umami-event="calendly-faq-click"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={12} />
              <span className="text-[0.6rem] uppercase tracking-[0.25em]">{t('buttons.contactUs')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;