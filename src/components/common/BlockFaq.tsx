'use client'
import Button from './Button'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface HomeFaqProps {
  title?: string
  description?: string
  buttonText?: string
  link?: string
}

const BlockFaq = ({ 
  title, 
  description,
  buttonText,
  link,
}: HomeFaqProps) => {
  const { t } = useTranslation()

  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36">
      <div className="p-6 lg:p-10 border rounded-lg bg-cardBackground text-center">
        {/* <h2 className="text-5xl md:text-5xl serif italic leading-tight mb-6">
          {title || t('home.faq.title')}
        </h2> */}
        <p className="text-lg lg:text-xl mb-8 leading-relaxed">
          {description || t('home.faq.description')}
        </p>
        <Button
          text={buttonText || t('home.faq.button')}
          additionalClassName="bg-purpleColor"
          icon={<ArrowRight />}
          center
          link={link || "faq"}
        />
      </div>
    </section>
  )
}

export default BlockFaq
