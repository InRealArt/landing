'use client'
import Image from 'next/image'
import Logo from '/icons/Logo.png';
import Button from '../Button';
import Question from './subcomponents/Question';
import { titleClassName } from '@/utils/classes';
import { useFaqStore } from '@/store/useFaqStore';
import { useEffect } from 'react';

const FAQ = () => {
  const { faqs, isLoading, hasError, fetchFaqs } = useFaqStore();
  
  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);
  
  // Utiliser les données du store si disponibles, sinon utiliser les données par défaut
  // Trier les items par le champ order pour s'assurer que l'ordre est respecté
  const faqItems = faqs.sort((a, b) => a.order - b.order);

  return (
    <section className="w-full m-auto mt-36 flex flex-col md:flex-row gap-16 max-w-90 xl:max-w-screen-xl">
      <div className='w-full md:w-1/3'>
        <h1 className={titleClassName}>FAQ</h1>
        <p className='mt-8'>Bien souvent vous avez des questions légitime alors nous avons anticipé cela ! Et si vous avez une autre question consulter la page FAQ</p>
        <Button text="Consulter la FAQ" additionalClassName="bg-purpleColor mt-8" />
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