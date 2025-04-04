'use client'

import { useLanguageStore } from '@/store/languageStore';

interface WhyChooseItem {
  title: string;
  description: string;
}

export default function WhyChoose() {
  const { t } = useLanguageStore();
  
  // Get the items from translation or use default if not available
  const items: WhyChooseItem[] = [
    {
      title: t('lending.whyChoose.items.0.title') || "Optimisation Financière et Flexibilité",
      description: t('lending.whyChoose.items.0.description') || "Accédez à des liquidités tout en gardant vos œuvres"
    },
    {
      title: t('lending.whyChoose.items.1.title') || "Sécurité et Transparence via la Blockchain",
      description: t('lending.whyChoose.items.1.description') || "Profitez de haute traçabilité et sécurité"
    },
    {
      title: t('lending.whyChoose.items.2.title') || "Accès à la Finance Décentralisée (DeFi)",
      description: t('lending.whyChoose.items.2.description') || "Profitez des nouvelles opportunités du Web3 pour optimiser vos actifs artistiques"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl bricolage-grotesque font-medium mb-12">
          {t('lending.whyChoose.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ul className="space-y-6">
            {items.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purpleColor mr-2">•</span>
                <p><span className="text-purpleColor">{item.title}</span> : {item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
} 