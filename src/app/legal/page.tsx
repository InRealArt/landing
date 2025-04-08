'use client';

import { Container } from '@/components/common/Container';
import { PageHeader } from '@/components/common/PageHeader';
import { useLanguageStore } from '@/store/languageStore';

export default function LegalPage() {
  const { t, translations, language } = useLanguageStore();
  
  // Get options directly from translations
  const mediationOptions = translations[language]?.legal?.mediation?.options || [];

  return (
      <Container>
        <div className="py-16">
        <h1 className="text-4xl font-bold mb-8">{t('legal.title')}</h1>

          {/* Publisher Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t('legal.publisher.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('legal.publisher.content')}
            </p>
          </section>

          {/* Design and Hosting Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t('legal.design.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('legal.design.content')}
            </p>
          </section>

          {/* Intellectual Property Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t('legal.intellectualProperty.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('legal.intellectualProperty.content')}
            </p>
          </section>

          {/* Links Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t('legal.links.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('legal.links.content')}
            </p>
          </section>

          {/* Disclaimer Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t('legal.disclaimer.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('legal.disclaimer.content')}
            </p>
          </section>

          {/* Changes Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t('legal.changes.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('legal.changes.content')}
            </p>
          </section>

          {/* Consumer Mediation Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t('legal.mediation.title')}
            </h2>
            <p className="text-gray-300 mb-4">
              {t('legal.mediation.content')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {mediationOptions.map((option: string, index: number) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
  );
} 