'use client';

import { Container } from '@/components/common/Container';
import { useLanguageStore } from '@/store/languageStore';

export default function TermsNFTPage() {
  const { t, language } = useLanguageStore();

  return (
    <Container>
      <div className="py-16">
        <h1 className="text-4xl font-bold mb-8">{t('termsNft.title')}</h1>
        <h2 className="text-2xl font-semibold mb-8">{t('termsNft.subtitle')}</h2>

        {/* Introduction Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.introduction.title')}
          </h2>
          <p className="text-gray-300 mb-4">
            {t('termsNft.introduction.content')}
          </p>
        </section>

        {/* Article 1 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article1.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article1.description.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article1.description.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article1.technicalIdentification.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article1.technicalIdentification.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article1.purpose.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article1.purpose.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article1.withdrawal.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article1.withdrawal.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Article 2 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article2.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article2.content.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article2.content.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article2.territorialScope.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article2.territorialScope.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article2.duration.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article2.duration.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article2.access.title')}
              </h3>
              <p className="text-gray-300 whitespace-pre-line">
                {t('termsNft.article2.access.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article2.credits.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article2.credits.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Article 3 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article3.title')}
          </h2>
          <p className="text-gray-300">
            {t('termsNft.article3.content')}
          </p>
        </section>

        {/* Article 4 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article4.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article4.copyright.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article4.copyright.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article4.exclusiveRights.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article4.exclusiveRights.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article4.thirdPartyRights.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article4.thirdPartyRights.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article4.precautions.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article4.precautions.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article4.deletion.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article4.deletion.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article4.indemnities.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article4.indemnities.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article4.authenticity.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article4.authenticity.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Article 5 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article5.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article5.economicRisks.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article5.economicRisks.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article5.technologicalRisks.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article5.technologicalRisks.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article5.regulatoryRisks.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article5.regulatoryRisks.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article5.modification.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article5.modification.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Article 6 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article6.title')}
          </h2>
          <p className="text-gray-300">
            {t('termsNft.article6.content')}
          </p>
        </section>

        {/* Article 7 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article7.title')}
          </h2>
          <p className="text-gray-300">
            {t('termsNft.article7.content')}
          </p>
        </section>

        {/* Article 8 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article8.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article8.conditions.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article8.conditions.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article8.resaleRight.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article8.resaleRight.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Article 9 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article9.title')}
          </h2>
          <p className="text-gray-300">
            {t('termsNft.article9.content')}
          </p>
        </section>

        {/* Article 10 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article10.title')}
          </h2>
          <p className="text-gray-300">
            {t('termsNft.article10.content')}
          </p>
        </section>

        {/* Article 11 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article11.title')}
          </h2>
          <p className="text-gray-300 mb-6">
            {t('termsNft.article11.content')}
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article11.gdpr.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article11.gdpr.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article11.rights.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article11.rights.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Article 12 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article12.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article12.registration.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article12.registration.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article12.conduct.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article12.conduct.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article12.restrictions.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article12.restrictions.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Article 13 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article13.title')}
          </h2>
          <p className="text-gray-300 mb-6">
            {t('termsNft.article13.content')}
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article13.moralRights.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article13.moralRights.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article13.modifications.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article13.modifications.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Article 14 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article14.title')}
          </h2>
          <p className="text-gray-300">
            {t('termsNft.article14.content')}
          </p>
        </section>

        {/* Article 15 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article15.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article15.security.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article15.security.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article15.storage.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article15.storage.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Article 16 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article16.title')}
          </h2>
          <p className="text-gray-300">
            {t('termsNft.article16.content')}
          </p>
        </section>

        {/* Article 17 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article17.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article17.byCompany.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article17.byCompany.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article17.byOwner.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article17.byOwner.content')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article17.consequences.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article17.consequences.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Article 18 Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {t('termsNft.article18.title')}
          </h2>
          <p className="text-gray-300 mb-6">
            {t('termsNft.article18.content')}
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('termsNft.article18.international.title')}
              </h3>
              <p className="text-gray-300">
                {t('termsNft.article18.international.content')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
} 