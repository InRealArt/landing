'use client'

import Image from 'next/image';
import TranslatedText from '@/components/common/TranslatedText';
import { useLanguageStore } from '@/store/languageStore';

export default function LeasingHero() {
  const { t } = useLanguageStore();

  return (
    <header className="pt-48 pb-32 px-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="section-number">Ingénierie Financière & Art</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl serif leading-tight text-ink-black">
              L&apos;Art devient un <span className="italic text-gold-accent">Investissement</span> fluide.
            </h1>
            <p className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-gray-400 mt-12 leading-relaxed max-w-lg">
              Optimisez la fiscalité de votre entreprise tout en sublimant vos espaces de travail grâce à nos solutions de Location avec Option d&apos;Achat (LOA).
            </p>
            <div className="mt-12">
              <a href="#simulateur" className="btn-cta">Simuler mon projet</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800"
                alt="Bureaux avec œuvres d'art"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white dark:bg-[#f5f5f5] p-8 hidden lg:block border border-gray-100 dark:border-gray-200 shadow-xl max-w-xs">
              <p className="serif text-xl italic mb-2 text-ink-black dark:text-[#000000]">&quot;Une déductibilité totale des loyers.&quot;</p>
              <p className="text-[8px] uppercase tracking-widest text-gray-400 dark:text-gray-600">Expert-comptable partenaire InRealArt</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
