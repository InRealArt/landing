'use client'
import Button from '../Button';
import Question from './subcomponents/Question';
import { useFaqStore } from '@/store/useFaqStore';
import { useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';

interface FAQProps {
  titre?: string;
  description?: string;
  titleKey?: string;
  descriptionKey?: string;
}

const FAQ = ({ titre, description, titleKey, descriptionKey }: FAQProps) => {
  const { faqs, isLoading, hasError, fetchFaqs } = useFaqStore();
  const { t } = useLanguageStore();
  
  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);
  
  // Utiliser les données du store si disponibles, sinon utiliser les données par défaut
  // Trier les items par le champ order pour s'assurer que l'ordre est respecté
  const faqItems = faqs.sort((a, b) => a.order - b.order);

  // Utiliser les props si fournies, sinon utiliser les traductions par défaut
  const faqTitle = titre || (titleKey ? t(titleKey) : t('faq.page.title'));
  const faqDescription = description || (descriptionKey ? t(descriptionKey) : t('faq.page.description'));

  return (
    <section className="w-full m-auto mt-36 flex flex-col md:flex-row gap-16 max-w-90 xl:max-w-screen-xl">
      <div className='w-full md:w-1/3'>
        <h1 className="text-6xl md:text-8xl serif"><span className="italic text-gold-accent">{faqTitle}</span></h1>
        <p className='mt-8'>{faqDescription}</p>
        <Button text={`${t('buttons.readMore')} ${t('nav.faq')}`} additionalClassName="bg-purpleColor mt-8" link='/faq'/>
      </div>
      <div className='h-full w-full md:w-2/3'>
        {faqItems.map((item, index) => (
          <Question key={item.id} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}

export default FAQ;