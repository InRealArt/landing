'use client'

import { Check } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function PresaleFeatures() {
  const { language } = useLanguageStore();
  
  // Define features based on language
  const features = language === 'fr' 
    ? [
        'Spécialement organisé pour les nouveaux investisseurs via notre programme éducatif',
        'Fenêtre de participation limitée avant le lancement public',
        'Allocation garantie à des prix préférentiels'
      ]
    : [
        'Specially curated for new investors through educational outreach',
        'Limited participation window before public launch',
        'Guaranteed allocation at preferential pricing'
      ];

  return (
    <div className="mt-8">
      <ul className="space-y-1 inter">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-300 text-sm">
            {index + 1}. {feature}
          </li>
        ))}
      </ul>
    </div>
  );
} 