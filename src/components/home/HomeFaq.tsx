'use client'
import Button from '../common/Button'
import { ArrowRight } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const HomeFaq = () => {
  const { t } = useLanguageStore()

  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36">
      <div className="p-6 lg:p-10 border rounded-lg bg-cardBackground text-center">
        <h2 className="text-3xl lg:text-4xl bricolage-grotesque font-semibold mb-6">
          {t('home.faq.title')}
        </h2>
        <p className="text-lg lg:text-xl mb-8 leading-relaxed">
          {t('home.faq.description')}
        </p>
        <Button
          text={t('home.faq.button')}
          additionalClassName="bg-purpleColor"
          icon={<ArrowRight />}
          center
          link="faq"
        />
      </div>
    </section>
  )
}

export default HomeFaq
