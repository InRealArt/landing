'use client';
import { Plus, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import Button from '@/components/common/Button';

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

  const handleCalendlyClick = () => {
    // Rediriger vers Calendly
    window.open('https://calendly.com/teaminrealart/plus-de-visibilite-plus-de-ventes', '_blank');
  }

  return (
    <div className="w-full py-6 pr-6 border-b flex flex-col cursor-pointer" onClick={toggleIsOpen}>
      <div className='flex justify-between items-center'>
        <h1 className="text-lg lg:text-xl unbounded">{question}</h1>
        <Plus className='shrink-0' />
      </div>
      <label className={`my-4 text-sm ${isOpen ? 'visible' : 'hidden'}`}>{answer}</label>
      
      {/* Section Calendly */}
      <div className={`mt-4 ${isOpen ? 'visible' : 'hidden'}`}>
        <p className="text-sm unbounded mb-3">{t('faqPerPage.haveQuestions')}</p>
        <Button
          text={t('buttons.contactUs')}
          action={handleCalendlyClick}
          additionalClassName="bg-purpleColor w-fit"
          icon={<Phone />}
          iconBefore
        />
      </div>
    </div>
  );
}

export default Question;