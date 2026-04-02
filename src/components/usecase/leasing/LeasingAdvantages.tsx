'use client'

import TranslatedText from '@/components/common/TranslatedText';
import { useTranslation } from '@/hooks/useTranslation';

const advantages = [
  {
    number: '01',
    title: 'Fiscalité Optimisée',
    description: 'Les loyers sont déductibles du résultat imposable au titre de la décoration des bureaux (Art. 39-1-1° du CGI). Réduisez votre IS tout en valorisant votre image.',
  },
  {
    number: '02',
    title: 'Trésorerie Préservée',
    description: "Étale l'investissement sur 13 à 48 mois. Conservez votre capacité d'autofinancement pour votre cœur de métier sans alourdir votre bilan.",
  },
  {
    number: '03',
    title: 'Option d\'Achat',
    description: "Au terme du contrat, devenez propriétaire de l'œuvre pour une valeur résiduelle symbolique. Transférez l'œuvre vers votre patrimoine privé ou celui de la structure.",
  },
];

export default function LeasingAdvantages() {
  const { t } = useTranslation();

  return (
    <section className="py-40 bg-black text-white px-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-24">
          <span className="section-number !text-gray-600">Levier de performance</span>
          <h2 className="serif text-5xl md:text-7xl italic">
            Pourquoi choisir <br />le Leasing d&apos;Art ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {advantages.map((advantage) => (
            <div
              key={advantage.number}
              className="p-10 border border-gray-800 hover:border-gold-accent transition-colors duration-500"
            >
              <span className="step-number">{advantage.number}</span>
              <h3 className="serif text-2xl mb-6">{advantage.title}</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed font-light">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
