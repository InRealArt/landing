import { getServerTranslations } from '@/utils/serverTranslations'
import CapitalContactForm from './CapitalContactForm'

export default function CapitalContactPage() {
  const { t } = getServerTranslations('fr')

  return (
    <main className="min-h-screen bg-backgroundColor text-textColor">

      {/* Hero */}
      <section className="relative bg-backgroundColor border-b border-borderColor pt-headerSize pb-20">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-accent/40 to-transparent" aria-hidden="true" />
        <div className="max-w-screen-2xl mx-auto px-10 pt-16">
          <span className="section-number">{t('usecase.capital.contact.hero.eyebrow')}</span>
          <h1 className="serif text-5xl md:text-7xl lg:text-8xl font-light leading-none text-textColor mt-4 mb-6">
            {t('usecase.capital.contact.hero.title')}
            <br />
            <em className="italic text-gold-accent">{t('usecase.capital.contact.hero.titleAccent')}</em>
          </h1>
          <div className="flex items-center gap-4 mt-8 max-w-2xl">
            <div className="w-12 h-px bg-gold-accent shrink-0" />
            <p className="text-sm uppercase tracking-[0.25em] text-grayText montserrat leading-relaxed">
              {t('usecase.capital.contact.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-24 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-10">
          <div className="max-w-3xl">
            <CapitalContactForm />
          </div>
        </div>
      </section>

    </main>
  )
}
