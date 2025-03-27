import Image from 'next/image'
import Logo from '/icons/Logo.png';
import Button from '../Button';
import Question from './subcomponents/Question';
import { titleClassName } from '@/utils/classes';

const FAQ = () => {
  const faq = [
    {
      question: 'Comment fonctionne InRealArt ?',
      answer: 'InRealArt est une plateforme de NFT qui permet aux artistes de vendre leurs œuvres sous forme de NFT. Les acheteurs peuvent'
    },
    {
      question: 'Pour qui ?',
      answer: 'InRealArt est une plateforme de NFT qui permet aux artistes de vendre leurs œuvres sous forme de NFT. Les acheteurs peuvent'
    },
    {
      question: 'Y a t’il un guide de démarrage ?',
      answer: 'InRealArt est une plateforme de NFT qui permet aux artistes de vendre leurs œuvres sous forme de NFT. Les acheteurs peuvent'
    }
  ]
  return (
    <section className="w-full m-auto mt-36 flex flex-col md:flex-row gap-16 max-w-90 xl:max-w-screen-xl">
      <div className='w-full md:w-1/3'>
        <h1 className={titleClassName}>FAQ</h1>
        <p className='mt-8'>Bien souvent vous avez des questions légitime alors nous avons anticipé cela ! Et si vous avez une autre question consulter la page FAQ</p>
        <Button text="Consulter la FAQ" additionalClassName="bg-purpleColor mt-8" />
      </div>
      <div className='h-full w-full md:w-2/3'>
        {faq.map((item, index) => (
          <Question key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}

export default FAQ;