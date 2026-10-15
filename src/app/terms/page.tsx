'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { Container } from '@/components/common/Container'

const TermsPage = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <div className="py-16">
        <h1 className="text-4xl font-bold mb-8">{t('terms.title')}</h1>
        
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. {t('terms.presentation.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.presentation.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. {t('terms.consent.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.consent.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. {t('terms.order.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.order.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. {t('terms.customization.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.customization.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. {t('terms.lots.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.lots.content')}</p>
          </section>





          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. {t('terms.copyright.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.copyright.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. {t('terms.gallery.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.gallery.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. {t('terms.buyerCommitments.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.buyerCommitments.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. {t('terms.modifications.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.modifications.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. {t('terms.price.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.price.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. {t('terms.delivery.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.delivery.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. {t('terms.withdrawal.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.withdrawal.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. {t('terms.guarantees.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.guarantees.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. {t('terms.forceMajeure.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.forceMajeure.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. {t('terms.intellectualProperty.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.intellectualProperty.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. {t('terms.dataProtection.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.dataProtection.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">17. {t('terms.applicableLaw.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.applicableLaw.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">18. {t('terms.mediation.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.mediation.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">19. {t('terms.jurisdiction.title')}</h2>
            <p className="text-grayText mb-4">{t('terms.jurisdiction.content')}</p>
          </section>
        </div>
      </div>
    </Container>
  )
}

export default TermsPage 